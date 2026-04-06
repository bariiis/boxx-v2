"use client"

import { useRouter } from "next/navigation"
import { useCompareStore } from "@/lib/stores/compare-store"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function ComparePageActions() {
  const router = useRouter()
  const clear = useCompareStore((s) => s.clear)

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        clear()
        router.push("/urunler")
      }}
    >
      <Trash2 className="mr-1.5 size-3.5" />
      Karşılaştırmayı Temizle
    </Button>
  )
}
