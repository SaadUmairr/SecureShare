import { generatePutObjectSignedURL } from '@/app/aws/s3/put-object';
import axios from 'axios';
import { EncryptedFile } from './crypto.util';

export async function filesUploader(files: EncryptedFile[]) {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  try {
    await Promise.all(
      files.map(async (file) => {
        const presignedUrl = await generatePutObjectSignedURL({
          key: `upload/${file.fileName.encrypted}`,
          fileType: 'application/octet-stream',
        });

        await axios.put(presignedUrl, file.encryptedBlob);
      }),
    );
  } catch (error) {
    throw new Error(`ERROR UPLOADING FILES ${(error as Error).message}`);
  }
}
