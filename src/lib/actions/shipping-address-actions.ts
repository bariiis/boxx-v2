"use server"


import { requireUser } from "@/lib/auth-guard"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getShippingAddresses(organizationId: string) {
  await requireUser()
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
  await requireUser()
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
  await requireUser()
  const existing = await db.shippingAddress.findUnique({ where: { id } })
  if (!existing) return null

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
  await requireUser()
  const address = await db.shippingAddress.delete({ where: { id } })
  revalidatePath(`/admin/organizations/${address.organizationId}`)
  revalidatePath("/portal")
}
