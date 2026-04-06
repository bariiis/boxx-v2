"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSolutionCategoryTree() {
  const all = await db.solutionCategory.findMany({ orderBy: { sortOrder: "asc" } })
  const roots = all.filter((c) => !c.parentId)
  return roots.map((root) => ({
    ...root,
    children: all
      .filter((c) => c.parentId === root.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((c) => ({ ...c, children: [] as typeof all })),
  }))
}

export async function getSolutionCategoryById(id: string) {
  return db.solutionCategory.findUnique({ where: { id } })
}

export async function createSolutionCategory(data: {
  name: string
  nameEn?: string
  slug: string
  description?: string
  parentId?: string
  sortOrder?: number
}) {
  await db.solutionCategory.create({ data })
  revalidatePath("/admin/solutions/categories")
  revalidatePath("/admin/solutions")
}

export async function updateSolutionCategory(
  id: string,
  data: {
    name?: string
    nameEn?: string
    slug?: string
    description?: string
    subtitle?: string
    intro?: string
    icon?: string
    heroImage?: string
    parentId?: string | null
    sortOrder?: number
    isActive?: boolean
  }
) {
  await db.solutionCategory.update({ where: { id }, data })
  revalidatePath("/admin/solutions/categories")
  revalidatePath(`/admin/solutions/categories/${id}`)
  revalidatePath("/admin/solutions")
}

export async function deleteSolutionCategory(id: string) {
  await db.solutionCategory.updateMany({ where: { parentId: id }, data: { parentId: null } })
  await db.solution.updateMany({ where: { categoryId: id }, data: { categoryId: null } })
  await db.solutionCategory.delete({ where: { id } })
  revalidatePath("/admin/solutions/categories")
  revalidatePath("/admin/solutions")
}
