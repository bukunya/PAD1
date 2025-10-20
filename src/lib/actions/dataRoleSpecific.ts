"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function dataRoleSpecific() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Anda harus login untuk mengakses dashboard",
    };
  }

  try {
    const userId = session.user.id;

    // Fetch data based on user role, if user is admin, fetch all data, if user is mahasiswa and dosen, fetch any data that contains their user id
    let data;

    // Normalize role to uppercase so it matches the Prisma enum values (MAHASISWA, DOSEN, ADMIN)
    const role = String(session.user.role || "").toUpperCase();

    if (role === "ADMIN") {
      // Admin: Fetch all Ujian data including Dosen Pembimbing and 2 Dosen Penguji
      data = await prisma.ujian.findFirst({
        include: {
          mahasiswa: true, // Include mahasiswa details
          dosenPembimbing: true, // Include dosen pembimbing
          dosenPenguji: {
            take: 2, // Take only the first 2 dosen penguji
            include: {
              dosen: true, // Include dosen details for penguji
            },
          },
        },
      });
    } else {
      // Non-admin: Fetch only Ujian data related to the user
      data = await prisma.ujian.findMany({
        where: {
          OR: [{ mahasiswaId: userId }, { dosenPembimbingId: userId }],
        },
        include: {
          mahasiswa: true,
          dosenPembimbing: true,
          dosenPenguji: {
            take: 2, // Take only the first 2 dosen penguji
            include: {
              dosen: true, // Include dosen details for penguji
            },
          },
        },
      });
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengambil data dashboard",
    };
  }
}
