import {
  CheckSharedFileStatus,
  saveFileRecordInDb,
  saveFileShareRecordInDb,
} from '@/actions/file';
import { generateGetObjectSignedURL } from '@/app/aws/s3/get-object';
import { generatePutObjectSignedURL } from '@/app/aws/s3/put-object';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { FileWithPath } from 'react-dropzone';
import {
  base64ToArrayBuffer,
  base64ToUint8Array,
  deriveEncryptionKeyFromPassphrase,
  generateSymmetricKeyPair,
} from './key-ops.util';

export interface EncryptedFile {
  fileName: {
    encrypted: string; // Base64 encoded encrypted filename
    iv: string; // Base64 encoded IV used for filename encryption
    original: string;
  };
  encryptedBlob: Blob; // Encrypted file content as a Blob
  encryptedSymmetricKey: string; // Base64 encoded symmetric key (encrypted with RSA-OAEP)
  iv: string; // Baase64 encoded IV used for file content encryption
  keyIV?: string;
}
export interface FileDownloadManagerProp {
  fileName: string;
  encryptedSymmetricKey: string;
  fileIV: string;
  privateKey: CryptoKey;
  originalName: string;
  fileId: string;
}

export interface FileShareManagerProp extends FileDownloadManagerProp {
  userId?: string;
  shareId: string;
  passphrase: string;
  googleID: string;
  fileSize: bigint;
  expireAt: Date;
}
/**
 * Encrypts one or multiple files.
 * @param files A single File or an array of File objects to encrypt.
 * @param publicKey The public key (RSA-OAEP) used to encrypt the symmetric key.
 * @returns A Promise that resolves to an array of EncryptedFile objects.
 */

export async function Encryptor(
  files: FileWithPath | FileWithPath[],
  publicKey: CryptoKey,
  googleID: string,
): Promise<EncryptedFile[]> {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  console.log('GOOGLE ID in ENC: ', googleID);
  const filesArray = Array.isArray(files) ? files : [files];
  const encryptedFiles: EncryptedFile[] = [];

  for (const file of filesArray) {
    const fileBuffer = await file.arrayBuffer();

    const { symmetricKey, rawSymmetricKey } = await generateSymmetricKeyPair();

    const contentIV = crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: contentIV },
      symmetricKey,
      fileBuffer,
    );
    const encryptedBlob = new Blob([encryptedData], {
      type: 'application/octet-stream',
    });

    const encryptedExportedKeyBuffer = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      rawSymmetricKey,
    );

    const encryptedSymmetricKey = btoa(
      String.fromCharCode(...new Uint8Array(encryptedExportedKeyBuffer)),
    );

    const contentIVBase64 = btoa(String.fromCharCode(...contentIV));

    const fileNameBuffer = new TextEncoder().encode(file.name);

    const fileNameIV = crypto.getRandomValues(new Uint8Array(12));

    const encryptedFilenameBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: fileNameIV },
      symmetricKey,
      fileNameBuffer,
    );

    const encryptedFileNameBase64 = btoa(
      String.fromCharCode(...new Uint8Array(encryptedFilenameBuffer)),
    );
    const filenameIVBase64 = btoa(String.fromCharCode(...fileNameIV));

    const encryptedFileName = toUrlSafeBase64(encryptedFileNameBase64);

    await saveFileRecordInDb({
      fileName: encryptedFileName,
      fileNameIV: filenameIVBase64,
      symmetricKey: encryptedSymmetricKey,
      googleID,
      fileIV: contentIVBase64,
      fileSize: file.size,
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    encryptedFiles.push({
      fileName: {
        encrypted: encryptedFileName,
        iv: filenameIVBase64,
        original: file.name,
      },
      encryptedBlob,
      encryptedSymmetricKey,
      iv: contentIVBase64,
    });
  }

  return encryptedFiles;
}

