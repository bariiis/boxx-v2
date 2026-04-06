"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Send, Copy, Trash2, Eye, ExternalLink, FileDown } from "lucide-react"
import { updateQuote, deleteQuote, cloneQuote } from "@/lib/actions/quote-actions"
import { toast } from "sonner"
import type { Quote } from "@/generated/prisma"

export function QuoteActions({ quote, userId }: { quote: Quote; userId: string }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading, setLoading] = useState("")

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/quote/${quote.publicToken}`
    : `/quote/${quote.publicToken}`

  async function handleStatusChange(status: "SENT" | "REVISED") {
    setLoading(status)
    try {
      await updateQuote(quote.id, { status })
      toast.success(status === "SENT" ? "Teklif gönderildi" : "Teklif revize edildi")
      router.refresh()
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading("")
    }
  }

  async function handleClone() {
    setLoading("clone")
    try {
      const clone = await cloneQuote(quote.id, userId)
      if (clone) {
        toast.success("Teklif kopyalandı")
        router.push(`/admin/quotes/${clone.id}`)
      }
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading("")
    }
  }

  async function handleDelete() {
    setLoading("delete")
    try {
      await deleteQuote(quote.id)
      toast.success("Teklif silindi")
      router.push("/admin/quotes")
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading("")
      setDeleteOpen(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {quote.status === "DRAFT" && (
        <Button onClick={() => handleStatusChange("SENT")} disabled={loading === "SENT"}>
          <Send className="mr-2 size-4" />
          {loading === "SENT" ? "Gönderiliyor..." : "Gönder"}
        </Button>
      )}

      {(quote.status === "SENT" || quote.status === "VIEWED") && (
        <Button variant="outline" onClick={() => handleStatusChange("REVISED")} disabled={loading === "REVISED"}>
          Revize Et
        </Button>
      )}

      <Button variant="outline" onClick={async () => {
        try {
          await navigator.clipboard.writeText(publicUrl)
          toast.success("Link kopyalandı: " + publicUrl)
        } catch {
          // Fallback for HTTP / non-secure contexts
          const input = document.createElement("input")
          input.value = publicUrl
          document.body.appendChild(input)
          input.select()
          document.execCommand("copy")
          document.body.removeChild(input)
          toast.success("Link kopyalandı")
        }
      }}>
        <ExternalLink className="mr-2 size-4" />
        Müşteri Linki
      </Button>

      <Button variant="outline" asChild>
        <a href={`/quote/${quote.publicToken}`} target="_blank" rel="noopener noreferrer">
          <Eye className="mr-2 size-4" />
          Ön İzleme
        </a>
      </Button>

      <Button variant="outline" asChild>
        <a href={`/api/pdf/quote/${quote.id}`} target="_blank" rel="noopener noreferrer">
          <FileDown className="mr-2 size-4" />
          PDF
        </a>
      </Button>

      <Button variant="outline" onClick={handleClone} disabled={loading === "clone"}>
        <Copy className="mr-2 size-4" />
        {loading === "clone" ? "Kopyalanıyor..." : "Kopyala"}
      </Button>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger
          render={
            <Button variant="destructive">
              <Trash2 className="mr-2 size-4" />
              Sil
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teklifi Sil</DialogTitle>
            <DialogDescription>
              <strong>{quote.quoteNumber}</strong> teklifini silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>İptal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading === "delete"}>
              {loading === "delete" ? "Siliniyor..." : "Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
