"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { deleteContact } from "@/lib/actions/contact-actions"
import { toast } from "sonner"

export function DeleteContactButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteContact(id)
      toast.success("Kişi silindi")
      setOpen(false)
    } catch {
      toast.error("Silme işlemi başarısız")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="size-4" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kişiyi Sil</DialogTitle>
          <DialogDescription>
            <strong>{name}</strong> kişisini silmek istediğinize emin misiniz?
          </DialogDescription>
        </DialogHeader>
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
