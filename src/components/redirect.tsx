"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Progress } from "./ui/progress"

interface RedirectProps {
  to: string
  label: string
}

export function Redirect({ to, label }: RedirectProps) {
  const [progress, setProgress] = useState(30)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    const startTime = Date.now()

    const updateProgress = () => {
      if (!mounted) return

      const elapsed = Date.now() - startTime
      const duration = 800

      const progressFrom30 = Math.min(70, (elapsed / duration) * 70)
      const newProgress = 30 + progressFrom30
      setProgress(newProgress)

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress)
      } else {
        router.push(to)
      }
    }

    requestAnimationFrame(updateProgress)

    const timeout = setTimeout(() => {
      if (mounted) router.push(to)
    }, 1000)

    return () => {
      mounted = false
      clearTimeout(timeout)
    }
  }, [router, to])

  return (
    <div className="flex h-screen w-screen flex-col gap-10 px-8 py-4 pt-28">
      <Progress value={progress} className="h-4 transition-all duration-75" />
      <p className="animate-pulse text-center text-2xl font-bold">{label}</p>
    </div>
  )
}
