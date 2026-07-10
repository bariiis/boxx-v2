"use server"


import { requireStaff } from "@/lib/auth-guard"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { ProductType } from "@/generated/prisma"

// ==========================================
// CATEGORIES
// ==========================================

export async function getCategories() {
  await requireStaff()
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
  await requireStaff()
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
  await requireStaff()
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
  await requireStaff()
  const category = await db.productCategory.update({ where: { id }, data })
  revalidatePath("/admin/products/categories")
  return category
}

export async function deleteCategory(id: string) {
  await requireStaff()
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
  /** Single category ID or comma-separated list. If a parent is given, all its
   *  descendant category IDs are auto-included. */
  categoryId?: string
  type?: ProductType
} = {}) {
  await requireStaff()
  // Expand categoryId(s) to include child categories of any selected parent.
  let categoryIdSet: string[] | undefined
  if (categoryId) {
    const initial = categoryId.split(",").filter(Boolean)
    const all = await db.productCategory.findMany({
      select: { id: true, parentId: true },
    })
    const childrenOf = new Map<string, string[]>()
    for (const c of all) {
      if (c.parentId) {
        if (!childrenOf.has(c.parentId)) childrenOf.set(c.parentId, [])
        childrenOf.get(c.parentId)!.push(c.id)
      }
    }
    const expanded = new Set<string>()
    const stack = [...initial]
    while (stack.length) {
      const id = stack.pop()!
      if (expanded.has(id)) continue
      expanded.add(id)
      const kids = childrenOf.get(id) ?? []
      for (const k of kids) stack.push(k)
    }
    categoryIdSet = [...expanded]
  }

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { sku: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(categoryIdSet && categoryIdSet.length > 0 && { categoryId: { in: categoryIdSet } }),
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
  await requireStaff()
  return db.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      componentSpecs: true,
      solutionProducts: { select: { solutionId: true } },
    },
  })
}

export async function getSolutionsForPicker() {
  await requireStaff()
  const solutions = await db.solution.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      slug: true,
      icon: true,
      category: {
        select: {
          id: true,
          name: true,
          parent: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }, { title: "asc" }],
  })
  return solutions.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    icon: s.icon,
    categoryName: s.category?.parent
      ? `${s.category.parent.name} › ${s.category.name}`
      : s.category?.name ?? null,
  }))
}

export async function duplicateProduct(id: string) {
  await requireStaff()
  const source = await db.product.findUnique({
    where: { id },
    include: { images: true },
  })
  if (!source) throw new Error("Ürün bulunamadı")

  const newSku = await generateSku()
  const baseSlug = source.slug.replace(/-kopya(-\d+)?$/, "")
  // Find unique slug
  let slugNum = 1
  let newSlug = `${baseSlug}-kopya`
  while (await db.product.findUnique({ where: { slug: newSlug }, select: { id: true } })) {
    slugNum++
    newSlug = `${baseSlug}-kopya-${slugNum}`
  }

  const duplicate = await db.product.create({
    data: {
      sku: newSku,
      slug: newSlug,
      name: `${source.name} (Kopya)`,
      nameEn: source.nameEn ? `${source.nameEn} (Copy)` : null,
      type: source.type,
      description: source.description,
      descriptionEn: source.descriptionEn,
      currency: source.currency,
      price: source.price,
      costPrice: source.costPrice,
      stock: source.stock,
      isActive: false,
      isSaleOpen: false,
      warrantyMonths: source.warrantyMonths,
      weight: source.weight,
      dimensions: source.dimensions,
      categoryId: source.categoryId,
      specs: source.specs ?? undefined,
      configuratorMeta: source.configuratorMeta ?? undefined,
    },
  })

  // Copy configurator options (basekit → component mappings)
  if (source.type === "CONFIGURABLE") {
    const sourceOptions = await db.configuratorOption.findMany({
      where: { basekitId: source.id },
    })
    if (sourceOptions.length > 0) {
      await db.configuratorOption.createMany({
        data: sourceOptions.map((o) => ({
          basekitId: duplicate.id,
          componentId: o.componentId,
          category: o.category,
          priceDelta: o.priceDelta,
          isDefault: o.isDefault,
          isRecommended: o.isRecommended,
          affectsResources: o.affectsResources,
          minQty: o.minQty,
          maxQty: o.maxQty,
          sortOrder: o.sortOrder,
        })),
      })
    }
  }

  revalidatePath("/admin/products")
  return duplicate
}

