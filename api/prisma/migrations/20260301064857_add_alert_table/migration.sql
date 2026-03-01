/*
  Warnings:

  - You are about to drop the column `alertState` on the `Monitor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Monitor" DROP COLUMN "alertState";

-- DropEnum
DROP TYPE "AlertState";

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monitorId" TEXT NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
