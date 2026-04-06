"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationCombobox } from "@/components/admin/organization-combobox"
import { ContactSelector } from "@/components/admin/contact-selector"
import { createTicket } from "@/lib/actions/ticket-actions"
import { toast } from "sonner"

interface TicketFormProps {
  categories: { id: string; name: string }[]
  employees: { id: string; name: string | null; surname: string | null }[]
}

export function TicketForm({ categories, employees }: TicketFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [contactId, setContactId] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const fd = new FormData(e.currentTarget)

    try {
      const ticket = await createTicket({
        subject: fd.get("subject") as string,
        description: fd.get("description") as string,
        priority: (fd.get("priority") as "LOW" | "NORMAL" | "HIGH" | "URGENT") || "NORMAL",
        categoryId: (fd.get("categoryId") as string) || undefined,
        organizationId: organizationId || undefined,
        contactId: contactId || undefined,
        assignedToId: (fd.get("assignedToId") as string) || undefined,
      })
      toast.success("Destek talebi oluşturuldu")
      router.push(`/admin/tickets/${ticket.id}`)
    } catch {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Talep Bilgileri</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Konu *</Label>
              <Input id="subject" name="subject" required placeholder="Sorunun kısa açıklaması" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama *</Label>
              <Textarea id="description" name="description" required rows={6}
                placeholder="Sorunu detaylı açıklayın..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="priority">Öncelik</Label>
                <Select name="priority" defaultValue="NORMAL">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Düşük</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="HIGH">Yüksek</SelectItem>
                    <SelectItem value="URGENT">Acil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Kategori</Label>
                <Select name="categoryId">
                  <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>İlişkilendirme</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Organizasyon</Label>
              <OrganizationCombobox
                value={organizationId}
                onSelect={(id) => { setOrganizationId(id); setContactId(null) }}
              />
            </div>
            <div className="space-y-2">
              <Label>Kişi</Label>
              <ContactSelector
                organizationId={organizationId}
                value={contactId}
                onSelect={setContactId}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedToId">Atanan Çalışan</Label>
              <Select name="assignedToId">
                <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name} {e.surname}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Oluşturuluyor..." : "Talep Oluştur"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
      </div>
    </form>
  )
}
