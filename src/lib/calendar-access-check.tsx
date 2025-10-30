"use client";

import { useEffect, useState } from "react";
import { checkCalendarAccess } from "@/lib/actions/googleCalendar";
import { signOut } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

/**
 * Component to check if user has valid Google Calendar access
 * Shows a warning banner if re-authentication is needed
 * 
 * Usage: Add this component to your dashboard or main layout
 */
export function CalendarAccessCheck() {
  const [needsReauth, setNeedsReauth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const result = await checkCalendarAccess();
        if (!result.hasAccess && result.needsReauth) {
          setNeedsReauth(true);
        }
      } catch (error) {
        console.error("Error checking calendar access:", error);
      } finally {
        setIsChecking(false);
      }
    }

    checkAccess();
  }, []);

  // Don't show anything if still checking, doesn't need reauth, or user dismissed
  if (isChecking || !needsReauth || isDismissed) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Google Calendar Connection Required</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          Your Google Calendar connection needs to be refreshed. Please sign out
          and sign in again to reconnect.
        </p>
        <div className="flex gap-2">
          <Button onClick={handleSignOut} size="sm">
            Sign Out and Reconnect
          </Button>
          <Button
            onClick={() => setIsDismissed(true)}
            variant="outline"
            size="sm"
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
