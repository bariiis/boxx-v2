import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getQuote } from "@/lib/actions/quote-actions"
import { getSettings } from "@/lib/actions/settings-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { quoteStatusConfig, StatusBadge } from "@/lib/status-colors"
import { QuoteForm } from "@/components/admin/quote-form"
import { QuoteItems } from "@/components/admin/quote-items"
import { QuoteActions } from "@/components/admin/quote-actions"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const currencySymbols: Record<string, string> = {
  TRY: "₺", USD: "$", EUR: "€", GBP: "£",
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { id } = await params
  const [quote, settings] = await Promise.all([
    getQuote(id),
    getSettings("quote"),
  ])
  if (!quote) notFound()

  const sym = currencySymbols[quote.currency] || "$"
  const subtotal = quote.totalAmount
  const vatAmount = subtotal * (quote.vatRate / 100)
  const grandTotal = subtotal + vatAmount

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-mono">{quote.quoteNumber}</h1>
            <StatusBadge config={quoteStatusConfig} status={quote.status} />
          </div>
          <p className="text-muted-foreground">
            {quote.organization?.name}
            {quote.contact && ` — ${quote.contact.firstName} ${quote.contact.lastName}`}
            {" | "}
            {format(quote.createdAt, "dd MMMM yyyy", { locale: tr })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Toplam</p>
          <p className="text-2xl font-bold">
            {grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
          </p>
          <p className="text-xs text-muted-foreground">
            (KDV %{quote.vatRate}: {vatAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym})
          </p>
        </div>
      </div>

      <QuoteActions quote={quote} userId={session.user.id} />

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Teklif Kalemleri ({quote.items.length})</TabsTrigger>
          <TabsTrigger value="details">Teklif Bilgileri</TabsTrigger>
          <TabsTrigger value="versions">Versiyon Geçmişi ({quote.versions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-6">
          <QuoteItems quote={quote} />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <QuoteForm userId={session.user.id} quote={quote} defaults={settings} />
        </TabsContent>

        <TabsContent value="versions" className="mt-6">
          {quote.versions.length === 0 ? (
            <div className="rounded-md border p-12 text-center text-muted-foreground">
              Henüz versiyon geçmişi yok. Teklif gönderildiğinde veya revize edildiğinde otomatik kaydedilir.
            </div>
          ) : (
            <div className="space-y-4">
              {quote.versions.map((v) => {
                const snap = v.snapshot as {
                  currency?: string; totalAmount?: number; vatRate?: number
                  items?: { name: string; quantity: number; unitPrice: number; isConfig: boolean; configItems?: { name: string; unitPrice: number; isSelected: boolean }[] }[]
                } | null

                return (
                  <div key={v.id} className="rounded-md border">
                    <div className="flex items-center justify-between bg-muted/30 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">v{v.version}</Badge>
                        <span className="text-sm font-medium">Versiyon {v.version}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {snap?.totalAmount != null && (
                          <span className="font-medium text-foreground">
                            {snap.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {(currencySymbols as Record<string,string>)[snap.currency || "USD"] || "$"}
                          </span>
                        )}
                        <span>{format(v.createdAt, "dd MMM yyyy HH:mm", { locale: tr })}</span>
                      </div>
                    </div>
                    {snap?.items && (
                      <div className="px-4 py-3">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-muted-foreground">
                              <th className="pb-2 text-left font-medium">Ürün</th>
                              <th className="pb-2 text-center font-medium w-16">Adet</th>
                              <th className="pb-2 text-right font-medium w-32">Birim Fiyat</th>
                            </tr>
                          </thead>
                          <tbody>
                            {snap.items.map((item, i) => (
                              <tr key={i} className="border-b last:border-0">
                                <td className="py-2">
                                  <p className="font-medium">{item.name}</p>
                                  {item.isConfig && item.configItems && (
                                    <div className="mt-1 space-y-0.5 pl-4">
                                      {item.configItems.filter(ci => ci.isSelected).map((ci, j) => (
                                        <p key={j} className="text-xs text-muted-foreground">
                                          {ci.name} — {ci.unitPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2 text-center">{item.quantity}</td>
                                <td className="py-2 text-right">{item.unitPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
