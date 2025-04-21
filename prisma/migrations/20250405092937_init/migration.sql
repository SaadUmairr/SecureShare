-- CreateTable
CREATE TABLE "User" (
    "googleID" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "isPassphraseSet" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("googleID")
);

-- CreateTable
CREATE TABLE "UserKeyPair" (
    "googleID" TEXT NOT NULL,
    "passphrase" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "iv" TEXT NOT NULL,

    CONSTRAINT "UserKeyPair_pkey" PRIMARY KEY ("googleID")
);

-- CreateTable
CREATE TABLE "Files" (
    "id" TEXT NOT NULL,
    "googleID" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileNameIV" TEXT NOT NULL,
    "symmetricKey" TEXT NOT NULL,
    "fileIV" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL DEFAULT 0,
    "expireAt" TIMESTAMP(3) NOT NULL DEFAULT (now() + interval '24 hours'),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserKeyPair" ADD CONSTRAINT "UserKeyPair_googleID_fkey" FOREIGN KEY ("googleID") REFERENCES "User"("googleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_googleID_fkey" FOREIGN KEY ("googleID") REFERENCES "User"("googleID") ON DELETE CASCADE ON UPDATE CASCADE;
