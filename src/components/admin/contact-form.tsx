"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { OrganizationCombobox } from "@/components/admin/organization-combobox"
import { createContact, updateContact } from "@/lib/actions/contact-actions"
import { toast } from "sonner"
import type { Contact, Organization } from "@/generated/prisma"

interface ContactFormProps {
  contact?: (Contact & { organization?: Organization | null }) | null
}

export function ContactForm({ contact }: ContactFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [organizationId, setOrganizationId] = useState<string | null>(
    contact?.organizationId || null
  )
  const isEditing = !!contact

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: (formData.get("title") as string) || undefined,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: (formData.get("email") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      department: (formData.get("department") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
      organizationId: organizationId || undefined,
    }

    try {
      if (isEditing) {
        await updateContact(contact.id, { ...data, organizationId: organizationId })
        toast.success("Kişi güncellendi")
      } else {
        await createContact(data)
        toast.success("Kişi oluşturuldu")
      }
      router.push("/admin/contacts")
    } catch {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kişi Bilgileri</CardTitle>
          <CardDescription>Kişi iletişim ve organizasyon bilgileri</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[140px_1fr_1fr]">
            <div className="space-y-2">
              <Label htmlFor="title">Ünvan</Label>
              <Input id="title" name="title" placeholder="Dr." defaultValue={contact?.title || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad <span className="text-destructive">*</span></Label>
              <Input id="firstName" name="firstName" required defaultValue={contact?.firstName || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad <span className="text-destructive">*</span></Label>
              <Input id="lastName" name="lastName" required defaultValue={contact?.lastName || ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Organizasyon</Label>
            <OrganizationCombobox
              value={organizationId}
              defaultLabel={contact?.organization?.name}
              onSelect={setOrganizationId}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" name="email" type="email" defaultValue={contact?.email || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" defaultValue={contact?.phone || ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Departman</Label>
            <Input id="department" name="department" defaultValue={contact?.department || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea id="notes" name="notes" rows={3} placeholder="Kişi hakkında notlar..." defaultValue={contact?.notes || ""} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading
            ? isEditing ? "Güncelleniyor..." : "Oluşturuluyor..."
            : isEditing ? "Güncelle" : "Oluştur"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          İptal
        </Button>
      </div>
    </form>
  )
}
