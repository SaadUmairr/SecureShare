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
}

export interface FileShareManagerProp extends FileDownloadManagerProp {
  fileId: string;
  userId?: string;
  shareId: string;
  passphrase: string;
  googleID: string;
  fileSize: bigint;
  maxDownloads?: number;
  downloadCount?: number;
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
export async function decryptFileName(
  encryptedNameBase64: string,
  passphrase: string,
  ivBase64: string,
): Promise<string> {
  console.log('DECRYPTING FILE NAME..', encryptedNameBase64);
  console.log('PASSPHRASE: ', passphrase);

  const encryptedNameBytes = Uint8Array.from(
    atob(fromUrlSafeBase64(encryptedNameBase64)),
    (c) => c.charCodeAt(0),
  );

  const iv = Uint8Array.from(atob(fromUrlSafeBase64(ivBase64)), (c) =>
    c.charCodeAt(0),
  );

  try {
    const derivedKey = await deriveEncryptionKeyFromPassphrase(passphrase);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      derivedKey,
      encryptedNameBytes,
    );

    const decodedName = new TextDecoder().decode(decryptedBuffer);
    console.log('DECRYPTED FILE NAME: ', decodedName);
    return decodedName;
  } catch (error) {
    console.error('Decryption error:', (error as Error).message);
    throw new Error(
      'Failed to decrypt file name. Possibly incorrect passphrase.',
    );
  }
}

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

export async function FileNameDecryptor(
  fileName: string,
  fileNameIVBase64: string,
  encryptedSymmetricKeyBase64: string,
  privateKey: CryptoKey,
) {
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
  returnBlob = false, // <-- NEW OPTIONAL PARAMETER
}: FileDownloadManagerProp & { returnBlob?: boolean }) {
  try {
    const encryptedFileArrayBuffer = await fetchEncryptedFile(
      `upload/${fileName}`,
    );

    const decryptedSymmetricKey = await decryptSymmetricKey(
      encryptedSymmetricKey,
      privateKey,
    );

    const decryptedFile = await decryptFile(
      encryptedFileArrayBuffer,
      decryptedSymmetricKey,
      fileIV,
    );

    if (returnBlob) {
      return new Blob([decryptedFile]);
    } else {
      await triggerDownload(decryptedFile, originalName);
    }
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

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

  console.log('PASSPHRASE: CRYPTO:: ', passphrase);

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
    await saveFileShareRecordInDb({
      userId: googleID,
      shareId,
      sharedFileName: encryptedFileName,
      fileId,
      originalFileId: fileId,
      passphraseHash,
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
    throw new Error((err as Error).message);
  }
}
