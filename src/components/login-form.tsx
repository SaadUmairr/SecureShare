import Link from "next/link"
import { LockIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { GoogleClientButton, GuestClientButton } from "./client-btn"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <LockIcon className="size-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="sr-only">Secure Share</span>
            </Link>
            <h1 className="text-xl font-bold">
              Welcome to &nbsp;
              <span className="text-blue-700">Secure Share</span>
            </h1>
          </div>

          <div className="grid gap-4">
            <GoogleClientButton />
          </div>
          <div className="grid gap-4">
            <GuestClientButton />
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our &nbsp;
        <Link href="/tos">Terms of Service</Link>&nbsp; and &nbsp;
        <Link href="/privacy">Privacy Policy</Link>.
      </div>
    </div>
  )
}
