import { auth } from "@/auth"
import { KeyPairContextProvider } from "@/context/keypair.context"
import { UserContextProvider } from "@/context/user.context"

import { PassphraseInput } from "@/components/passphrase-input"
import { Redirect } from "@/components/redirect"

export default async function PassphrasePage() {
  const session = await auth()
  if (!session) return <Redirect to="/" label="UNAUTHENTICATED" />

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <UserContextProvider>
        <KeyPairContextProvider>
          <PassphraseInput />
        </KeyPairContextProvider>
      </UserContextProvider>
    </div>
  )
}