export async function EncryptArrayBuffer(
  fileBuffer: ArrayBuffer,
  derivedKey: CryptoKey,
  originalName: string,
): Promise<{
  encryptedData: ArrayBuffer;
  iv: Uint8Array;
  encryptedName: string;
}> {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    derivedKey,
    fileBuffer,
  );
  const fileNameBuffer = new TextEncoder().encode(originalName);
  const encryptedFileName = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    derivedKey,
    fileNameBuffer,
  );
  const encryptedName = btoa(
    String.fromCharCode(...new Uint8Array(encryptedFileName)),
  );
  return { encryptedData, iv, encryptedName };
}
// type UploadModeParams = {
//   mode: 'upload';
//   publicKey: CryptoKey;
// };

// type ShareModeParams = {
//   mode: 'share';
//   passphraseKey: CryptoKey;
// };

// type EncryptorParams = UploadModeParams | ShareModeParams;

// export async function Encryptor(
//   fileInput: FileWithPath | FileWithPath[] | ArrayBuffer,
//   googleID: string,
//   params: EncryptorParams,
// ): Promise<EncryptedFile[]> {
//   if (typeof window === 'undefined') {
//     throw new Error('❌ This function should only run on the client side!');
//   }

//   if (params.mode === 'upload') {
//     if (!googleID || !params.publicKey) {
//       throw new Error('Missing required parameters for upload mode');
//     }

//     const filesArray = Array.isArray(fileInput) ? fileInput : [fileInput];
//     const encryptedFiles: EncryptedFile[] = [];

//     for (const file of filesArray as FileWithPath[]) {
//       const fileBuffer = await file.arrayBuffer();
//       const { symmetricKey, rawSymmetricKey } =
//         await generateSymmetricKeyPair();
//       const contentIV = crypto.getRandomValues(new Uint8Array(12));

//       const encryptedData = await crypto.subtle.encrypt(
//         { name: 'AES-GCM', iv: contentIV },
//         symmetricKey,
//         fileBuffer,
//       );

//       const encryptedBlob = new Blob([encryptedData], {
//         type: 'application/octet-stream',
//       });

//       const encryptedExportedKeyBuffer = await crypto.subtle.encrypt(
//         { name: 'RSA-OAEP' },
//         params.publicKey,
//         rawSymmetricKey,
//       );

//       const encryptedSymmetricKey = btoa(
//         String.fromCharCode(...new Uint8Array(encryptedExportedKeyBuffer)),
//       );

//       const contentIVBase64 = btoa(String.fromCharCode(...contentIV));

//       const fileNameBuffer = new TextEncoder().encode(file.name);
//       const fileNameIV = crypto.getRandomValues(new Uint8Array(12));

//       const encryptedFilenameBuffer = await crypto.subtle.encrypt(
//         { name: 'AES-GCM', iv: fileNameIV },
//         symmetricKey,
//         fileNameBuffer,
//       );

//       const encryptedFileNameBase64 = btoa(
//         String.fromCharCode(...new Uint8Array(encryptedFilenameBuffer)),
//       );
//       const filenameIVBase64 = btoa(String.fromCharCode(...fileNameIV));
//       const encryptedFileName = toUrlSafeBase64(encryptedFileNameBase64);

//       await saveFileRecordInDb({
//         fileName: encryptedFileName,
//         fileNameIV: filenameIVBase64,
//         symmetricKey: encryptedSymmetricKey,
//         googleID,
//         fileIV: contentIVBase64,
//         fileSize: file.size,
//         expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
//       });

//       encryptedFiles.push({
//         fileName: {
//           encrypted: encryptedFileName,
//           iv: filenameIVBase64,
//           original: file.name,
//         },
//         encryptedBlob,
//         encryptedSymmetricKey,
//         iv: contentIVBase64,
//       });
//     }

//     return encryptedFiles;
//   }

