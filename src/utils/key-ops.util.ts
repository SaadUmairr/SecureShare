interface AsymmetricKeyPairReturnProp {
  keyPair: CryptoKeyPair
  exportedPublicKeyBase64: string
  exportedPrivateKeyBase64: string
}

export async function generateAsymmetricKeyPair(): Promise<AsymmetricKeyPairReturnProp> {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  try {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 3072,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    )
    const exportedPublicKeyBase64 = await exportKeyToBase64(
      keyPair.publicKey,
      "public"
    )
    const exportedPrivateKeyBase64 = await exportKeyToBase64(
      keyPair.privateKey,
      "private"
    )

    return {
      keyPair,
      exportedPublicKeyBase64,
      exportedPrivateKeyBase64,
    }
  } catch (error) {
    throw new Error(
      `Error generating asymmetric key pair: ${(error as Error).message}`
    )
  }
}

export async function generateSymmetricKeyPair() {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  try {
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    )
    const exportedKeyBase64 = await crypto.subtle.exportKey("raw", key)
    return {
      symmetricKey: key,
      exportedKey: btoa(
        String.fromCharCode(...new Uint8Array(exportedKeyBase64))
      ),
      rawSymmetricKey: exportedKeyBase64,
    }
  } catch (error) {
    throw new Error(
      `Error generating symmetric key: ${(error as Error).message}`
    )
  }
}

// EXPORT METHODS

export async function exportKeyToBase64(
  key: CryptoKey,
  type: "public" | "private"
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  const exportedKey = await crypto.subtle.exportKey(
    type === "public" ? "spki" : "pkcs8",
    key
  )
  return btoa(String.fromCharCode(...new Uint8Array(exportedKey)))
}

export function base64ToArrayBuffer(base64: string): Uint8Array {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }

  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++)
    bytes[i] = binaryString.charCodeAt(i)

  return bytes
}

export function base64ToUint8Array(base64: string): Uint8Array {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  const binaryStr = atob(base64)
  const bytes = new Uint8Array(binaryStr.length)
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  return bytes
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  return btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  )
}

// KEY IMPORT, DERIVATION, ENCRYPTION AND DECRYPTION

export async function deriveEncryptionKey(
  passphrase: string,
  googleID: string
): Promise<CryptoKey> {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  const passphraseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  )

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(googleID),
      iterations: 200000,
      hash: "SHA-256",
    },
    passphraseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )
}

export async function deriveEncryptionKeyFromPassphrase(
  passphrase: string
): Promise<CryptoKey> {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }

  const passphraseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  )

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(), // ⛔ No salt (empty buffer)
      iterations: 200_000,
      hash: "SHA-256",
    },
    passphraseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )
}

export async function encryptPrivateKey(
  privateKey: CryptoKey,
  passphrase: string,
  googleID: string
): Promise<{
  encryptedPrivateKey: string
  iv: string
}> {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", privateKey)
  const derivedKey = await deriveEncryptionKey(passphrase, googleID)
  const iv = crypto.getRandomValues(new Uint8Array(16))

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    privateKeyBuffer
  )

  return {
    encryptedPrivateKey: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv.buffer),
  }
}

export async function decryptPrivateKey(
  encryptedPrivateKeyBase64: string,
  ivBase64: string,
  passphrase: string,
  googleID: string
): Promise<CryptoKey> {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  const derivedKey = await deriveEncryptionKey(passphrase, googleID)
  const iv = base64ToArrayBuffer(ivBase64).slice()
  const encryptedBuffer = base64ToArrayBuffer(encryptedPrivateKeyBase64).slice()

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    encryptedBuffer
  )

  return await crypto.subtle.importKey(
    "pkcs8",
    decryptedBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"]
  )
}

export async function importPublicKey(
  publicKeyBase64: string
): Promise<CryptoKey> {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64).slice()

  return await crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  )
}

export async function KeyPairDecryptor(
  googleID: string,
  passphrase: string,
  privateKeyString: string,
  publicKeyString: string,
  ivString: string
) {
  if (typeof window === "undefined") {
    throw new Error("❌ This function should only run on the client side!")
  }
  try {
    const decryptedPrivateKey = await decryptPrivateKey(
      privateKeyString,
      ivString,
      passphrase,
      googleID
    )
    const importedPublicKey = await importPublicKey(publicKeyString)
    return {
      importedPublicKey,
      decryptedPrivateKey,
    }
  } catch (error) {
    throw new Error(`ERROR LOADING KEYS: ${(error as Error).message}`)
  }
}
