"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createOrganization, updateOrganization } from "@/lib/actions/organization-actions"
import { toast } from "sonner"
import type { Organization } from "@/generated/prisma"

const organizationTypes = [
  { value: "COMPANY", label: "Şirket" },
  { value: "UNIVERSITY", label: "Üniversite" },
  { value: "INDIVIDUAL", label: "Bireysel" },
  { value: "GOVERNMENT", label: "Kamu Kurumu" },
  { value: "NGO", label: "STK/Dernek" },
  { value: "OTHER", label: "Diğer" },
]

const organizationSources = [
  { value: "WEBSITE", label: "Web Sayfası" },
  { value: "STORE", label: "Mağaza" },
  { value: "PHONE", label: "Telefon" },
  { value: "EMAIL", label: "E-posta" },
  { value: "REFERRAL", label: "Referans" },
  { value: "SOCIAL_MEDIA", label: "Sosyal Medya" },
  { value: "OTHER", label: "Diğer" },
]

const organizationStatuses = [
  { value: "LEAD", label: "Lead" },
  { value: "ACTIVE", label: "Aktif" },
  { value: "PASSIVE", label: "Pasif" },
  { value: "CUSTOMER", label: "Müşteri" },
]

interface OrganizationFormProps {
  organization?: Organization | null
}

export function OrganizationForm({ organization }: OrganizationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isEditing = !!organization

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      type: formData.get("type") as "COMPANY",
      source: formData.get("source") as "WEBSITE",
      status: formData.get("status") as "LEAD",
      name: formData.get("name") as string,
      taxOffice: (formData.get("taxOffice") as string) || undefined,
      taxNumber: (formData.get("taxNumber") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      website: (formData.get("website") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      district: (formData.get("district") as string) || undefined,
      city: (formData.get("city") as string) || undefined,
      country: (formData.get("country") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    }

    try {
      if (isEditing) {
        await updateOrganization(organization.id, data)
        toast.success("Organizasyon güncellendi")
      } else {
        await createOrganization(data)
        toast.success("Organizasyon oluşturuldu")
      }
      router.push("/admin/organizations")
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
            <CardTitle>Temel Bilgiler</CardTitle>
            <CardDescription>Organizasyon tipi ve vergi bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organizasyon Adı <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={organization?.name || ""}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Tip <span className="text-destructive">*</span></Label>
                <Select name="type" defaultValue={organization?.type || "COMPANY"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Kaynak</Label>
                <Select name="source" defaultValue={organization?.source || "WEBSITE"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationSources.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Durum</Label>
              <Select name="status" defaultValue={organization?.status || "LEAD"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {organizationStatuses.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxOffice">Vergi Dairesi</Label>
                <Input
                  id="taxOffice"
                  name="taxOffice"
                  defaultValue={organization?.taxOffice || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Vergi No</Label>
                <Input
                  id="taxNumber"
                  name="taxNumber"
                  defaultValue={organization?.taxNumber || ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>İletişim Bilgileri</CardTitle>
            <CardDescription>Telefon ve web adresi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={organization?.phone || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                defaultValue={organization?.website || ""}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adres Bilgileri</CardTitle>
            <CardDescription>Fiziksel adres ve konum</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                name="address"
                rows={2}
                defaultValue={organization?.address || ""}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="district">İlçe</Label>
                <Input
                  id="district"
                  name="district"
                  defaultValue={organization?.district || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Şehir</Label>
                <Input
                  id="city"
                  name="city"
                  defaultValue={organization?.city || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Ülke</Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={organization?.country || "Türkiye"}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notlar</CardTitle>
            <CardDescription>Dahili notlar, müşteriye görünmez</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="notes"
              name="notes"
              rows={5}
              placeholder="Organizasyon hakkında notlar..."
              defaultValue={organization?.notes || ""}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading
            ? isEditing
              ? "Güncelleniyor..."
              : "Oluşturuluyor..."
            : isEditing
              ? "Güncelle"
              : "Oluştur"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          İptal
        </Button>
      </div>
    </form>
  )
}
