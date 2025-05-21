"use client"

import Image from "next/image"
import Link from "next/link"
import { GoogleLoginHandler } from "@/actions/user"
import { UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import Google from "../../public/google.svg"

export function GoogleClientButton() {
  const handleLogin = async () => {
    await GoogleLoginHandler()
  }

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full border-[#1446B5] dark:border-[#1446B5]"
      onClick={handleLogin}
    >
      <Image src={Google} alt="Google" width={20} height={20} />
      Continue with Google
    </Button>
  )
}

export function GuestClientButton() {
  return (
    <Link href="/try">
      <Button
        variant="outline"
        type="button"
        className="w-full gap-x-4 border-[#1446B5] dark:border-[#1446B5]"
      >
        <UserIcon absoluteStrokeWidth />
        Try as guest
      </Button>
    </Link>
  )
}
