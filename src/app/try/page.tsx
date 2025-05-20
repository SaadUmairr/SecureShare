import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { UploadTrialPage } from "@/components/try-page"

export default async function Try() {
  const googleID = await auth().then((session) => session?.user.googleID)
  if (googleID) return redirect("/auth/upload")
  return <UploadTrialPage />
}
