"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createCustomerUser(data: {
  contactId: string
  organizationId: string
  password: string
}) {
  const contact = await db.contact.findUnique({ where: { id: data.contactId } })
  if (!contact || !contact.email) throw new Error("Kişinin e-posta adresi gerekli")

  // Check if user already exists
  const existing = await db.user.findUnique({ where: { email: contact.email } })
  if (existing) throw new Error("Bu e-posta ile zaten bir kullanıcı mevcut")

  const bcrypt = await import("bcryptjs")
  const hashedPassword = await bcrypt.hash(data.password, 12)

  const user = await db.user.create({
    data: {
      name: contact.firstName,
      surname: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      password: hashedPassword,
      role: "CUSTOMER",
      organization: { connect: { id: data.organizationId } },
    },
  })

  revalidatePath(`/admin/organizations/${data.organizationId}`)
  return user
}

export async function resetCustomerPassword(email: string, newPassword: string) {
  const bcrypt = await import("bcryptjs")
  const hashedPassword = await bcrypt.hash(newPassword, 12)

  const user = await db.user.update({
    where: { email },
    data: { password: hashedPassword },
  })

  revalidatePath("/admin/organizations")
  return user
}

export async function getOrganizationUsers(organizationId: string) {
  return db.user.findMany({
    where: { organizationId, role: "CUSTOMER" },
    select: { id: true, name: true, surname: true, email: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  })
}
