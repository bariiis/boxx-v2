"use server"


import { requireStaff } from "@/lib/auth-guard"
import { db } from "@/lib/db"

export async function getDashboardStats() {
  await requireStaff()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [
    totalOrganizations,
    totalContacts,
    totalProducts,
    // Quotes
    totalQuotes,
    quotesThisMonth,
    quotesLastMonth,
    approvedQuotes,
    pendingQuotes,
    // Orders
    totalOrders,
    ordersThisMonth,
    pendingOrders,
    // Tickets
    openTickets,
    totalTickets,
    // Revenue
    revenueData,
    revenueLastMonth,
    // Serial numbers
    totalSerialNumbers,
    expiringWarranties,
    // Recent items
    recentQuotes,
    recentOrders,
    recentTickets,
  ] = await Promise.all([
    db.organization.count(),
    db.contact.count(),
    db.product.count({ where: { isActive: true } }),
    // Quotes
    db.quote.count(),
    db.quote.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.quote.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
    db.quote.count({ where: { status: "APPROVED" } }),
    db.quote.count({ where: { status: { in: ["DRAFT", "SENT", "VIEWED", "REVISED"] } } }),
    // Orders
    db.order.count(),
    db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.order.count({ where: { status: "PENDING" } }),
    // Tickets
    db.ticket.count({ where: { status: { in: ["OPEN", "AWAITING_REPLY"] } } }),
    db.ticket.count(),
    // Revenue - this month
    db.order.aggregate({ where: { createdAt: { gte: startOfMonth } }, _sum: { totalAmount: true, vatAmount: true } }),
    db.order.aggregate({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } }, _sum: { totalAmount: true } }),
    // Serial numbers
    db.serialNumber.count({ where: { isActive: true } }),
    db.serialNumber.count({
      where: {
        warrantyEnd: {
          gt: now,
          lte: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    // Recent
    db.quote.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, quoteNumber: true, status: true, totalAmount: true, currency: true, createdAt: true,
        organization: { select: { name: true } },
      },
    }),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, orderNumber: true, status: true, totalAmount: true, vatAmount: true, currency: true, createdAt: true,
        organization: { select: { name: true } },
      },
    }),
    db.ticket.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      where: { status: { in: ["OPEN", "AWAITING_REPLY"] } },
      select: {
        id: true, ticketNumber: true, subject: true, status: true, priority: true, createdAt: true,
        contactName: true,
        organization: { select: { name: true } },
      },
    }),
  ])

  const revenueThisMonth = revenueData._sum.totalAmount || 0
  const revenueThisMonthVat = revenueData._sum.vatAmount || 0
  const revenuePrevMonth = revenueLastMonth._sum.totalAmount || 0
  const revenueChange = revenuePrevMonth > 0
    ? ((revenueThisMonth - revenuePrevMonth) / revenuePrevMonth) * 100
    : 0

  const quotesChange = quotesLastMonth > 0
    ? ((quotesThisMonth - quotesLastMonth) / quotesLastMonth) * 100
    : 0

  return {
    totalOrganizations,
    totalContacts,
    totalProducts,
    totalQuotes,
    quotesThisMonth,
    quotesChange,
    approvedQuotes,
    pendingQuotes,
    totalOrders,
    ordersThisMonth,
    pendingOrders,
    openTickets,
    totalTickets,
    revenueThisMonth,
    revenueThisMonthVat,
    revenueChange,
    totalSerialNumbers,
    expiringWarranties,
    recentQuotes,
    recentOrders,
    recentTickets,
  }
}
