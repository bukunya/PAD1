"use server";

import { prisma } from "@/lib/prisma";

// Read - Get users with pagination
export async function getUsersServerAction(
  page: number = 1,
  limit: number = 10
) {
  try {
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count(),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

// Create - Add a new user
export async function createUserServerAction(data: {
  email: string;
  name: string;
  role?: string;
}) {
  try {
    const { email, name, role } = data;

    // Validate required fields
    if (!email || !name) {
      throw new Error("Email and name are required");
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role || "user",
      },
    });

    return {
      user,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update - Modify an existing user
export async function updateUserServerAction(data: {
  id: number;
  email?: string;
  name?: string;
  role?: string;
}) {
  try {
    const { id, email, name, role } = data;

    // Validate required fields
    if (!id) {
      throw new Error("User ID is required");
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // If email is being updated, check if it's already taken
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email },
      });

      if (emailTaken) {
        throw new Error("Email already exists");
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(email && { email }),
        ...(name && { name }),
        ...(role && { role }),
      },
    });

    return {
      user,
      message: "User updated successfully",
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Delete - Remove a user
export async function deleteUserServerAction(id: number) {
  try {
    // Validate required fields
    if (!id) {
      throw new Error("User ID is required");
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return {
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
