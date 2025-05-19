"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getUserKeyPair, SaveUserKeysInDB } from "@/actions/user"
import {
  loadLocalKeyPairRecord,
  saveKeyPairRecordLocally,
} from "@/utils/idb.util"
import {
  encryptPrivateKey,
  generateAsymmetricKeyPair,
  KeyPairDecryptor,
} from "@/utils/key-ops.util"
import { hashPassphrase } from "@/utils/passphrase.util"

import { useUser } from "./user.context"

type CryptoKeyType = CryptoKey | null

interface KeyPairProp {
  publicKey: CryptoKeyType
  privateKey: CryptoKeyType
}

const KeyPairContext = createContext<KeyPairProp | null>(null)

export function KeyPairContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { googleID, passphrase } = useUser()

  const [publicKey, setPublicKey] = useState<CryptoKeyType>(null)
  const [privateKey, setPrivateKey] = useState<CryptoKeyType>(null)

  async function KeyPairGenerationHandler() {
    const { keyPair, exportedPublicKeyBase64 } =
      await generateAsymmetricKeyPair()

    setPublicKey(keyPair.publicKey)
    setPrivateKey(keyPair.privateKey)

    const { encryptedPrivateKey, iv } = await encryptPrivateKey(
      keyPair.privateKey,
      passphrase,
      googleID
    )

    const hashedPassphrase = await hashPassphrase(passphrase, googleID)
    // * SAVING KEYPAIR LOCALLY.
    await saveKeyPairRecordLocally({
      id: "keys",
      publicKey: exportedPublicKeyBase64,
      privateKey: encryptedPrivateKey,
      iv: iv,
    })
    // * SAVING KEYPAIR IN REMOTE DB.
    await SaveUserKeysInDB({
      googleID,
      passphrase: hashedPassphrase,
      publicKey: exportedPublicKeyBase64,
      privateKey: encryptedPrivateKey,
      iv,
    })
  }

  async function KeyPairMainHandler() {
    const localKeyPair = await loadLocalKeyPairRecord()
    if (localKeyPair) {
      const { importedPublicKey, decryptedPrivateKey } = await KeyPairDecryptor(
        googleID,
        passphrase,
        localKeyPair.privateKey,
        localKeyPair.publicKey,
        localKeyPair.iv
      )
      setPublicKey(importedPublicKey)
      setPrivateKey(decryptedPrivateKey)
      return
    }
    const dbKeyPair = await getUserKeyPair(googleID)
    if (dbKeyPair) {
      const { importedPublicKey, decryptedPrivateKey } = await KeyPairDecryptor(
        googleID,
        passphrase,
        dbKeyPair.privateKey,
        dbKeyPair.publicKey,
        dbKeyPair.iv
      )
      await saveKeyPairRecordLocally({
        id: "keys",
        publicKey: dbKeyPair.publicKey,
        privateKey: dbKeyPair.privateKey,
        iv: dbKeyPair.iv,
      })
      setPublicKey(importedPublicKey)
      setPrivateKey(decryptedPrivateKey)
      return
    }
    await KeyPairGenerationHandler()
  }

  useEffect(() => {
    if (!googleID || !passphrase) return
    KeyPairMainHandler()
  }, [googleID, passphrase])

  return (
    <KeyPairContext value={{ publicKey, privateKey }}>
      {children}
    </KeyPairContext>
  )
}

export const useKeyPair = (): KeyPairProp => {
  const context = useContext(KeyPairContext)
  if (!context) throw new Error("useKeyPair must be used within KeyPairContext")
  return context
}