//   if (params.mode === 'share') {
//     if (!(fileInput instanceof ArrayBuffer)) {
//       throw new Error('In share mode, file must be of type ArrayBuffer');
//     }

//     const contentIV = crypto.getRandomValues(new Uint8Array(12));

//     const encryptedData = await crypto.subtle.encrypt(
//       { name: 'AES-GCM', iv: contentIV },
//       params.passphraseKey,
//       fileInput,
//     );

//     const encryptedBlob = new Blob([encryptedData], {
//       type: 'application/octet-stream',
//     });

//     const contentIVBase64 = btoa(String.fromCharCode(...contentIV));

//     return [
//       {
//         fileName: {
//           encrypted: '',
//           iv: '',
//           original: '',
//         },
//         encryptedBlob,
//         encryptedSymmetricKey: '',
//         iv: contentIVBase64,
//       },
//     ];
//   }

//   throw new Error('Invalid mode provided');
// }

// export async function EncryptArrayBuffer(
//   fileBuffer: ArrayBuffer,
//   derivedKey: CryptoKey,
// ): Promise<{
//   encryptedData: ArrayBuffer;
//   iv: Uint8Array;
// }> {
//   if (typeof window === 'undefined') {
//     throw new Error('❌ This function should only run on the client side!');
//   }
//   const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM recommends 12-byte IV

//   const encryptedData = await crypto.subtle.encrypt(
//     {
//       name: 'AES-GCM',
//       iv,
//     },
//     derivedKey,
//     fileBuffer,
//   );

//   return { encryptedData, iv };
// }

function toUrlSafeBase64(base64: string): string {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromUrlSafeBase64(urlSafe: string): string {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  let base64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) base64 += '='.repeat(4 - pad);
  return base64;
}
// * DECRYPT

export interface DecryptedFile {
  fileName: string;
  data: ArrayBuffer;
}

/**
 * Decrypts one or multiple encrypted files.
 * @param encryptedFiles A single EncryptedFile object or an array of them.
 * @param privateKey The private key (RSA-OAEP) corresponding to the public key used during encryption.
 * @returns A Promise that resolves to an array of DecryptedFile objects.
 */
export async function decryptFiles(
  encryptedFiles: EncryptedFile | EncryptedFile[],
  privateKey: CryptoKey,
): Promise<DecryptedFile[]> {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const encryptedFilesArray = Array.isArray(encryptedFiles)
    ? encryptedFiles
    : [encryptedFiles];

  const decryptedFiles: DecryptedFile[] = [];

  for (const encryptedFile of encryptedFilesArray) {
    const encryptedSymmetricKeyArrayBuffer = base64ToArrayBuffer(
      encryptedFile.encryptedSymmetricKey,
    );

    const symmetricKeyRaw = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedSymmetricKeyArrayBuffer,
    );

    const symmetricKey = await crypto.subtle.importKey(
      'raw',
      symmetricKeyRaw,
      { name: 'AES-GCM' },
      true,
      ['decrypt'],
    );

    const iv = base64ToArrayBuffer(encryptedFile.iv);

    const encryptedDataBuffer = await encryptedFile.encryptedBlob.arrayBuffer();

    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      symmetricKey,
      encryptedDataBuffer,
    );
    decryptedFiles.push({
      fileName: encryptedFile.fileName.original,
      data: decryptedData,
    });
  }
  return decryptedFiles;
}

// *
// export interface DecryptedFile {
//   fileName: string;
//   data: ArrayBuffer;
// }

// export type DecryptionMode =
//   | {
//       mode: 'upload';
//       privateKey: CryptoKey;
//     }
//   | {
//       mode: 'share';
//       passphraseKey: CryptoKey;
//     };

// /**
//  * Decrypts one or multiple encrypted files.
//  * @param encryptedFiles A single EncryptedFile object or an array of them.
//  * @param options Decryption mode options (upload or share).
//  * @returns A Promise that resolves to an array of DecryptedFile objects.
//  */
// export async function decryptFiles(
//   encryptedFiles: EncryptedFile | EncryptedFile[],
//   options: DecryptionMode,
// ): Promise<DecryptedFile[]> {
//   if (typeof window === 'undefined') {
//     throw new Error('❌ This function should only run on the client side!');
//   }

