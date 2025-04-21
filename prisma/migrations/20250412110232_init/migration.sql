/*
  Warnings:

  - You are about to drop the column `fileId` on the `FileShare` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[originalFileId,userId]` on the table `FileShare` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `encryptedSymmetricKey` to the `FileShare` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `FileShare` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFileId` to the `FileShare` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `FileShare` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sharedFileName` to the `FileShare` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FileShare" DROP CONSTRAINT "FileShare_fileId_fkey";

-- AlterTable
ALTER TABLE "FileShare" DROP COLUMN "fileId",
ADD COLUMN     "encryptedSymmetricKey" TEXT NOT NULL,
ADD COLUMN     "fileSize" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "iv" TEXT NOT NULL,
ADD COLUMN     "originalFileId" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "sharedFileName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Files" ALTER COLUMN "expireAt" SET DEFAULT (now() + interval '24 hours');

-- CreateIndex
CREATE UNIQUE INDEX "FileShare_originalFileId_userId_key" ON "FileShare"("originalFileId", "userId");

-- AddForeignKey
ALTER TABLE "FileShare" ADD CONSTRAINT "FileShare_originalFileId_fkey" FOREIGN KEY ("originalFileId") REFERENCES "Files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
