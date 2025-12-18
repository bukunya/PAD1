-- DropForeignKey
ALTER TABLE "public"."Ujian" DROP CONSTRAINT "Ujian_dosenPembimbingId_fkey";

-- AlterTable
ALTER TABLE "Ujian" ALTER COLUMN "dosenPembimbingId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ujian" ADD CONSTRAINT "Ujian_dosenPembimbingId_fkey" FOREIGN KEY ("dosenPembimbingId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
