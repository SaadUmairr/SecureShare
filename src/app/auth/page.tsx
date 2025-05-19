import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function AuthPage() {
  const session = await auth()
  if (!session) return redirect("/")
  return redirect("/auth/upload")
}
