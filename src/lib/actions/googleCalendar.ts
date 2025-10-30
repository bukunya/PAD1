"use server";

import { google } from "googleapis";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Initialize OAuth2 client
function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  );
}

// Get user's access token from the database
async function getUserAccessToken(userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId: userId,
      provider: "google",
    },
  });

  if (!account) {
    throw new Error(
      "REAUTH_REQUIRED: No Google account linked. Please sign in again."
    );
  }

  if (!account.access_token) {
    throw new Error(
      "REAUTH_REQUIRED: Access token not found. Please sign in again."
    );
  }

  return {
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expires_at: account.expires_at,
  };
}

// Refresh access token if expired
async function refreshAccessToken(userId: string, refreshToken: string) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();

    if (!credentials.access_token) {
      throw new Error("Failed to obtain new access token");
    }

    // Update the token in the database
    await prisma.account.updateMany({
      where: {
        userId: userId,
        provider: "google",
      },
      data: {
        access_token: credentials.access_token,
        expires_at: credentials.expiry_date
          ? Math.floor(credentials.expiry_date / 1000)
          : null,
        refresh_token: credentials.refresh_token || refreshToken,
      },
    });

    return credentials.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);

    // If refresh token is invalid, throw a specific error
    if (
      error instanceof Error &&
      (error.message.includes("invalid_grant") ||
        error.message.includes("Token has been expired or revoked"))
    ) {
      throw new Error(
        "REAUTH_REQUIRED: Your Google Calendar access has expired. Please sign out and sign in again to reconnect."
      );
    }

    throw new Error(
      "Failed to refresh access token. Please try signing in again."
    );
  }
}

// Get valid access token (refresh if needed)
async function getValidAccessToken(userId: string) {
  try {
    const tokenData = await getUserAccessToken(userId);

    // Check if we have a refresh token
    if (!tokenData.refresh_token) {
      throw new Error(
        "REAUTH_REQUIRED: Your Google Calendar connection is missing required permissions. Please sign out and sign in again to reconnect."
      );
    }

    // Check if token is expired (with 5 minute buffer)
    const now = Math.floor(Date.now() / 1000);
    const isExpired = tokenData.expires_at && tokenData.expires_at < now + 300;

    if (isExpired) {
      console.log("Access token expired for user:", userId, "- refreshing...");
      return await refreshAccessToken(userId, tokenData.refresh_token);
    }

    return tokenData.access_token;
  } catch (error) {
    // Re-throw with context
    if (error instanceof Error && error.message.includes("REAUTH_REQUIRED")) {
      throw error;
    }
    throw new Error(
      "REAUTH_REQUIRED: Unable to access Google Calendar. Please sign out and sign in again."
    );
  }
}

// Create a calendar event
export async function createCalendarEvent(eventData: {
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  attendees?: string[]; // Array of email addresses
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to create calendar events",
      };
    }

    const userId = session.user.id;
    const accessToken = await getValidAccessToken(userId);

    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: eventData.summary,
      description: eventData.description,
      location: eventData.location,
      start: {
        dateTime: eventData.startDateTime,
        timeZone: "Asia/Jakarta",
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: "Asia/Jakarta",
      },
      attendees: eventData.attendees?.map((email) => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "popup", minutes: 30 }, // 30 minutes before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      sendUpdates: "all", // Send email invitations to attendees
    });

    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      message: "Event created successfully",
    };
  } catch (error: unknown) {
    console.error("Error creating calendar event:", error);

    // Handle specific error types
    if (error instanceof Error) {
      // Check if it's a re-authentication required error
      if (error.message.includes("REAUTH_REQUIRED")) {
        return {
          success: false,
          error: error.message.replace("REAUTH_REQUIRED: ", ""),
          needsReauth: true,
        };
      }

      // Check if it's an API error (401, 403, etc.)
      if (
        error.message.includes("invalid authentication credentials") ||
        error.message.includes("Invalid Credentials") ||
        error.message.includes("unauthorized")
      ) {
        return {
          success: false,
          error:
            "Your Google Calendar access has expired. Please sign out and sign in again.",
          needsReauth: true,
        };
      }

      return {
        success: false,
        error: error.message || "Failed to create calendar event",
      };
    }

    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
}

