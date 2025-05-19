"use server"

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID || "",
  },
})

export const deleteObjectFromS3 = async (key: string) => {
  const requiredEnvs = [
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY_ID",
    "AWS_S3_BUCKET_NAME",
  ]

  const missing = requiredEnvs.filter((env) => !process.env[env])
  if (missing.length > 0) {
    throw new Error(`Missing AWS config: ${missing.join(", ")}`)
  }
  if (!key) throw new Error("Invalid input, URL can not be generated")

  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: key,
    })

    const response = await s3.send(deleteCommand)
    return response
  } catch (error) {
    throw new Error(`File deletion failed: ${(error as Error).message}`)
  }
}
