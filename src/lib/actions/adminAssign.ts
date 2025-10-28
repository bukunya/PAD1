"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define the schema for admin assignment
const assignUjianSchema = z.object({
  ujianId: z.string().min(1, "ID Ujian tidak valid"),
  dosenPenguji1Id: z.string().min(1, "Dosen Penguji 1 wajib dipilih"),
  dosenPenguji2Id: z.string().min(1, "Dosen Penguji 2 wajib dipilih"),
  tanggalUjian: z.string().min(1, "Tanggal ujian wajib diisi"),
  jamMulai: z.string().min(1, "Jam mulai wajib diisi"),
  jamSelesai: z.string().min(1, "Jam selesai wajib diisi"),
  ruangan: z.string().min(1, "Ruangan wajib diisi"),
});

/**
 * Server action to get ujian details for admin assignment
 */
export async function getUjianDetails(ujianId: string) {
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
        dosenPenguji: {
          select: {
            dosen: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tanggalUjian: true,
        jamMulai: true,
        jamSelesai: true,
        ruangan: true,
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
    console.error("Error fetching ujian details:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengambil data ujian",
    };
  }
}

/**
 * Server action to assign dosen penguji and schedule ujian
 */
export async function assignUjian(formData: FormData) {
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

    // Extract form data
    const rawData = {
      ujianId: formData.get("ujianId") as string,
      dosenPenguji1Id: formData.get("dosenPenguji1") as string,
      dosenPenguji2Id: formData.get("dosenPenguji2") as string,
      tanggalUjian: formData.get("tanggalUjian") as string,
      jamMulai: formData.get("jamMulai") as string,
      jamSelesai: formData.get("jamSelesai") as string,
      ruangan: formData.get("ruangan") as string,
    };

    // Validate the input data
    const validationResult = assignUjianSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Data tidak valid",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const data = validationResult.data;

    // Check if two dosen penguji are different
    if (data.dosenPenguji1Id === data.dosenPenguji2Id) {
      return {
        success: false,
        error: "Dosen Penguji 1 dan Dosen Penguji 2 harus berbeda",
      };
    }

    // Check if ujian exists
    const ujian = await prisma.ujian.findUnique({
      where: { id: data.ujianId },
    });

    if (!ujian) {
      return {
        success: false,
        error: "Ujian tidak ditemukan",
      };
    }

    // Combine date and time
    const tanggalUjian = new Date(data.tanggalUjian);
    const [jamMulaiHour, jamMulaiMinute] = data.jamMulai.split(":");
    const [jamSelesaiHour, jamSelesaiMinute] = data.jamSelesai.split(":");

    const jamMulai = new Date(tanggalUjian);
    jamMulai.setHours(parseInt(jamMulaiHour), parseInt(jamMulaiMinute));

    const jamSelesai = new Date(tanggalUjian);
    jamSelesai.setHours(parseInt(jamSelesaiHour), parseInt(jamSelesaiMinute));

    // Validate time logic
    if (jamSelesai <= jamMulai) {
      return {
        success: false,
        error: "Jam selesai harus lebih besar dari jam mulai",
      };
    }

    // Update ujian and assign dosen penguji in a transaction
    await prisma.$transaction(async (tx) => {
      // Update ujian with schedule
      await tx.ujian.update({
        where: { id: data.ujianId },
        data: {
          status: "DIJADWALKAN",
          tanggalUjian: tanggalUjian,
          jamMulai: jamMulai,
          jamSelesai: jamSelesai,
          ruangan: data.ruangan,
          updatedAt: new Date(),
        },
      });

      // Delete existing dosen penguji assignments (if any)
      await tx.ujianDosenPenguji.deleteMany({
        where: { ujianId: data.ujianId },
      });

      // Create new dosen penguji assignments
      await tx.ujianDosenPenguji.createMany({
        data: [
          {
            ujianId: data.ujianId,
            dosenId: data.dosenPenguji1Id,
          },
          {
            ujianId: data.ujianId,
            dosenId: data.dosenPenguji2Id,
          },
        ],
      });
    });

    // Revalidate relevant pages
    revalidatePath("/detail-jadwal");
    revalidatePath(`/admin-assign/${data.ujianId}`);

    return {
      success: true,
      message:
        "Ujian berhasil dijadwalkan dan dosen penguji berhasil ditugaskan",
    };
  } catch (error) {
    console.error("Error assigning ujian:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menjadwalkan ujian",
    };
  }
}
