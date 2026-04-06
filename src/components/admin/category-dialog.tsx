"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { createCategory } from "@/lib/actions/product-actions"
import { toast } from "sonner"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function CategoryDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    try {
      await createCategory({
        name: fd.get("name") as string,
        nameEn: (fd.get("nameEn") as string) || undefined,
        slug: fd.get("slug") as string,
      })
      toast.success("Kategori oluşturuldu")
      setOpen(false)
      setName("")
      setSlug("")
    } catch {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 size-4" />
            Yeni Kategori
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Kategori</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Kategori Adı (TR) *</Label>
            <Input
              id="cat-name" name="name" required value={name}
              onChange={(e) => { setName(e.target.value); setSlug(slugify(e.target.value)) }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-nameEn">Kategori Adı (EN)</Label>
            <Input id="cat-nameEn" name="nameEn" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-slug">Slug *</Label>
            <Input id="cat-slug" name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>İptal</Button>
            <Button type="submit" disabled={loading}>{loading ? "Oluşturuluyor..." : "Oluştur"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
