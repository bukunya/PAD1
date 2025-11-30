/*
  Warnings:

  - You are about to drop the column `ruangan` on the `Ujian` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ujian" DROP COLUMN "ruangan",
ADD COLUMN     "ruanganId" TEXT;

-- CreateTable
CREATE TABLE "Ruangan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ruangan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ruangan_nama_key" ON "Ruangan"("nama");

-- AddForeignKey
ALTER TABLE "Ujian" ADD CONSTRAINT "Ujian_ruanganId_fkey" FOREIGN KEY ("ruanganId") REFERENCES "Ruangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
