"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getProductCategoryTree() {
  const all = await db.productCategory.findMany({ orderBy: { sortOrder: "asc" } })

  type CatNode = (typeof all)[number] & { children: CatNode[] }

  function buildTree(parentId: string | null): CatNode[] {
    return all
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((c) => ({ ...c, children: buildTree(c.id) }))
  }

  return buildTree(null)
}

export async function createProductCategory(data: {
  name: string
  nameEn?: string
  slug: string
  description?: string
  parentId?: string
  sortOrder?: number
}) {
  await db.productCategory.create({ data })
  revalidatePath("/admin/products/categories")
  revalidatePath("/admin/products")
}

export async function updateProductCategory(
  id: string,
  data: { name?: string; nameEn?: string; slug?: string; description?: string; parentId?: string | null; sortOrder?: number; isActive?: boolean }
) {
  await db.productCategory.update({ where: { id }, data })
  revalidatePath("/admin/products/categories")
  revalidatePath("/admin/products")
}

export async function deleteProductCategory(id: string) {
  await db.productCategory.updateMany({ where: { parentId: id }, data: { parentId: null } })
  await db.product.updateMany({ where: { categoryId: id }, data: { categoryId: null } })
  await db.productCategory.delete({ where: { id } })
  revalidatePath("/admin/products/categories")
  revalidatePath("/admin/products")
}
