"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSolution } from "@/lib/actions/solution-actions"
import { toast } from "sonner"

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

interface Category {
  id: string
  name: string
  children: { id: string; name: string }[]
}

export function SolutionCreateForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    try {
      const solution = await createSolution({
        title: fd.get("title") as string,
        titleEn: (fd.get("titleEn") as string) || undefined,
        slug: fd.get("slug") as string,
        subtitle: (fd.get("subtitle") as string) || undefined,
        metaTitle: (fd.get("metaTitle") as string) || undefined,
        metaDescription: (fd.get("metaDescription") as string) || undefined,
        categoryId: (fd.get("categoryId") as string) || undefined,
      })
      toast.success("Çözüm sayfası oluşturuldu — sekmeler otomatik eklendi")
      router.push(`/admin/solutions/${solution.id}`)
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const allCategories = categories.flatMap((c) => [
    { id: c.id, name: c.name },
    ...c.children.map((ch) => ({ id: ch.id, name: `  └ ${ch.name}` })),
  ])

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Sayfa Bilgileri</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık (TR) *</Label>
              <Input id="title" name="title" required value={title}
                onChange={(e) => { setTitle(e.target.value); setSlug(slugify(e.target.value)) }}
                placeholder="ör: Adobe Lightroom Classic" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleEn">Başlık (EN)</Label>
              <Input id="titleEn" name="titleEn" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input id="slug" name="slug" required value={slug}
                onChange={(e) => setSlug(e.target.value)} />
              <p className="text-xs text-muted-foreground">/cozumler/{slug || "..."}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Alt Başlık</Label>
              <Textarea id="subtitle" name="subtitle" rows={2}
                placeholder="Kısa açıklama..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Kategori</Label>
              <Select name="categoryId">
                <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                <SelectContent>
                  {allCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Başlık</Label>
              <Input id="metaTitle" name="metaTitle" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Açıklama</Label>
              <Textarea id="metaDescription" name="metaDescription" rows={3} />
            </div>
            <div className="rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
              Oluşturulduktan sonra otomatik olarak şu sekmeler eklenecek:
              <strong> Giriş, İşlemci, GPU, Bellek, Depolama, SSS</strong>.
              İçerikleri düzenleme sayfasından doldurabilirsiniz.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Oluşturuluyor..." : "Oluştur ve Düzenlemeye Geç"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
      </div>
    </form>
  )
}
