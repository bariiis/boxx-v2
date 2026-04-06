import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ShoppingCart, HeadphonesIcon, ArrowRight } from "lucide-react"
import { getPortalDashboard } from "@/lib/actions/portal-actions"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const sym: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }
const qStatus: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "Taslak", variant: "secondary" }, SENT: { label: "Gönderildi", variant: "default" },
  VIEWED: { label: "Görüntülendi", variant: "outline" }, APPROVED: { label: "Onaylandı", variant: "default" },
  REJECTED: { label: "Reddedildi", variant: "destructive" }, REVISED: { label: "Revize", variant: "outline" },
}
const oStatus: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Beklemede", variant: "outline" }, PROCESSING: { label: "Hazırlanıyor", variant: "default" },
  SHIPPED: { label: "Kargoda", variant: "secondary" }, DELIVERED: { label: "Teslim Edildi", variant: "default" },
  CANCELLED: { label: "İptal", variant: "destructive" },
}

export default async function PortalDashboard() {
  const data = await getPortalDashboard()
  if (!data) return null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hoş Geldiniz</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/portal/teklifler">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-full bg-blue-100">
                <FileText className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.quotes}</p>
                <p className="text-sm text-muted-foreground">Tekliflerim</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/portal/siparisler">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100">
                <ShoppingCart className="size-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.orders}</p>
                <p className="text-sm text-muted-foreground">Siparişlerim</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/portal/destek">
          <Card className={`transition-shadow hover:shadow-md ${data.openTickets > 0 ? "border-orange-300" : ""}`}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-full bg-orange-100">
                <HeadphonesIcon className="size-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.openTickets}</p>
                <p className="text-sm text-muted-foreground">Açık Talepler</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Son Teklifler</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/teklifler">Tümü <ArrowRight className="ml-1 size-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentQuotes.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Henüz teklif yok</p>
            ) : (
              <div className="space-y-2">
                {data.recentQuotes.map((q) => {
                  const st = qStatus[q.status] || qStatus.DRAFT
                  return (
                    <Link key={q.id} href={`/quote/${q.publicToken}`} target="_blank"
                      className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{q.quoteNumber}</span>
                          <Badge variant={st.variant} className="text-[10px]">{st.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{q.projectName || format(q.createdAt, "dd MMM yyyy", { locale: tr })}</p>
                      </div>
                      <span className="text-sm font-semibold">{q.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} {sym[q.currency] || "$"}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Son Siparişler</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/siparisler">Tümü <ArrowRight className="ml-1 size-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentOrders.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Henüz sipariş yok</p>
            ) : (
              <div className="space-y-2">
                {data.recentOrders.map((o) => {
                  const st = oStatus[o.status] || oStatus.PENDING
                  const total = o.totalAmount + o.vatAmount
                  return (
                    <div key={o.id} className="flex items-center justify-between rounded-md p-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{o.orderNumber}</span>
                          <Badge variant={st.variant} className="text-[10px]">{st.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{format(o.createdAt, "dd MMM yyyy", { locale: tr })}</p>
                      </div>
                      <span className="text-sm font-semibold">{total.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} {sym[o.currency] || "$"}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
