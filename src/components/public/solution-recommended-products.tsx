"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
  slug: string
  sku: string | null
  price: number
  currency: string
  images: string[]
  specs: unknown
}

export function SolutionRecommendedProducts({ products, solutionTitle }: { products: Product[]; solutionTitle: string }) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="text-muted-foreground">Henüz önerilen sistem eklenmemiş.</p>
        <p className="mt-1 text-sm text-muted-foreground">Admin panelinden bu çözüm sayfasına ürün bağlayabilirsiniz.</p>
      </div>
    )
  }

  const formatPrice = (price: number, currency: string) => {
    const symbols: Record<string, string> = { USD: "$", EUR: "€", TRY: "₺", GBP: "£" }
    const symbol = symbols[currency] || currency
    return `${symbol}${price.toLocaleString("tr-TR")}`
  }

  // Show key specs for workstations
  const keySpecs = ["CPU", "İşlemci", "GPU", "Ekran Kartı", "RAM", "Bellek", "Depolama", "SSD", "NVMe"]

  function normalizeSpecs(raw: unknown): { key: string; value: string }[] {
    if (!raw) return []
    if (Array.isArray(raw)) return raw as { key: string; value: string }[]
    if (typeof raw === "object") {
      return Object.entries(raw as Record<string, string>).map(([key, value]) => ({ key, value }))
    }
    return []
  }

  function getHighlightSpecs(specsRaw: unknown): { label: string; value: string }[] {
    const specs = normalizeSpecs(specsRaw)
    if (specs.length === 0) return []
    const result: { label: string; value: string }[] = []
    for (const key of keySpecs) {
      const match = specs.find((s) => s.key.toLowerCase().includes(key.toLowerCase()))
      if (match) result.push({ label: match.key, value: match.value })
      if (result.length >= 4) break
    }
    return result
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const highlights = getHighlightSpecs(product.specs)
        const image = product.images?.[0]

        return (
          <div
            key={product.id}
            className="group relative flex flex-col rounded-xl border bg-white transition-shadow hover:shadow-lg"
          >
            {/* Image */}
            <div className="flex h-48 items-center justify-center rounded-t-xl bg-[#F8F9FB] p-4">
              {image ? (
                <img src={image} alt={product.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-4xl font-bold text-muted-foreground/20">{product.name.charAt(0)}</div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
              {product.sku && (
                <p className="text-xs text-muted-foreground font-mono mb-1">{product.sku}</p>
              )}
              <h3 className="font-semibold text-base leading-snug">{product.name}</h3>

              {/* Key specs */}
              {highlights.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {highlights.map((spec) => (
                    <li key={spec.label} className="flex items-start gap-2 text-sm">
                      <span className="shrink-0 text-muted-foreground">{spec.label}:</span>
                      <span className="font-medium">{spec.value}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-lg font-bold">{formatPrice(product.price, product.currency)}</span>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/urunler/${product.slug}`}>
                    Detay <ArrowRight className="ml-1 size-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
