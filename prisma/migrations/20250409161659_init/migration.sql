-- AlterTable
ALTER TABLE "Files" ALTER COLUMN "expireAt" SET DEFAULT (now() + interval '24 hours');

-- CreateTable
CREATE TABLE "FileShare" (
    "id" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "passphraseHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireAt" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "FileShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileShare_shareId_key" ON "FileShare"("shareId");

-- AddForeignKey
ALTER TABLE "FileShare" ADD CONSTRAINT "FileShare_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileShare" ADD CONSTRAINT "FileShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("googleID") ON DELETE SET NULL ON UPDATE CASCADE;