//   const encryptedFilesArray = Array.isArray(encryptedFiles)
//     ? encryptedFiles
//     : [encryptedFiles];

//   const decryptedFiles: DecryptedFile[] = [];

//   for (const encryptedFile of encryptedFilesArray) {
//     const iv = base64ToArrayBuffer(encryptedFile.iv);
//     const encryptedDataBuffer = await encryptedFile.encryptedBlob.arrayBuffer();

//     let symmetricKey: CryptoKey;

//     if (options.mode === 'upload') {
//       const encryptedKeyBuffer = base64ToArrayBuffer(
//         encryptedFile.encryptedSymmetricKey,
//       );
//       const symmetricKeyRaw = await crypto.subtle.decrypt(
//         { name: 'RSA-OAEP' },
//         options.privateKey,
//         encryptedKeyBuffer,
//       );
//       symmetricKey = await crypto.subtle.importKey(
//         'raw',
//         symmetricKeyRaw,
//         { name: 'AES-GCM' },
//         false,
//         ['decrypt'],
//       );
//     } else {
//       symmetricKey = options.passphraseKey;
//     }

//     const decryptedData = await crypto.subtle.decrypt(
//       { name: 'AES-GCM', iv },
//       symmetricKey,
//       encryptedDataBuffer,
//     );

//     decryptedFiles.push({
//       fileName: encryptedFile.fileName.original,
//       data: decryptedData,
//     });
//   }

//   return decryptedFiles;
// }

export async function FileNameDecryptor(
  fileName: string,
  fileNameIVBase64: string,
  encryptedSymmetricKeyBase64: string,
  privateKey: CryptoKey,
) {
  console.log('fileName: ', fileName);
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const encryptedFilenameBase64 = fromUrlSafeBase64(fileName);

  const encryptedFilenameBytes = base64ToUint8Array(encryptedFilenameBase64);

  const fileNameIV = base64ToUint8Array(fileNameIVBase64);

  const encryptedSymmetricKeyBytes = base64ToUint8Array(
    encryptedSymmetricKeyBase64,
  );
  try {
    const symmetricKeyBuffer = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedSymmetricKeyBytes,
    );

    const symmetricKey = await crypto.subtle.importKey(
      'raw',
      symmetricKeyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt'],
    );

    const decryptedFileNameBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: fileNameIV,
      },
      symmetricKey,
      encryptedFilenameBytes,
    );
    return new TextDecoder().decode(decryptedFileNameBuffer);
  } catch (error) {
    throw new Error(`name dec: ${(error as Error).message} `);
  }
}

export async function fetchEncryptedFile(key: string): Promise<ArrayBuffer> {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const presignedURL = await generateGetObjectSignedURL(key);
  const response = await fetch(presignedURL);

  if (!response.ok) throw new Error('Failed to fetch encrypted file.');
  return await response.arrayBuffer();
}

export const decryptSymmetricKey = async (
  encryptedSymmetricKeyBase64: string,
  privateKey: CryptoKey,
): Promise<CryptoKey> => {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const encryptedKeyBytes = base64ToUint8Array(encryptedSymmetricKeyBase64);

  const symmetricKeyBuffer = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedKeyBytes,
  );

  return await crypto.subtle.importKey(
    'raw',
    symmetricKeyBuffer,
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  );
};

export const decryptFile = async (
  encryptedFileBuffer: ArrayBuffer,
  symmetricKey: CryptoKey,
  ivBase64: string,
): Promise<ArrayBuffer> => {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const iv = base64ToUint8Array(ivBase64);

  return await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    symmetricKey,
    encryptedFileBuffer,
  );
};

