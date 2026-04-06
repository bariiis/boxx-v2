"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationCombobox } from "@/components/admin/organization-combobox"
import { ContactSelector } from "@/components/admin/contact-selector"
import { createSerialNumber, updateSerialNumber } from "@/lib/actions/serial-number-actions"
import { searchProducts } from "@/lib/actions/product-actions"
import { toast } from "sonner"

interface SerialNumberData {
  id: string
  serialNumber: string
  isActive: boolean
  configuration: string | null
  warrantyStart: Date
  warrantyEnd: Date | null
  notes: string | null
  productId: string | null
  organizationId: string | null
  contactId: string | null
  product?: { id: string; name: string; sku: string; warrantyMonths: number } | null
  organization?: { id: string; name: string } | null
  contact?: { id: string; firstName: string; lastName: string } | null
}

interface SerialNumberFormProps {
  serialNumber?: SerialNumberData | null
}

export function SerialNumberForm({ serialNumber }: SerialNumberFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(serialNumber?.isActive ?? true)
  const [organizationId, setOrganizationId] = useState<string | null>(serialNumber?.organizationId || null)
  const [contactId, setContactId] = useState<string | null>(serialNumber?.contactId || null)
  const [productId, setProductId] = useState<string | null>(serialNumber?.productId || null)
  const [productQuery, setProductQuery] = useState(serialNumber?.product?.name || "")
  const [productResults, setProductResults] = useState<{ id: string; name: string; sku: string; price: number; stock: number; type: string }[]>([])
  const [warrantyEnd, setWarrantyEnd] = useState(() => {
    if (serialNumber?.warrantyEnd) return new Date(serialNumber.warrantyEnd).toISOString().split("T")[0]
    const d = new Date()
    d.setFullYear(d.getFullYear() + 3)
    return d.toISOString().split("T")[0]
  })

  const isEditing = !!serialNumber

  async function handleProductSearch(q: string) {
    setProductQuery(q)
    if (q.length >= 2) {
      const res = await searchProducts(q)
      setProductResults(res)
    } else {
      setProductResults([])
    }
  }

  function selectProduct(p: { id: string; name: string; sku: string }) {
    setProductId(p.id)
    setProductQuery(p.name)
    setProductResults([])
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const data = {
      serialNumber: fd.get("serialNumber") as string,
      configuration: (fd.get("configuration") as string) || undefined,
      notes: (fd.get("notes") as string) || undefined,
      warrantyStart: (fd.get("warrantyStart") as string) || undefined,
      warrantyEnd: warrantyEnd || undefined,
      productId: productId || undefined,
      organizationId: organizationId || undefined,
      contactId: contactId || undefined,
    }

    try {
      if (isEditing) {
        await updateSerialNumber(serialNumber.id, { ...data, isActive })
        toast.success("Seri no güncellendi")
      } else {
        await createSerialNumber(data)
        toast.success("Seri no oluşturuldu")
      }
      router.push("/admin/serial-numbers")
    } catch {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Müşteri Eşleştir</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Organizasyon</Label>
                <OrganizationCombobox
                  value={organizationId}
                  defaultLabel={serialNumber?.organization?.name}
                  onSelect={(id) => { setOrganizationId(id); setContactId(null) }}
                />
              </div>
              <div className="space-y-2">
                <Label>Kişi</Label>
                <ContactSelector
                  organizationId={organizationId}
                  value={contactId}
                  defaultLabel={serialNumber?.contact ? `${serialNumber.contact.firstName} ${serialNumber.contact.lastName}` : undefined}
                  onSelect={setContactId}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Notlar</CardTitle></CardHeader>
            <CardContent>
              <Textarea name="notes" rows={3} defaultValue={serialNumber?.notes || ""} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Seri No Bilgileri</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Seri Numarası *</Label>
                <Input id="serialNumber" name="serialNumber" required className="font-mono"
                  defaultValue={serialNumber?.serialNumber || ""} />
              </div>
              <div className="space-y-2">
                <Label>Ürün</Label>
                <Input value={productQuery} onChange={(e) => handleProductSearch(e.target.value)}
                  placeholder="Ürün adı veya SKU ara..." />
                {productResults.length > 0 && (
                  <div className="max-h-40 overflow-y-auto rounded-md border">
                    {productResults.map((p) => (
                      <button key={p.id} type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => selectProduct(p)}>
                        <span>{p.name} <span className="text-muted-foreground">({p.sku})</span></span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="configuration">Konfigürasyon</Label>
                <Textarea id="configuration" name="configuration" rows={3}
                  placeholder="CPU: ... | RAM: ... | GPU: ... | SSD: ..."
                  defaultValue={serialNumber?.configuration || ""} />
              </div>
              {isEditing && (
                <div className="flex items-center gap-3">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                  <Label>Aktif</Label>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Garanti Bilgileri</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="warrantyStart">Garanti Başlangıç</Label>
                <Input id="warrantyStart" name="warrantyStart" type="date"
                  defaultValue={serialNumber?.warrantyStart
                    ? new Date(serialNumber.warrantyStart).toISOString().split("T")[0]
                    : today} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyEnd">Garanti Bitiş</Label>
                <Input id="warrantyEnd" name="warrantyEnd" type="date"
                  value={warrantyEnd} onChange={(e) => setWarrantyEnd(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Oluştur"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
      </div>
    </form>
  )
}
