import { getTickets } from "@/lib/actions/ticket-actions"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Plus, HeadphonesIcon, MessageSquare, Paperclip } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { TicketSearch } from "@/components/admin/ticket-search"
import { ticketStatusConfig, ticketPriorityConfig, StatusBadge } from "@/lib/status-colors"

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; status?: string }>
}) {
  const params = await searchParams
  const search = params.search || ""
  const page = parseInt(params.page || "1")
  const status = params.status as "OPEN" | "AWAITING_REPLY" | "RESOLVED" | "CLOSED" | undefined

  const { tickets, total, totalPages } = await getTickets({ search, page, status })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Destek Talepleri</h1>
          <p className="text-muted-foreground">{total} talep</p>
        </div>
        <Button asChild>
          <Link href="/admin/tickets/new">
            <Plus className="mr-2 size-4" />
            Yeni Talep
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <TicketSearch defaultSearch={search} status={status} />
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Tümü", value: undefined, class: "" },
            ...Object.entries(ticketStatusConfig).map(([k, v]) => ({ label: v.label, value: k, class: v.class })),
          ].map((f) => {
            const isActive = status === f.value
            return (
              <Link
                key={f.label}
                href={`/admin/tickets${f.value ? `?status=${f.value}` : ""}${search ? `${f.value ? "&" : "?"}search=${search}` : ""}`}
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
              <TableHead>Talep No</TableHead>
              <TableHead>Konu</TableHead>
              <TableHead>Organizasyon</TableHead>
              <TableHead>Öncelik</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Atanan</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  <HeadphonesIcon className="mx-auto mb-2 size-8 opacity-50" />
                  {search ? `"${search}" için sonuç bulunamadı` : "Henüz destek talebi yok"}
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((t) => {
                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Link href={`/admin/tickets/${t.id}`} className="font-mono font-medium hover:underline">
                        {t.ticketNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/tickets/${t.id}`} className="hover:underline">
                        {t.subject}
                      </Link>
                      <div className="flex gap-2 mt-0.5">
                        {t.messages.length > 0 && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageSquare className="size-3" />{t.messages.length}
                          </span>
                        )}
                        {t.attachments.length > 0 && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Paperclip className="size-3" />{t.attachments.length}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{t.organization?.name || "-"}</TableCell>
                    <TableCell><StatusBadge config={ticketPriorityConfig} status={t.priority} /></TableCell>
                    <TableCell><StatusBadge config={ticketStatusConfig} status={t.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{t.category?.name || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {t.assignedTo ? `${t.assignedTo.name} ${t.assignedTo.surname}` : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(t.createdAt, "dd MMM yyyy", { locale: tr })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/tickets/${t.id}`}>Aç</Link>
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
              <Link href={`/admin/tickets?page=${i + 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}>
                {i + 1}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
