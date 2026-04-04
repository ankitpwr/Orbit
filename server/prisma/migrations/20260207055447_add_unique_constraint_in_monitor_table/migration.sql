/*
  Warnings:

  - A unique constraint covering the columns `[userId,url]` on the table `Monitor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Monitor_userId_url_key" ON "Monitor"("userId", "url");
