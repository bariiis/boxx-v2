"use server"


import { requireStaff } from "@/lib/auth-guard"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { OrganizationType, OrganizationSource, OrganizationStatus } from "@/generated/prisma"

export async function getOrganizations({
  search = "",
  page = 1,
  limit = 20,
  status,
}: {
  search?: string
  page?: number
  limit?: number
  status?: OrganizationStatus
} = {}) {
  await requireStaff()
  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { phone: { contains: search, mode: "insensitive" as const } },
        { taxNumber: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(status && { status }),
  }

  const [organizations, total] = await Promise.all([
    db.organization.findMany({
      where,
      include: {
        contacts: { select: { id: true } },
        quotes: { select: { id: true } },
        tickets: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.organization.count({ where }),
  ])

  return { organizations, total, totalPages: Math.ceil(total / limit) }
}

export async function getOrganization(id: string) {
  await requireStaff()
  return db.organization.findUnique({
    where: { id },
    include: {
      contacts: true,
      quotes: { orderBy: { createdAt: "desc" }, take: 10 },
      tickets: { orderBy: { createdAt: "desc" }, take: 10 },
      serialNumbers: { orderBy: { createdAt: "desc" }, take: 10 },
      shippingAddresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
    },
  })
}

export async function createOrganization(data: {
  type: OrganizationType
  source: OrganizationSource
  status?: OrganizationStatus
  name: string
  taxOffice?: string
  taxNumber?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  district?: string
  city?: string
  country?: string
  notes?: string
}) {
  await requireStaff()
  const organization = await db.organization.create({ data })
  revalidatePath("/admin/organizations")
  return organization
}

export async function updateOrganization(
  id: string,
  data: {
    type?: OrganizationType
    source?: OrganizationSource
    status?: OrganizationStatus
    name?: string
    taxOffice?: string
    taxNumber?: string
    email?: string
    phone?: string
    website?: string
    address?: string
    district?: string
    city?: string
    country?: string
    notes?: string
  }
) {
  await requireStaff()
  const organization = await db.organization.update({ where: { id }, data })
  revalidatePath("/admin/organizations")
  revalidatePath(`/admin/organizations/${id}`)
  return organization
}

export async function deleteOrganization(id: string) {
  await requireStaff()
  await db.organization.delete({ where: { id } })
  revalidatePath("/admin/organizations")
}

export async function searchOrganizations(query: string) {
  await requireStaff()
  if (!query || query.length < 2) return []
  return db.organization.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, email: true, type: true },
    take: 10,
  })
}
