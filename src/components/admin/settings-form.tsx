"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { updateSettings } from "@/lib/actions/settings-actions"
import { LogoUpload } from "@/components/admin/logo-upload"
import { toast } from "sonner"

interface SettingsFormProps {
  settings: Record<string, string>
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    fd.forEach((value, key) => {
      data[key] = value as string
    })

    try {
      await updateSettings(data)
      toast.success("Ayarlar kaydedildi")
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Genel</CardTitle>
            <CardDescription>Şirket bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Şirket Adı</Label>
              <Input id="company_name" name="company_name" defaultValue={settings.company_name || "STUUX"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_email">Şirket E-posta</Label>
              <Input id="company_email" name="company_email" type="email" defaultValue={settings.company_email || ""} />
            </div>
            <LogoUpload currentLogo={settings.company_logo} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Döviz Kuru</CardTitle>
            <CardDescription>Otomatik kur kaynağı seçimi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exchange_rate_source">Kur Kaynağı</Label>
              <Select name="exchange_rate_source" defaultValue={settings.exchange_rate_source || "TCMB"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TCMB">TCMB (Merkez Bankası)</SelectItem>
                  <SelectItem value="GARANTI">Garanti Bankası</SelectItem>
                  <SelectItem value="HALKBANK">Halk Bankası</SelectItem>
                  <SelectItem value="MANUAL">Manuel (Kendiniz girin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_currency">Varsayılan Para Birimi</Label>
              <Select name="default_currency" defaultValue={settings.default_currency || "USD"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRY">₺ TRY</SelectItem>
                  <SelectItem value="USD">$ USD</SelectItem>
                  <SelectItem value="EUR">€ EUR</SelectItem>
                  <SelectItem value="GBP">£ GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teklif Ayarları</CardTitle>
            <CardDescription>Varsayılan teklif parametreleri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default_quote_days">Varsayılan Geçerlilik (Gün)</Label>
              <Input id="default_quote_days" name="default_quote_days" type="number"
                defaultValue={settings.default_quote_days || "10"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_vat_rate">Varsayılan KDV Oranı (%)</Label>
              <Select name="default_vat_rate" defaultValue={settings.default_vat_rate || "20"}>
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
              <Label htmlFor="vat_rates">KDV Oranları (JSON)</Label>
              <Input id="vat_rates" name="vat_rates" defaultValue={settings.vat_rates || "[0, 1, 10, 20]"} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Varsayılan Notlar</CardTitle>
            <CardDescription>Her teklifin altında görünecek not</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="default_quote_notes"
              rows={6}
              defaultValue={settings.default_quote_notes || "Bu teklif belirtilen tarihler arasında geçerlidir."}
            />
          </CardContent>
        </Card>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
      </Button>
    </form>
  )
}
