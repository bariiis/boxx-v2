import Link from "next/link"
import { notFound } from "next/navigation"
import { getOrder } from "@/lib/actions/order-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { ArrowLeft, ExternalLink, Hash, Shield, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { OrderStatusManager } from "@/components/admin/order-status-manager"

const currencySymbols: Record<string, string> = {
  TRY: "₺", USD: "$", EUR: "€", GBP: "£",
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()

  const sym = currencySymbols[order.currency] || "$"
  const grandTotal = order.totalAmount + order.vatAmount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-mono">{order.orderNumber}</h1>
            <OrderStatusManager orderId={order.id} currentStatus={order.status} />
          </div>
          <p className="text-muted-foreground">
            {order.organization?.name}
            {order.contact && ` — ${order.contact.firstName} ${order.contact.lastName}`}
            {" | "}
            {format(order.createdAt, "dd MMMM yyyy", { locale: tr })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Toplam</p>
          <p className="text-2xl font-bold">
            {grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
          </p>
          <p className="text-xs text-muted-foreground">
            (KDV %{order.vatRate}: {order.vatAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym})
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-2">
        {order.quote && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/quotes/${order.quote.id}`}>
              <ExternalLink className="mr-2 size-3.5" />
              Teklif: {order.quote.quoteNumber}
            </Link>
          </Button>
        )}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 size-3.5" />
            Siparişlere Dön
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sipariş Kalemleri ({order.items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Ürün</TableHead>
                  <TableHead className="text-center">Adet</TableHead>
                  <TableHead className="text-right">Birim</TableHead>
                  <TableHead className="text-right">Toplam</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, idx) => {
                  const config = item.configuration as { name: string; quantity: number; unitPrice: number }[] | null
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <p className="font-medium">{item.name}</p>
                        {item.product && (
                          <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>
                        )}
                        {config && config.length > 0 && (
                          <div className="mt-1.5 space-y-0.5 pl-4 border-l-2 border-muted">
                            {config.map((ci, i) => (
                              <p key={i} className="text-xs text-muted-foreground">
                                {ci.name}
                                {ci.quantity > 1 && ` x${ci.quantity}`}
                                {" — "}
                                {ci.unitPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
                              </p>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {item.unitPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(item.unitPrice * item.quantity).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-4">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Müşteri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {order.organization && (
                <p className="font-medium">{order.organization.name}</p>
              )}
              {order.contact && (
                <p>{order.contact.firstName} {order.contact.lastName}</p>
              )}
              {order.organization?.email && (
                <p className="text-muted-foreground">{order.organization.email}</p>
              )}
              {order.organization?.phone && (
                <p className="text-muted-foreground">{order.organization.phone}</p>
              )}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Özet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span>{order.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">KDV (%{order.vatRate})</span>
                <span>{order.vatAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold">
                <span>Genel Toplam</span>
                <span>{grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}</span>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Serial Numbers */}
      {order.serialNumbers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="size-5" />
              Seri Numaraları ({order.serialNumbers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seri No</TableHead>
                  <TableHead>Ürün</TableHead>
                  <TableHead>Garanti Başlangıç</TableHead>
                  <TableHead>Garanti Bitiş</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.serialNumbers.map((sn) => {
                  const now = new Date()
                  const warrantyActive = sn.warrantyEnd ? new Date(sn.warrantyEnd) > now : false
                  const expiringSoon = sn.warrantyEnd
                    ? new Date(sn.warrantyEnd) > now && new Date(sn.warrantyEnd).getTime() - now.getTime() < 90 * 24 * 60 * 60 * 1000
                    : false

                  return (
                    <TableRow key={sn.id}>
                      <TableCell className="font-mono font-medium">{sn.serialNumber}</TableCell>
                      <TableCell>
                        {sn.product ? (
                          <div>
                            <p className="text-sm">{sn.product.name}</p>
                            <p className="text-xs text-muted-foreground">{sn.product.sku}</p>
                          </div>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(sn.warrantyStart).toLocaleDateString("tr-TR")}
                      </TableCell>
                      <TableCell className="text-sm">
                        {sn.warrantyEnd ? new Date(sn.warrantyEnd).toLocaleDateString("tr-TR") : "—"}
                      </TableCell>
                      <TableCell>
                        {warrantyActive ? (
                          expiringSoon ? (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                              <AlertTriangle className="mr-1 size-3" />
                              Yakında Dolacak
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <Shield className="mr-1 size-3" />
                              Aktif
                            </Badge>
                          )
                        ) : (
                          <Badge variant="secondary">Süresi Dolmuş</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/serial-numbers/${sn.id}`}>Detay</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
