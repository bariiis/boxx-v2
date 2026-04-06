"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

async function getSessionOrg() {
  const session = await auth()
  if (!session?.user) return null
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
    email: session.user.email,
  }
}

export async function getPortalDashboard() {
  const ctx = await getSessionOrg()
  if (!ctx) return null

  const where = ctx.organizationId
    ? { organizationId: ctx.organizationId }
    : { contact: { email: ctx.email } }

  const [quotes, orders, openTickets] = await Promise.all([
    db.quote.count({ where }),
    db.order.count({ where: ctx.organizationId ? { organizationId: ctx.organizationId } : {} }),
    db.ticket.count({
      where: {
        ...where,
        status: { in: ["OPEN", "AWAITING_REPLY"] },
      },
    }),
  ])

  const recentQuotes = await db.quote.findMany({
    where,
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, quoteNumber: true, status: true, totalAmount: true, currency: true,
      publicToken: true, createdAt: true, projectName: true,
    },
  })

  const recentOrders = await db.order.findMany({
    where: ctx.organizationId ? { organizationId: ctx.organizationId } : {},
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, orderNumber: true, status: true, totalAmount: true, vatAmount: true,
      currency: true, createdAt: true,
    },
  })

  return { quotes, orders, openTickets, recentQuotes, recentOrders }
}

export async function getMyQuotes() {
  const ctx = await getSessionOrg()
  if (!ctx) return []

  const where = ctx.organizationId
    ? { organizationId: ctx.organizationId }
    : { contact: { email: ctx.email } }

  return db.quote.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, quoteNumber: true, status: true, totalAmount: true, currency: true,
      publicToken: true, projectName: true, validUntil: true, createdAt: true,
      items: { select: { id: true } },
    },
  })
}

export async function getMyOrders() {
  const ctx = await getSessionOrg()
  if (!ctx) return []

  return db.order.findMany({
    where: ctx.organizationId ? { organizationId: ctx.organizationId } : {},
    orderBy: { createdAt: "desc" },
    select: {
      id: true, orderNumber: true, status: true, totalAmount: true, vatAmount: true,
      currency: true, createdAt: true,
      quote: { select: { quoteNumber: true, publicToken: true } },
      _count: { select: { items: true } },
    },
  })
}

export async function getMyAddresses() {
  const ctx = await getSessionOrg()
  if (!ctx?.organizationId) return []

  return db.shippingAddress.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  })
}

export async function getMyTickets() {
  const ctx = await getSessionOrg()
  if (!ctx) return []

  const where = ctx.organizationId
    ? { organizationId: ctx.organizationId }
    : { contactEmail: ctx.email }

  return db.ticket.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, ticketNumber: true, publicToken: true, subject: true,
      status: true, priority: true, createdAt: true,
      category: { select: { name: true } },
      _count: { select: { messages: true } },
    },
  })
}
