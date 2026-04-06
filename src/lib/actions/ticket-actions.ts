"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { TicketStatus, TicketPriority } from "@/generated/prisma"

async function generateTicketNumber() {
  const year = new Date().getFullYear()
  const prefix = `TKT-${year}-`
  const last = await db.ticket.findFirst({
    where: { ticketNumber: { startsWith: prefix } },
    orderBy: { ticketNumber: "desc" },
  })
  const lastNum = last ? parseInt(last.ticketNumber.replace(prefix, "")) : 0
  return `${prefix}${String(lastNum + 1).padStart(4, "0")}`
}

export async function getTickets({
  search = "",
  page = 1,
  limit = 20,
  status,
  priority,
}: {
  search?: string
  page?: number
  limit?: number
  status?: TicketStatus
  priority?: TicketPriority
} = {}) {
  const where = {
    ...(search && {
      OR: [
        { ticketNumber: { contains: search, mode: "insensitive" as const } },
        { subject: { contains: search, mode: "insensitive" as const } },
        { organization: { name: { contains: search, mode: "insensitive" as const } } },
      ],
    }),
    ...(status && { status }),
    ...(priority && { priority }),
  }

  const [tickets, total] = await Promise.all([
    db.ticket.findMany({
      where,
      include: {
        organization: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, name: true, surname: true } },
        category: { select: { id: true, name: true } },
        messages: { select: { id: true } },
        attachments: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.ticket.count({ where }),
  ])

  return { tickets, total, totalPages: Math.ceil(total / limit) }
}

export async function getTicket(id: string) {
  return db.ticket.findUnique({
    where: { id },
    include: {
      organization: true,
      contact: true,
      assignedTo: { select: { id: true, name: true, surname: true, email: true } },
      category: true,
      serialNumber: true,
      messages: {
        include: { sender: { select: { id: true, name: true, surname: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
      attachments: { orderBy: { createdAt: "desc" } },
    },
  })
}

export async function getTicketCategories() {
  return db.ticketCategory.findMany({ where: { isActive: true }, orderBy: { name: "asc" } })
}

export async function getEmployeeList() {
  return db.user.findMany({
    where: { role: { in: ["ADMIN", "EMPLOYEE"] }, isActive: true },
    select: { id: true, name: true, surname: true },
    orderBy: { name: "asc" },
  })
}

export async function createTicket(data: {
  subject: string
  description: string
  priority?: TicketPriority
  categoryId?: string
  organizationId?: string
  contactId?: string
  serialNumberId?: string
  assignedToId?: string
}) {
  const ticketNumber = await generateTicketNumber()
  const ticket = await db.ticket.create({
    data: {
      ticketNumber,
      subject: data.subject,
      description: data.description,
      priority: data.priority || "NORMAL",
      ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
      ...(data.organizationId && { organization: { connect: { id: data.organizationId } } }),
      ...(data.contactId && { contact: { connect: { id: data.contactId } } }),
      ...(data.serialNumberId && { serialNumber: { connect: { id: data.serialNumberId } } }),
      ...(data.assignedToId && { assignedTo: { connect: { id: data.assignedToId } } }),
    },
  })
  revalidatePath("/admin/tickets")
  return ticket
}

export async function updateTicket(
  id: string,
  data: {
    status?: TicketStatus
    priority?: TicketPriority
    assignedToId?: string | null
    categoryId?: string | null
  }
) {
  const updateData: Record<string, unknown> = {}
  if (data.status) {
    updateData.status = data.status
    if (data.status === "CLOSED") updateData.closedAt = new Date()
  }
  if (data.priority) updateData.priority = data.priority
  if (data.assignedToId !== undefined) {
    updateData.assignedTo = data.assignedToId
      ? { connect: { id: data.assignedToId } }
      : { disconnect: true }
  }

  await db.ticket.update({ where: { id }, data: updateData })
  revalidatePath(`/admin/tickets/${id}`)
  revalidatePath("/admin/tickets")
}

export async function deleteTicket(id: string) {
  await db.ticket.delete({ where: { id } })
  revalidatePath("/admin/tickets")
}

export async function addTicketMessage(data: {
  ticketId: string
  senderId: string
  content: string
  isInternal?: boolean
}) {
  const message = await db.ticketMessage.create({ data })

  // Update ticket status to AWAITING_REPLY if staff replies + send email
  const sender = await db.user.findUnique({ where: { id: data.senderId } })
  if (sender && (sender.role === "ADMIN" || sender.role === "EMPLOYEE") && !data.isInternal) {
    await db.ticket.update({
      where: { id: data.ticketId },
      data: { status: "AWAITING_REPLY" },
    })

    // Send email notification to customer
    const ticket = await db.ticket.findUnique({
      where: { id: data.ticketId },
      select: { ticketNumber: true, subject: true, publicToken: true, contactName: true, contactEmail: true, contact: { select: { email: true, firstName: true, lastName: true } }, organization: { select: { email: true } } },
    })
    if (ticket) {
      const email = ticket.contactEmail || ticket.contact?.email || ticket.organization?.email
      if (email) {
        const customerName = ticket.contactName || (ticket.contact ? `${ticket.contact.firstName} ${ticket.contact.lastName}` : "Müşteri")
        const settings = await db.setting.findUnique({ where: { key: "company_name" } })
        const companyName = settings?.value || "STUUX"
        const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/destek/${ticket.publicToken}`

        import("@/lib/email").then(({ sendEmail, ticketNotificationTemplate }) => {
          sendEmail({
            to: email,
            subject: `${companyName} - Destek Yanıtı [${ticket.ticketNumber}]`,
            html: ticketNotificationTemplate({ ticketNumber: ticket.ticketNumber, companyName, customerName, subject: ticket.subject, publicUrl }),
          }).catch(() => {})
        })
      }
    }
  }

  revalidatePath(`/admin/tickets/${data.ticketId}`)
  return message
}

export async function addTicketAttachment(data: {
  ticketId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
}) {
  const attachment = await db.ticketAttachment.create({ data })
  revalidatePath(`/admin/tickets/${data.ticketId}`)
  return attachment
}