export async function generateSku() {
  await requireStaff()
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
  showPrice?: boolean
  warrantyMonths?: number
  weight?: number
  dimensions?: string
  categoryId?: string
  specs?: { key: string; value: string }[]
  tags?: string[]
  solutionIds?: string[]
}) {
  await requireStaff()
  const { categoryId, specs, tags, solutionIds, ...rest } = data
  const product = await db.product.create({
    data: {
      ...rest,
      ...(tags && { tags }),
      ...(specs && { specs: specs as never }),
      ...(categoryId && { category: { connect: { id: categoryId } } }),
      ...(solutionIds && solutionIds.length > 0 && {
        solutionProducts: {
          create: solutionIds.map((solutionId) => ({ solutionId })),
        },
      }),
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
    showPrice?: boolean
    warrantyMonths?: number
    weight?: number
    dimensions?: string
    categoryId?: string | null
    specs?: { key: string; value: string }[]
    tags?: string[]
    solutionIds?: string[]
  }
) {
  await requireStaff()
  const { categoryId, specs, tags, solutionIds, ...rest } = data
  const product = await db.product.update({
    where: { id },
    data: {
      ...rest,
      ...(tags !== undefined && { tags }),
      ...(specs && { specs: specs as never }),
      ...(categoryId === null
        ? { category: { disconnect: true } }
        : categoryId
          ? { category: { connect: { id: categoryId } } }
          : {}),
    },
  })

  if (solutionIds !== undefined) {
    await db.solutionProduct.deleteMany({ where: { productId: id } })
    if (solutionIds.length > 0) {
      await db.solutionProduct.createMany({
        data: solutionIds.map((solutionId) => ({ solutionId, productId: id })),
        skipDuplicates: true,
      })
    }
  }

  revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${id}`)
  revalidatePath(`/urunler/${product.slug}`)
  revalidatePath("/urunler")
  return product
}

export async function deleteProduct(id: string) {
  await requireStaff()
  await db.product.delete({ where: { id } })
  revalidatePath("/admin/products")
}

export async function reorderProducts(productIds: string[]) {
  await requireStaff()
  await db.$transaction(
    productIds.map((id, index) =>
      db.product.update({ where: { id }, data: { sortOrder: index } })
    )
  )
  revalidatePath("/admin/products")
  revalidatePath("/urunler")
}

export async function searchProducts(query: string) {
  await requireStaff()
  if (!query || query.length < 2) return []
  return db.product.findMany({
    where: {
      OR: [
        { id: query },
        { name: { contains: query, mode: "insensitive" } },
        { sku: { contains: query, mode: "insensitive" } },
      ],
      isActive: true,
    },
    select: { id: true, name: true, sku: true, price: true, stock: true, type: true },
    take: 15,
  })
}

export async function getProductForLandingHero(productId: string) {
  const product = await db.product.findUnique({
    where: { id: productId, isActive: true },
    include: {
      category: {
        select: {
          id: true, name: true, slug: true,
          parent: { select: { id: true, name: true, slug: true } },
        },
      },
      images: { orderBy: { sortOrder: "asc" } },
      solutionProducts: {
        include: {
          solution: {
            select: { id: true, title: true, slug: true, icon: true, isActive: true },
          },
        },
      },
    },
  })
  if (!product) return null
  const useCases = product.solutionProducts.map((sp) => ({
    id: sp.solution.id,
    name: sp.solution.title,
    slug: sp.solution.slug,
    icon: sp.solution.icon,
  }))
  return {
    product: {
      id: product.id,
      name: product.name,
      nameEn: product.nameEn,
      slug: product.slug,
      sku: product.sku,
      type: product.type,
      description: product.description,
      price: product.price,
      currency: product.currency,
      showPrice: product.showPrice,
      heroImage: product.heroImage,
      sortOrder: product.sortOrder,
      createdAt: product.createdAt,
      images: product.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt })),
      category: product.category,
      specs: product.specs,
    },
    useCases,
    tags: product.tags ?? [],
  }
}

// ==========================================
// PRODUCT IMAGES
// ==========================================

export async function getProductImages(productId: string) {
  await requireStaff()
  return db.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  })
}

export async function addProductImage(productId: string, url: string, alt?: string) {
  await requireStaff()
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
  await requireStaff()
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
  await requireStaff()
  await db.product.update({
    where: { id: productId },
    data: { heroImage: imageUrl },
  })
  revalidatePath(`/admin/products/${productId}`)
  revalidatePath("/urunler")
}

export async function reorderProductImages(productId: string, imageIds: string[]) {
  await requireStaff()
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
