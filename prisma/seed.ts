import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Running TSX Prisma seed...");

  await prisma.ujianDosenPenguji.deleteMany();
  await prisma.ujian.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const mahasiswa = await prisma.user.create({
    data: {
      name: "Rina Mahasiswa",
      email: "rina@example.com",
      role: "MAHASISWA",
      nim: "12345678",
    },
  });

  // create additional mahasiswa and dosen
  const mahasiswa2 = await prisma.user.create({
    data: {
      name: "Arya Mahasiswa",
      email: "arya@example.com",
      role: "MAHASISWA",
      nim: "87654321",
    },
  });

  const mahasiswa3 = await prisma.user.create({
    data: {
      name: "Dewi Mahasiswa",
      email: "dewi@example.com",
      role: "MAHASISWA",
      nim: "11223344",
    },
  });

  const dosen1 = await prisma.user.create({
    data: {
      name: "Dr. Budi",
      email: "budi@example.com",
      role: "DOSEN",
    },
  });

  const dosen2 = await prisma.user.create({
    data: {
      name: "Dr. Siti",
      email: "siti@example.com",
      role: "DOSEN",
    },
  });

  const dosen3 = await prisma.user.create({
    data: {
      name: "Dr. Anton",
      email: "anton@example.com",
      role: "DOSEN",
    },
  });

  const dosen4 = await prisma.user.create({
    data: {
      name: "Dr. Lestari",
      email: "lestari@example.com",
      role: "DOSEN",
    },
  });

  const dosen5 = await prisma.user.create({
    data: {
      name: "Dr. Hari",
      email: "hari@example.com",
      role: "DOSEN",
    },
  });

  // accounts
  await prisma.account.create({
    data: {
      userId: mahasiswa.id,
      type: "oauth",
      provider: "google",
      providerAccountId: "rina-google",
    },
  });

  await prisma.account.create({
    data: {
      userId: dosen1.id,
      type: "oauth",
      provider: "google",
      providerAccountId: "budi-google",
    },
  });

  // session
  await prisma.session.create({
    data: {
      userId: mahasiswa.id,
      sessionToken: "sess-rina",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  // Create 5 ujian with pembimbing + two penguji each
  const ujian1 = await prisma.ujian.create({
    data: {
      judul: "Proposal A - Sistem Informasi",
      berkasUrl: "http://example.com/prop-a.pdf",
      mahasiswaId: mahasiswa.id,
      dosenPembimbingId: dosen1.id,
      status: "DIJADWALKAN",
      tanggalUjian: new Date("2025-10-10T10:00:00Z"),
      jamMulai: new Date("2025-10-10T10:00:00Z"),
      jamSelesai: new Date("2025-10-10T12:00:00Z"),
      ruangan: "Ruang 101",
    },
  });

  await prisma.ujianDosenPenguji.createMany({
    data: [
      { ujianId: ujian1.id, dosenId: dosen2.id },
      { ujianId: ujian1.id, dosenId: dosen3.id },
    ],
  });

  const ujian2 = await prisma.ujian.create({
    data: {
      judul: "Ujian B - Jaringan",
      berkasUrl: "http://example.com/ujian-b.pdf",
      mahasiswaId: mahasiswa2.id,
      dosenPembimbingId: dosen2.id,
      status: "MENUNGGU_VERIFIKASI",
      tanggalUjian: new Date("2025-11-05T13:00:00Z"),
      jamMulai: new Date("2025-11-05T13:00:00Z"),
      jamSelesai: new Date("2025-11-05T15:00:00Z"),
      ruangan: "Ruang 202",
    },
  });

  await prisma.ujianDosenPenguji.createMany({
    data: [
      { ujianId: ujian2.id, dosenId: dosen1.id },
      { ujianId: ujian2.id, dosenId: dosen3.id },
    ],
  });

  const ujian3 = await prisma.ujian.create({
    data: {
      judul: "Ujian C - Instrumentasi",
      berkasUrl: "http://example.com/ujian-c.pdf",
      mahasiswaId: mahasiswa3.id,
      dosenPembimbingId: dosen3.id,
      status: "DITERIMA",
      tanggalUjian: new Date("2025-12-01T09:00:00Z"),
      jamMulai: new Date("2025-12-01T09:00:00Z"),
      jamSelesai: new Date("2025-12-01T11:00:00Z"),
      ruangan: "Ruang 303",
    },
  });

  await prisma.ujianDosenPenguji.createMany({
    data: [
      { ujianId: ujian3.id, dosenId: dosen1.id },
      { ujianId: ujian3.id, dosenId: dosen4.id },
    ],
  });

  const ujian4 = await prisma.ujian.create({
    data: {
      judul: "Ujian D - Rekayasa Perangkat Lunak",
      berkasUrl: "http://example.com/ujian-d.pdf",
      mahasiswaId: mahasiswa.id,
      dosenPembimbingId: dosen4.id,
      status: "DIJADWALKAN",
      tanggalUjian: new Date("2025-10-20T14:00:00Z"),
      jamMulai: new Date("2025-10-20T14:00:00Z"),
      jamSelesai: new Date("2025-10-20T16:00:00Z"),
      ruangan: "Ruang 104",
    },
  });

  await prisma.ujianDosenPenguji.createMany({
    data: [
      { ujianId: ujian4.id, dosenId: dosen2.id },
      { ujianId: ujian4.id, dosenId: dosen5.id },
    ],
  });

  const ujian5 = await prisma.ujian.create({
    data: {
      judul: "Ujian E - Sistem Tertanam",
      berkasUrl: "http://example.com/ujian-e.pdf",
      mahasiswaId: mahasiswa2.id,
      dosenPembimbingId: dosen5.id,
      status: "MENUNGGU_VERIFIKASI",
      tanggalUjian: new Date("2025-10-25T08:00:00Z"),
      jamMulai: new Date("2025-10-25T08:00:00Z"),
      jamSelesai: new Date("2025-10-25T10:00:00Z"),
      ruangan: "Lab Embedded",
    },
  });

  await prisma.ujianDosenPenguji.createMany({
    data: [
      { ujianId: ujian5.id, dosenId: dosen1.id },
      { ujianId: ujian5.id, dosenId: dosen4.id },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
