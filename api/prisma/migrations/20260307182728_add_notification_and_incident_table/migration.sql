/*
  Warnings:

  - You are about to drop the column `lastAlertSentAt` on the `Monitor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('EMAIL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'RESOLVED', 'ACKNOWLEDGED');

-- AlterTable
ALTER TABLE "Monitor" DROP COLUMN "lastAlertSentAt",
ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "monitorId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "currentStatus" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "alertCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationChannel" (
    "id" TEXT NOT NULL,
    "monitorId" TEXT NOT NULL,
    "ChannelType" "ChannelType" NOT NULL,
    "ChannelValue" TEXT NOT NULL,

    CONSTRAINT "NotificationChannel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Incident_monitorId_currentStatus_idx" ON "Incident"("monitorId", "currentStatus");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationChannel" ADD CONSTRAINT "NotificationChannel_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
