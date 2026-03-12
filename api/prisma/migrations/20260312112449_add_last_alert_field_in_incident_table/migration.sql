/*
  Warnings:

  - You are about to drop the column `ChannelType` on the `NotificationChannel` table. All the data in the column will be lost.
  - You are about to drop the column `ChannelValue` on the `NotificationChannel` table. All the data in the column will be lost.
  - Added the required column `channelType` to the `NotificationChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelValue` to the `NotificationChannel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "lastAlertSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "NotificationChannel" DROP COLUMN "ChannelType",
DROP COLUMN "ChannelValue",
ADD COLUMN     "channelType" "ChannelType" NOT NULL,
ADD COLUMN     "channelValue" TEXT NOT NULL;
