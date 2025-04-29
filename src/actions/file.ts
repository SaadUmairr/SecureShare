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

interface SaveFileShareRecordInDbProps {
  userId?: string;
  shareId: string;
  sharedFileName: string;
  originalFileId?: string;
  passphraseHash: string;
  fileId?: string | null;
  iv: string;
  fileSize: bigint;
  maxDownloads?: number;
  downloadCount?: number;
  expireAt: Date;
}

interface CreateUploadRateLimitRecordProp {
  userId: string;
  fileSize: number;
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
    await prisma.file.create({
      data: {
        googleID,
        fileName,
        fileNameIV,
        symmetricKey,
        fileSize,
        fileIV,
        expireAt,
      },
    });
    await CreateUploadRateLimitRecord({ userId: googleID, fileSize });
  } catch (error) {
    throw new Error(`ERROR SAVING FILE RECORD: ${(error as Error).message}`);
  }
}

export async function getAllFiles(googleID: string) {
  try {
    const records = await prisma.file.findMany({ where: { googleID } });
    return records;
  } catch (error) {
    throw new Error(`ERROR FETCHING FILE RECORD: ${(error as Error).message}`);
  }
}

export async function CheckSharedFileStatus(fileName: string) {
  if (!fileName) throw new Error('File name is required');

  try {
    const originalFile = await prisma.file.findFirst({
      where: { fileName },
      select: {
        id: true,
      },
    });

    if (!originalFile) throw new Error('File not found in database');

    const existingShare = await prisma.fileShare.findFirst({
      where: {
        originalFileId: originalFile.id,
      },
    });

    return !!existingShare; // true if already shared, false otherwise
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function saveFileShareRecordInDb({
  userId,
  shareId,
  // fileId,
  sharedFileName,
  originalFileId,
  iv,
  fileSize,
  passphraseHash,
  maxDownloads,
  downloadCount,
  expireAt,
}: SaveFileShareRecordInDbProps) {
  if (
    [userId, shareId, iv, fileSize].some((field) => field === '') ||
    !expireAt
  )
    throw new Error('REQUIRED FIELDS ARE MISSING');

  try {
    await prisma.fileShare.create({
      data: {
        userId,
        shareId,
        sharedFileName,
        originalFileId,
        passphraseHash,
        iv,
        downloadCount,
        maxDownloads,
        fileSize,
        expireAt,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function fetchShareDetails(shareId: string) {
  try {
    const details = await prisma.fileShare.findUnique({ where: { shareId } });
    if (!details) throw new Error('NO SHARE RECORD FOUND');
    return details;
  } catch (error) {
    throw new Error(`ERROR IN SHARE DETAIL: ${(error as Error).message}`);
  }
}

export async function DeleteFileRecord(id: string) {
  try {
    const response = await prisma.file.delete({ where: { id } });
    return response;
  } catch (error) {
    throw new Error(`FILE RECORD NOT DELETED: ${(error as Error).message}`);
  }
}

export async function fetchAllSharedFiles(googleID: string) {
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

export async function CreateUploadRateLimitRecord({
  userId,
  fileSize,
}: CreateUploadRateLimitRecordProp) {
  try {
    const record = await prisma.uploadRecord.create({
      data: {
        userId,
        fileSize,
      },
    });
    return record;
  } catch (error) {
    throw new Error(`FAILED: ${(error as Error).message}`);
  }
}

const MAX_FILES_PER_DAY = 5;
const MAX_UPLOAD_SIZE_PER_DAY = 100 * 1024 * 1024;

export async function checkUploadRateLimit({
  userId,
  fileSize,
}: {
  userId: string;
  fileSize: number;
}): Promise<{ count: number; size: number }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const stats = await prisma.uploadRecord.aggregate({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
      _sum: {
        fileSize: true,
      },
      _count: {
        id: true,
      },
    });

    const uploadedSize = BigInt(stats._sum.fileSize ?? 0);
    const uploadedCount = stats._count.id ?? 0;

    const newSizeTotal = uploadedSize + BigInt(fileSize);
    const newCountTotal = uploadedCount + 1;

    if (newSizeTotal > BigInt(MAX_UPLOAD_SIZE_PER_DAY)) {
      throw new Error('Upload limit of 100MB/day exceeded.');
    }

    if (newCountTotal > MAX_FILES_PER_DAY) {
      throw new Error('You can only upload up to 5 files per day.');
    }

    return {
      count: newCountTotal,
      size: Number(newSizeTotal),
    };
  } catch (error) {
    throw new Error(
      (error as Error).message || 'FAILED TO CHECK UPLOAD RATE LIMIT',
    );
  }
}

export async function IncrementShareDownloadCount(shareId: string) {
  try {
    // Update the download count in the database
    const updatedShare = await prisma.fileShare.update({
      where: { shareId },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    return updatedShare;
  } catch (error) {
    throw new Error(`COUNT INCREMENT FAILED: ${(error as Error).message}`);
  }
}
