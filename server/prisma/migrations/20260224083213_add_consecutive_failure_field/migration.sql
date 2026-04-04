-- CreateEnum
CREATE TYPE "AlertState" AS ENUM ('OK', 'ALERTING');

-- AlterTable
ALTER TABLE "Monitor" ADD COLUMN     "alertState" "AlertState" NOT NULL DEFAULT 'OK',
ADD COLUMN     "consecutiveFailure" INTEGER NOT NULL DEFAULT 0;
