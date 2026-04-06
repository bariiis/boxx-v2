import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2, Users, FileText, HeadphonesIcon, ShoppingCart, Package,
  TrendingUp, TrendingDown, Hash, AlertTriangle, ArrowRight,
} from "lucide-react"
import { getDashboardStats } from "@/lib/actions/dashboard-actions"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { quoteStatusConfig, orderStatusConfig, ticketPriorityConfig, StatusBadge } from "@/lib/status-colors"

const currencySymbols: Record<string, string> = {
  TRY: "₺", USD: "$", EUR: "€", GBP: "£",
}

const priorityColors: Record<string, string> = {
  LOW: "text-muted-foreground",
  NORMAL: "text-blue-600",
  HIGH: "text-orange-600",
  URGENT: "text-red-600",
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Top stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Gelir (Bu Ay)"
          value={`$${stats.revenueThisMonth.toLocaleString("tr-TR", { minimumFractionDigits: 0 })}`}
          subtitle={stats.revenueChange !== 0 ? `${stats.revenueChange > 0 ? "+" : ""}${stats.revenueChange.toFixed(0)}% geçen aya göre` : ""}
          icon={stats.revenueChange >= 0 ? TrendingUp : TrendingDown}
          trend={stats.revenueChange >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Teklifler (Bu Ay)"
          value={String(stats.quotesThisMonth)}
          subtitle={`${stats.pendingQuotes} beklemede · ${stats.approvedQuotes} onaylı`}
          icon={FileText}
        />
        <StatCard
          title="Siparişler"
          value={String(stats.totalOrders)}
          subtitle={`${stats.ordersThisMonth} bu ay · ${stats.pendingOrders} beklemede`}
          icon={ShoppingCart}
        />
        <StatCard
          title="Açık Destek Talepleri"
          value={String(stats.openTickets)}
          subtitle={`${stats.totalTickets} toplam talep`}
          icon={HeadphonesIcon}
          alert={stats.openTickets > 0}
        />
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat icon={Building2} label="Organizasyonlar" value={stats.totalOrganizations} href="/admin/organizations" />
        <MiniStat icon={Users} label="Kişiler" value={stats.totalContacts} href="/admin/contacts" />
        <MiniStat icon={Package} label="Aktif Ürünler" value={stats.totalProducts} href="/admin/products" />
        <MiniStat icon={Hash} label="Seri Numaraları" value={stats.totalSerialNumbers} href="/admin/serial-numbers"
          alert={stats.expiringWarranties > 0 ? `${stats.expiringWarranties} garanti dolacak` : undefined} />
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Quotes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Son Teklifler</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/quotes">Tümü <ArrowRight className="ml-1 size-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentQuotes.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Henüz teklif yok</p>
            ) : (
              <div className="space-y-3">
                {stats.recentQuotes.map((q) => {
                  const _qs = q.status
                  const sym = currencySymbols[q.currency] || "$"
                  return (
                    <Link key={q.id} href={`/admin/quotes/${q.id}`} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{q.quoteNumber}</span>
                          <StatusBadge config={quoteStatusConfig} status={q.status} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {q.organization?.name || "—"} · {format(q.createdAt, "dd MMM", { locale: tr })}
                        </p>
                      </div>
                      <span className="text-sm font-semibold shrink-0 ml-2">
                        {q.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} {sym}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Son Siparişler</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">Tümü <ArrowRight className="ml-1 size-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Henüz sipariş yok</p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((o) => {
                  const _os = o.status
                  const sym = currencySymbols[o.currency] || "$"
                  const total = o.totalAmount + o.vatAmount
                  return (
                    <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{o.orderNumber}</span>
                          <StatusBadge config={orderStatusConfig} status={o.status} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {o.organization?.name || "—"} · {format(o.createdAt, "dd MMM", { locale: tr })}
                        </p>
                      </div>
                      <span className="text-sm font-semibold shrink-0 ml-2">
                        {total.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} {sym}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Open Tickets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Açık Destek Talepleri</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/tickets">Tümü <ArrowRight className="ml-1 size-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentTickets.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Açık talep yok</p>
            ) : (
              <div className="space-y-3">
                {stats.recentTickets.map((t) => (
                  <Link key={t.id} href={`/admin/tickets/${t.id}`} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{t.ticketNumber}</span>
                        <span className={`text-[10px] font-bold ${priorityColors[t.priority] || ""}`}>
                          {t.priority === "URGENT" ? "ACİL" : t.priority === "HIGH" ? "YÜKSEK" : ""}
                        </span>
                      </div>
                      <p className="text-sm truncate">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.contactName || t.organization?.name || "—"} · {format(t.createdAt, "dd MMM", { locale: tr })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon: Icon, trend, alert }: {
  title: string; value: string; subtitle: string; icon: typeof TrendingUp; trend?: "up" | "down"; alert?: boolean
}) {
  return (
    <Card className={alert ? "border-orange-300" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`size-4 ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-500" : "text-muted-foreground"} ${alert ? "text-orange-500" : ""}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className={`text-xs ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-500" : "text-muted-foreground"}`}>
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function MiniStat({ icon: Icon, label, value, href, alert }: {
  icon: typeof Building2; label: string; value: number; href: string; alert?: string
}) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            {alert && (
              <p className="flex items-center gap-1 text-[10px] text-orange-600 mt-0.5">
                <AlertTriangle className="size-3" /> {alert}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
