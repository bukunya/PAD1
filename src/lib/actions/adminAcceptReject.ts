"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Server action to get ujian details for admin review
 */
export async function getUjianForReview(ujianId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Anda harus login untuk mengakses halaman ini",
      };
    }

    if (session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Akses ditolak. Hanya admin yang dapat mengakses halaman ini.",
      };
    }

    const ujian = await prisma.ujian.findUnique({
      where: { id: ujianId },
      select: {
        id: true,
        judul: true,
        berkasUrl: true,
        status: true,
        createdAt: true,
        mahasiswa: {
          select: {
            id: true,
            name: true,
            nim: true,
            prodi: true,
          },
        },
        dosenPembimbing: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!ujian) {
      return {
        success: false,
        error: "Ujian tidak ditemukan",
      };
    }

    return {
      success: true,
      data: ujian,
    };
  } catch (error) {
    console.error("Error fetching ujian for review:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengambil data ujian",
    };
  }
}

/**
 * Server action to accept ujian and redirect to assign page
 */
export async function acceptUjian(ujianId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Anda harus login untuk melakukan aksi ini",
      };
    }

    if (session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Akses ditolak. Hanya admin yang dapat mengakses halaman ini.",
      };
    }

    // Check if ujian exists
    const ujian = await prisma.ujian.findUnique({
      where: { id: ujianId },
    });

    if (!ujian) {
      return {
        success: false,
        error: "Ujian tidak ditemukan",
      };
    }

    // Update status to DITERIMA
    await prisma.ujian.update({
      where: { id: ujianId },
      data: {
        status: "DITERIMA",
        updatedAt: new Date(),
      },
    });

    // Revalidate relevant pages
    revalidatePath("/detail-jadwal");
    revalidatePath(`/admin-accept-reject/${ujianId}`);

    return {
      success: true,
      message:
        "Pengajuan diterima. Anda akan diarahkan ke halaman penjadwalan.",
      redirectTo: `/admin-assign/${ujianId}`,
    };
  } catch (error) {
    console.error("Error accepting ujian:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menerima pengajuan",
    };
  }
}

/**
 * Server action to reject ujian with optional comment
 */
export async function rejectUjian(ujianId: string, komentarAdmin?: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Anda harus login untuk melakukan aksi ini",
      };
    }

    if (session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Akses ditolak. Hanya admin yang dapat mengakses halaman ini.",
      };
    }

    // Check if ujian exists
    const ujian = await prisma.ujian.findUnique({
      where: { id: ujianId },
    });

    if (!ujian) {
      return {
        success: false,
        error: "Ujian tidak ditemukan",
      };
    }

    // Update status to DITOLAK
    await prisma.ujian.update({
      where: { id: ujianId },
      data: {
        status: "DITOLAK",
        komentarAdmin: komentarAdmin || null,
        updatedAt: new Date(),
      },
    });

    // Revalidate relevant pages
    revalidatePath("/detail-jadwal");
    revalidatePath(`/admin-accept-reject/${ujianId}`);

    return {
      success: true,
      message: "Pengajuan ditolak",
    };
  } catch (error) {
    console.error("Error rejecting ujian:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menolak pengajuan",
    };
  }
}
