"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog"
import {
  Plus, Trash2, Pencil, GripVertical, ChevronDown, ChevronUp,
  Layout, Star, FileText, HelpCircle, Megaphone, Image, Code,
} from "lucide-react"
import {
  addProductSection, updateProductSection, deleteProductSection,
  updateProductLanding, addProductFaq, updateProductFaq, deleteProductFaq,
} from "@/lib/actions/product-landing-actions"
import { toast } from "sonner"

const sectionTypes = [
  { value: "HERO", label: "Hero Banner", icon: Layout, description: "Büyük banner, başlık, CTA" },
  { value: "FEATURES", label: "Özellikler", icon: Star, description: "Özellik grid (ikon + başlık + açıklama)" },
  { value: "USE_CASES", label: "Kullanım Alanları", icon: FileText, description: "Kullanım senaryoları" },
  { value: "FAQ", label: "SSS", icon: HelpCircle, description: "Sıkça sorulan sorular" },
  { value: "CTA", label: "CTA", icon: Megaphone, description: "Teklif iste / aksyon bloğu" },
  { value: "GALLERY", label: "Galeri", icon: Image, description: "Genişletilmiş görsel galeri" },
  { value: "CUSTOM", label: "Serbest İçerik", icon: Code, description: "HTML içerik bloğu" },
]

interface Section {
  id: string
  sectionType: string
  tabKey: string
  tabLabel: string
  content: string | null
  sortOrder: number
}

interface Faq {
  id: string
  question: string
  answer: string
  sortOrder: number
}

interface Feature {
  icon: string
  title: string
  description: string
}

export function ProductLandingEditor({ productId, product, sections, faqs }: {
  productId: string
  product: { heroTitle: string | null; heroSubtitle: string | null; heroVideo: string | null; features: unknown }
  sections: Section[]
  faqs: Faq[]
}) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Hero Settings */}
      <HeroSettings productId={productId} product={product} />

      {/* Features */}
      <FeaturesEditor productId={productId} features={product.features} />

      {/* Sections */}
      <SectionsManager productId={productId} sections={sections} />

      {/* FAQs */}
      <FaqManager productId={productId} faqs={faqs} />
    </div>
  )
}

// ==========================================
// HERO SETTINGS
// ==========================================

