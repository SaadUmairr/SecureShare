'use server';

import { prisma } from '@/lib/db';

interface saveFileRecordInDbProp {
  fileName: string;
  fileNameIV: string;
  symmetricKey: string;
  fileIV: string;
  googleID: string;
  fileSize: number;
  expireAt: Date;
}

export async function saveFileRecordInDb({
  fileName,
  fileNameIV,
  symmetricKey,
  fileIV,
  googleID,
  fileSize,
  expireAt,
}: saveFileRecordInDbProp) {
  try {
    const response = await prisma.files.create({
      data: {
        googleID,
        fileName,
        fileNameIV,
        symmetricKey,
        fileIV,
        fileSize,
        expireAt,
      },
    });
  } catch (error) {
    throw new Error(`ERROR SAVING FILE RECORD: ${(error as Error).message}`);
  }
}

export async function getAllFiles(googleID: string) {
  try {
    const records = await prisma.files.findMany({ where: { googleID } });
    return records;
  } catch (error) {
    throw new Error(`ERROR FETCHING FILE RECORD: ${(error as Error).message}`);
  }
}

export async function CheckSharedFileStatus(fileName: string) {
  if (!fileName) throw new Error('File name is required');
  try {
    const originalFile = await prisma.files.findFirst({
      where: { fileName },
    });
    if (!originalFile) throw new Error('File not found in database');
    const existingShare = await prisma.fileShare.findFirst({
      where: {
        originalFileId: originalFile.id,
      },
    });
    return !!existingShare; // returns true if shared, false otherwise
  } catch (error) {
    throw error;
  }
}

export async function saveFileShareRecordInDb({
  userId,
  shareId,

  originalName,
  sharedFileName,
  originalFileId,
  encryptedSymmetricKey,
  iv,
  fileSize,
  passphraseHash,
  expireAt,
}: {
  userId: string;
  shareId: string;
  // fileName: string;
  originalName: string;
  sharedFileName: string;
  originalFileId: string;
  encryptedSymmetricKey: string;
  iv: string;
  fileSize: bigint;
  passphraseHash: string;
  expireAt: Date;
}) {
  if (
    [userId, shareId, iv, fileSize].some((field) => field === '') ||
    !expireAt
  )
    throw new Error('REQUIRED FIELDS ARE MISSING');

  try {
    const record = await prisma.fileShare.create({
      data: {
        userId,
        shareId,
        sharedFileName,
        originalFileId,
        passphraseHash,
        encryptedSymmetricKey,
        originalName,
        iv,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function fetchFileDetailFromShareId(shareId: string) {
  try {
    const detail = await prisma.fileShare.findUnique({ where: { shareId } });
    return detail;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function DeleteFileRecord(id: string) {
  try {
    const response = await prisma.files.delete({ where: { id } });
    return response;
  } catch (error) {
    throw new Error(`FILE RECORD NOT DELETED: ${(error as Error).message}`);
  }
}

export async function SharedFilesRecord(googleID: string) {
  if (!googleID) throw new Error('GoogleID is missing');
  try {
    const records = await prisma.fileShare.findMany({
      where: { userId: googleID },
     
    });
    return records;
  } catch (error) {
    throw new Error(`SHARE RECORDS NOT FETCHED: ${(error as Error).message}`);
  }
}
