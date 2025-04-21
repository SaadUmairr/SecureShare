'use server';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface s3Props {
  key: string;
  fileType: string;
  expireInSeconds?: number;
}

const s3 = new S3Client({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID || '',
  },
});

export const generatePutObjectSignedURL = async ({
  key,
  fileType,
  expireInSeconds = 300,
}: s3Props): Promise<string> => {
  const requiredEnvs = [
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY_ID',
    'AWS_S3_BUCKET_NAME',
  ];

  const missing = requiredEnvs.filter((env) => !process.env[env]);
  if (missing.length > 0) {
    throw new Error(`Missing AWS config: ${missing.join(', ')}`);
  }
  if (!key || !fileType) {
    throw new Error('Invalid input, URL can not be generated');
  }

  try {
    const presignedCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || '',
      Key: key,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, presignedCommand, {
      expiresIn: expireInSeconds,
    });
    if (!url) throw new Error('Failed to generate presigned URL');
    return url;
  } catch (error) {
    throw new Error(
      `Presigned URL generation failed: ${(error as Error).message}`,
    );
  }
};
