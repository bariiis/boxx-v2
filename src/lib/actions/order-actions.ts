"use server"


import { requireStaff } from "@/lib/auth-guard"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { OrderStatus } from "@/generated/prisma"

export async function getOrders({
  search = "",
  page = 1,
  limit = 20,
  status,
}: {
  search?: string
  page?: number
  limit?: number
  status?: OrderStatus
} = {}) {
  await requireStaff()
  const where = {
    ...(search && {
      OR: [
        { orderNumber: { contains: search, mode: "insensitive" as const } },
        { organization: { name: { contains: search, mode: "insensitive" as const } } },
      ],
    }),
    ...(status && { status }),
  }

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        organization: { select: { name: true } },
        contact: { select: { firstName: true, lastName: true } },
        quote: { select: { quoteNumber: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.order.count({ where }),
  ])

  return { orders, total, totalPages: Math.ceil(total / limit) }
}

export async function getOrder(id: string) {
  await requireStaff()
  return db.order.findUnique({
    where: { id },
    include: {
      organization: true,
      contact: true,
      quote: { select: { id: true, quoteNumber: true, publicToken: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true, heroImage: true } },
        },
      },
      serialNumbers: {
        include: {
          product: { select: { name: true, sku: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireStaff()
  const order = await db.order.update({
    where: { id },
    data: { status },
  })
  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${id}`)
  return order
}
