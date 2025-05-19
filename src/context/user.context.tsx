"use client"

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import { getCurrentUserSession, getPassphraseStatus } from "@/actions/user"
import { loadPassphrase } from "@/utils/idb.util"
import { toast } from "sonner"

interface UserContextProp {
  googleID: string
  name: string
  email: string
  avatar: string
  passphrase: string
  setPassphrase: Dispatch<SetStateAction<string>>
  isLoading: boolean
}

const UserContext = createContext<UserContextProp | null>(null)

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [googleID, setGoogleID] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState("")
  const [passphrase, setPassphrase] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  // Session loading
  useEffect(() => {
    ;(async () => {
      try {
        const session = await getCurrentUserSession()
        if (session?.user) {
          setGoogleID(session.user.googleID || "")
          setName(session.user.name || "")
          setEmail(session.user.email || "")
          setAvatar(session.user.image || "")
        }
      } catch (err) {
        toast.error(`SESSION NOT FETCHED: ${(err as Error).message}`)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  // Passphrase verification
  useEffect(() => {
    if (!googleID) return
    ;(async () => {
      const storedPass = await loadPassphrase()
      if (storedPass) {
        setPassphrase(storedPass)
        return
      }

      try {
        const passExists = await getPassphraseStatus(googleID)
        if (!passExists) {
          router.replace("/passphrase?mode=setup")
        } else {
          const retryStored = await loadPassphrase()
          if (retryStored) {
            setPassphrase(retryStored)
          } else {
            router.replace("/passphrase?mode=enter")
          }
        }
      } catch {
        toast.error("Passphrase Check Failed")
      }
    })()
  }, [googleID, router])

  return (
    <UserContext.Provider
      value={{
        googleID,
        name,
        email,
        avatar,
        passphrase,
        setPassphrase,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextProp => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider")
  }
  return context
}
