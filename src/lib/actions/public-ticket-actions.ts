"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

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

export async function getPublicTicketCategories() {
  return db.ticketCategory.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  })
}

export async function createPublicTicket(data: {
  subject: string
  description: string
  contactName: string
  contactEmail: string
  categoryId?: string
  serialNumber?: string
  attachments?: { fileName: string; fileUrl: string; fileSize: number; mimeType: string }[]
}) {
  const ticketNumber = await generateTicketNumber()

  // Try to find serial number
  let serialNumberId: string | undefined
  if (data.serialNumber) {
    const sn = await db.serialNumber.findUnique({
      where: { serialNumber: data.serialNumber },
      select: { id: true },
    })
    if (sn) serialNumberId = sn.id
  }

  const ticket = await db.ticket.create({
    data: {
      ticketNumber,
      subject: data.subject,
      description: data.description,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
      ...(serialNumberId && { serialNumber: { connect: { id: serialNumberId } } }),
    },
  })

  // Save attachments
  if (data.attachments?.length) {
    for (const att of data.attachments) {
      await db.ticketAttachment.create({
        data: {
          ticketId: ticket.id,
          fileName: att.fileName,
          fileUrl: att.fileUrl,
          fileSize: att.fileSize,
          mimeType: att.mimeType,
        },
      })
    }
  }

  revalidatePath("/admin/tickets")
  return { ticketNumber: ticket.ticketNumber, publicToken: ticket.publicToken }
}

export async function getPublicTicketByToken(token: string) {
  return db.ticket.findUnique({
    where: { publicToken: token },
    include: {
      category: { select: { name: true } },
      messages: {
        where: { isInternal: false },
        include: {
          sender: { select: { name: true, surname: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      attachments: { orderBy: { createdAt: "asc" } },
    },
  })
}

export async function lookupTicket(ticketNumber: string) {
  const ticket = await db.ticket.findUnique({
    where: { ticketNumber: ticketNumber.trim().toUpperCase() },
    select: { publicToken: true },
  })
  return ticket?.publicToken || null
}

export async function lookupSerialNumber(serialNumber: string) {
  const sn = await db.serialNumber.findUnique({
    where: { serialNumber: serialNumber.trim() },
    include: {
      product: {
        select: {
          name: true,
          sku: true,
          slug: true,
          heroImage: true,
          warrantyMonths: true,
          category: { select: { name: true } },
        },
      },
      organization: { select: { name: true } },
      contact: { select: { firstName: true, lastName: true } },
    },
  })
  if (!sn) return null

  return {
    serialNumber: sn.serialNumber,
    isActive: sn.isActive,
    warrantyStart: sn.warrantyStart,
    warrantyEnd: sn.warrantyEnd,
    configuration: sn.configuration,
    product: sn.product,
    organization: sn.organization,
    contact: sn.contact,
  }
}

export async function addPublicMessage(token: string, content: string) {
  const ticket = await db.ticket.findUnique({
    where: { publicToken: token },
    select: { id: true, status: true },
  })
  if (!ticket) throw new Error("Talep bulunamadı")
  if (ticket.status === "CLOSED") throw new Error("Bu talep kapatılmış")

  const message = await db.ticketMessage.create({
    data: {
      ticketId: ticket.id,
      content,
      isInternal: false,
    },
  })

  // Reopen if resolved
  if (ticket.status === "RESOLVED") {
    await db.ticket.update({
      where: { id: ticket.id },
      data: { status: "OPEN" },
    })
  }

  revalidatePath(`/admin/tickets/${ticket.id}`)
  return message
}
