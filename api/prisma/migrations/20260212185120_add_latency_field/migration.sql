/*
  Warnings:

  - Made the column `lastChecked` on table `Monitor` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `latency` to the `PingLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `statusCode` on table `PingLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Monitor" ALTER COLUMN "lastChecked" SET NOT NULL,
ALTER COLUMN "lastChecked" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PingLog" ADD COLUMN     "latency" INTEGER NOT NULL,
ALTER COLUMN "statusCode" SET NOT NULL;
