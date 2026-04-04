/*
  Warnings:

  - You are about to drop the column `lastlatency` on the `Monitor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Monitor" DROP COLUMN "lastlatency",
ADD COLUMN     "statusChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
