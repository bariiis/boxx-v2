"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { deleteSolution } from "@/lib/actions/solution-actions"
import { toast } from "sonner"

export function DeleteSolutionButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteSolution(id)
      toast.success("Sayfa silindi")
      setOpen(false)
    } catch {
      toast.error("Silme başarısız")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="size-4" />
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Çözüm Sayfasını Sil</DialogTitle>
          <DialogDescription>
            <strong>{title}</strong> sayfasını silmek istediğinize emin misiniz? Tüm sekmeler ve benchmark chartlar da silinecek.
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