function HeroSettings({ productId, product }: { productId: string; product: { heroTitle: string | null; heroSubtitle: string | null; heroVideo: string | null } }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    try {
      await updateProductLanding(productId, {
        heroTitle: (fd.get("heroTitle") as string) || null,
        heroSubtitle: (fd.get("heroSubtitle") as string) || null,
        heroVideo: (fd.get("heroVideo") as string) || null,
      })
      toast.success("Hero ayarları kaydedildi")
      router.refresh()
    } catch { toast.error("Hata") }
    finally { setSaving(false) }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Layout className="size-5" />
          Hero Ayarları
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label>Hero Başlık</Label>
            <Input name="heroTitle" defaultValue={product.heroTitle || ""} placeholder="Ürün başlığı (ör: Profesyoneller İçin Üstün Performans)" />
          </div>
          <div className="space-y-2">
            <Label>Hero Alt Başlık</Label>
            <Textarea name="heroSubtitle" rows={2} defaultValue={product.heroSubtitle || ""} placeholder="Kısa açıklama metni" />
          </div>
          <div className="space-y-2">
            <Label>Video URL (opsiyonel)</Label>
            <Input name="heroVideo" defaultValue={product.heroVideo || ""} placeholder="https://youtube.com/embed/..." />
          </div>
          <Button type="submit" disabled={saving}>{saving ? "Kaydediliyor..." : "Kaydet"}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

// ==========================================
// FEATURES EDITOR
// ==========================================

function FeaturesEditor({ productId, features: raw }: { productId: string; features: unknown }) {
  const router = useRouter()
  const initial = Array.isArray(raw) ? (raw as Feature[]) : []
  const [items, setItems] = useState<Feature[]>(initial)
  const [saving, setSaving] = useState(false)

  function addItem() {
    setItems([...items, { icon: "Cpu", title: "", description: "" }])
  }

  function updateItem(i: number, field: keyof Feature, value: string) {
    const copy = [...items]
    copy[i] = { ...copy[i], [field]: value }
    setItems(copy)
  }

  function removeItem(i: number) {
    setItems(items.filter((_, j) => j !== i))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateProductLanding(productId, { features: items.filter(f => f.title) })
      toast.success("Özellikler kaydedildi")
      router.refresh()
    } catch { toast.error("Hata") }
    finally { setSaving(false) }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Star className="size-5" />
          Özellik Blokları ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[100px_1fr_1fr_36px] items-start rounded-md border p-3">
            <div className="space-y-1">
              <Label className="text-xs">İkon</Label>
              <Input value={item.icon} onChange={(e) => updateItem(i, "icon", e.target.value)} placeholder="Cpu" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Başlık</Label>
              <Input value={item.title} onChange={(e) => updateItem(i, "title", e.target.value)} placeholder="Çoklu GPU Desteği" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Açıklama</Label>
              <Input value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} placeholder="7 adet GPU ile..." className="h-8 text-sm" />
            </div>
            <Button type="button" variant="ghost" size="icon" className="mt-5 size-8 text-destructive" onClick={() => removeItem(i)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-1 size-3" /> Özellik Ekle
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ==========================================
// SECTIONS MANAGER
// ==========================================

function makeTabKey(type: string) {
  return type.toLowerCase() + "-" + Date.now().toString(36)
}

function SectionsManager({ productId, sections }: { productId: string; sections: Section[] }) {
  const router = useRouter()
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  async function handleAdd(type: string, label: string) {
    const tabKey = makeTabKey(type)
    try {
      await addProductSection(productId, { sectionType: type, tabKey, tabLabel: label })
      toast.success("Section eklendi")
      setAddOpen(false)
      router.refresh()
    } catch { toast.error("Hata") }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProductSection(id)
      toast.success("Section silindi")
      router.refresh()
    } catch { toast.error("Hata") }
  }

  async function handleContentSave(id: string, content: string) {
    try {
      await updateProductSection(id, { content })
      toast.success("İçerik kaydedildi")
    } catch { toast.error("Hata") }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="size-5" />
          İçerik Section&apos;ları ({sections.length})
        </CardTitle>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger render={
            <Button size="sm"><Plus className="mr-1 size-3" /> Section Ekle</Button>
          } />
          <DialogContent>
            <DialogHeader><DialogTitle>Section Tipi Seçin</DialogTitle></DialogHeader>
            <div className="grid gap-2">
              {sectionTypes.map((st) => (
                <button
                  key={st.value}
                  onClick={() => handleAdd(st.value, st.label)}
                  className="flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <st.icon className="size-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{st.label}</p>
                    <p className="text-xs text-muted-foreground">{st.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {sections.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Henüz section eklenmemiş.</p>
        ) : (
          <div className="space-y-3">
            {sections.map((section) => {
              const typeInfo = sectionTypes.find((t) => t.value === section.sectionType)
              const Icon = typeInfo?.icon || Code
              const isEditing = editId === section.id

              return (
                <div key={section.id} className="rounded-lg border">
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <Icon className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{section.tabLabel}</span>
                      <Badge variant="outline" className="text-[10px]">{section.sectionType}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => setEditId(isEditing ? null : section.id)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => handleDelete(section.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  {isEditing && (
                    <SectionContentEditor
                      section={section}
                      onSave={(content) => handleContentSave(section.id, content)}
                      onClose={() => setEditId(null)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SectionContentEditor({ section, onSave, onClose }: { section: Section; onSave: (content: string) => void; onClose: () => void }) {
  const [content, setContent] = useState(section.content || "")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(content)
    setSaving(false)
    onClose()
  }

  return (
    <div className="border-t p-3 space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        placeholder="HTML içerik yazın..."
        className="font-mono text-sm"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onClose}>İptal</Button>
      </div>
    </div>
  )
}

// ==========================================
// FAQ MANAGER
// ==========================================

function FaqManager({ productId, faqs }: { productId: string; faqs: Faq[] }) {
  const router = useRouter()
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  async function handleAdd(question: string, answer: string) {
    try {
      await addProductFaq(productId, { question, answer })
      toast.success("SSS eklendi")
      setAddOpen(false)
      router.refresh()
    } catch { toast.error("Hata") }
  }

  async function handleUpdate(id: string, question: string, answer: string) {
    try {
      await updateProductFaq(id, { question, answer })
      toast.success("Güncellendi")
      setEditId(null)
      router.refresh()
    } catch { toast.error("Hata") }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProductFaq(id)
      toast.success("Silindi")
      router.refresh()
    } catch { toast.error("Hata") }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <HelpCircle className="size-5" />
          Sıkça Sorulan Sorular ({faqs.length})
        </CardTitle>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1 size-3" /> SSS Ekle
        </Button>
      </CardHeader>
      <CardContent>
        {addOpen && (
          <FaqForm onSave={handleAdd} onCancel={() => setAddOpen(false)} />
        )}
        {faqs.length === 0 && !addOpen ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Henüz SSS eklenmemiş.</p>
        ) : (
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-md border p-3">
                {editId === faq.id ? (
                  <FaqForm
                    initial={faq}
                    onSave={(q, a) => handleUpdate(faq.id, q, a)}
                    onCancel={() => setEditId(null)}
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{faq.question}</p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => setEditId(faq.id)}>
                        <Pencil className="size-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => handleDelete(faq.id)}>
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FaqForm({ initial, onSave, onCancel }: { initial?: { question: string; answer: string }; onSave: (q: string, a: string) => void; onCancel: () => void }) {
  const [question, setQuestion] = useState(initial?.question || "")
  const [answer, setAnswer] = useState(initial?.answer || "")

  return (
    <div className="space-y-3 rounded-md border bg-muted/30 p-3">
      <div className="space-y-2">
        <Label className="text-xs">Soru</Label>
        <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Soru..." />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Cevap</Label>
        <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} placeholder="Cevap..." />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(question, answer)} disabled={!question || !answer}>Kaydet</Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>İptal</Button>
      </div>
    </div>
  )
}
