import { auth } from "@/auth"

import { Account } from "@/components/account"
import { Redirect } from "@/components/redirect"

export default async function AccountPage() {
  const session = await auth()
  if (!session) return <Redirect to="/" label="UNAUTHENTICATED" />
  return (
    <Account
      username={session?.user.name}
      email={session?.user.email}
      avatarUrl={session?.user.image}
    />
  )
}
