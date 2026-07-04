"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { QuoteStatus, TicketStatus } from "@/generated/prisma"

export type KanbanQuote = {
  id: string
  quoteNumber: string
  status: QuoteStatus
  totalAmount: number
  currency: string
  projectName: string | null
  createdAt: Date
  validUntil: Date | null
  organization: { name: string } | null
  contact: { firstName: string; lastName: string } | null
  createdBy: { name: string | null; surname: string | null } | null
}

export type KanbanTicket = {
  id: string
  ticketNumber: string
  subject: string
  status: TicketStatus
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT"
  createdAt: Date
  contactName: string | null
  organization: { name: string } | null
  assignedTo: { name: string | null; surname: string | null } | null
  messageCount: number
}

export async function getKanbanQuotes(): Promise<KanbanQuote[]> {
  const quotes = await db.quote.findMany({
    orderBy: { updatedAt: "desc" },
    take: 120,
    select: {
      id: true,
      quoteNumber: true,
      status: true,
      totalAmount: true,
      currency: true,
      projectName: true,
      createdAt: true,
      validUntil: true,
      organization: { select: { name: true } },
      contact: { select: { firstName: true, lastName: true } },
      createdBy: { select: { name: true, surname: true } },
    },
  })
  return quotes as KanbanQuote[]
}

export async function getKanbanTickets(): Promise<KanbanTicket[]> {
  const tickets = await db.ticket.findMany({
    orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
    take: 120,
    select: {
      id: true,
      ticketNumber: true,
      subject: true,
      status: true,
      priority: true,
      createdAt: true,
      contactName: true,
      organization: { select: { name: true } },
      assignedTo: { select: { name: true, surname: true } },
      _count: { select: { messages: true } },
    },
  })
  return tickets.map((t) => ({
    id: t.id,
    ticketNumber: t.ticketNumber,
    subject: t.subject,
    status: t.status,
    priority: t.priority,
    createdAt: t.createdAt,
    contactName: t.contactName,
    organization: t.organization,
    assignedTo: t.assignedTo,
    messageCount: t._count.messages,
  }))
}

export async function moveQuoteStatus(id: string, status: QuoteStatus) {
  const updateData: Record<string, unknown> = { status }
  if (status === "SENT") updateData.sentAt = new Date()
  if (status === "APPROVED") updateData.approvedAt = new Date()
  if (status === "REJECTED") updateData.rejectedAt = new Date()

  await db.quote.update({ where: { id }, data: updateData })
  revalidatePath("/admin")
  revalidatePath("/admin/quotes")
}

export async function moveTicketStatus(id: string, status: TicketStatus) {
  const updateData: Record<string, unknown> = { status }
  if (status === "CLOSED") updateData.closedAt = new Date()

  await db.ticket.update({ where: { id }, data: updateData })
  revalidatePath("/admin")
  revalidatePath("/admin/tickets")
}
