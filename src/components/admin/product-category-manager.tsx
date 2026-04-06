"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, FolderPlus, GripVertical, ChevronRight } from "lucide-react"
import {
  createProductCategory, updateProductCategory, deleteProductCategory,
} from "@/lib/actions/product-category-actions"
import { toast } from "sonner"

interface CategoryNode {
  id: string; name: string; nameEn: string | null; subtitle: string | null; slug: string
  description: string | null; parentId: string | null; sortOrder: number; isActive: boolean
  children: CategoryNode[]
}

const MAX_DEPTH = 3

function slugify(t: string) {
  return t.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s")
    .replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/â/g,"a")
    .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")
}

export function ProductCategoryManager({ categories }: { categories: CategoryNode[] }) {
  const router = useRouter()
  return (
    <div className="space-y-4">
      <AddDialog onDone={() => router.refresh()} />
      {categories.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Henüz kategori yok.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} depth={0} onDone={() => router.refresh()} />
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryCard({ category: cat, depth, onDone }: { category: CategoryNode; depth: number; onDone: () => void }) {
  const [expanded, setExpanded] = useState(true)
  const canAddChild = depth < MAX_DEPTH - 1

  if (depth === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-3">
            <GripVertical className="size-4 text-muted-foreground" />
            {cat.children.length > 0 && (
              <button onClick={() => setExpanded(!expanded)}>
                <ChevronRight className={`size-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
              </button>
            )}
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {cat.name}
                {cat.nameEn && <span className="text-sm font-normal text-muted-foreground">({cat.nameEn})</span>}
                {!cat.isActive && <Badge variant="secondary">Pasif</Badge>}
              </CardTitle>
              {cat.subtitle && <p className="text-xs text-muted-foreground">{cat.subtitle}</p>}
              <p className="text-[10px] text-muted-foreground font-mono">/{cat.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {canAddChild && <AddDialog parentId={cat.id} parentName={cat.name} onDone={onDone} />}
            <EditDialog category={cat} onDone={onDone} />
            <DeleteBtn id={cat.id} name={cat.name} onDone={onDone} />
          </div>
        </CardHeader>
        {expanded && cat.children.length > 0 && (
          <CardContent className="pt-0">
            <div className="ml-6 space-y-1 border-l pl-4">
              {cat.children.map((child) => (
                <CategoryCard key={child.id} category={child} depth={1} onDone={onDone} />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  // Depth 1+ : inline row style
  return (
    <div>
      <div className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50">
        <div className="flex items-center gap-3">
          <GripVertical className="size-3 text-muted-foreground" />
          {cat.children.length > 0 && (
            <button onClick={() => setExpanded(!expanded)}>
              <ChevronRight className={`size-3.5 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
            </button>
          )}
          <span className="text-sm font-medium">{cat.name}</span>
          {cat.subtitle && <span className="text-xs text-muted-foreground">— {cat.subtitle}</span>}
          {cat.nameEn && <span className="text-xs text-muted-foreground">({cat.nameEn})</span>}
          <span className="text-[10px] text-muted-foreground font-mono">/{cat.slug}</span>
          {!cat.isActive && <Badge variant="secondary" className="text-[10px]">Pasif</Badge>}
        </div>
        <div className="flex items-center gap-1">
          {canAddChild && <AddDialog parentId={cat.id} parentName={cat.name} onDone={onDone} />}
          <EditDialog category={cat} onDone={onDone} />
          <DeleteBtn id={cat.id} name={cat.name} onDone={onDone} />
        </div>
      </div>
      {expanded && cat.children.length > 0 && (
        <div className="ml-6 space-y-1 border-l pl-4">
          {cat.children.map((child) => (
            <CategoryCard key={child.id} category={child} depth={depth + 1} onDone={onDone} />
          ))}
        </div>
      )}
    </div>
  )
}

function AddDialog({ parentId, parentName, onDone }: { parentId?: string; parentName?: string; onDone: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [nameEn, setNameEn] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [slug, setSlug] = useState("")

  async function handle() {
    if (!name || !slug) return toast.error("Ad ve slug gerekli")
    setLoading(true)
    try {
      await createProductCategory({ name, nameEn: nameEn || undefined, subtitle: subtitle || undefined, slug, parentId })
      toast.success(parentId ? "Alt kategori eklendi" : "Ana kategori eklendi")
      setOpen(false); setName(""); setNameEn(""); setSubtitle(""); setSlug(""); onDone()
    } catch { toast.error("Hata — slug benzersiz olmalı") }
    finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        parentId
          ? <Button variant="ghost" size="sm" title="Alt kategori ekle"><FolderPlus className="size-4" /></Button>
          : <Button><Plus className="mr-2 size-4" />Ana Kategori Ekle</Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{parentId ? `"${parentName}" altına alt kategori` : "Yeni Ana Kategori"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Kategori Adı (TR) *</Label>
            <Input value={name} onChange={(e) => { setName(e.target.value); setSlug(slugify(e.target.value)) }} placeholder="ör: İş İstasyonları" />
          </div>
          <div className="space-y-2">
            <Label>Kategori Adı (EN)</Label>
            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="ör: Workstations" />
          </div>
          <div className="space-y-2">
            <Label>Alt Başlık</Label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="ör: Küçük ve kompakt" />
          </div>
          <div className="space-y-2">
            <Label>Slug *</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
          <Button onClick={handle} disabled={loading}>{loading ? "Ekleniyor..." : "Ekle"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditDialog({ category, onDone }: { category: CategoryNode; onDone: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(category.name)
  const [nameEn, setNameEn] = useState(category.nameEn || "")
  const [subtitle, setSubtitle] = useState(category.subtitle || "")
  const [slug, setSlug] = useState(category.slug)
  const [isActive, setIsActive] = useState(category.isActive)
  const [sortOrder, setSortOrder] = useState(category.sortOrder)

  async function handle() {
    setLoading(true)
    try {
      await updateProductCategory(category.id, { name, nameEn: nameEn || undefined, subtitle: subtitle || undefined, slug, isActive, sortOrder })
      toast.success("Güncellendi"); setOpen(false); onDone()
    } catch { toast.error("Hata") }
    finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm" title="Düzenle"><Pencil className="size-4" /></Button>} />
      <DialogContent>
        <DialogHeader><DialogTitle>Kategoriyi Düzenle</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Ad (TR)</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Ad (EN)</Label><Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} /></div>
          <div className="space-y-2"><Label>Alt Başlık</Label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Menüde görünecek kısa açıklama" /></div>
          <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
          <div className="space-y-2"><Label>Sıralama</Label><Input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} /></div>
          <div className="flex items-center gap-3"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>{isActive ? "Aktif" : "Pasif"}</Label></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
          <Button onClick={handle} disabled={loading}>{loading ? "Kaydediliyor..." : "Kaydet"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteBtn({ id, name, onDone }: { id: string; name: string; onDone: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  async function handle() {
    setLoading(true)
    try { await deleteProductCategory(id); toast.success("Silindi"); setOpen(false); onDone() }
    catch { toast.error("Hata") }
    finally { setLoading(false) }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm" className="text-destructive" title="Sil"><Trash2 className="size-4" /></Button>} />
      <DialogContent>
        <DialogHeader><DialogTitle>Kategoriyi Sil</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground"><strong>{name}</strong> silinecek. Alt kategoriler köke taşınır, ürünlerin kategorisi kaldırılır.</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
          <Button variant="destructive" onClick={handle} disabled={loading}>{loading ? "Siliniyor..." : "Sil"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
