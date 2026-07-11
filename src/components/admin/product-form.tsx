"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createProduct, updateProduct, generateSku } from "@/lib/actions/product-actions"
import { SpecsEditor, type SpecEntry } from "@/components/admin/specs-editor"
import { toast } from "sonner"
import type { Product, ProductCategory, ComponentSpec } from "@/generated/prisma"

interface SolutionOption {
  id: string
  title: string
  slug: string
  categoryName: string | null
}

interface ProductFormProps {
  product?:
    | (Product & {
        category?: ProductCategory | null
        componentSpecs?: ComponentSpec | null
        solutionProducts?: { solutionId: string }[]
        tags?: string[]
      })
    | null
  categories: { id: string; name: string; depth: number; parentId: string | null }[]
  solutions?: SolutionOption[]
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function ProductForm({ product, categories, solutions = [] }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(product?.isActive ?? true)
  const [isSaleOpen, setIsSaleOpen] = useState(product?.isSaleOpen ?? true)
  const [showPrice, setShowPrice] = useState(product?.showPrice ?? true)
  const [productTypeState, setProductTypeState] = useState(product?.type || "STANDALONE")
  const [name, setName] = useState(product?.name || "")
  const [slug, setSlug] = useState(product?.slug || "")
  const [sku, setSku] = useState(product?.sku || "")
  const [tags, setTags] = useState<string[]>(product?.tags ?? [])
  const [tagInput, setTagInput] = useState("")
  const [selectedSolutionIds, setSelectedSolutionIds] = useState<string[]>(
    product?.solutionProducts?.map((sp) => sp.solutionId) ?? []
  )
  const [solutionQuery, setSolutionQuery] = useState("")
  const isEditing = !!product

  // Auto-generate SKU for new products
  useEffect(() => {
    if (!isEditing && !sku) {
      generateSku().then(setSku)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [specs, setSpecs] = useState<SpecEntry[]>(() => {
    const raw = product?.specs
    if (!raw) return []
    // New format: [{key, value, type, options}]
    if (Array.isArray(raw)) {
      return (raw as Record<string, unknown>[]).map((e) => ({
        key: String(e.key ?? ""),
        label: e.label ? String(e.label) : undefined,
        unit: e.unit ? String(e.unit) : undefined,
        value: String(e.value ?? ""),
        type: (e.type as SpecEntry["type"]) || "TEXT",
        options: Array.isArray(e.options) ? (e.options as string[]) : undefined,
      }))
    }
    // Legacy format: {key: value} object — convert to array
    if (typeof raw === "object") {
      return Object.entries(raw as Record<string, unknown>).map(([key, value]) => ({
        key,
        value: String(value ?? ""),
        type: "TEXT" as const,
      }))
    }
    return []
  })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const data = {
      sku: fd.get("sku") as string,
      name: fd.get("name") as string,
      nameEn: (fd.get("nameEn") as string) || undefined,
      slug: fd.get("slug") as string,
      type: fd.get("type") as "STANDALONE" | "CONFIGURABLE" | "COMPONENT",
      description: (fd.get("description") as string) || undefined,
      descriptionEn: (fd.get("descriptionEn") as string) || undefined,
      currency: fd.get("currency") as "USD" | "EUR" | "TRY" | "GBP",
      price: parseFloat(fd.get("price") as string) || 0,
      costPrice: parseFloat(fd.get("costPrice") as string) || undefined,
      stock: parseInt(fd.get("stock") as string) || 0,
      warrantyMonths: parseInt(fd.get("warrantyMonths") as string) || 24,
      weight: parseFloat(fd.get("weight") as string) || undefined,
      dimensions: (fd.get("dimensions") as string) || undefined,
      categoryId: (fd.get("categoryId") as string) || undefined,
      isActive,
      isSaleOpen,
      showPrice,
      specs,
      tags,
      solutionIds: selectedSolutionIds,
    }

    try {
      if (isEditing) {
        await updateProduct(product.id, data)
        toast.success("Ürün güncellendi")
      } else {
        await createProduct(data)
        toast.success("Ürün oluşturuldu")
      }
      router.push("/admin/products")
    } catch (err) {
      console.error("Product save error:", err)
      toast.error(err instanceof Error ? `Hata: ${err.message}` : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Üst bar: butonlar + durum switch'leri */}
      <div className="sticky top-16 z-20 flex flex-wrap items-center gap-4 rounded-lg border bg-card p-3 shadow-sm">
        <Button type="submit" disabled={loading}>
          {loading ? (isEditing ? "Güncelleniyor..." : "Oluşturuluyor...") : (isEditing ? "Güncelle" : "Oluştur")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
        <div className="mx-2 h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <Label className="text-sm">Aktif</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={isSaleOpen} onCheckedChange={setIsSaleOpen} />
          <Label className="text-sm">Satışa Açık</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={showPrice} onCheckedChange={setShowPrice} />
          <Label className="text-sm">Fiyatı Göster</Label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Temel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU <span className="text-destructive">*</span></Label>
                <Input id="sku" name="sku" required value={sku} onChange={(e) => setSku(e.target.value)} placeholder="STX-0001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Ürün Tipi *</Label>
                <Select name="type" value={productTypeState} onValueChange={(v) => setProductTypeState(v as typeof productTypeState)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDALONE">Tek Ürün</SelectItem>
                    <SelectItem value="CONFIGURABLE">Konfigüre Edilebilir</SelectItem>
                    <SelectItem value="COMPONENT">Bileşen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Ürün Adı (TR) *</Label>
              <Input
                id="name" name="name" required value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!isEditing) setSlug(slugify(e.target.value))
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn">Ürün Adı (EN)</Label>
              <Input id="nameEn" name="nameEn" defaultValue={product?.nameEn || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input id="slug" name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Kategori</Label>
              <Select name="categoryId" defaultValue={product?.categoryId || ""}>
                <SelectTrigger><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
                <SelectContent>
                  {(() => {
                    const groups: { root: typeof categories[0]; children: typeof categories }[] = []
                    for (let i = 0; i < categories.length; i++) {
                      if (categories[i].depth === 0) {
                        const children: typeof categories = []
                        for (let j = i + 1; j < categories.length && categories[j].depth > 0; j++) {
                          children.push(categories[j])
                        }
                        groups.push({ root: categories[i], children })
                      }
                    }
                    return groups.map(({ root, children }) => {
                      if (children.length === 0) {
                        return <SelectItem key={root.id} value={root.id}>{root.name}</SelectItem>
                      }
                      return (
                        <SelectGroup key={root.id}>
                          <SelectLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">{root.name}</SelectLabel>
                          {children.map((child) => (
                            <SelectItem key={child.id} value={child.id} className="pl-6">
                              {"  ".repeat(child.depth - 1)}{child.depth > 1 ? "└ " : ""}{child.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )
                    })
                  })()}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fiyat ve Stok</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Para Birimi</Label>
              <Select name="currency" defaultValue={product?.currency || "USD"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">$ USD</SelectItem>
                  <SelectItem value="EUR">€ EUR</SelectItem>
                  <SelectItem value="TRY">₺ TRY</SelectItem>
                  <SelectItem value="GBP">£ GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Satış Fiyatı *</Label>
                <Input id="price" name="price" type="number" step="0.01" required defaultValue={product?.price || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPrice">Maliyet Fiyatı</Label>
                <Input id="costPrice" name="costPrice" type="number" step="0.01" defaultValue={product?.costPrice || ""} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stock">Stok Adedi</Label>
                <Input id="stock" name="stock" type="number" defaultValue={product?.stock ?? 0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyMonths">Garanti (Ay)</Label>
                <Input id="warrantyMonths" name="warrantyMonths" type="number" defaultValue={product?.warrantyMonths ?? 24} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weight">Ağırlık (kg)</Label>
                <Input id="weight" name="weight" type="number" step="0.1" defaultValue={product?.weight || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensions">Boyutlar</Label>
                <Input id="dimensions" name="dimensions" placeholder="50x40x20 cm" defaultValue={product?.dimensions || ""} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Açıklama</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama (TR)</Label>
              <Textarea id="description" name="description" rows={5} defaultValue={product?.description || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionEn">Açıklama (EN)</Label>
              <Textarea id="descriptionEn" name="descriptionEn" rows={5} defaultValue={product?.descriptionEn || ""} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Çözümler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedSolutionIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSolutionIds.map((id) => {
                  const sol = solutions.find((s) => s.id === id)
                  if (!sol) return null
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-sm"
                    >
                      <span>{sol.title}</span>
                      {sol.categoryName && (
                        <span className="text-xs text-muted-foreground">· {sol.categoryName}</span>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSolutionIds((prev) => prev.filter((x) => x !== id))
                        }
                        className="rounded-full text-muted-foreground hover:text-destructive"
                        aria-label={`${sol.title} çözümünü kaldır`}
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="solutionSearch">Çözüm ekle</Label>
              <Input
                id="solutionSearch"
                placeholder="Çözüm adı veya kategori ile ara..."
                value={solutionQuery}
                onChange={(e) => setSolutionQuery(e.target.value)}
              />
              {solutionQuery.trim() && (
                <div className="max-h-56 overflow-y-auto rounded-md border bg-background">
                  {solutions
                    .filter((s) => {
                      if (selectedSolutionIds.includes(s.id)) return false
                      const q = solutionQuery.toLowerCase().trim()
                      return (
                        s.title.toLowerCase().includes(q) ||
                        (s.categoryName?.toLowerCase().includes(q) ?? false)
                      )
                    })
                    .slice(0, 20)
                    .map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedSolutionIds((prev) => [...prev, s.id])
                          setSolutionQuery("")
                        }}
                        className="flex w-full items-center justify-between gap-3 border-b px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted"
                      >
                        <span>{s.title}</span>
                        {s.categoryName && (
                          <span className="text-xs text-muted-foreground">{s.categoryName}</span>
                        )}
                      </button>
                    ))}
                  {solutions.filter((s) => {
                    if (selectedSolutionIds.includes(s.id)) return false
                    const q = solutionQuery.toLowerCase().trim()
                    return (
                      s.title.toLowerCase().includes(q) ||
                      (s.categoryName?.toLowerCase().includes(q) ?? false)
                    )
                  }).length === 0 && (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                      Sonuç yok
                    </div>
                  )}
                </div>
              )}
              {solutions.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Henüz çözüm tanımlanmamış. Önce{" "}
                  <Link href="/admin/solutions" className="underline">
                    çözümler
                  </Link>{" "}
                  oluşturun.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Etiketler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                      className="rounded-full text-muted-foreground hover:text-destructive"
                      aria-label={`${tag} etiketini kaldır`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="tagInput">Yeni etiket</Label>
              <div className="flex gap-2">
                <Input
                  id="tagInput"
                  placeholder="Etiket yazıp Enter'a basın..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault()
                      const v = tagInput.trim().replace(/,$/, "").trim()
                      if (v && !tags.includes(v)) {
                        setTags((prev) => [...prev, v])
                      }
                      setTagInput("")
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const v = tagInput.trim()
                    if (v && !tags.includes(v)) {
                      setTags((prev) => [...prev, v])
                    }
                    setTagInput("")
                  }}
                >
                  Ekle
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Örnek: AI, render, 3D, workstation. Enter veya virgül ile ekleyin.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Teknik Özellikler</CardTitle>
          </CardHeader>
          <CardContent>
            <SpecsEditor specs={specs} onChange={setSpecs} productType={productTypeState} />
          </CardContent>
        </Card>
      </div>

    </form>
  )
}
