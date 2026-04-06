"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createEmployee, updateEmployee } from "@/lib/actions/employee-actions"
import { saveSmtpConfig, testSmtp, sendTestEmail } from "@/lib/actions/smtp-actions"
import { toast } from "sonner"
import { Check, Loader2, Mail, Send, Wifi } from "lucide-react"
import type { UserRole } from "@/generated/prisma"

interface Employee {
  id: string
  username: string | null
  name: string | null
  surname: string | null
  email: string
  phone: string | null
  role: UserRole
  isActive: boolean
}

interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  username: string
  password: string
  fromName: string | null
  fromEmail: string | null
}

interface EmployeeFormProps {
  employee?: Employee | null
  smtpConfig?: SmtpConfig | null
}

export function EmployeeForm({ employee, smtpConfig }: EmployeeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(employee?.isActive ?? true)
  const isEditing = !!employee

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      if (isEditing) {
        const password = formData.get("password") as string
        await updateEmployee(employee.id, {
          username: formData.get("username") as string,
          name: formData.get("name") as string,
          surname: formData.get("surname") as string,
          email: formData.get("email") as string,
          phone: (formData.get("phone") as string) || undefined,
          role: formData.get("role") as UserRole,
          isActive,
          ...(password && { password }),
        })
        toast.success("Çalışan güncellendi")
      } else {
        await createEmployee({
          username: formData.get("username") as string,
          name: formData.get("name") as string,
          surname: formData.get("surname") as string,
          email: formData.get("email") as string,
          phone: (formData.get("phone") as string) || undefined,
          password: formData.get("password") as string,
          role: formData.get("role") as UserRole,
        })
        toast.success("Çalışan oluşturuldu")
      }
      router.push("/admin/employees")
    } catch {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Hesap & Kişisel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Ad <span className="text-destructive">*</span></Label>
                <Input id="name" name="name" required defaultValue={employee?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Soyad <span className="text-destructive">*</span></Label>
                <Input id="surname" name="surname" required defaultValue={employee?.surname || ""} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı <span className="text-destructive">*</span></Label>
                <Input id="username" name="username" required defaultValue={employee?.username || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta <span className="text-destructive">*</span></Label>
                <Input id="email" name="email" type="email" required defaultValue={employee?.email || ""} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" defaultValue={employee?.phone || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre {isEditing && "(boş = değişmez)"}</Label>
                <Input id="password" name="password" type="password" required={!isEditing} minLength={6} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol <span className="text-destructive">*</span></Label>
                <Select name="role" defaultValue={employee?.role || "EMPLOYEE"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="EMPLOYEE">Çalışan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {isEditing && (
              <div className="flex items-center gap-3">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label>Aktif</Label>
              </div>
            )}
            <div className="pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Oluştur"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* SMTP - only for existing employees */}
      {isEditing && <EmployeeSmtpCard userId={employee.id} config={smtpConfig} employeeEmail={employee.email} />}
    </div>
  )
}

function EmployeeSmtpCard({ userId, config, employeeEmail }: { userId: string; config?: SmtpConfig | null; employeeEmail: string }) {
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    try {
      await saveSmtpConfig(userId, {
        host: fd.get("smtp_host") as string,
        port: parseInt(fd.get("smtp_port") as string) || 465,
        secure: fd.get("smtp_secure") === "on",
        username: fd.get("smtp_username") as string,
        password: fd.get("smtp_password") as string,
        fromName: (fd.get("smtp_fromName") as string) || undefined,
        fromEmail: (fd.get("smtp_fromEmail") as string) || undefined,
      })
      toast.success("SMTP ayarları kaydedildi")
    } catch { toast.error("Kayıt başarısız") }
    finally { setSaving(false) }
  }

  async function handleTest(form: HTMLFormElement) {
    const fd = new FormData(form)
    setTesting(true)
    try {
      const result = await testSmtp({
        host: fd.get("smtp_host") as string,
        port: parseInt(fd.get("smtp_port") as string) || 465,
        secure: fd.get("smtp_secure") === "on",
        username: fd.get("smtp_username") as string,
        password: fd.get("smtp_password") as string,
      })
      if (result.success) toast.success("SMTP bağlantısı başarılı!")
      else toast.error(`Bağlantı başarısız: ${result.error}`)
    } catch { toast.error("Test başarısız") }
    finally { setTesting(false) }
  }

  async function handleSendTest() {
    setSendingTest(true)
    try {
      const result = await sendTestEmail(userId, employeeEmail)
      if (result) toast.success(`Test maili ${employeeEmail} adresine gönderildi`)
      else toast.error("Gönderilemedi. Önce SMTP ayarlarını kaydedin.")
    } catch { toast.error("Gönderim başarısız") }
    finally { setSendingTest(false) }
  }

  return (
    <form onSubmit={handleSave} id={`smtp-form-${userId}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="size-5" />
            E-posta Ayarları (SMTP)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Bu çalışanın gönderdiği teklif, sipariş ve destek bildirimleri bu SMTP ayarları üzerinden gönderilir.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>SMTP Sunucu <span className="text-destructive">*</span></Label>
              <Input name="smtp_host" required defaultValue={config?.host || "smtp.yandex.com"} />
            </div>
            <div className="space-y-2">
              <Label>Port <span className="text-destructive">*</span></Label>
              <Input name="smtp_port" type="number" required defaultValue={config?.port || 465} />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input type="checkbox" name="smtp_secure" id={`ssl-${userId}`} defaultChecked={config?.secure ?? true} className="size-4" />
              <Label htmlFor={`ssl-${userId}`}>SSL/TLS</Label>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>E-posta (Kullanıcı Adı) <span className="text-destructive">*</span></Label>
              <Input name="smtp_username" required defaultValue={config?.username || employeeEmail} />
            </div>
            <div className="space-y-2">
              <Label>Şifre <span className="text-destructive">*</span></Label>
              <Input name="smtp_password" type="password" required defaultValue={config?.password || ""} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Gönderen Adı</Label>
              <Input name="smtp_fromName" defaultValue={config?.fromName || ""} placeholder="STUUX" />
            </div>
            <div className="space-y-2">
              <Label>Gönderen E-posta</Label>
              <Input name="smtp_fromEmail" type="email" defaultValue={config?.fromEmail || ""} placeholder={employeeEmail} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? <><Loader2 className="mr-1.5 size-3.5 animate-spin" />Kaydediliyor</> : <><Check className="mr-1.5 size-3.5" />Kaydet</>}
            </Button>
            <Button type="button" variant="outline" disabled={testing}
              onClick={() => handleTest(document.getElementById(`smtp-form-${userId}`) as HTMLFormElement)}>
              {testing ? <><Loader2 className="mr-1.5 size-3.5 animate-spin" />Test</> : <><Wifi className="mr-1.5 size-3.5" />Bağlantı Testi</>}
            </Button>
            <Button type="button" variant="outline" disabled={sendingTest} onClick={handleSendTest}>
              {sendingTest ? <><Loader2 className="mr-1.5 size-3.5 animate-spin" />Gönderiliyor</> : <><Send className="mr-1.5 size-3.5" />Test Maili</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
