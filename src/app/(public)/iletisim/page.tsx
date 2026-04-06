"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"
import { submitContactForm } from "@/lib/actions/contact-form-actions"
import { toast } from "sonner"

const categories = [
  "Teklif İste",
  "Genel Bilgi",
  "Teknik Destek",
  "İş Ortaklığı",
  "Kariyer",
  "Diğer",
]

export default function ContactPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productSlug = searchParams.get("urun") || undefined
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    try {
      const result = await submitContactForm({
        name: fd.get("name") as string,
        company: (fd.get("company") as string) || undefined,
        email: fd.get("email") as string,
        phone: (fd.get("phone") as string) || undefined,
        subject: fd.get("subject") as string,
        category: fd.get("category") as string,
        message: fd.get("message") as string,
        productSlug,
      })
      setSubmitted(result.ticketNumber)
    } catch {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div>
        <section className="bg-gradient-to-b from-background to-muted/30 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <CheckCircle className="mx-auto mb-4 size-16 text-green-500" />
            <h1 className="text-3xl font-bold">Mesajınız Alındı!</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              En kısa sürede size dönüş yapacağız.
            </p>
            <div className="mt-6 rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Takip numaranız:</p>
              <p className="mt-1 font-mono text-lg font-bold">{submitted}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Bu numara ile destek sayfasından talebinizi takip edebilirsiniz.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <Button variant="outline" onClick={() => setSubmitted(null)}>
                Yeni Mesaj Gönder
              </Button>
              <Button onClick={() => router.push("/")}>
                Ana Sayfaya Dön
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">İletişim</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Projeleriniz için doğru donanım çözümünü birlikte belirleyelim.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Bize Yazın</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad *</Label>
                    <Input id="name" name="name" required placeholder="Ad Soyad" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Şirket</Label>
                    <Input id="company" name="company" placeholder="Şirket adı" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta *</Label>
                    <Input id="email" name="email" type="email" required placeholder="ornek@firma.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="05XX XXX XXXX" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <select
                      id="category"
                      name="category"
                      required
                      defaultValue={productSlug ? "Teklif İste" : ""}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="" disabled>Seçin...</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Konu *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      placeholder="Konuyu kısaca özetleyin"
                      defaultValue={productSlug ? `${productSlug} hakkında teklif talebi` : ""}
                    />
                  </div>
                </div>

                {productSlug && (
                  <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                    <strong>İlgili Ürün:</strong> {productSlug}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">Mesaj *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="İhtiyacınızı detaylı olarak açıklayın. Kullanım amacı, bütçe aralığı, adet gibi bilgileri paylaşabilirsiniz."
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                  <Send className="mr-2 size-4" />
                  {loading ? "Gönderiliyor..." : "Gönder"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-4">
            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">E-posta</p>
                  <p className="text-sm text-muted-foreground">info@stuux.com</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Telefon</p>
                  <p className="text-sm text-muted-foreground">+90 212 XXX XX XX</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Adres</p>
                  <p className="text-sm text-muted-foreground">İstanbul, Türkiye</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-semibold">Çalışma Saatleri</p>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                  <p>Cumartesi: 10:00 - 14:00</p>
                  <p>Pazar: Kapalı</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
