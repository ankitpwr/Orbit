/*
  Warnings:

  - You are about to drop the `Alert` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_monitorId_fkey";

-- AlterTable
ALTER TABLE "Monitor" ADD COLUMN     "lastAlertSentAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Alert";
