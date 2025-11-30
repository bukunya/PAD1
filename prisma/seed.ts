import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ruangan data...");

  // Create ruangan
  const ruanganData = [
    { nama: "HU207", deskripsi: "Ruang kuliah lantai 2" },
    { nama: "HU208", deskripsi: "Ruang kuliah lantai 2" },
    { nama: "HU209", deskripsi: "Ruang kuliah lantai 2" },
    { nama: "CM201", deskripsi: "Ruang kuliah lantai 2" },
    { nama: "Lab RPL 1", deskripsi: "Laboratorium Rekayasa Perangkat Lunak" },
    { nama: "Lab RPL 2", deskripsi: "Laboratorium Rekayasa Perangkat Lunak" },
    { nama: "Lab Embedded", deskripsi: "Laboratorium Sistem Tertanam" },
    { nama: "Lab Jaringan", deskripsi: "Laboratorium Jaringan Komputer" },
    {
      nama: "Lab Instrumentasi",
      deskripsi: "Laboratorium Instrumentasi dan Kontrol",
    },
    { nama: "Lab Elektro", deskripsi: "Laboratorium Teknik Elektro" },
  ];

  for (const ruangan of ruanganData) {
    await prisma.ruangan.upsert({
      where: { nama: ruangan.nama },
      update: {},
      create: ruangan,
    });
  }

  console.log("Ruangan seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
