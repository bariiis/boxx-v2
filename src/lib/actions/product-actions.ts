"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { ProductType } from "@/generated/prisma"

// ==========================================
// CATEGORIES
// ==========================================

export async function getCategories() {
  return db.productCategory.findMany({
    include: {
      products: { select: { id: true } },
      children: {
        include: { products: { select: { id: true } } },
        orderBy: { sortOrder: "asc" },
      },
    },
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
  })
}

export async function getAllCategories() {
  const all = await db.productCategory.findMany({ orderBy: { sortOrder: "asc" } })
  const result: { id: string; name: string; depth: number; parentId: string | null }[] = []

  function addLevel(parentId: string | null, depth: number) {
    const items = all.filter((c) => c.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder)
    for (const item of items) {
      result.push({ id: item.id, name: item.name, depth, parentId: item.parentId })
      addLevel(item.id, depth + 1)
    }
  }

  addLevel(null, 0)
  return result
}

export async function createCategory(data: {
  name: string
  nameEn?: string
  subtitle?: string
  slug: string
  description?: string
  parentId?: string
  sortOrder?: number
}) {
  const category = await db.productCategory.create({ data })
  revalidatePath("/admin/products/categories")
  return category
}

export async function updateCategory(
  id: string,
  data: {
    name?: string
    nameEn?: string
    slug?: string
    description?: string
    parentId?: string | null
    sortOrder?: number
    isActive?: boolean
  }
) {
  const category = await db.productCategory.update({ where: { id }, data })
  revalidatePath("/admin/products/categories")
  return category
}

export async function deleteCategory(id: string) {
  await db.productCategory.delete({ where: { id } })
  revalidatePath("/admin/products/categories")
}

// ==========================================
// PRODUCTS
// ==========================================

export async function getProducts({
  search = "",
  page = 1,
  limit = 20,
  categoryId,
  type,
}: {
  search?: string
  page?: number
  limit?: number
  categoryId?: string
  type?: ProductType
} = {}) {
  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { sku: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(categoryId && { categoryId }),
    ...(type && { type }),
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        images: { select: { id: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.product.count({ where }),
  ])

  return { products, total, totalPages: Math.ceil(total / limit) }
}

export async function getProduct(id: string) {
  return db.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      componentSpecs: true,
    },
  })
}

export async function generateSku() {
  const last = await db.product.findFirst({
    where: { sku: { startsWith: "STX-" } },
    orderBy: { sku: "desc" },
    select: { sku: true },
  })
  const lastNum = last ? parseInt(last.sku.replace(/^STX-0*/, "")) || 0 : 0
  return `STX-${String(lastNum + 1).padStart(4, "0")}`
}

export async function createProduct(data: {
  sku: string
  name: string
  nameEn?: string
  slug: string
  type: ProductType
  description?: string
  descriptionEn?: string
  currency?: "USD" | "EUR" | "TRY" | "GBP"
  price: number
  costPrice?: number
  stock?: number
  isActive?: boolean
  isSaleOpen?: boolean
  warrantyMonths?: number
  weight?: number
  dimensions?: string
  categoryId?: string
  specs?: { key: string; value: string }[]
}) {
  const { categoryId, specs, ...rest } = data
  const product = await db.product.create({
    data: {
      ...rest,
      ...(specs && { specs: specs as never }),
      ...(categoryId && { category: { connect: { id: categoryId } } }),
    },
  })
  revalidatePath("/admin/products")
  return product
}

export async function updateProduct(
  id: string,
  data: {
    sku?: string
    name?: string
    nameEn?: string
    slug?: string
    type?: ProductType
    description?: string
    descriptionEn?: string
    currency?: "USD" | "EUR" | "TRY" | "GBP"
    price?: number
    costPrice?: number
    stock?: number
    isActive?: boolean
    isSaleOpen?: boolean
    warrantyMonths?: number
    weight?: number
    dimensions?: string
    categoryId?: string | null
    specs?: { key: string; value: string }[]
  }
) {
  const { categoryId, specs, ...rest } = data
  const product = await db.product.update({
    where: { id },
    data: {
      ...rest,
      ...(specs && { specs: specs as never }),
      ...(categoryId === null
        ? { category: { disconnect: true } }
        : categoryId
          ? { category: { connect: { id: categoryId } } }
          : {}),
    },
  })
  revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${id}`)
  return product
}

export async function deleteProduct(id: string) {
  await db.product.delete({ where: { id } })
  revalidatePath("/admin/products")
}

export async function reorderProducts(productIds: string[]) {
  await db.$transaction(
    productIds.map((id, index) =>
      db.product.update({ where: { id }, data: { sortOrder: index } })
    )
  )
  revalidatePath("/admin/products")
  revalidatePath("/urunler")
}

export async function searchProducts(query: string) {
  if (!query || query.length < 2) return []
  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { sku: { contains: query, mode: "insensitive" } },
      ],
      isActive: true,
    },
    select: { id: true, name: true, sku: true, price: true, stock: true, type: true },
    take: 15,
  })
}

// ==========================================
// PRODUCT IMAGES
// ==========================================

export async function getProductImages(productId: string) {
  return db.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  })
}

export async function addProductImage(productId: string, url: string, alt?: string) {
  const maxOrder = await db.productImage.findFirst({
    where: { productId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  })

  const image = await db.productImage.create({
    data: {
      productId,
      url,
      alt,
      sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
    },
  })

  revalidatePath(`/admin/products/${productId}`)
  revalidatePath("/urunler")
  return image
}

export async function deleteProductImage(id: string) {
  const image = await db.productImage.delete({ where: { id } })

  // Delete file from disk
  if (image.url.startsWith("/uploads/")) {
    const { unlink } = await import("fs/promises")
    const path = await import("path")
    const filePath = path.join(process.cwd(), "public", image.url)
    await unlink(filePath).catch(() => {})
  }

  revalidatePath(`/admin/products/${image.productId}`)
  revalidatePath("/urunler")
  return image
}

export async function setHeroImage(productId: string, imageUrl: string) {
  await db.product.update({
    where: { id: productId },
    data: { heroImage: imageUrl },
  })
  revalidatePath(`/admin/products/${productId}`)
  revalidatePath("/urunler")
}

export async function reorderProductImages(productId: string, imageIds: string[]) {
  await db.$transaction(
    imageIds.map((id, index) =>
      db.productImage.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  )
  revalidatePath(`/admin/products/${productId}`)
  revalidatePath("/urunler")
}
