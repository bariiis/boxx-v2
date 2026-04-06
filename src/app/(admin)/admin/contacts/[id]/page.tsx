import Link from "next/link"
import { notFound } from "next/navigation"
import { getContact } from "@/lib/actions/contact-actions"
import { db } from "@/lib/db"
import { ContactForm } from "@/components/admin/contact-form"
import { PortalAccessButton } from "@/components/admin/org-portal-access"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, HeadphonesIcon, Hash, ShoppingCart } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const quoteStatus: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "Taslak", variant: "secondary" }, SENT: { label: "Gönderildi", variant: "default" },
  VIEWED: { label: "Görüntülendi", variant: "outline" }, APPROVED: { label: "Onaylandı", variant: "default" },
  REJECTED: { label: "Reddedildi", variant: "destructive" }, REVISED: { label: "Revize", variant: "outline" },
}

const ticketStatus: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Açık", color: "bg-blue-100 text-blue-700" },
  AWAITING_REPLY: { label: "Yanıt Bekleniyor", color: "bg-amber-100 text-amber-700" },
  RESOLVED: { label: "Çözüldü", color: "bg-green-100 text-green-700" },
  CLOSED: { label: "Kapatıldı", color: "bg-gray-100 text-gray-700" },
}

const sym: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const contact = await getContact(id)
  if (!contact) notFound()

  const portalUser = contact.email
    ? await db.user.findUnique({
        where: { email: contact.email },
        select: { id: true, name: true, surname: true, email: true, isActive: true },
      })
    : null

  // Get orders via organization
  const orders = contact.organizationId
    ? await db.order.findMany({
        where: { organizationId: contact.organizationId, contactId: contact.id },
        select: { id: true, orderNumber: true, status: true, totalAmount: true, vatAmount: true, currency: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {contact.title && `${contact.title} `}
          {contact.firstName} {contact.lastName}
        </h1>
        {contact.email && (
          <PortalAccessButton
            contact={contact}
            organizationId={contact.organizationId || ""}
            existingUser={portalUser}
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sol: Form */}
        <div>
          <ContactForm contact={contact} />
        </div>

        {/* Sağ: İlişkili veriler */}
        <div className="space-y-4">
          {/* Teklifler */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4" />
                Teklifler ({contact.quotes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contact.quotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Teklif yok</p>
              ) : (
                <div className="space-y-2">
                  {contact.quotes.map((q) => {
                    const st = quoteStatus[q.status] || quoteStatus.DRAFT
                    return (
                      <Link key={q.id} href={`/admin/quotes/${q.id}`}
                        className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors">
                        <div>
                          <span className="font-mono text-sm">{q.quoteNumber}</span>
                          <p className="text-xs text-muted-foreground">
                            {q.projectName || format(q.createdAt, "dd MMM yyyy", { locale: tr })}
                          </p>
                        </div>
                        <Badge variant={st.variant} className="text-[10px]">{st.label}</Badge>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Siparişler */}
          {orders.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShoppingCart className="size-4" />
                  Siparişler ({orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {orders.map((o) => {
                    const total = o.totalAmount + o.vatAmount
                    const s = sym[o.currency] || "$"
                    return (
                      <Link key={o.id} href={`/admin/orders/${o.id}`}
                        className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors">
                        <div>
                          <span className="font-mono text-sm">{o.orderNumber}</span>
                          <p className="text-xs text-muted-foreground">
                            {format(o.createdAt, "dd MMM yyyy", { locale: tr })}
                          </p>
                        </div>
                        <span className="text-sm font-semibold">
                          {total.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} {s}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Destek Talepleri */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <HeadphonesIcon className="size-4" />
                Destek Talepleri ({contact.tickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contact.tickets.length === 0 ? (
                <p className="text-sm text-muted-foreground">Destek talebi yok</p>
              ) : (
                <div className="space-y-2">
                  {contact.tickets.map((t) => {
                    const st = ticketStatus[t.status] || ticketStatus.OPEN
                    return (
                      <Link key={t.id} href={`/admin/tickets/${t.id}`}
                        className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="text-sm">{t.subject}</p>
                          <span className="font-mono text-xs text-muted-foreground">{t.ticketNumber}</span>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.color}`}>{st.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seri Numaraları */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Hash className="size-4" />
                Seri Numaraları ({contact.serialNumbers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contact.serialNumbers.length === 0 ? (
                <p className="text-sm text-muted-foreground">Seri numara kaydı yok</p>
              ) : (
                <div className="space-y-2">
                  {contact.serialNumbers.map((sn) => (
                    <Link key={sn.id} href={`/admin/serial-numbers/${sn.id}`}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 transition-colors">
                      <div>
                        <span className="font-mono text-sm">{sn.serialNumber}</span>
                        <p className="text-xs text-muted-foreground truncate max-w-48">
                          {sn.configuration || "Konfigürasyon yok"}
                        </p>
                      </div>
                      <Badge variant={sn.isActive ? "default" : "secondary"} className="text-[10px]">
                        {sn.isActive ? "Aktif" : "Pasif"}
                      </Badge>
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
