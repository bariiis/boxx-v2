"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const data = {
      name: fd.get("name") as string,
      surname: fd.get("surname") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || undefined,
      password: fd.get("password") as string,
      companyName: (fd.get("companyName") as string) || undefined,
    }

    const confirmPassword = fd.get("confirmPassword") as string
    if (data.password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor")
      setLoading(false)
      return
    }

    if (data.password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || "Kayıt başarısız")
        setLoading(false)
        return
      }

      // Auto login
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.success("Kayıt başarılı! Giriş yapabilirsiniz.")
        router.push("/login")
      } else {
        toast.success("Hoş geldiniz!")
        router.push("/portal")
        router.refresh()
      }
    } catch {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">STUUX</CardTitle>
          <CardDescription>Müşteri hesabı oluşturun</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Ad *</Label>
                <Input id="name" name="name" required placeholder="Ad" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Soyad *</Label>
                <Input id="surname" name="surname" required placeholder="Soyad" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta *</Label>
              <Input id="email" name="email" type="email" required placeholder="ornek@firma.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" type="tel" placeholder="05XX XXX XXXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Şirket Adı (opsiyonel)</Label>
              <Input id="companyName" name="companyName" placeholder="Şirket adınız" />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Şifre *</Label>
                <Input id="password" name="password" type="password" required minLength={6} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar *</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">Giriş Yap</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
