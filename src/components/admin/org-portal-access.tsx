"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import { KeyRound, UserPlus, Copy } from "lucide-react"
import { createCustomerUser, resetCustomerPassword } from "@/lib/actions/customer-user-actions"
import { toast } from "sonner"

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string | null
}

interface PortalUser {
  id: string
  name: string | null
  surname: string | null
  email: string
  isActive: boolean
}

export function PortalAccessButton({ contact, organizationId, existingUser }: {
  contact: Contact
  organizationId: string
  existingUser?: PortalUser | null
}) {
  if (!contact.email) {
    return <span className="text-xs text-muted-foreground">E-posta yok</span>
  }

  if (existingUser) {
    return <ResetPasswordDialog email={existingUser.email} />
  }

  return <CreateUserDialog contact={contact} organizationId={organizationId} />
}

function CreateUserDialog({ contact, organizationId }: { contact: Contact; organizationId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)

  function generatePassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    let pw = ""
    for (let i = 0; i < 10; i++) pw += chars[Math.floor(Math.random() * chars.length)]
    setPassword(pw)
  }

  async function handleCreate() {
    if (!password || password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı")
      return
    }
    setLoading(true)
    try {
      await createCustomerUser({ contactId: contact.id, organizationId, password })
      setCreated(true)
      toast.success("Portal erişimi oluşturuldu")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setCreated(false); setPassword("") } }}>
      <DialogTrigger render={
        <Button variant="outline" size="sm" className="h-7 text-xs">
          <UserPlus className="mr-1 size-3" />
          Portal Erişimi Ver
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Portal Erişimi Oluştur</DialogTitle>
          <DialogDescription>
            {contact.firstName} {contact.lastName} için müşteri portalı erişimi oluşturun.
          </DialogDescription>
        </DialogHeader>

        {created ? (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950/30">
              <p className="text-sm font-medium text-green-700">Portal erişimi oluşturuldu!</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm"><strong>E-posta:</strong> {contact.email}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm"><strong>Şifre:</strong> {password}</p>
                <Button variant="ghost" size="icon" className="size-6" onClick={() => {
                  navigator.clipboard.writeText(password)
                  toast.success("Şifre kopyalandı")
                }}>
                  <Copy className="size-3" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Bu bilgileri müşteriye güvenli bir şekilde iletin.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <p><strong>Kişi:</strong> {contact.firstName} {contact.lastName}</p>
              <p><strong>E-posta:</strong> {contact.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Şifre</Label>
              <div className="flex gap-2">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  type="text"
                />
                <Button type="button" variant="outline" onClick={generatePassword}>
                  Oluştur
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {created ? (
            <Button onClick={() => setOpen(false)}>Kapat</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
              <Button onClick={handleCreate} disabled={loading || !password}>
                {loading ? "Oluşturuluyor..." : "Erişim Oluştur"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ResetPasswordDialog({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function generatePassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    let pw = ""
    for (let i = 0; i < 10; i++) pw += chars[Math.floor(Math.random() * chars.length)]
    setPassword(pw)
  }

  async function handleReset() {
    if (!password || password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı")
      return
    }
    setLoading(true)
    try {
      await resetCustomerPassword(email, password)
      setDone(true)
      toast.success("Şifre sıfırlandı")
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setDone(false); setPassword("") } }}>
      <DialogTrigger render={
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">Portal Aktif</Badge>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            <KeyRound className="mr-1 size-3" />
            Şifre Sıfırla
          </Button>
        </div>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Şifre Sıfırla</DialogTitle>
          <DialogDescription>{email} için yeni şifre belirleyin.</DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950/30">
              <p className="text-sm font-medium text-green-700">Şifre sıfırlandı!</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm"><strong>Yeni Şifre:</strong> {password}</p>
              <Button variant="ghost" size="icon" className="size-6" onClick={() => {
                navigator.clipboard.writeText(password)
                toast.success("Kopyalandı")
              }}>
                <Copy className="size-3" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Yeni Şifre</Label>
            <div className="flex gap-2">
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="text" placeholder="En az 6 karakter" />
              <Button type="button" variant="outline" onClick={generatePassword}>Oluştur</Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {done ? (
            <Button onClick={() => setOpen(false)}>Kapat</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
              <Button onClick={handleReset} disabled={loading || !password}>
                {loading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
