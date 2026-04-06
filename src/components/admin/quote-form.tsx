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
import { createQuote, updateQuote } from "@/lib/actions/quote-actions"
import { toast } from "sonner"
import type { Quote, Organization, Contact } from "@/generated/prisma"

interface QuoteFormProps {
  userId: string
  quote?: (Quote & { organization?: Organization | null; contact?: Contact | null }) | null
  defaults?: Record<string, string>
}

export function QuoteForm({ userId, quote, defaults = {} }: QuoteFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [organizationId, setOrganizationId] = useState<string | null>(quote?.organizationId || null)
  const [contactId, setContactId] = useState<string | null>(quote?.contactId || null)
  const isEditing = !!quote

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const data = {
      organizationId: organizationId || undefined,
      contactId: contactId || undefined,
      createdById: userId,
      currency: fd.get("currency") as "TRY" | "USD" | "EUR" | "GBP",
      displayMode: fd.get("displayMode") as "RECIPE" | "DETAILED",
      projectName: (fd.get("projectName") as string) || undefined,
      projectNumber: (fd.get("projectNumber") as string) || undefined,
      vatRate: parseFloat(fd.get("vatRate") as string) || 20,
      discountPercent: parseFloat(fd.get("discountPercent") as string) || undefined,
      validUntil: (fd.get("validUntil") as string) || undefined,
      publicNote: (fd.get("publicNote") as string) || undefined,
      internalNote: (fd.get("internalNote") as string) || undefined,
    }

    try {
      if (isEditing) {
        await updateQuote(quote.id, data)
        toast.success("Teklif güncellendi")
        router.refresh()
      } else {
        const newQuote = await createQuote(data)
        toast.success("Teklif oluşturuldu")
        router.push(`/admin/quotes/${newQuote.id}`)
      }
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
          <CardHeader>
            <CardTitle>Müşteri Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Organizasyon</Label>
              <OrganizationCombobox
                value={organizationId}
                defaultLabel={quote?.organization?.name}
                onSelect={(id) => {
                  setOrganizationId(id)
                  setContactId(null)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Kişi</Label>
              <ContactSelector
                organizationId={organizationId}
                value={contactId}
                defaultLabel={quote?.contact ? `${quote.contact.firstName} ${quote.contact.lastName}` : undefined}
                onSelect={setContactId}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teklif Detayları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="projectName">Proje Adı</Label>
                <Input id="projectName" name="projectName" defaultValue={quote?.projectName || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectNumber">Proje No</Label>
                <Input id="projectNumber" name="projectNumber" defaultValue={quote?.projectNumber || ""} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Para Birimi</Label>
                <Select name="currency" defaultValue={quote?.currency || defaults.default_currency || "USD"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRY">₺ TRY</SelectItem>
                    <SelectItem value="USD">$ USD</SelectItem>
                    <SelectItem value="EUR">€ EUR</SelectItem>
                    <SelectItem value="GBP">£ GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayMode">Gösterim</Label>
                <Select name="displayMode" defaultValue={quote?.displayMode || "DETAILED"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DETAILED">Detaylı (Kalem Kalem)</SelectItem>
                    <SelectItem value="RECIPE">Reçete (Tek Toplam)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vatRate">KDV (%)</Label>
                <Select name="vatRate" defaultValue={String(quote?.vatRate ?? defaults.default_vat_rate ?? 20)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">%0</SelectItem>
                    <SelectItem value="1">%1</SelectItem>
                    <SelectItem value="10">%10</SelectItem>
                    <SelectItem value="20">%20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Geçerlilik Tarihi</Label>
                <Input id="validUntil" name="validUntil" type="date"
                  defaultValue={quote?.validUntil
                    ? new Date(quote.validUntil).toISOString().split("T")[0]
                    : (() => {
                        const d = new Date()
                        d.setDate(d.getDate() + (parseInt(defaults.default_quote_days) || 10))
                        return d.toISOString().split("T")[0]
                      })()
                  } />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Müşteriye Görünen Not</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea name="publicNote" rows={3}
              placeholder="Bu not müşteriye gösterilecek..."
              defaultValue={quote?.publicNote ?? defaults.default_quote_notes ?? ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dahili Not</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea name="internalNote" rows={3}
              placeholder="Sadece çalışanlar görebilir..."
              defaultValue={quote?.internalNote || ""} />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Teklif Oluştur"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
      </div>
    </form>
  )
}