export const triggerDownload = (buffer: ArrayBuffer, filename: string) => {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }
  const blob = new Blob([buffer]);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export async function FileDownloadManager({
  fileName,
  encryptedSymmetricKey,
  fileIV,
  privateKey,
  originalName,
}: FileDownloadManagerProp) {
  try {
    const encryptedFileArrayBufer = await fetchEncryptedFile(
      `upload/${fileName}`,
    );

    const decryptedSymmetricKey = await decryptSymmetricKey(
      encryptedSymmetricKey,
      privateKey,
    );

    const decryptedFile = await decryptFile(
      encryptedFileArrayBufer,
      decryptedSymmetricKey,
      fileIV,
    );

    await triggerDownload(decryptedFile, originalName);
  } catch (err) {
    console.error(err);
  }
}

// export async function FileDownloadManager({
//   fileName,
//   encryptedSymmetricKey,
//   fileIV,
//   privateKey,
//   originalName,
// }: FileDownloadManagerProp) {
//   try {
//     const encryptedFileArrayBuffer = await fetchEncryptedFile(fileName);
//     const encryptedBlob = new Blob([encryptedFileArrayBuffer]);

//     const result = await decryptFiles(
//       {
//         fileName: {
//           encrypted: fileName,
//           iv: fileIV,
//           original: originalName,
//         },
//         encryptedBlob,
//         encryptedSymmetricKey,
//         iv: fileIV,
//       },
//       { mode: 'upload', privateKey },
//     );

//     await triggerDownload(result[0].data, result[0].fileName);
//   } catch (err) {
//     console.error(err);
//   }
// }

export async function FileShareManager({
  googleID,
  fileId,
  shareId,
  fileName,
  fileSize,
  encryptedSymmetricKey,
  fileIV,
  privateKey,
  originalName,
  passphrase,
}: FileShareManagerProp) {
  if (typeof window === 'undefined') {
    throw new Error('❌ This function should only run on the client side!');
  }

  if (!passphrase) throw new Error('Passphrase is missing');

  try {
    const alreadySharedCheck = await CheckSharedFileStatus(fileName);
    if (alreadySharedCheck) throw new Error('File is already shared');

    const passphraseHash = await bcrypt.hash(passphrase, 12);

    const encryptedFileArrayBufer = await fetchEncryptedFile(
      `upload/${fileName}`,
    );

    const decryptedSymmetricKey = await decryptSymmetricKey(
      encryptedSymmetricKey,
      privateKey,
    );

    const decryptedFile = await decryptFile(
      encryptedFileArrayBufer,
      decryptedSymmetricKey,
      fileIV,
    );
    const derivedKey = await deriveEncryptionKeyFromPassphrase(passphrase);

    const encryptedShareFile = await EncryptArrayBuffer(
      decryptedFile,
      derivedKey,
      originalName,
    );
    const shareFileIV = encryptedShareFile.iv;
    const shareFileIVBase64 = btoa(String.fromCharCode(...shareFileIV));
    const encryptedShareFileBlob = new Blob([encryptedShareFile.encryptedData]);
    const encryptedFileName = toUrlSafeBase64(encryptedShareFile.encryptedName);
    console.log('BUFFER: ', encryptedShareFile.encryptedData);
    console.log('ENC NAME: ', encryptedShareFile.encryptedName);
    await saveFileShareRecordInDb({
      userId: googleID,
      shareId,
      sharedFileName: encryptedFileName,
      originalFileId: fileId,
      originalName: originalName,
      passphraseHash,
      encryptedSymmetricKey,
      fileSize,
      iv: shareFileIVBase64,
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const presignedURL = await generatePutObjectSignedURL({
      key: `upload/share/${encryptedFileName}`,
      fileType: 'application/octet-stream',
    });
    await axios.put(presignedURL, encryptedShareFileBlob);
  } catch (err) {
    console.error(err);
  }
}
