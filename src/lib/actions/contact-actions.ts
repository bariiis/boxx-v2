"use server"


import { requireStaff } from "@/lib/auth-guard"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getContacts({
  search = "",
  page = 1,
  limit = 20,
  organizationId,
}: {
  search?: string
  page?: number
  limit?: number
  organizationId?: string
} = {}) {
  await requireStaff()
  const where = {
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: "insensitive" as const } },
        { lastName: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { phone: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(organizationId && { organizationId }),
  }

  const [contacts, total] = await Promise.all([
    db.contact.findMany({
      where,
      include: { organization: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.contact.count({ where }),
  ])

  return { contacts, total, totalPages: Math.ceil(total / limit) }
}

export async function getContact(id: string) {
  await requireStaff()
  return db.contact.findUnique({
    where: { id },
    include: {
      organization: true,
      quotes: { orderBy: { createdAt: "desc" }, take: 10 },
      tickets: { orderBy: { createdAt: "desc" }, take: 10 },
      serialNumbers: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  })
}

export async function createContact(data: {
  title?: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  department?: string
  notes?: string
  organizationId?: string
}) {
  await requireStaff()
  const contact = await db.contact.create({ data })
  revalidatePath("/admin/contacts")
  return contact
}

export async function updateContact(
  id: string,
  data: {
    title?: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    department?: string
    notes?: string
    organizationId?: string | null
  }
) {
  await requireStaff()
  const contact = await db.contact.update({ where: { id }, data })
  revalidatePath("/admin/contacts")
  revalidatePath(`/admin/contacts/${id}`)
  return contact
}

export async function deleteContact(id: string) {
  await requireStaff()
  await db.contact.delete({ where: { id } })
  revalidatePath("/admin/contacts")
}
