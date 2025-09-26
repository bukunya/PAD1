import { prisma } from "@/lib/prisma";

// get status pengajuan ujian mahasiswa
export async function getStatusPengajuan(mahasiswaId: string) {
  return prisma.ujian.findMany({
    where: { mahasiswaId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      judul: true,
      status: true,
      jadwal: true,
      dosenPembimbing: { select: { name: true } },
    },
  });
}

// get jadwal ujian mahasiswa
export async function getJadwalUjian(mahasiswaId: string) {
  return prisma.ujian.findMany({
    where: { mahasiswaId, status: "DIJADWALKAN" },
    orderBy: { jadwal: "asc" },
    select: {
      id: true,
      judul: true,
      jadwal: true,
      // ruangUjian: true, // nanti bisa tambahin field di model ujian kalau butuh
    },
  });
}

// get agenda untuk kalender (semua role bisa pake)
export async function getAgenda(userId: string, role: string) {
  if (role === "MAHASISWA") {
    return prisma.ujian.findMany({
      where: { mahasiswaId: userId },
      select: { jadwal: true, judul: true },
    });
  }
  if (role === "DOSEN") {
    return prisma.ujian.findMany({
      where: {
        OR: [
          { dosenPembimbingId: userId },
          { dosenPenguji: { some: { dosenId: userId } } },
        ],
      },
      select: { jadwal: true, judul: true },
    });
  }
  if (role === "ADMIN") {
    return prisma.ujian.findMany({
      select: { jadwal: true, judul: true },
    });
  }
  return [];
}