"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * Create a notification for a user
 */
export async function createNotification(
  userId: string,
  ujianId: string,
  message: string
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        ujianId,
        message,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

/**
 * Create multiple notifications at once
 */
export async function createMultipleNotifications(
  notifications: Array<{ userId: string; ujianId: string; message: string }>
) {
  try {
    await prisma.notification.createMany({
      data: notifications,
    });
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
}

/**
 * Get notifications for the current user
 */
export async function getNotifications() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Anda harus login untuk melihat notifikasi",
      };
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        ujian: {
          select: {
            judul: true,
            tanggalUjian: true,
            jamMulai: true,
            mahasiswa: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: notifications,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengambil notifikasi",
    };
  }
}
