/*
  Warnings:

  - You are about to drop the column `encryptedSymmetricKey` on the `FileShare` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FileShare" DROP COLUMN "encryptedSymmetricKey",
ALTER COLUMN "expireAt" SET DEFAULT (now() + interval '24 hours');

-- AlterTable
ALTER TABLE "Files" ALTER COLUMN "expireAt" SET DEFAULT (now() + interval '24 hours');
