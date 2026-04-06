"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TiptapEditor } from "@/components/admin/tiptap-editor"
import { BenchmarkManager } from "@/components/admin/benchmark-manager"
import { SolutionProductsManager } from "@/components/admin/solution-products-manager"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { updateSectionContent, updateSolution } from "@/lib/actions/solution-actions"
import { Save, Eye, Pencil } from "lucide-react"
import { toast } from "sonner"

interface Section {
  id: string
  tabKey: string
  tabLabel: string
  content: string | null
  sortOrder: number
}

interface BenchmarkDataset {
  id: string
  name: string
  color: string
  values: number[]
  sortOrder: number
}

interface Benchmark {
  id: string
  title: string
  chartType: string
  unit: string
  sectionKey: string | null
  sortOrder: number
  labels: string[]
  datasets: BenchmarkDataset[]
}

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

interface SolutionData {
  id: string
  title: string
  titleEn: string | null
  slug: string
  subtitle: string | null
  icon: string | null
  heroImage: string | null
  isActive: boolean
  metaTitle: string | null
  metaDescription: string | null
  sections: Section[]
  benchmarks: Benchmark[]
  recommendedProducts: RecommendedProduct[]
}

export function SolutionEditor({ solution }: { solution: SolutionData }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(solution.sections[0]?.tabKey || "intro")
  const [saving, setSaving] = useState<string | null>(null)
  const [editingInfo, setEditingInfo] = useState(false)
  const [title, setTitle] = useState(solution.title)
  const [slug, setSlug] = useState(solution.slug)
  const [subtitle, setSubtitle] = useState(solution.subtitle || "")
  const [icon, setIcon] = useState(solution.icon || "")
  const [heroImage, setHeroImage] = useState(solution.heroImage || "")
  const [isActive, setIsActive] = useState(solution.isActive)
  const [uploading, setUploading] = useState("")
  const [contents, setContents] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const s of solution.sections) {
      map[s.tabKey] = s.content || ""
    }
    return map
  })

  async function handleSave(tabKey: string) {
    setSaving(tabKey)
    try {
      await updateSectionContent(solution.id, tabKey, contents[tabKey] || "")
      toast.success("Kaydedildi")
    } catch {
      toast.error("Kaydetme başarısız")
    } finally {
      setSaving(null)
    }
  }

  const sectionBenchmarks = (tabKey: string) =>
    solution.benchmarks.filter((b) => b.sectionKey === tabKey)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        {editingInfo ? (
          <Card className="flex-1">
            <CardContent className="pt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Başlık</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="font-mono" />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Alt Başlık</Label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              </div>
              {/* Icon + Hero uploads */}
              <div className="grid gap-3 sm:grid-cols-2">
                <ImageUploadField
                  label="İkon (menüde görünür)"
                  value={icon}
                  onChange={setIcon}
                  accept=".svg,.png,.ico,.webp,image/*"
                  hint="SVG veya PNG, küçük boyut"
                />
                <ImageUploadField
                  label="Hero Görsel"
                  value={heroImage}
                  onChange={setHeroImage}
                  hint="Sayfa üst görseli"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label>{isActive ? "Aktif" : "Pasif"}</Label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={async () => {
                  setSaving("info")
                  try {
                    await updateSolution(solution.id, { title, slug, subtitle: subtitle || undefined, icon: icon || undefined, heroImage: heroImage || undefined, isActive })
                    toast.success("Sayfa bilgileri güncellendi")
                    setEditingInfo(false)
                    router.refresh()
                  } catch { toast.error("Hata oluştu") }
                  finally { setSaving(null) }
                }} disabled={saving === "info"}>
                  <Save className="mr-2 size-3" />{saving === "info" ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  setTitle(solution.title); setSlug(solution.slug)
                  setSubtitle(solution.subtitle || ""); setIcon(solution.icon || "")
                  setHeroImage(solution.heroImage || ""); setIsActive(solution.isActive)
                  setEditingInfo(false)
                }}>İptal</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="flex items-center gap-3">
              {solution.icon && <img src={solution.icon} alt="" className="size-8 object-contain" />}
              <h1 className="text-2xl font-bold">{solution.title}</h1>
              <Badge variant={solution.isActive ? "default" : "secondary"}>
                {solution.isActive ? "Aktif" : "Pasif"}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => setEditingInfo(true)} title="Düzenle">
                <Pencil className="size-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground font-mono">/cozumler/{solution.slug}</p>
            {solution.subtitle && <p className="text-sm text-muted-foreground mt-1">{solution.subtitle}</p>}
          </div>
        )}
        <Button variant="outline" asChild>
          <a href={`/cozumler/${slug}`} target="_blank" rel="noopener noreferrer">
            <Eye className="mr-2 size-4" />
            Ön İzleme
          </a>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          {solution.sections.map((s) => (
            <TabsTrigger key={s.tabKey} value={s.tabKey}>
              {s.tabLabel}
            </TabsTrigger>
          ))}
          <TabsTrigger value="benchmarks">
            Benchmark Chartlar ({solution.benchmarks.length})
          </TabsTrigger>
          <TabsTrigger value="products">
            Önerilen Sistemler ({solution.recommendedProducts.length})
          </TabsTrigger>
        </TabsList>

        {solution.sections.map((section) => (
          <TabsContent key={section.tabKey} value={section.tabKey} className="mt-6 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">{section.tabLabel}</CardTitle>
                <Button
                  size="sm"
                  onClick={() => handleSave(section.tabKey)}
                  disabled={saving === section.tabKey}
                >
                  <Save className="mr-2 size-3" />
                  {saving === section.tabKey ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </CardHeader>
              <CardContent>
                <TiptapEditor
                  key={`editor-${section.tabKey}`}
                  content={contents[section.tabKey] || ""}
                  onChange={(html) => setContents((prev) => ({ ...prev, [section.tabKey]: html }))}
                  placeholder={`${section.tabLabel} içeriğini buraya yazın...`}
                />
              </CardContent>
            </Card>

            {sectionBenchmarks(section.tabKey).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bu sekmedeki benchmark chartlar</CardTitle>
                </CardHeader>
                <CardContent>
                  {sectionBenchmarks(section.tabKey).map((b) => (
                    <div key={b.id} className="mb-2 rounded border p-3">
                      <p className="font-medium">{b.title}</p>
                      <p className="text-xs text-muted-foreground">{b.datasets.length} veri seti, {b.labels.length} etiket, {b.unit}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}

        <TabsContent value="benchmarks" className="mt-6">
          <BenchmarkManager
            solutionId={solution.id}
            benchmarks={solution.benchmarks}
            sections={solution.sections}
          />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <SolutionProductsManager
            solutionId={solution.id}
            products={solution.recommendedProducts}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ==========================================
// IMAGE UPLOAD FIELD
// ==========================================

function ImageUploadField({
  label,
  value,
  onChange,
  accept = "image/*",
  hint,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  accept?: string
  hint?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }
      onChange(data.url)
      toast.success("Yüklendi")
    } catch {
      toast.error("Yükleme başarısız")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative flex size-16 items-center justify-center rounded-lg border bg-muted/30">
            <img src={value} alt="" className="max-h-14 max-w-14 object-contain" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="flex size-16 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground text-[10px]">
            Yok
          </div>
        )}
        <div className="flex flex-col gap-1">
          <input ref={inputRef} type="file" accept={accept} onChange={handleUpload} className="hidden" />
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading} className="h-7 text-xs">
            {uploading ? "Yükleniyor..." : value ? "Değiştir" : "Yükle"}
          </Button>
          {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
        </div>
      </div>
    </div>
  )
}
