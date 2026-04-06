import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { getMyOrders } from "@/lib/actions/portal-actions"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const sym: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }
const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
  PENDING: { label: "Beklemede", variant: "outline", color: "bg-yellow-500" },
  PROCESSING: { label: "Hazırlanıyor", variant: "default", color: "bg-blue-500" },
  SHIPPED: { label: "Kargoda", variant: "secondary", color: "bg-purple-500" },
  DELIVERED: { label: "Teslim Edildi", variant: "default", color: "bg-green-500" },
  CANCELLED: { label: "İptal", variant: "destructive", color: "bg-red-500" },
}

const steps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]

export default async function MyOrdersPage() {
  const orders = await getMyOrders()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Siparişlerim</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <ShoppingCart className="mx-auto mb-2 size-8 opacity-50" />
            Henüz sipariş bulunmuyor
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const st = statusConfig[o.status] || statusConfig.PENDING
            const s = sym[o.currency] || "$"
            const total = o.totalAmount + o.vatAmount
            const currentStep = steps.indexOf(o.status)

            return (
              <Card key={o.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-lg font-bold">{o.orderNumber}</span>
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </div>
                      <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                        <span>{format(o.createdAt, "dd MMM yyyy", { locale: tr })}</span>
                        <span>{o._count.items} kalem</span>
                        {o.quote && <span>Teklif: {o.quote.quoteNumber}</span>}
                      </div>
                    </div>
                    <span className="text-xl font-bold">
                      {total.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} {s}
                    </span>
                  </div>

                  {/* Progress bar */}
                  {o.status !== "CANCELLED" && (
                    <div className="flex items-center gap-1">
                      {steps.map((step, i) => (
                        <div key={step} className="flex flex-1 items-center gap-1">
                          <div className={`h-1.5 flex-1 rounded-full ${i <= currentStep ? st.color : "bg-muted"}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
