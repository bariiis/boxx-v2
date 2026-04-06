import { notFound } from "next/navigation"
import { getSerialNumber } from "@/lib/actions/serial-number-actions"
import { SerialNumberForm } from "@/components/admin/serial-number-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { differenceInDays, format } from "date-fns"
import { tr } from "date-fns/locale"
import Link from "next/link"

export default async function SerialNumberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sn = await getSerialNumber(id)
  if (!sn) notFound()

  const warrantyDays = sn.warrantyEnd ? differenceInDays(sn.warrantyEnd, new Date()) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold font-mono">{sn.serialNumber}</h1>
        <Badge variant={sn.isActive ? "default" : "secondary"}>
          {sn.isActive ? "Aktif" : "Pasif"}
        </Badge>
        {warrantyDays !== null && (
          <Badge variant={warrantyDays < 0 ? "destructive" : warrantyDays < 30 ? "destructive" : "default"}>
            Garanti: {warrantyDays < 0 ? "Süresi Dolmuş" : `${warrantyDays} gün kaldı`}
          </Badge>
        )}
      </div>

      <SerialNumberForm serialNumber={sn} />

      {/* Related tickets */}
      {sn.tickets.length > 0 && (
        <Card>
          <CardHeader><CardTitle>İlişkili Destek Talepleri ({sn.tickets.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sn.tickets.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <Link href={`/admin/tickets/${t.id}`} className="font-medium hover:underline">
                      {t.subject}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {t.ticketNumber} | {t.category?.name || "Kategorisiz"} | {format(t.createdAt, "dd MMM yyyy", { locale: tr })}
                    </p>
                  </div>
                  <Badge>{t.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
