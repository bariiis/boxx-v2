"use server"


import { requireStaff } from "@/lib/auth-guard"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function listCustomFonts() {
  return db.customFont.findMany({ orderBy: { createdAt: "desc" } })
}

export async function createCustomFont(data: {
  name: string
  family: string
  weight?: number
  style?: string
  fileUrl: string
  format?: string
}) {
  await requireStaff()
  const font = await db.customFont.create({
    data: {
      name: data.name,
      family: data.family,
      weight: data.weight ?? 400,
      style: data.style ?? "normal",
      fileUrl: data.fileUrl,
      format: data.format ?? "woff2",
    },
  })
  revalidatePath("/admin/landing-pages")
  return font
}

export async function deleteCustomFont(id: string) {
  await requireStaff()
  await db.customFont.delete({ where: { id } })
  revalidatePath("/admin/landing-pages")
}
