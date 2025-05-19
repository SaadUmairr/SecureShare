"use client"

import { FilesContextProvider } from "@/context/file.context"
import NextTopLoader from "nextjs-toploader"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Toaster />
      <NextTopLoader showSpinner={false} />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <FilesContextProvider>{children}</FilesContextProvider>
      </ThemeProvider>
    </>
  )
}
