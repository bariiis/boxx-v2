import Link from "next/link"
import { notFound } from "next/navigation"
import { getEmployee } from "@/lib/actions/employee-actions"
import { db } from "@/lib/db"
import { EmployeeForm } from "@/components/admin/employee-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, HeadphonesIcon, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { quoteStatusConfig, ticketStatusConfig, StatusBadge } from "@/lib/status-colors"

const currencySymbols: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const employee = await getEmployee(id)
  if (!employee) notFound()

  const smtpConfig = await db.smtpConfig.findUnique({ where: { userId: id } })

  const [quotes, tickets] = await Promise.all([
    db.quote.findMany({
      where: { createdById: id },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true, quoteNumber: true, status: true, totalAmount: true, currency: true,
        createdAt: true, projectName: true,
        organization: { select: { name: true } },
      },
    }),
    db.ticket.findMany({
      where: { assignedToId: id },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true, ticketNumber: true, subject: true, status: true, priority: true,
        createdAt: true,
        organization: { select: { name: true } },
        _count: { select: { messages: true } },
      },
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">
            {employee.name} {employee.surname}
          </h1>
          <Badge variant={employee.role === "ADMIN" ? "default" : "secondary"}>
            {employee.role === "ADMIN" ? "Yönetici" : "Çalışan"}
          </Badge>
          {!employee.isActive && <Badge variant="destructive">Pasif</Badge>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sol: Form */}
        <div>
          <EmployeeForm employee={employee} smtpConfig={smtpConfig} />
        </div>

        {/* Sağ: İlişkili veriler */}
        <div className="space-y-4">
          {/* Oluşturduğu Teklifler */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4" />
                Oluşturduğu Teklifler ({quotes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Henüz teklif yok</p>
              ) : (
                <div className="space-y-2">
                  {quotes.map((q) => {
                    const sym = currencySymbols[q.currency] || "$"
                    return (
                      <Link key={q.id} href={`/admin/quotes/${q.id}`}
                        className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{q.quoteNumber}</span>
                            <StatusBadge config={quoteStatusConfig} status={q.status} />
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {q.organization?.name || "—"} · {q.projectName || format(q.createdAt, "dd MMM yyyy", { locale: tr })}
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

          {/* Atanan Destek Talepleri */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <HeadphonesIcon className="size-4" />
                Atanan Destek Talepleri ({tickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <p className="text-sm text-muted-foreground">Atanmış talep yok</p>
              ) : (
                <div className="space-y-2">
                  {tickets.map((t) => (
                    <Link key={t.id} href={`/admin/tickets/${t.id}`}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{t.ticketNumber}</span>
                          <StatusBadge config={ticketStatusConfig} status={t.status} />
                        </div>
                        <p className="text-sm truncate">{t.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.organization?.name || "—"} · {format(t.createdAt, "dd MMM", { locale: tr })}
                          {t._count.messages > 0 && (
                            <span className="ml-2 inline-flex items-center gap-0.5">
                              <MessageSquare className="size-3" /> {t._count.messages}
                            </span>
                          )}
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
    </div>
  )
}
