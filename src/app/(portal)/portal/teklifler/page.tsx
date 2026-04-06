import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText } from "lucide-react"
import { getMyQuotes } from "@/lib/actions/portal-actions"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const sym: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }
const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "Taslak", variant: "secondary" }, SENT: { label: "Gönderildi", variant: "default" },
  VIEWED: { label: "Görüntülendi", variant: "outline" }, APPROVED: { label: "Onaylandı", variant: "default" },
  REJECTED: { label: "Reddedildi", variant: "destructive" }, REVISED: { label: "Revize", variant: "outline" },
}

export default async function MyQuotesPage() {
  const quotes = await getMyQuotes()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tekliflerim</h1>

      {quotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="mx-auto mb-2 size-8 opacity-50" />
            Henüz teklif bulunmuyor
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => {
            const st = statusConfig[q.status] || statusConfig.DRAFT
            const s = sym[q.currency] || "$"
            const canAct = q.status === "SENT" || q.status === "VIEWED" || q.status === "REVISED"
            return (
              <Card key={q.id}>
                <CardContent className="flex items-center justify-between pt-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-bold">{q.quoteNumber}</span>
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </div>
                    {q.projectName && <p className="text-sm text-muted-foreground">{q.projectName}</p>}
                    <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                      <span>{format(q.createdAt, "dd MMM yyyy", { locale: tr })}</span>
                      <span>{q.items.length} kalem</span>
                      {q.validUntil && <span>Geçerlilik: {format(q.validUntil, "dd.MM.yyyy")}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">
                      {q.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} {s}
                    </span>
                    <Button variant={canAct ? "default" : "outline"} size="sm" asChild>
                      <Link href={`/quote/${q.publicToken}`} target="_blank">
                        <ExternalLink className="mr-1.5 size-3.5" />
                        {canAct ? "İncele & Onayla" : "Görüntüle"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
