/*
  Warnings:

  - Added the required column `encryptedSymmetricKey` to the `FileShare` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileShare" ADD COLUMN     "encryptedSymmetricKey" TEXT NOT NULL,
ALTER COLUMN "expireAt" SET DEFAULT (now() + interval '24 hours');

-- AlterTable
ALTER TABLE "Files" ALTER COLUMN "expireAt" SET DEFAULT (now() + interval '24 hours');
