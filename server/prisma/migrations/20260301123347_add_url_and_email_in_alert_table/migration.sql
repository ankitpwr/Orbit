/*
  Warnings:

  - Added the required column `email` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
