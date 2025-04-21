/*
  Warnings:

  - Made the column `expireAt` on table `FileShare` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileShare" ALTER COLUMN "expireAt" SET NOT NULL,
ALTER COLUMN "expireAt" SET DEFAULT (now() + interval '24 hours');

-- AlterTable
ALTER TABLE "Files" ALTER COLUMN "expireAt" SET DEFAULT (now() + interval '24 hours');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL;
