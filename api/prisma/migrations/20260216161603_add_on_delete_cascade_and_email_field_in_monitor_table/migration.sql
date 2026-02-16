/*
  Warnings:

  - You are about to drop the column `interval` on the `Monitor` table. All the data in the column will be lost.
  - Added the required column `email` to the `Monitor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PingLog" DROP CONSTRAINT "PingLog_monitorId_fkey";

-- AlterTable
ALTER TABLE "Monitor" DROP COLUMN "interval",
ADD COLUMN     "email" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PingLog" ADD CONSTRAINT "PingLog_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
