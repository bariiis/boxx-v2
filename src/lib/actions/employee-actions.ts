"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import type { UserRole } from "@/generated/prisma"

export async function getEmployees({
  search = "",
  page = 1,
  limit = 20,
} = {}) {
  const where = {
    role: { in: ["ADMIN" as const, "EMPLOYEE" as const] },
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { surname: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { username: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  }

  const [employees, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.user.count({ where }),
  ])

  return { employees, total, totalPages: Math.ceil(total / limit) }
}

export async function getEmployee(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      surname: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  })
}

export async function createEmployee(data: {
  username: string
  name: string
  surname: string
  email: string
  phone?: string
  password: string
  role: UserRole
}) {
  const hashedPassword = await bcrypt.hash(data.password, 12)
  const employee = await db.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  })
  revalidatePath("/admin/employees")
  return employee
}

export async function updateEmployee(
  id: string,
  data: {
    username?: string
    name?: string
    surname?: string
    email?: string
    phone?: string
    role?: UserRole
    isActive?: boolean
    password?: string
  }
) {
  const updateData: Record<string, unknown> = { ...data }
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12)
  } else {
    delete updateData.password
  }

  const employee = await db.user.update({ where: { id }, data: updateData })
  revalidatePath("/admin/employees")
  revalidatePath(`/admin/employees/${id}`)
  return employee
}

export async function deleteEmployee(id: string) {
  await db.user.delete({ where: { id } })
  revalidatePath("/admin/employees")
}
