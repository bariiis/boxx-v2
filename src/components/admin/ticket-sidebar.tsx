"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateTicket, deleteTicket } from "@/lib/actions/ticket-actions"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import type { TicketStatus, TicketPriority } from "@/generated/prisma"

interface TicketData {
  id: string
  ticketNumber: string
  status: string
  priority: string
  createdAt: Date
  closedAt: Date | null
  organization: { id: string; name: string } | null
  contact: { id: string; firstName: string; lastName: string } | null
  assignedTo: { id: string; name: string | null; surname: string | null } | null
  category: { id: string; name: string } | null
  serialNumber: { id: string; serialNumber: string } | null
}

interface TicketSidebarProps {
  ticket: TicketData
  employees: { id: string; name: string | null; surname: string | null }[]
  categories: { id: string; name: string }[]
}

const NONE = "__none__"

export function TicketSidebar({ ticket, employees, categories }: TicketSidebarProps) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleStatusChange(value: string) {
    try {
      await updateTicket(ticket.id, { status: value as TicketStatus })
      toast.success("Güncellendi")
      router.refresh()
    } catch {
      toast.error("Hata oluştu")
    }
  }

  async function handlePriorityChange(value: string) {
    try {
      await updateTicket(ticket.id, { priority: value as TicketPriority })
      toast.success("Güncellendi")
      router.refresh()
    } catch {
      toast.error("Hata oluştu")
    }
  }

  async function handleAssigneeChange(value: string) {
    const assignedToId = value === NONE ? null : value
    try {
      await updateTicket(ticket.id, { assignedToId })
      toast.success("Güncellendi")
      router.refresh()
    } catch {
      toast.error("Hata oluştu")
    }
  }

  async function handleCategoryChange(value: string) {
    const categoryId = value === NONE ? null : value
    try {
      await updateTicket(ticket.id, { categoryId })
      toast.success("Güncellendi")
      router.refresh()
    } catch {
      toast.error("Hata oluştu")
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteTicket(ticket.id)
      toast.success("Talep silindi")
      router.push("/admin/tickets")
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-sm">Durum</CardTitle></CardHeader>
        <CardContent>
          <Select key={ticket.status} defaultValue={ticket.status} onValueChange={handleStatusChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Açık</SelectItem>
              <SelectItem value="AWAITING_REPLY">Yanıt Bekleniyor</SelectItem>
              <SelectItem value="RESOLVED">Çözüldü</SelectItem>
              <SelectItem value="CLOSED">Kapandı</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Öncelik</CardTitle></CardHeader>
        <CardContent>
          <Select key={ticket.priority} defaultValue={ticket.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Düşük</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="HIGH">Yüksek</SelectItem>
              <SelectItem value="URGENT">Acil</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Atanan</CardTitle></CardHeader>
        <CardContent>
          <Select
            key={ticket.assignedTo?.id ?? NONE}
            defaultValue={ticket.assignedTo?.id ?? NONE}
            onValueChange={handleAssigneeChange}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Atanmadı</SelectItem>
              {employees.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.name} {e.surname}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Kategori</CardTitle></CardHeader>
        <CardContent>
          <Select
            key={ticket.category?.id ?? NONE}
            defaultValue={ticket.category?.id ?? NONE}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Kategori yok</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Detaylar</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {ticket.organization && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Organizasyon</span>
              <span>{ticket.organization.name}</span>
            </div>
          )}
          {ticket.contact && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kişi</span>
              <span>{ticket.contact.firstName} {ticket.contact.lastName}</span>
            </div>
          )}
          {ticket.serialNumber && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seri No</span>
              <span className="font-mono">{ticket.serialNumber.serialNumber}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Oluşturulma</span>
            <span>{format(ticket.createdAt, "dd.MM.yyyy HH:mm", { locale: tr })}</span>
          </div>
          {ticket.closedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kapanma</span>
              <span>{format(ticket.closedAt, "dd.MM.yyyy HH:mm", { locale: tr })}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger render={
          <Button variant="destructive" className="w-full">
            <Trash2 className="mr-2 size-4" />Talebi Sil
          </Button>
        } />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Talebi Sil</DialogTitle>
            <DialogDescription>{ticket.ticketNumber} talebini silmek istediğinize emin misiniz?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>İptal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Siliniyor..." : "Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
