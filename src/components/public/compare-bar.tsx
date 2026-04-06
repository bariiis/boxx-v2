"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCompareStore } from "@/lib/stores/compare-store"
import { Button } from "@/components/ui/button"
import { GitCompareArrows, X, Package, Trash2 } from "lucide-react"

export function CompareBar() {
  const { items, remove, clear } = useCompareStore()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch (store uses localStorage)
  useEffect(() => setMounted(true), [])

  if (!mounted || items.length === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        {/* Category label */}
        <div className="hidden shrink-0 sm:block">
          <p className="text-xs font-medium text-muted-foreground">Karşılaştırma</p>
          <p className="text-sm font-semibold">{items[0].rootCategoryName}</p>
        </div>

        {/* Product thumbnails */}
        <div className="flex flex-1 items-center gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex items-center gap-2 rounded-lg border bg-muted/50 px-2 py-1.5 pr-7"
            >
              <div className="relative size-8 shrink-0 overflow-hidden rounded bg-muted">
                {item.heroImage ? (
                  <Image
                    src={item.heroImage}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Package className="size-4 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <span className="max-w-24 truncate text-xs font-medium sm:max-w-40">
                {item.name}
              </span>
              <button
                onClick={() => remove(item.id)}
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 2 - items.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="hidden h-11 w-32 items-center justify-center rounded-lg border border-dashed sm:flex"
            >
              <span className="text-xs text-muted-foreground">Ürün ekleyin</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground"
            onClick={clear}
          >
            <Trash2 className="mr-1 size-3" />
            <span className="hidden sm:inline">Temizle</span>
          </Button>
          <Button size="sm" className="h-8" disabled={items.length < 2} asChild>
            <Link href={`/urunler/karsilastir?ids=${items.map((i) => i.id).join(",")}`}>
              <GitCompareArrows className="mr-1.5 size-3.5" />
              Karşılaştır ({items.length})
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
