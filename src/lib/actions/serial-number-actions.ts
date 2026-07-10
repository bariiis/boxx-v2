"use server"


import { requireStaff } from "@/lib/auth-guard"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSerialNumbers({
  search = "",
  page = 1,
  limit = 20,
  isActive,
  warranty,
}: {
  search?: string
  page?: number
  limit?: number
  isActive?: boolean
  warranty?: "active" | "expiring" | "expired"
} = {}) {
  await requireStaff()
  const now = new Date()
  const in90Days = new Date()
  in90Days.setDate(in90Days.getDate() + 90)

  const where: Record<string, unknown> = {
    ...(search && {
      OR: [
        { serialNumber: { contains: search, mode: "insensitive" as const } },
        { configuration: { contains: search, mode: "insensitive" as const } },
        { organization: { name: { contains: search, mode: "insensitive" as const } } },
      ],
    }),
    ...(isActive !== undefined && { isActive }),
  }

  if (warranty === "active") {
    where.warrantyEnd = { gt: in90Days }
  } else if (warranty === "expiring") {
    where.warrantyEnd = { gt: now, lte: in90Days }
  } else if (warranty === "expired") {
    where.warrantyEnd = { lte: now }
  }

  const [serialNumbers, total] = await Promise.all([
    db.serialNumber.findMany({
      where,
      include: {
        product: { select: { id: true, name: true, sku: true } },
        organization: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        tickets: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.serialNumber.count({ where }),
  ])

  return { serialNumbers, total, totalPages: Math.ceil(total / limit) }
}

export async function getSerialNumber(id: string) {
  await requireStaff()
  return db.serialNumber.findUnique({
    where: { id },
    include: {
      product: true,
      organization: true,
      contact: true,
      tickets: {
        include: { category: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  })
}

export async function createSerialNumber(data: {
  serialNumber: string
  productId?: string
  organizationId?: string
  contactId?: string
  configuration?: string
  warrantyStart?: string
  warrantyEnd?: string
  notes?: string
}) {
  await requireStaff()
  const sn = await db.serialNumber.create({
    data: {
      serialNumber: data.serialNumber,
      configuration: data.configuration || undefined,
      notes: data.notes || undefined,
      warrantyStart: data.warrantyStart ? new Date(data.warrantyStart) : new Date(),
      warrantyEnd: data.warrantyEnd ? new Date(data.warrantyEnd) : undefined,
      ...(data.productId && { product: { connect: { id: data.productId } } }),
      ...(data.organizationId && { organization: { connect: { id: data.organizationId } } }),
      ...(data.contactId && { contact: { connect: { id: data.contactId } } }),
    },
  })
  revalidatePath("/admin/serial-numbers")
  return sn
}

export async function updateSerialNumber(
  id: string,
  data: {
    serialNumber?: string
    isActive?: boolean
    configuration?: string
    warrantyStart?: string
    warrantyEnd?: string
    notes?: string
    productId?: string | null
    organizationId?: string | null
    contactId?: string | null
  }
) {
  await requireStaff()
  const { productId, organizationId, contactId, warrantyStart, warrantyEnd, ...rest } = data
  await db.serialNumber.update({
    where: { id },
    data: {
      ...rest,
      ...(warrantyStart && { warrantyStart: new Date(warrantyStart) }),
      ...(warrantyEnd && { warrantyEnd: new Date(warrantyEnd) }),
      ...(productId !== undefined && (productId
        ? { product: { connect: { id: productId } } }
        : { product: { disconnect: true } })),
      ...(organizationId !== undefined && (organizationId
        ? { organization: { connect: { id: organizationId } } }
        : { organization: { disconnect: true } })),
      ...(contactId !== undefined && (contactId
        ? { contact: { connect: { id: contactId } } }
        : { contact: { disconnect: true } })),
    },
  })
  revalidatePath("/admin/serial-numbers")
  revalidatePath(`/admin/serial-numbers/${id}`)
}

export async function deleteSerialNumber(id: string) {
  await requireStaff()
  await db.serialNumber.delete({ where: { id } })
  revalidatePath("/admin/serial-numbers")
}

export async function searchSerialNumbers(query: string) {
  await requireStaff()
  if (!query || query.length < 2) return []
  return db.serialNumber.findMany({
    where: {
      serialNumber: { contains: query, mode: "insensitive" },
    },
    select: { id: true, serialNumber: true, isActive: true },
    take: 10,
  })
}
