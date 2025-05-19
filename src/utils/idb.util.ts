import { IDBPDatabase, openDB } from "idb"

const DB_NAME = "keypair"
const DB_VERSION = 1

export interface KeyPairRecord {
  id: "keys"
  publicKey: string // stored as Base64 string (or extractable CryptoKey if your browser supports it)
  privateKey: string // encrypted private key in Base64
  iv: string // IV used for encrypting the private key, as Base64
}

// Get the IndexedDB database instance.
export async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("keypair")) {
        db.createObjectStore("keypair", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("passphrase")) {
        db.createObjectStore("passphrase", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("identifier")) {
        db.createObjectStore("identifier", { keyPath: "id" })
      }
    },
  })
}

export async function saveKeyPairRecordLocally(
  record: KeyPairRecord
): Promise<void> {
  const db = await getDB()
  const tx = db.transaction("keypair", "readwrite")
  await tx.objectStore("keypair").put(record)
  await tx.done
}
// Load the key pair record from IndexedDB.
export async function loadLocalKeyPairRecord(): Promise<KeyPairRecord | null> {
  const db = await getDB()
  const record = await db
    .transaction("keypair", "readonly")
    .objectStore("keypair")
    .get("keys")
  return record ?? null
}

// Save other simple data into a specified store.
export async function saveDataLocally(
  storeName: string,
  id: string,
  data: string
): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(storeName, "readwrite")
  await tx.objectStore(storeName).put({ id, data })
  await tx.done
}

// Load data from a specified store.
export async function loadLocalData(
  storeName: string,
  id: string
): Promise<string | null> {
  try {
    const db = await getDB()
    const record = await db
      .transaction(storeName, "readonly")
      .objectStore(storeName)
      .get(id)
    return record?.data ?? null
  } catch {
    return null
  }
}

export async function clearLocalDB(store: string) {
  const db = await getDB()
  const tx = db.transaction(store, "readwrite")
  await tx.objectStore(store).clear()
  await tx.done
}

// Save the passphrase into the "passphrase" store, with a fixed key (e.g., 'passphrase')
export async function savePassphraseLocally(pass: string): Promise<void> {
  await saveDataLocally("passphrase", "passphrase", pass)
}

// Load the passphrase from the "passphrase" store
export async function loadPassphrase(): Promise<string | null> {
  return await loadLocalData("passphrase", "passphrase")
}

const UPLOAD_LIMIT_KEY = "upload-rate-limit"

export interface UploadRateLimit {
  count: number
  size: number
  date: string
}
export async function getUploadRateLimitLocal(): Promise<UploadRateLimit | null> {
  const raw = await loadLocalData("identifier", UPLOAD_LIMIT_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as UploadRateLimit
    const today = new Date().toISOString().slice(0, 10)
    if (parsed.date !== today) {
      return null // Outdated, ignore
    }
    return parsed
  } catch {
    return null
  }
}
export async function setUploadRateLimitLocal(
  limit: Omit<UploadRateLimit, "date">
): Promise<void> {
  const today = new Date().toISOString().slice(0, 10)
  const data: UploadRateLimit = { ...limit, date: today }
  await saveDataLocally("identifier", UPLOAD_LIMIT_KEY, JSON.stringify(data))
}

const SHARE_LIMIT_KEY = "share-limit"

export async function getShareRateLimitLocal(): Promise<{
  count: number
} | null> {
  const data = await loadLocalData("identifier", SHARE_LIMIT_KEY)
  if (!data) return null

  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export async function setShareRateLimitLocal(limit: {
  count: number
}): Promise<void> {
  await saveDataLocally("identifier", SHARE_LIMIT_KEY, JSON.stringify(limit))
}
