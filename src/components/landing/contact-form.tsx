"use client"

import { useState } from "react"
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
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"
import { submitContactForm } from "@/lib/actions/contact-form-actions"
import { toast } from "sonner"

export interface ContactFormProps {
  headline?: string
  description?: string
  email?: string
  phone?: string
  address?: string
  categories?: string[]
  dark?: boolean
}

const defaultCategories = [
  "Teklif İste",
  "Genel Bilgi",
  "Teknik Destek",
  "İş Ortaklığı",
  "Kariyer",
  "Diğer",
]

export function ContactForm({
  headline = "İletişim",
  description = "Sorularınız ve teklif talepleriniz için bizimle iletişime geçin.",
  email,
  phone,
  address,
  categories,
  dark = false,
}: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState<string | null>(null)
  const cats = categories && categories.length > 0 ? categories : defaultCategories

  const bg = dark ? "bg-neutral-950" : "bg-white"
  const headingColor = dark ? "text-white" : "text-neutral-900"
  const mutedColor = dark ? "text-neutral-400" : "text-neutral-600"
  const cardBg = dark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"

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
      })
      if (result?.ticketNumber) {
        setSubmitted(result.ticketNumber)
        toast.success(`Mesajınız iletildi. Bilet no: ${result.ticketNumber}`)
      } else {
        toast.error("Bir hata oluştu, lütfen tekrar deneyin")
      }
    } catch {
      toast.error("Bir hata oluştu, lütfen tekrar deneyin")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className={`w-full py-24 ${bg}`}>
        <div className="mx-auto max-w-md px-4 text-center">
          <CheckCircle className="mx-auto size-16 text-green-500" />
          <h2 className={`mt-6 text-2xl font-bold ${headingColor}`}>Teşekkürler!</h2>
          <p className={`mt-3 ${mutedColor}`}>
            Mesajınızı aldık. En kısa sürede size dönüş yapacağız.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={`w-full py-16 md:py-24 ${bg}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${headingColor}`}>
            {headline}
          </h2>
          {description && <p className={`mt-3 ${mutedColor}`}>{description}</p>}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            {email && (
              <div className="flex gap-3">
                <Mail className={`size-5 mt-0.5 ${mutedColor}`} />
                <div>
                  <p className={`text-sm font-medium ${headingColor}`}>E-posta</p>
                  <p className={`text-sm ${mutedColor}`}>{email}</p>
                </div>
              </div>
            )}
            {phone && (
              <div className="flex gap-3">
                <Phone className={`size-5 mt-0.5 ${mutedColor}`} />
                <div>
                  <p className={`text-sm font-medium ${headingColor}`}>Telefon</p>
                  <p className={`text-sm ${mutedColor}`}>{phone}</p>
                </div>
              </div>
            )}
            {address && (
              <div className="flex gap-3">
                <MapPin className={`size-5 mt-0.5 ${mutedColor}`} />
                <div>
                  <p className={`text-sm font-medium ${headingColor}`}>Adres</p>
                  <p className={`text-sm ${mutedColor}`}>{address}</p>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className={`lg:col-span-2 space-y-4 rounded-2xl border p-6 md:p-8 ${cardBg}`}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad *</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Şirket</Label>
                <Input id="company" name="company" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select name="category" defaultValue={cats[0]}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cats.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Konu *</Label>
              <Input id="subject" name="subject" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mesaj *</Label>
              <Textarea id="message" name="message" rows={6} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              <Send className="mr-2 size-4" />
              {loading ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
