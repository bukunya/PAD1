// src/lib/actions/adminPengajuan/getPengajuan.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusUjian } from "@/generated/prisma";

export async function getAllPengajuan(filters?: {
  status?: StatusUjian;
  month?: number;
}) {
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

    const whereClause: {
      status?: StatusUjian;
      createdAt?: { gte: Date; lte: Date };
    } = {};

    // Filter by status
    if (filters?.status) {
      whereClause.status = filters.status;
    }

    // Filter by month
    if (filters?.month !== undefined) {
      const year = new Date().getFullYear();
      const startDate = new Date(year, filters.month, 1);
      const endDate = new Date(year, filters.month + 1, 0, 23, 59, 59);

      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const pengajuan = await prisma.ujian.findMany({
      where: whereClause,
      select: {
        id: true,
        judul: true,
        berkasUrl: true,
        status: true,
        createdAt: true,
        tanggalUjian: true,
        mahasiswa: {
          select: {
            id: true,
            name: true,
            nim: true,
            prodi: true,
            image: true,
          },
        },
        dosenPembimbing: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: pengajuan,
    };
  } catch (error) {
    console.error("Error fetching pengajuan:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengambil data pengajuan",
    };
  }
}
