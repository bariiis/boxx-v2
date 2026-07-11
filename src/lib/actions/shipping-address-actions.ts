"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Staff can manage any organization's addresses; customers only their own.
async function requireOrgAccess(organizationId: string) {
  const session = await auth()
  const user = session?.user
  if (!user) throw new Error("Yetkisiz erişim")
  const isStaff = user.role === "ADMIN" || user.role === "EMPLOYEE"
  if (!isStaff && user.organizationId !== organizationId) {
    throw new Error("Yetkisiz erişim")
  }
}

export async function getShippingAddresses(organizationId: string) {
  await requireOrgAccess(organizationId)
  return db.shippingAddress.findMany({
    where: { organizationId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  })
}

export async function createShippingAddress(data: {
  organizationId: string
  label: string
  contactName?: string
  phone?: string
  address: string
  district?: string
  city: string
  postalCode?: string
  country?: string
  isDefault?: boolean
}) {
  await requireOrgAccess(data.organizationId)
  // If setting as default, unset others
  if (data.isDefault) {
    await db.shippingAddress.updateMany({
      where: { organizationId: data.organizationId },
      data: { isDefault: false },
    })
  }

  const address = await db.shippingAddress.create({ data })
  revalidatePath(`/admin/organizations/${data.organizationId}`)
  revalidatePath("/portal")
  return address
}

export async function updateShippingAddress(
  id: string,
  data: {
    label?: string
    contactName?: string | null
    phone?: string | null
    address?: string
    district?: string | null
    city?: string
    postalCode?: string | null
    country?: string
    isDefault?: boolean
  }
) {
  const existing = await db.shippingAddress.findUnique({ where: { id } })
  if (!existing) return null
  await requireOrgAccess(existing.organizationId)

  if (data.isDefault) {
    await db.shippingAddress.updateMany({
      where: { organizationId: existing.organizationId },
      data: { isDefault: false },
    })
  }

  const address = await db.shippingAddress.update({ where: { id }, data })
  revalidatePath(`/admin/organizations/${existing.organizationId}`)
  revalidatePath("/portal")
  return address
}

export async function deleteShippingAddress(id: string) {
  const existing = await db.shippingAddress.findUnique({ where: { id } })
  if (!existing) return
  await requireOrgAccess(existing.organizationId)

  await db.shippingAddress.delete({ where: { id } })
  revalidatePath(`/admin/organizations/${existing.organizationId}`)
  revalidatePath("/portal")
}
