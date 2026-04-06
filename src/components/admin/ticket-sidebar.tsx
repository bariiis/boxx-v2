"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
}

export function TicketSidebar({ ticket, employees }: TicketSidebarProps) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleUpdate(field: string, value: string) {
    try {
      await updateTicket(ticket.id, { [field]: value })
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
        <CardContent className="space-y-3">
          <Select defaultValue={ticket.status} onValueChange={(v) => handleUpdate("status", v)}>
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
          <Select defaultValue={ticket.priority} onValueChange={(v) => handleUpdate("priority", v)}>
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
          <Select defaultValue={ticket.assignedTo?.id || ""} onValueChange={(v) => handleUpdate("assignedToId", v)}>
            <SelectTrigger><SelectValue placeholder="Atanmadı" /></SelectTrigger>
            <SelectContent>
              {employees.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.name} {e.surname}</SelectItem>
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
          {ticket.category && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kategori</span>
              <span>{ticket.category.name}</span>
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
