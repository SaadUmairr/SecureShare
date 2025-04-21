/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FileShare" ALTER COLUMN "expireAt" SET DEFAULT (now() + interval '24 hours');

-- AlterTable
ALTER TABLE "Files" ALTER COLUMN "expireAt" SET DEFAULT (now() + interval '24 hours');

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
