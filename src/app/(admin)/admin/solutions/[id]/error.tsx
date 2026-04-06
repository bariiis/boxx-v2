"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function SolutionEditError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Solution edit error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-xl font-bold text-destructive">Bir hata oluştu</h2>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        {error.message}
      </p>
      <Button onClick={reset}>Tekrar Dene</Button>
    </div>
  )
}
