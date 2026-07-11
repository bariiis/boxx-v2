"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveSmtpConfig, testSmtp, sendTestEmail } from "@/lib/actions/smtp-actions"
import { toast } from "sonner"
import { Check, Loader2, Mail, Send, Wifi } from "lucide-react"

interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  username: string
  password: string
  fromName: string | null
  fromEmail: string | null
}

export function SmtpForm({ userId, config }: { userId: string; config: SmtpConfig | null }) {
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)
  const [testEmail, setTestEmail] = useState("")

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)

    try {
      await saveSmtpConfig(userId, {
        host: fd.get("host") as string,
        port: parseInt(fd.get("port") as string) || 587,
        secure: fd.get("secure") === "on",
        username: fd.get("username") as string,
        password: fd.get("password") as string,
        fromName: (fd.get("fromName") as string) || undefined,
        fromEmail: (fd.get("fromEmail") as string) || undefined,
      })
      toast.success("SMTP ayarları kaydedildi")
    } catch {
      toast.error("Kayıt başarısız")
    } finally {
      setSaving(false)
    }
  }

  async function handleTest(form: HTMLFormElement) {
    const fd = new FormData(form)
    setTesting(true)

    try {
      const result = await testSmtp({
        host: fd.get("host") as string,
        port: parseInt(fd.get("port") as string) || 587,
        secure: fd.get("secure") === "on",
        username: fd.get("username") as string,
        password: fd.get("password") as string,
      })
      if (result.success) {
        toast.success("SMTP bağlantısı başarılı!")
      } else {
        toast.error(`Bağlantı başarısız: ${result.error}`)
      }
    } catch {
      toast.error("Test başarısız")
    } finally {
      setTesting(false)
    }
  }

  async function handleSendTest() {
    if (!testEmail) return
    setSendingTest(true)
    try {
      const result = await sendTestEmail(userId, testEmail)
      if (result) {
        toast.success(`Test e-postası ${testEmail} adresine gönderildi`)
      } else {
        toast.error("E-posta gönderilemedi. SMTP ayarlarını kontrol edin.")
      }
    } catch {
      toast.error("Gönderim başarısız")
    } finally {
      setSendingTest(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={handleSave} id="smtp-form">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="size-5" />
              SMTP Sunucu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="host">SMTP Sunucu *</Label>
                <Input id="host" name="host" required defaultValue={config?.host || "smtp.yandex.com"} placeholder="smtp.yandex.com" />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="port">Port *</Label>
                  <Input id="port" name="port" type="number" required defaultValue={config?.port || 465} />
                </div>
                <div className="flex items-end gap-2 pb-1">
                  <Switch id="secure" name="secure" defaultChecked={config?.secure ?? true} />
                  <Label htmlFor="secure">SSL/TLS</Label>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı *</Label>
                <Input id="username" name="username" required defaultValue={config?.username || ""} placeholder="info@stuux.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre *</Label>
                <Input id="password" name="password" type="password" required defaultValue={config?.password || ""} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fromName">Gönderen Adı</Label>
                <Input id="fromName" name="fromName" defaultValue={config?.fromName || ""} placeholder="STUUX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">Gönderen E-posta</Label>
                <Input id="fromEmail" name="fromEmail" type="email" defaultValue={config?.fromEmail || ""} placeholder="noreply@stuux.com" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? <><Loader2 className="mr-2 size-4 animate-spin" />Kaydediliyor...</> : <><Check className="mr-2 size-4" />Kaydet</>}
              </Button>
              <Button type="button" variant="outline" disabled={testing}
                onClick={() => { const form = document.getElementById("smtp-form") as HTMLFormElement; handleTest(form) }}>
                {testing ? <><Loader2 className="mr-2 size-4 animate-spin" />Test Ediliyor...</> : <><Wifi className="mr-2 size-4" />Bağlantı Testi</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="size-5" />
            Test E-postası Gönder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            SMTP ayarlarınızı kaydettikten sonra test e-postası göndererek doğrulayın.
          </p>
          <div className="space-y-2">
            <Label>Alıcı E-posta</Label>
            <Input
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              type="email"
              placeholder="test@domain.com"
            />
          </div>
          <Button onClick={handleSendTest} disabled={sendingTest || !testEmail} className="w-full">
            {sendingTest ? <><Loader2 className="mr-2 size-4 animate-spin" />Gönderiliyor...</> : <><Send className="mr-2 size-4" />Test Maili Gönder</>}
          </Button>
          <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Yandex Kurumsal (varsayılan):</strong> smtp.yandex.com, Port: 465, SSL açık</p>
            <p><strong>Gmail:</strong> smtp.gmail.com, Port: 587, SSL kapalı (Uygulama Şifresi gerekir)</p>
            <p><strong>Outlook:</strong> smtp.office365.com, Port: 587</p>
            <p>Kullanıcı adı olarak tam e-posta adresinizi girin.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
