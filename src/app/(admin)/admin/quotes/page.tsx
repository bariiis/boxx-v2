import { getQuotes } from "@/lib/actions/quote-actions"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Plus, FileText, Eye } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { QuoteSearch } from "@/components/admin/quote-search"
import { quoteStatusConfig, StatusBadge } from "@/lib/status-colors"

const currencySymbols: Record<string, string> = {
  TRY: "₺", USD: "$", EUR: "€", GBP: "£",
}

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; status?: string }>
}) {
  const params = await searchParams
  const search = params.search || ""
  const page = parseInt(params.page || "1")
  const status = params.status as "DRAFT" | "SENT" | "VIEWED" | "APPROVED" | "REJECTED" | "REVISED" | undefined

  const { quotes, total, totalPages } = await getQuotes({ search, page, status })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teklifler</h1>
          <p className="text-muted-foreground">{total} teklif</p>
        </div>
        <Button asChild>
          <Link href="/admin/quotes/new">
            <Plus className="mr-2 size-4" />
            Yeni Teklif
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <QuoteSearch defaultSearch={search} status={status} />
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Tümü", value: undefined, class: "" },
            ...Object.entries(quoteStatusConfig).map(([k, v]) => ({ label: v.label, value: k, class: v.class })),
          ].map((f) => {
            const isActive = status === f.value
            return (
              <Link
                key={f.label}
                href={`/admin/quotes${f.value ? `?status=${f.value}` : ""}${search ? `${f.value ? "&" : "?"}search=${search}` : ""}`}
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teklif No</TableHead>
              <TableHead>Organizasyon</TableHead>
              <TableHead>Kişi</TableHead>
              <TableHead>Proje</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">Toplam</TableHead>
              <TableHead>Hazırlayan</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  <FileText className="mx-auto mb-2 size-8 opacity-50" />
                  {search ? `"${search}" için sonuç bulunamadı` : "Henüz teklif bulunmuyor"}
                </TableCell>
              </TableRow>
            ) : (
              quotes.map((q) => {
                const sym = currencySymbols[q.currency] || "$"
                return (
                  <TableRow key={q.id}>
                    <TableCell>
                      <Link href={`/admin/quotes/${q.id}`} className="font-mono font-medium hover:underline">
                        {q.quoteNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{q.organization?.name || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {q.contact ? `${q.contact.firstName} ${q.contact.lastName}` : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{q.projectName || "-"}</TableCell>
                    <TableCell><StatusBadge config={quoteStatusConfig} status={q.status} /></TableCell>
                    <TableCell className="text-right font-medium">
                      {q.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {q.createdBy.name} {q.createdBy.surname}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(q.createdAt, "dd MMM yyyy", { locale: tr })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" asChild title="Ön İzleme">
                          <a href={`/quote/${q.publicToken}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="size-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/quotes/${q.id}`}>Aç</Link>
                        </Button>
                      </div>
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
              <Link href={`/admin/quotes?page=${i + 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}>
                {i + 1}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
