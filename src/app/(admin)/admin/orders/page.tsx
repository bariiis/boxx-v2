import Link from "next/link"
import { getOrders } from "@/lib/actions/order-actions"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { ShoppingCart } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { orderStatusConfig, StatusBadge } from "@/lib/status-colors"

const currencySymbols: Record<string, string> = {
  TRY: "₺", USD: "$", EUR: "€", GBP: "£",
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const status = params.status as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | undefined

  const { orders, total, totalPages } = await getOrders({ page, status })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Siparişler</h1>
        <p className="text-muted-foreground">{total} sipariş</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: "Tümü", value: undefined, class: "" },
          ...Object.entries(orderStatusConfig).map(([k, v]) => ({ label: v.label, value: k, class: v.class })),
        ].map((f) => {
          const isActive = status === f.value
          return (
            <Link
              key={f.label}
              href={`/admin/orders${f.value ? `?status=${f.value}` : ""}`}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                isActive && f.class ? f.class + " ring-2 ring-offset-1 ring-current" :
                isActive ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </Link>
          )
        })}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Teklif</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Kalem</TableHead>
              <TableHead className="text-right">Toplam</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  <ShoppingCart className="mx-auto mb-2 size-8 opacity-50" />
                  Henüz sipariş yok
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const st = orderStatusConfig[order.status] || orderStatusConfig.PENDING
                const sym = currencySymbols[order.currency] || "$"
                const grandTotal = order.totalAmount + order.vatAmount
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`} className="font-mono font-medium hover:underline">
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {order.quote ? (
                        <Link href={`/admin/quotes/${order.quoteId}`} className="text-sm text-muted-foreground hover:underline">
                          {order.quote.quoteNumber}
                        </Link>
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{order.organization?.name || "—"}</p>
                        {order.contact && (
                          <p className="text-xs text-muted-foreground">{order.contact.firstName} {order.contact.lastName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{order._count.items}</TableCell>
                    <TableCell className="text-right font-medium">
                      {grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
                    </TableCell>
                    <TableCell>
                      <StatusBadge config={orderStatusConfig} status={order.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(order.createdAt, "dd MMM yyyy", { locale: tr })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/orders/${order.id}`}>Detay</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button key={i + 1} variant={page === i + 1 ? "default" : "outline"} size="sm" asChild>
              <Link href={`/admin/orders?page=${i + 1}${status ? `&status=${status}` : ""}`}>
                {i + 1}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
