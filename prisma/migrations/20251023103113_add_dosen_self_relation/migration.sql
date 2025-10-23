-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dosenPembimbingId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_dosenPembimbingId_fkey" FOREIGN KEY ("dosenPembimbingId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
