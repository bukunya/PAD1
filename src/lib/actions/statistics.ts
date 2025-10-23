"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function statistics() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Anda harus login untuk mengakses dashboard",
    };
  }

  try {
    // Fetch data based on user role, if user is admin, fetch all data, if user is mahasiswa and dosen, fetch any data that contains their user id
    // Normalize role to uppercase so it matches the Prisma enum values (MAHASISWA, DOSEN, ADMIN)
    const role = String(session.user.role || "").toUpperCase();

    // if (role === "MAHASISWA") {
    //   return {
    //     success: false,
    //     error: "Akses ditolak untuk role MAHASISWA",
    //   };
    // }

    // fetch all dosen and mahasiswa data, only their id and name, with format like {"dosen": [{id: string, name: string}, ...], "mahasiswa": [{id: string, name: string}, ...]}

    // i also want to add how many each dosen has participate as pembimbing and penguji in ujian, but separate, i mean like as pembimbing count and penguji count, make dosen like {id: string, name: string, pembimbingCount: number, pengujiCount: number}
    const [dosenRaw, mahasiswa] = await Promise.all([
      prisma.user.findMany({
        where: { role: "DOSEN" },
        select: {
          id: true,
          name: true,
          image: true,
          nim: true,
          _count: {
            select: {
              ujianDosenPembimbing: true, // Count as pembimbing
              ujianDosenPenguji: true, // Count as penguji
            },
          },
        },
      }),
      prisma.user.findMany({
        where: { role: "MAHASISWA" },
        select: { id: true, name: true, prodi: true, image: true, nim: true },
      }),
    ]);

    // Map dosen to include pembimbingCount and pengujiCount
    const dosen = dosenRaw.map((d) => ({
      id: d.id,
      name: d.name,
      pembimbingCount: d._count.ujianDosenPembimbing,
      pengujiCount: d._count.ujianDosenPenguji,
      image: d.image,
      nim: d.nim,
    }));

    const data = {
      dosen,
      mahasiswa,
    };

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error in dataRoleSpecific:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat memproses data",
    };
  }
}
