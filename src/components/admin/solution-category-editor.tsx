"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TiptapEditor } from "@/components/admin/tiptap-editor"
import { updateSolutionCategory } from "@/lib/actions/solution-category-actions"
import { Save, Upload } from "lucide-react"
import { toast } from "sonner"

interface CategoryData {
  id: string
  name: string
  nameEn: string | null
  slug: string
  description: string | null
  subtitle: string | null
  intro: string | null
  icon: string | null
  heroImage: string | null
  sortOrder: number
  isActive: boolean
}

export function SolutionCategoryEditor({ category }: { category: CategoryData }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(category.name)
  const [nameEn, setNameEn] = useState(category.nameEn || "")
  const [slug, setSlug] = useState(category.slug)
  const [description, setDescription] = useState(category.description || "")
  const [subtitle, setSubtitle] = useState(category.subtitle || "")
  const [intro, setIntro] = useState(category.intro || "")
  const [icon, setIcon] = useState(category.icon || "")
  const [heroImage, setHeroImage] = useState(category.heroImage || "")
  const [isActive, setIsActive] = useState(category.isActive)
  const [sortOrder, setSortOrder] = useState(category.sortOrder)

  async function handleSave() {
    setSaving(true)
    try {
      await updateSolutionCategory(category.id, {
        name, nameEn: nameEn || undefined, slug, description: description || undefined,
        subtitle: subtitle || undefined, intro: intro || undefined,
        icon: icon || undefined, heroImage: heroImage || undefined,
        isActive, sortOrder,
      })
      toast.success("Kategori güncellendi")
      router.refresh()
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Temel Bilgiler</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Kategori Adı (TR)</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Kategori Adı (EN)</Label>
                <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Alt Başlık</Label>
              <Textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2}
                placeholder="Kategori sayfasında başlık altında görünecek kısa açıklama" />
            </div>
            <div className="space-y-2">
              <Label>Kısa Açıklama (menü/SEO)</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Menüde ve SEO'da kullanılacak kısa metin" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Sıralama</Label>
                <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label>{isActive ? "Aktif" : "Pasif"}</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Görseller</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <ImageField label="İkon" value={icon} onChange={setIcon} hint="SVG veya PNG, menüde görünür" accept=".svg,.png,.ico,.webp,image/*" />
            <ImageField label="Hero Görsel" value={heroImage} onChange={setHeroImage} hint="Kategori sayfasının üst görseli" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Giriş Yazısı</CardTitle></CardHeader>
        <CardContent>
          <TiptapEditor
            key={`intro-${category.id}`}
            content={intro}
            onChange={setIntro}
            placeholder="Kategori sayfasında kartların üstünde görünecek giriş metni..."
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 size-4" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>Geri</Button>
      </div>
    </div>
  )
}

function ImageField({ label, value, onChange, hint, accept = "image/*" }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string; accept?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }
      onChange(data.url)
    } catch { toast.error("Yükleme başarısız") }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = "" }
  }

  return (
    <div className="space-y-1">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative flex size-16 items-center justify-center rounded-lg border bg-muted/30">
            <img src={value} alt="" className="max-h-14 max-w-14 object-contain" />
            <button type="button" onClick={() => onChange("")}
              className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">×</button>
          </div>
        ) : (
          <div className="flex size-16 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground text-[10px]">Yok</div>
        )}
        <div className="flex flex-col gap-1">
          <input ref={inputRef} type="file" accept={accept} onChange={handleUpload} className="hidden" />
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading} className="h-7 text-xs">
            <Upload className="mr-1 size-3" />{uploading ? "Yükleniyor..." : value ? "Değiştir" : "Yükle"}
          </Button>
          {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
        </div>
      </div>
    </div>
  )
}
