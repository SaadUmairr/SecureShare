import { auth } from "@/auth"
import { KeyPairContextProvider } from "@/context/keypair.context"
import { UserContextProvider } from "@/context/user.context"

import { AllFilesMain } from "@/components/all-files"
import { Redirect } from "@/components/redirect"

export default async function FilesPage() {
  const session = await auth()
  if (!session) return <Redirect to="/" label="UNAUTHENTICATED" />
  return (
    <UserContextProvider>
      <KeyPairContextProvider>
        <AllFilesMain />
      </KeyPairContextProvider>
    </UserContextProvider>
  )
}
