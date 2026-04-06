"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, FolderPlus, GripVertical } from "lucide-react"
import {
  createSolutionCategory,
  updateSolutionCategory,
  deleteSolutionCategory,
} from "@/lib/actions/solution-category-actions"
import { toast } from "sonner"

interface CategoryBase {
  id: string
  name: string
  nameEn: string | null
  slug: string
  description: string | null
  parentId: string | null
  sortOrder: number
  isActive: boolean
}

interface Category extends CategoryBase {
  children: CategoryBase[]
}

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/â/g, "a").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export function SolutionCategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <AddCategoryDialog onCreated={() => router.refresh()} />
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Henüz kategori yok. Yukarıdan yeni bir ana kategori ekleyin.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <GripVertical className="size-4 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {cat.name}
                      {cat.nameEn && <span className="text-sm font-normal text-muted-foreground">({cat.nameEn})</span>}
                      {!cat.isActive && <Badge variant="secondary">Pasif</Badge>}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground font-mono">/{cat.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <AddCategoryDialog parentId={cat.id} parentName={cat.name} onCreated={() => router.refresh()} />
                  <Button variant="ghost" size="sm" asChild title="Sayfa düzenle">
                    <Link href={`/admin/solutions/categories/${cat.id}`}><Pencil className="size-4" /></Link>
                  </Button>
                  <DeleteCategoryButton id={cat.id} name={cat.name} onDeleted={() => router.refresh()} />
                </div>
              </CardHeader>

              {cat.children.length > 0 && (
                <CardContent className="pt-0">
                  <div className="ml-6 space-y-1 border-l pl-4">
                    {cat.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="size-3 text-muted-foreground" />
                          <div>
                            <span className="text-sm font-medium">{child.name}</span>
                            {child.nameEn && (
                              <span className="ml-2 text-xs text-muted-foreground">({child.nameEn})</span>
                            )}
                            {!child.isActive && <Badge variant="secondary" className="ml-2 text-[10px]">Pasif</Badge>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" asChild title="Sayfa düzenle">
                            <Link href={`/admin/solutions/categories/${child.id}`}><Pencil className="size-4" /></Link>
                          </Button>
                          <DeleteCategoryButton id={child.id} name={child.name} onDeleted={() => router.refresh()} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ==========================================
// ADD CATEGORY DIALOG
// ==========================================

function AddCategoryDialog({
  parentId,
  parentName,
  onCreated,
}: {
  parentId?: string
  parentName?: string
  onCreated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [nameEn, setNameEn] = useState("")
  const [slug, setSlug] = useState("")

  async function handleSubmit() {
    if (!name || !slug) return toast.error("Ad ve slug gerekli")
    setLoading(true)
    try {
      await createSolutionCategory({
        name,
        nameEn: nameEn || undefined,
        slug,
        parentId,
      })
      toast.success(parentId ? "Alt kategori eklendi" : "Ana kategori eklendi")
      setOpen(false)
      setName(""); setNameEn(""); setSlug("")
      onCreated()
    } catch {
      toast.error("Hata oluştu — slug benzersiz olmalı")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          parentId ? (
            <Button variant="ghost" size="sm" title="Alt kategori ekle">
              <FolderPlus className="size-4" />
            </Button>
          ) : (
            <Button>
              <Plus className="mr-2 size-4" />
              Ana Kategori Ekle
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {parentId ? `"${parentName}" altına alt kategori ekle` : "Yeni Ana Kategori"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Kategori Adı (TR) *</Label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); setSlug(slugify(e.target.value)) }}
              placeholder="ör: Fotoğraf Düzenleme"
            />
          </div>
          <div className="space-y-2">
            <Label>Kategori Adı (EN)</Label>
            <Input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="ör: Photo Editing"
            />
          </div>
          <div className="space-y-2">
            <Label>Slug *</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Ekleniyor..." : "Ekle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==========================================
// EDIT CATEGORY DIALOG
// ==========================================

function EditCategoryDialog({ category, onUpdated }: { category: CategoryBase; onUpdated: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(category.name)
  const [nameEn, setNameEn] = useState(category.nameEn || "")
  const [slug, setSlug] = useState(category.slug)
  const [isActive, setIsActive] = useState(category.isActive)
  const [sortOrder, setSortOrder] = useState(category.sortOrder)

  async function handleSubmit() {
    setLoading(true)
    try {
      await updateSolutionCategory(category.id, { name, nameEn: nameEn || undefined, slug, isActive, sortOrder })
      toast.success("Kategori güncellendi")
      setOpen(false)
      onUpdated()
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="ghost" size="sm" title="Düzenle">
          <Pencil className="size-4" />
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kategoriyi Düzenle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Kategori Adı (TR)</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Kategori Adı (EN)</Label>
            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Sıralama</Label>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Aktif</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==========================================
// DELETE BUTTON
// ==========================================

function DeleteCategoryButton({ id, name, onDeleted }: { id: string; name: string; onDeleted: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteSolutionCategory(id)
      toast.success("Kategori silindi")
      setOpen(false)
      onDeleted()
    } catch {
      toast.error("Silinemedi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="ghost" size="sm" className="text-destructive" title="Sil">
          <Trash2 className="size-4" />
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kategoriyi Sil</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          <strong>{name}</strong> kategorisini silmek istediğinize emin misiniz?
          Alt kategoriler kök dizine taşınacak, bağlı çözüm sayfalarının kategorisi kaldırılacak.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Siliniyor..." : "Sil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
