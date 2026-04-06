"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, MapPin, Star } from "lucide-react"
import {
  createShippingAddress, updateShippingAddress, deleteShippingAddress,
} from "@/lib/actions/shipping-address-actions"
import { toast } from "sonner"

interface Address {
  id: string
  label: string
  contactName: string | null
  phone: string | null
  address: string
  district: string | null
  city: string
  postalCode: string | null
  country: string
  isDefault: boolean
}

export function ShippingAddressManager({ organizationId, addresses }: { organizationId: string; addresses: Address[] }) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddressDialog
          organizationId={organizationId}
          onSaved={() => router.refresh()}
        />
      </div>

      {addresses.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          Henüz sevkiyat adresi eklenmemiş.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr.id} className={addr.isDefault ? "border-primary" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{addr.label}</p>
                        {addr.isDefault && (
                          <Badge className="bg-primary/10 text-primary text-[10px]">
                            <Star className="mr-0.5 size-2.5" /> Varsayılan
                          </Badge>
                        )}
                      </div>
                      {addr.contactName && <p className="text-sm">{addr.contactName}</p>}
                      {addr.phone && <p className="text-sm text-muted-foreground">{addr.phone}</p>}
                      <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{addr.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {[addr.district, addr.city, addr.postalCode].filter(Boolean).join(", ")}
                        {addr.country !== "Türkiye" && ` — ${addr.country}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <AddressDialog
                      organizationId={organizationId}
                      address={addr}
                      onSaved={() => router.refresh()}
                    />
                    <DeleteAddressBtn id={addr.id} label={addr.label} onDeleted={() => router.refresh()} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function AddressDialog({ organizationId, address, onSaved }: {
  organizationId: string; address?: Address; onSaved: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const isEdit = !!address

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    const data = {
      label: fd.get("label") as string,
      contactName: (fd.get("contactName") as string) || undefined,
      phone: (fd.get("phone") as string) || undefined,
      address: fd.get("address") as string,
      district: (fd.get("district") as string) || undefined,
      city: fd.get("city") as string,
      postalCode: (fd.get("postalCode") as string) || undefined,
      country: (fd.get("country") as string) || "Türkiye",
      isDefault: fd.get("isDefault") === "on",
    }

    try {
      if (isEdit) {
        await updateShippingAddress(address.id, data)
        toast.success("Adres güncellendi")
      } else {
        await createShippingAddress({ ...data, organizationId })
        toast.success("Adres eklendi")
      }
      setOpen(false)
      onSaved()
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        isEdit
          ? <Button variant="ghost" size="icon" className="size-7"><Pencil className="size-3.5" /></Button>
          : <Button><Plus className="mr-2 size-4" />Adres Ekle</Button>
      } />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Adresi Düzenle" : "Yeni Sevkiyat Adresi"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Adres Etiketi *</Label>
            <Input name="label" required defaultValue={address?.label || ""} placeholder="ör: Merkez Ofis, Fabrika, Depo" />
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label>Teslim Alacak Kişi</Label>
              <Input name="contactName" defaultValue={address?.contactName || ""} placeholder="Ad Soyad" />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input name="phone" defaultValue={address?.phone || ""} placeholder="05XX XXX XXXX" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Adres *</Label>
            <Textarea name="address" required rows={3} defaultValue={address?.address || ""} placeholder="Sokak, cadde, bina no, kat..." />
          </div>
          <div className="grid gap-4 grid-cols-3">
            <div className="space-y-2">
              <Label>İlçe</Label>
              <Input name="district" defaultValue={address?.district || ""} />
            </div>
            <div className="space-y-2">
              <Label>Şehir *</Label>
              <Input name="city" required defaultValue={address?.city || ""} />
            </div>
            <div className="space-y-2">
              <Label>Posta Kodu</Label>
              <Input name="postalCode" defaultValue={address?.postalCode || ""} />
            </div>
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label>Ülke</Label>
              <Input name="country" defaultValue={address?.country || "Türkiye"} />
            </div>
            <div className="flex items-end gap-3 pb-1">
              <input type="checkbox" name="isDefault" id="isDefault" defaultChecked={address?.isDefault || false} className="size-4" />
              <Label htmlFor="isDefault">Varsayılan adres</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>İptal</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteAddressBtn({ id, label, onDeleted }: { id: string; label: string; onDeleted: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="ghost" size="icon" className="size-7 text-destructive">
          <Trash2 className="size-3.5" />
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adresi Sil</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          <strong>{label}</strong> adresini silmek istediğinize emin misiniz?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
          <Button variant="destructive" disabled={loading} onClick={async () => {
            setLoading(true)
            await deleteShippingAddress(id)
            toast.success("Adres silindi")
            setOpen(false)
            onDeleted()
          }}>
            {loading ? "Siliniyor..." : "Sil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
