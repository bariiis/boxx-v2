"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical, Search } from "lucide-react"
import {
  addRecommendedProduct,
  removeRecommendedProduct,
  updateRecommendedProduct,
  searchProducts,
} from "@/lib/actions/solution-actions"
import { toast } from "sonner"

interface RecommendedProduct {
  id: string
  productId: string
  name: string
  sku: string | null
  price: number
  currency: string
  note: string | null
  sortOrder: number
}

interface SearchResult {
  id: string
  name: string
  sku: string | null
  price: number
  currency: string
}

export function SolutionProductsManager({
  solutionId,
  products,
}: {
  solutionId: string
  products: RecommendedProduct[]
}) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [adding, setAdding] = useState<string | null>(null)

  const existingIds = new Set(products.map((p) => p.productId))

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return }
    setSearching(true)
    try {
      const res = await searchProducts(q)
      setResults(res)
    } catch {
      /* ignore */
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => doSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search, doSearch])

  async function handleAdd(productId: string) {
    setAdding(productId)
    try {
      await addRecommendedProduct(solutionId, productId)
      toast.success("Ürün eklendi")
      setSearch("")
      setResults([])
      router.refresh()
    } catch {
      toast.error("Ekleme başarısız — zaten ekli olabilir")
    } finally {
      setAdding(null)
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeRecommendedProduct(id, solutionId)
      toast.success("Ürün kaldırıldı")
      router.refresh()
    } catch {
      toast.error("Silme başarısız")
    }
  }

  async function handleNoteChange(id: string, note: string) {
    try {
      await updateRecommendedProduct(id, solutionId, { note: note || undefined })
    } catch {
      /* ignore */
    }
  }

  const formatPrice = (price: number, currency: string) => {
    const symbols: Record<string, string> = { USD: "$", EUR: "€", TRY: "₺", GBP: "£" }
    return `${symbols[currency] || currency}${price.toLocaleString("tr-TR")}`
  }

  return (
    <div className="space-y-6">
      {/* Search & Add */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ürün Ekle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün adı veya SKU ile ara..."
              className="pl-9"
            />
          </div>

          {results.length > 0 && (
            <div className="rounded-lg border divide-y max-h-60 overflow-y-auto">
              {results.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50">
                  <div>
                    <span className="font-medium">{r.name}</span>
                    {r.sku && <span className="ml-2 text-xs text-muted-foreground font-mono">{r.sku}</span>}
                    <span className="ml-2 text-xs text-muted-foreground">{formatPrice(r.price, r.currency)}</span>
                  </div>
                  {existingIds.has(r.id) ? (
                    <span className="text-xs text-muted-foreground">Eklendi</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => handleAdd(r.id)}
                      disabled={adding === r.id}
                    >
                      <Plus className="mr-1 size-3" />
                      {adding === r.id ? "..." : "Ekle"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {search.length >= 2 && results.length === 0 && !searching && (
            <p className="text-sm text-muted-foreground">Sonuç bulunamadı.</p>
          )}
        </CardContent>
      </Card>

      {/* Current products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Önerilen Sistemler ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Henüz ürün eklenmemiş. Yukarıdan arayarak ürün ekleyin.
            </p>
          ) : (
            <div className="space-y-2">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border px-3 py-2"
                >
                  <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{p.name}</span>
                      {p.sku && <span className="text-xs text-muted-foreground font-mono">{p.sku}</span>}
                      <span className="text-xs text-muted-foreground">{formatPrice(p.price, p.currency)}</span>
                    </div>
                    <Input
                      defaultValue={p.note || ""}
                      placeholder="Etiket: En iyi performans, Bütçe dostu..."
                      className="mt-1 h-7 text-xs"
                      onBlur={(e) => handleNoteChange(p.id, e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive shrink-0"
                    onClick={() => handleRemove(p.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
