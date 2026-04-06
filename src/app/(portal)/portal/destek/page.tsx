import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HeadphonesIcon, ExternalLink, Plus } from "lucide-react"
import { getMyTickets } from "@/lib/actions/portal-actions"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Açık", color: "bg-blue-100 text-blue-700" },
  AWAITING_REPLY: { label: "Yanıt Bekleniyor", color: "bg-amber-100 text-amber-700" },
  RESOLVED: { label: "Çözüldü", color: "bg-green-100 text-green-700" },
  CLOSED: { label: "Kapatıldı", color: "bg-gray-100 text-gray-700" },
}

const priorityLabels: Record<string, string> = {
  LOW: "Düşük", NORMAL: "Normal", HIGH: "Yüksek", URGENT: "Acil",
}

export default async function MyTicketsPage() {
  const tickets = await getMyTickets()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Destek Taleplerim</h1>
        <Button asChild>
          <Link href="/destek">
            <Plus className="mr-2 size-4" />
            Yeni Talep
          </Link>
        </Button>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <HeadphonesIcon className="mx-auto mb-2 size-8 opacity-50" />
            Henüz destek talebi yok
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => {
            const st = statusConfig[t.status] || statusConfig.OPEN
            return (
              <Card key={t.id}>
                <CardContent className="flex items-center justify-between pt-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm">{t.ticketNumber}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.color}`}>{st.label}</span>
                      {(t.priority === "HIGH" || t.priority === "URGENT") && (
                        <Badge variant="destructive" className="text-[10px]">{priorityLabels[t.priority]}</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium">{t.subject}</p>
                    <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                      {t.category && <span>{t.category.name}</span>}
                      <span>{format(t.createdAt, "dd MMM yyyy", { locale: tr })}</span>
                      <span>{t._count.messages} mesaj</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/destek/${t.publicToken}`}>
                      <ExternalLink className="mr-1.5 size-3.5" />
                      Görüntüle
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