// Update a calendar event
export async function updateCalendarEvent(
  eventId: string,
  eventData: {
    summary?: string;
    description?: string;
    location?: string;
    startDateTime?: string;
    endDateTime?: string;
    attendees?: string[];
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const userId = session.user.id;
    const accessToken = await getValidAccessToken(userId);

    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event: {
      summary?: string;
      description?: string;
      location?: string;
      start?: { dateTime: string; timeZone: string };
      end?: { dateTime: string; timeZone: string };
      attendees?: { email: string }[];
    } = {};

    if (eventData.summary) event.summary = eventData.summary;
    if (eventData.description) event.description = eventData.description;
    if (eventData.location) event.location = eventData.location;
    if (eventData.startDateTime) {
      event.start = {
        dateTime: eventData.startDateTime,
        timeZone: "Asia/Jakarta",
      };
    }
    if (eventData.endDateTime) {
      event.end = {
        dateTime: eventData.endDateTime,
        timeZone: "Asia/Jakarta",
      };
    }
    if (eventData.attendees) {
      event.attendees = eventData.attendees.map((email) => ({ email }));
    }

    const response = await calendar.events.patch({
      calendarId: "primary",
      eventId: eventId,
      requestBody: event,
      sendUpdates: "all",
    });

    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      message: "Event updated successfully",
    };
  } catch (error: unknown) {
    console.error("Error updating calendar event:", error);

    if (error instanceof Error) {
      // Check if it's a re-authentication required error
      if (error.message.includes("REAUTH_REQUIRED")) {
        return {
          success: false,
          error: error.message.replace("REAUTH_REQUIRED: ", ""),
          needsReauth: true,
        };
      }

      // Check if it's an API error
      if (
        error.message.includes("invalid authentication credentials") ||
        error.message.includes("Invalid Credentials") ||
        error.message.includes("unauthorized")
      ) {
        return {
          success: false,
          error:
            "Your Google Calendar access has expired. Please sign out and sign in again.",
          needsReauth: true,
        };
      }

      return {
        success: false,
        error: error.message || "Failed to update calendar event",
      };
    }

    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
}

// Delete a calendar event
export async function deleteCalendarEvent(eventId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const userId = session.user.id;
    const accessToken = await getValidAccessToken(userId);

    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.delete({
      calendarId: "primary",
      eventId: eventId,
      sendUpdates: "all",
    });

    return {
      success: true,
      message: "Event deleted successfully",
    };
  } catch (error: unknown) {
    console.error("Error deleting calendar event:", error);

    if (error instanceof Error) {
      // Check if it's a re-authentication required error
      if (error.message.includes("REAUTH_REQUIRED")) {
        return {
          success: false,
          error: error.message.replace("REAUTH_REQUIRED: ", ""),
          needsReauth: true,
        };
      }

      // Check if it's an API error
      if (
        error.message.includes("invalid authentication credentials") ||
        error.message.includes("Invalid Credentials") ||
        error.message.includes("unauthorized")
      ) {
        return {
          success: false,
          error:
            "Your Google Calendar access has expired. Please sign out and sign in again.",
          needsReauth: true,
        };
      }

      return {
        success: false,
        error: error.message || "Failed to delete calendar event",
      };
    }

    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
}

// Check if user has valid Google Calendar access
export async function checkCalendarAccess() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        hasAccess: false,
        error: "You must be logged in",
      };
    }

    const userId = session.user.id;

    // Try to get and validate the token
    await getValidAccessToken(userId);

    return {
      hasAccess: true,
      message: "Google Calendar access is valid",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("REAUTH_REQUIRED")) {
        return {
          hasAccess: false,
          needsReauth: true,
          error: error.message.replace("REAUTH_REQUIRED: ", ""),
        };
      }

      return {
        hasAccess: false,
        error: error.message,
      };
    }

    return {
      hasAccess: false,
      error: "Failed to check calendar access",
    };
  }
}
