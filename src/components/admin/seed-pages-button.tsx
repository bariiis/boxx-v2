"use client"

import { useState, useTransition } from "react"
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
import { Sparkles } from "lucide-react"
import { toast } from "sonner"
import { seedStaticPages } from "@/lib/actions/seed-pages-actions"

export function SeedPagesButton() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function run(overwrite: boolean) {
    startTransition(async () => {
      try {
        const res = await seedStaticPages(overwrite)
        const created = res.created.length
        const skipped = res.skipped.length
        toast.success(
          `${created} sayfa içe aktarıldı${skipped ? `, ${skipped} sayfa atlandı (zaten mevcut)` : ""}`
        )
        setOpen(false)
      } catch (e) {
        toast.error("Hata: " + (e instanceof Error ? e.message : "Bilinmeyen"))
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Sparkles className="mr-2 size-4" />
            Statik Sayfaları İçe Aktar
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Statik Sayfaları İçe Aktar</DialogTitle>
          <DialogDescription>
            Anasayfa, Hakkımızda, Çözümler ve İletişim sayfalarını landing-page olarak içe aktarır.
            Sonrasında bu sayfaları admin panelinden düzenleyebilirsin.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-muted/30 p-3 text-sm">
          <p className="font-medium">Oluşturulacak slug&apos;lar:</p>
          <ul className="mt-2 list-disc pl-5 text-muted-foreground">
            <li>home (anasayfa)</li>
            <li>hakkimizda</li>
            <li>iletisim (contact-form section ile)</li>
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Not: Çözümler sayfası dinamik katalog olduğu için şimdilik kod olarak kalıyor.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            İptal
          </Button>
          <Button variant="secondary" onClick={() => run(false)} disabled={pending}>
            {pending ? "İşleniyor..." : "Sadece Yenileri Oluştur"}
          </Button>
          <Button onClick={() => run(true)} disabled={pending}>
            {pending ? "İşleniyor..." : "Üzerine Yaz (Tümü)"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
