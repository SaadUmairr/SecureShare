import { UploadTrialPage } from "@/components/upload-input"

export default async function Try() {
  // const googleID = await auth().then((session) => session?.user.googleID)
  // if (googleID) return redirect("/auth/upload")
  return <UploadTrialPage />
}
