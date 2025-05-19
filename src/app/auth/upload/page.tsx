import { auth } from "@/auth"
import { KeyPairContextProvider } from "@/context/keypair.context"
import { UserContextProvider } from "@/context/user.context"

import { Redirect } from "@/components/redirect"
import { UploadMainPage } from "@/components/upload"

export default async function UploadPage() {
  const session = await auth()
  if (!session) return <Redirect to="/" label="UNAUTHENTICATED" />
  return (
    <UserContextProvider>
      <KeyPairContextProvider>
        <UploadMainPage />
      </KeyPairContextProvider>
    </UserContextProvider>
  )
}
