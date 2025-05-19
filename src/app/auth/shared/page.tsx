import { auth } from "@/auth"

import { Redirect } from "@/components/redirect"

export default async function SharedPage() {
  const session = await auth()
  if (!session) return <Redirect to="/" label="UNAUTHENTICATED" />

  return (
    <>
      <p>WORK IN PROGRESS</p>
    </>
  )
}
