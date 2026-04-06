"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeadphonesIcon, Search, Send, MessageSquare, Package, Shield, CheckCircle, XCircle, Upload, X, FileIcon, Loader2 } from "lucide-react"
import { createPublicTicket, lookupTicket, lookupSerialNumber } from "@/lib/actions/public-ticket-actions"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
}

export function SupportPageClient({ categories }: { categories: Category[] }) {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <HeadphonesIcon className="mx-auto mb-4 size-12 text-primary" />
          <h1 className="text-3xl font-bold sm:text-4xl">Teknik Destek</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Yeni bir destek talebi oluşturun veya mevcut talebinizi takip numaranız ile sorgulayın.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Tabs defaultValue="new">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new">
              <Send className="mr-2 size-4" />
              Yeni Talep
            </TabsTrigger>
            <TabsTrigger value="track">
              <Search className="mr-2 size-4" />
              Talep Takip
            </TabsTrigger>
            <TabsTrigger value="serial">
              <Package className="mr-2 size-4" />
              Seri No Sorgula
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-6">
            <NewTicketForm categories={categories} />
          </TabsContent>

          <TabsContent value="track" className="mt-6">
            <TrackTicketForm />
          </TabsContent>

          <TabsContent value="serial" className="mt-6">
            <SerialNumberLookup />
          </TabsContent>
        </Tabs>
      </section>

      {/* Info cards */}
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="mx-auto mb-3 size-8 text-primary" />
              <h3 className="font-semibold">Hızlı Yanıt</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                İş günlerinde 24 saat içinde yanıt
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <HeadphonesIcon className="mx-auto mb-3 size-8 text-primary" />
              <h3 className="font-semibold">Uzman Destek</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Donanım uzmanlarından doğrudan destek
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="mx-auto mb-3 size-8 text-primary" />
              <h3 className="font-semibold">Seri No Takip</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Seri numaranız ile garanti durumunu sorgulayın
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

interface UploadedFile {
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
}

function NewTicketForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)

  async function handleFileUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setUploading(true)

    for (const file of Array.from(fileList)) {
      if (file.size > 25 * 1024 * 1024) {
        toast.error(`${file.name}: 25MB'dan büyük dosyalar yüklenemez`)
        continue
      }

      try {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/upload/ticket-attachment", {
          method: "POST",
          body: formData,
        })
        if (!res.ok) {
          const err = await res.json()
          toast.error(err.error || `${file.name} yüklenemedi`)
          continue
        }
        const data = await res.json()
        setFiles((prev) => [...prev, data])
      } catch {
        toast.error(`${file.name} yüklenirken hata oluştu`)
      }
    }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    try {
      const result = await createPublicTicket({
        subject: fd.get("subject") as string,
        description: fd.get("description") as string,
        contactName: fd.get("contactName") as string,
        contactEmail: fd.get("contactEmail") as string,
        categoryId: (fd.get("categoryId") as string) || undefined,
        serialNumber: (fd.get("serialNumber") as string) || undefined,
        attachments: files.length > 0 ? files : undefined,
      })
      toast.success(`Talep oluşturuldu: ${result.ticketNumber}`)
      router.push(`/destek/${result.publicToken}`)
    } catch {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Destek Talebi Oluştur</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactName">Adınız Soyadınız *</Label>
              <Input id="contactName" name="contactName" required placeholder="Ad Soyad" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">E-posta *</Label>
              <Input id="contactEmail" name="contactEmail" type="email" required placeholder="ornek@firma.com" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Kategori</Label>
              <select
                id="categoryId"
                name="categoryId"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Seçin...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Seri Numarası (opsiyonel)</Label>
              <Input id="serialNumber" name="serialNumber" placeholder="SN-XXXX-XXXX" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Konu *</Label>
            <Input id="subject" name="subject" required placeholder="Sorununuzu kısaca özetleyin" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama *</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={6}
              placeholder="Sorununuzu detaylı olarak açıklayın. Hata mesajları, adımlar ve ortam bilgisini paylaşın."
            />
          </div>

          {/* File attachments */}
          <div className="space-y-2">
            <Label>Ekler (opsiyonel)</Label>
            <div
              className="relative flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors hover:border-primary/50"
              onClick={() => document.getElementById("ticket-files")?.click()}
            >
              {uploading ? (
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="size-6 text-muted-foreground" />
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {uploading ? "Yükleniyor..." : "Ekran görüntüsü, video veya dosya ekleyin"}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, MP4, PDF, ZIP — Maks. 25MB
              </p>
              <input
                id="ticket-files"
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.zip"
                className="hidden"
                onChange={(e) => {
                  handleFileUpload(e.target.files)
                  e.target.value = ""
                }}
              />
            </div>
            {files.length > 0 && (
              <div className="space-y-1">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {f.mimeType.startsWith("image/") ? (
                        <img src={f.fileUrl} alt="" className="size-8 rounded object-cover" />
                      ) : (
                        <FileIcon className="size-4 text-muted-foreground" />
                      )}
                      <span className="text-sm truncate">{f.fileName}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {(f.fileSize / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFiles((prev) => prev.filter((_, j) => j !== i)) }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading || uploading}>
            <Send className="mr-2 size-4" />
            {loading ? "Gönderiliyor..." : "Talep Oluştur"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function TrackTicketForm() {
  const router = useRouter()
  const [ticketNumber, setTicketNumber] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ticketNumber.trim()) return
    setLoading(true)

    try {
      const token = await lookupTicket(ticketNumber)
      if (token) {
        router.push(`/destek/${token}`)
      } else {
        toast.error("Talep bulunamadı. Talep numaranızı kontrol edin.")
      }
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Talep Takip</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticketNumber">Talep Numarası</Label>
            <Input
              id="ticketNumber"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="TKT-2026-0001"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Talep oluşturulduğunda size verilen numarayı girin.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading || !ticketNumber.trim()}>
            <Search className="mr-2 size-4" />
            {loading ? "Aranıyor..." : "Talep Sorgula"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

interface SerialResult {
  serialNumber: string
  isActive: boolean
  warrantyStart: Date
  warrantyEnd: Date | null
  configuration: string | null
  product: {
    name: string
    sku: string
    slug: string
    heroImage: string | null
    warrantyMonths: number
    category: { name: string } | null
  } | null
  organization: { name: string } | null
  contact: { firstName: string; lastName: string } | null
}

function SerialNumberLookup() {
  const [serial, setSerial] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SerialResult | null>(null)
  const [searched, setSearched] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!serial.trim()) return
    setLoading(true)
    setSearched(false)

    try {
      const data = await lookupSerialNumber(serial)
      setResult(data)
      setSearched(true)
      if (!data) toast.error("Seri numarası bulunamadı")
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const warrantyActive = result?.warrantyEnd ? new Date(result.warrantyEnd) > new Date() : false

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Seri Numarası Sorgula</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serial">Seri Numarası</Label>
              <Input
                id="serial"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="Ürününüzün seri numarasını girin"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Seri numaranızı ürün etiketinde veya faturanızda bulabilirsiniz.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading || !serial.trim()}>
              <Search className="mr-2 size-4" />
              {loading ? "Aranıyor..." : "Sorgula"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Result */}
      {searched && result && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            {/* Product info */}
            {result.product && (
              <div className="flex items-start gap-4">
                {result.product.heroImage ? (
                  <img
                    src={result.product.heroImage}
                    alt={result.product.name}
                    className="size-20 rounded-lg object-cover bg-muted"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-lg bg-muted">
                    <Package className="size-8 text-muted-foreground/30" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">{result.product.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {result.product.sku}</p>
                  {result.product.category && (
                    <p className="text-sm text-muted-foreground">{result.product.category.name}</p>
                  )}
                </div>
              </div>
            )}

            {/* Serial & warranty */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Seri Numarası</p>
                <p className="font-mono font-semibold">{result.serialNumber}</p>
                <div className="mt-1">
                  {result.isActive ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="size-3" /> Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-red-600">
                      <XCircle className="size-3" /> Pasif
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Garanti Durumu</p>
                {warrantyActive ? (
                  <div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                      <Shield className="size-4" /> Garanti Kapsamında
                    </span>
                    {result.warrantyEnd && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Bitiş: {new Date(result.warrantyEnd).toLocaleDateString("tr-TR")}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600">
                      <XCircle className="size-4" /> Garanti Süresi Dolmuş
                    </span>
                    {result.warrantyEnd && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Bitiş: {new Date(result.warrantyEnd).toLocaleDateString("tr-TR")}
                      </p>
                    )}
                  </div>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Başlangıç: {new Date(result.warrantyStart).toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>

            {/* Owner info */}
            {(result.organization || result.contact) && (
              <div className="rounded-lg border p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Kayıtlı Sahip</p>
                {result.organization && <p className="text-sm font-medium">{result.organization.name}</p>}
                {result.contact && <p className="text-sm text-muted-foreground">{result.contact.firstName} {result.contact.lastName}</p>}
              </div>
            )}

            {/* Configuration */}
            {result.configuration && (
              <div className="rounded-lg border p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Konfigürasyon</p>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{result.configuration}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {result.product && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`/urunler/${result.product.slug}`}>Ürün Sayfası</a>
                </Button>
              )}
              <Button size="sm" asChild>
                <a href={`/destek?tab=new&sn=${result.serialNumber}`}>
                  <Send className="mr-1.5 size-3.5" />
                  Destek Talebi Oluştur
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {searched && !result && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <XCircle className="mx-auto mb-2 size-8 opacity-50" />
            <p>Seri numarası bulunamadı. Numarayı kontrol edip tekrar deneyin.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
