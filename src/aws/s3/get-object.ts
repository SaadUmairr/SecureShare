"use server"

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID || "",
  },
})

export const generateGetObjectSignedURL = async (
  key: string,
  expireInSeconds: number = 86400
): Promise<string> => {
  if (
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY_ID ||
    !process.env.AWS_S3_BUCKET_NAME
  ) {
    throw new Error("AWS Environment variables are missing")
  }

  if (!key) throw new Error("Key is empty")
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    })
    const presignedURL = await getSignedUrl(s3, command, {
      expiresIn: expireInSeconds,
    })
    if (!presignedURL) throw new Error("Failed to generate get presigned URL")

    return presignedURL
  } catch (error) {
    throw new Error(
      `Presigned URL generation failed: ${(error as Error).message}`
    )
  }
}
