"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createProduct, updateProduct } from "@/lib/actions/product-actions"
import { SpecsEditor, type SpecEntry } from "@/components/admin/specs-editor"
import { toast } from "sonner"
import type { Product, ProductCategory, ComponentSpec } from "@/generated/prisma"

interface ProductFormProps {
  product?: (Product & { category?: ProductCategory | null; componentSpecs?: ComponentSpec | null }) | null
  categories: { id: string; name: string; depth: number; parentId: string | null }[]
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(product?.isActive ?? true)
  const [isSaleOpen, setIsSaleOpen] = useState(product?.isSaleOpen ?? true)
  const [name, setName] = useState(product?.name || "")
  const [slug, setSlug] = useState(product?.slug || "")
  const [specs, setSpecs] = useState<SpecEntry[]>(() => {
    const raw = product?.specs
    if (!raw) return []
    // New format: [{key, value, type, options}]
    if (Array.isArray(raw)) {
      return (raw as Record<string, unknown>[]).map((e) => ({
        key: String(e.key ?? ""),
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
  const isEditing = !!product

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
      specs,
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
    } catch {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Temel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input id="sku" name="sku" required defaultValue={product?.sku || ""} placeholder="STX-WS-001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Ürün Tipi *</Label>
                <Select name="type" defaultValue={product?.type || "STANDALONE"}>
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
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-3">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label>Aktif</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={isSaleOpen} onCheckedChange={setIsSaleOpen} />
                <Label>Satışa Açık</Label>
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
            <CardTitle>Teknik Özellikler</CardTitle>
          </CardHeader>
          <CardContent>
            <SpecsEditor specs={specs} onChange={setSpecs} />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? (isEditing ? "Güncelleniyor..." : "Oluşturuluyor...") : (isEditing ? "Güncelle" : "Oluştur")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
      </div>
    </form>
  )
}
