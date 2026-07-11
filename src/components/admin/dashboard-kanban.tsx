"use client"

import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { StatusBadge, ticketPriorityConfig } from "@/lib/status-colors"
import { KanbanBoard, type KanbanColumn } from "./kanban-board"
import {
  type KanbanQuote,
  type KanbanTicket,
  moveQuoteStatus,
  moveTicketStatus,
} from "@/lib/actions/kanban-actions"
import type { QuoteStatus, TicketStatus } from "@/generated/prisma"
import { Building2, Calendar, MessageSquare, User } from "lucide-react"

const currencySymbols: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }

const quoteColumns: KanbanColumn<QuoteStatus>[] = [
  { id: "DRAFT", label: "Taslak", accent: "bg-gray-400" },
  { id: "SENT", label: "Gönderildi", accent: "bg-blue-500" },
  { id: "VIEWED", label: "Görüntülendi", accent: "bg-purple-500" },
  { id: "REVISED", label: "Revize", accent: "bg-orange-500" },
  { id: "APPROVED", label: "Onaylandı", accent: "bg-green-500" },
  { id: "REJECTED", label: "Reddedildi", accent: "bg-red-500" },
]

const ticketColumns: KanbanColumn<TicketStatus>[] = [
  { id: "OPEN", label: "Açık", accent: "bg-blue-500" },
  { id: "AWAITING_REPLY", label: "Yanıt Bekleniyor", accent: "bg-amber-500" },
  { id: "RESOLVED", label: "Çözüldü", accent: "bg-green-500" },
  { id: "CLOSED", label: "Kapatıldı", accent: "bg-gray-400" },
]

export function DashboardKanban({
  quotes,
  tickets,
}: {
  quotes: KanbanQuote[]
  tickets: KanbanTicket[]
}) {
  return (
    <Tabs defaultValue="quotes" className="w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">İş Panosu</h2>
        <TabsList>
          <TabsTrigger value="quotes">Teklifler ({quotes.length})</TabsTrigger>
          <TabsTrigger value="tickets">Destek ({tickets.length})</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="quotes" className="mt-4">
        <KanbanBoard<KanbanQuote, QuoteStatus>
          items={quotes}
          columns={quoteColumns}
          onMove={moveQuoteStatus}
          renderCard={(q) => <QuoteCard quote={q} />}
          emptyLabel="Teklif yok"
        />
      </TabsContent>

      <TabsContent value="tickets" className="mt-4">
        <KanbanBoard<KanbanTicket, TicketStatus>
          items={tickets}
          columns={ticketColumns}
          onMove={moveTicketStatus}
          renderCard={(t) => <TicketCard ticket={t} />}
          emptyLabel="Talep yok"
        />
      </TabsContent>
    </Tabs>
  )
}

function QuoteCard({ quote }: { quote: KanbanQuote }) {
  const sym = currencySymbols[quote.currency] || "$"
  const customer =
    quote.organization?.name ||
    (quote.contact ? `${quote.contact.firstName} ${quote.contact.lastName}` : "—")
  const owner = quote.createdBy
    ? `${quote.createdBy.name || ""} ${quote.createdBy.surname || ""}`.trim()
    : null
  const [now] = useState(() => Date.now())
  const expiringSoon =
    quote.validUntil && new Date(quote.validUntil).getTime() - now < 1000 * 60 * 60 * 24 * 7

  return (
    <Card className="gap-2 p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/admin/quotes/${quote.id}`}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="font-mono text-xs font-semibold text-primary hover:underline"
        >
          {quote.quoteNumber}
        </Link>
        <span className="text-sm font-semibold">
          {quote.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} {sym}
        </span>
      </div>
      {quote.projectName && (
        <p className="line-clamp-2 text-sm font-medium">{quote.projectName}</p>
      )}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Building2 className="size-3 shrink-0" />
        <span className="truncate">{customer}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          {format(quote.createdAt, "dd MMM", { locale: tr })}
        </span>
        {expiringSoon && quote.validUntil && (
          <span className="font-medium text-orange-600">
            Son: {format(quote.validUntil, "dd MMM", { locale: tr })}
          </span>
        )}
        {owner && (
          <span className="flex items-center gap-1 truncate">
            <User className="size-3" />
            {owner}
          </span>
        )}
      </div>
    </Card>
  )
}

function TicketCard({ ticket }: { ticket: KanbanTicket }) {
  const customer = ticket.contactName || ticket.organization?.name || "—"
  const assignee = ticket.assignedTo
    ? `${ticket.assignedTo.name || ""} ${ticket.assignedTo.surname || ""}`.trim()
    : null

  return (
    <Card className="gap-2 p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/admin/tickets/${ticket.id}`}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="font-mono text-xs font-semibold text-primary hover:underline"
        >
          {ticket.ticketNumber}
        </Link>
        <StatusBadge config={ticketPriorityConfig} status={ticket.priority} />
      </div>
      <p className="line-clamp-2 text-sm font-medium">{ticket.subject}</p>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Building2 className="size-3 shrink-0" />
        <span className="truncate">{customer}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          {format(ticket.createdAt, "dd MMM", { locale: tr })}
        </span>
        {ticket.messageCount > 0 && (
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3" />
            {ticket.messageCount}
          </span>
        )}
        {assignee && (
          <span className="flex items-center gap-1 truncate">
            <User className="size-3" />
            {assignee}
          </span>
        )}
      </div>
    </Card>
  )
}
