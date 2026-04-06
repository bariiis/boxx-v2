"use server"

import { db } from "@/lib/db"

export async function getPublicCategories() {
  return db.productCategory.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: {
        where: { isActive: true },
        include: {
          _count: { select: { products: { where: { isActive: true } } } },
          children: {
            where: { isActive: true },
            include: {
              _count: { select: { products: { where: { isActive: true } } } },
            },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { sortOrder: "asc" },
  })
}

export async function getPublicProducts({
  search = "",
  categorySlug,
  page = 1,
  limit = 24,
}: {
  search?: string
  categorySlug?: string
  page?: number
  limit?: number
} = {}) {
  const where: Record<string, unknown> = {
    isActive: true,
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  if (categorySlug) {
    // Find category by slug, include products from child + grandchild categories
    const category = await db.productCategory.findUnique({
      where: { slug: categorySlug },
      include: {
        children: {
          select: { id: true, children: { select: { id: true } } },
        },
      },
    })
    if (category) {
      const categoryIds = [
        category.id,
        ...category.children.map((c) => c.id),
        ...category.children.flatMap((c) => c.children.map((gc) => gc.id)),
      ]
      where.categoryId = { in: categoryIds }
    }
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true, name: true, slug: true,
            parent: { select: { id: true, name: true, slug: true } },
          },
        },
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.product.count({ where }),
  ])

  return { products, total, totalPages: Math.ceil(total / limit) }
}

export async function getPublicProduct(slug: string) {
  return db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: {
        select: {
          id: true, name: true, slug: true,
          parent: { select: { id: true, name: true, slug: true } },
        },
      },
      images: { orderBy: { sortOrder: "asc" } },
      componentSpecs: true,
      sections: { orderBy: { sortOrder: "asc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  })
}

export async function getPublicCategoryBySlug(slug: string) {
  return db.productCategory.findUnique({
    where: { slug, isActive: true },
    include: {
      parent: { select: { id: true, name: true, slug: true } },
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  })
}

export async function getProductsForComparison(ids: string[]) {
  if (ids.length === 0) return []
  return db.product.findMany({
    where: { id: { in: ids }, isActive: true },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          parent: { select: { id: true, name: true, slug: true } },
        },
      },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      componentSpecs: true,
    },
  })
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
  return db.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      ...(categoryId && { categoryId }),
    },
    include: {
      category: {
        select: {
          id: true, name: true, slug: true,
          parent: { select: { id: true, name: true, slug: true } },
        },
      },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  })
}
