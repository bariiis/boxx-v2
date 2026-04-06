import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getTicket, getEmployeeList } from "@/lib/actions/ticket-actions"
import { Badge } from "@/components/ui/badge"
import { TicketConversation } from "@/components/admin/ticket-conversation"
import { TicketSidebar } from "@/components/admin/ticket-sidebar"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  OPEN: { label: "Açık", variant: "default" },
  AWAITING_REPLY: { label: "Yanıt Bekleniyor", variant: "outline" },
  RESOLVED: { label: "Çözüldü", variant: "secondary" },
  CLOSED: { label: "Kapandı", variant: "secondary" },
}

const priorityLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  LOW: { label: "Düşük", variant: "secondary" },
  NORMAL: { label: "Normal", variant: "outline" },
  HIGH: { label: "Yüksek", variant: "default" },
  URGENT: { label: "Acil", variant: "destructive" },
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { id } = await params
  const [ticket, employees] = await Promise.all([
    getTicket(id),
    getEmployeeList(),
  ])

  if (!ticket) notFound()

  const st = statusLabels[ticket.status] || statusLabels.OPEN
  const pr = priorityLabels[ticket.priority] || priorityLabels.NORMAL

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <Badge variant={st.variant}>{st.label}</Badge>
          <Badge variant={pr.variant}>{pr.label}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {ticket.ticketNumber} | {format(ticket.createdAt, "dd MMMM yyyy HH:mm", { locale: tr })}
          {ticket.organization && ` | ${ticket.organization.name}`}
          {ticket.contact && ` — ${ticket.contact.firstName} ${ticket.contact.lastName}`}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <TicketConversation
          ticket={ticket}
          userId={session.user.id}
        />
        <TicketSidebar
          ticket={ticket}
          employees={employees}
        />
      </div>
    </div>
  )
}
