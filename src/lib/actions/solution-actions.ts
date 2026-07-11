"use server"


import { requireStaff } from "@/lib/auth-guard"
import { safeJsonParse } from "@/lib/safe-json"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSolutions({ search = "", page = 1, limit = 20 } = {}) {
  await requireStaff()
  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { slug: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  }

  const [solutionsRaw, total] = await Promise.all([
    db.solution.findMany({ where, include: { category: true }, orderBy: { sortOrder: "asc" }, skip: (page - 1) * limit, take: limit }),
    db.solution.count({ where }),
  ])

  const solutions = await Promise.all(
    solutionsRaw.map(async (s) => {
      const [sections, benchmarks] = await Promise.all([
        db.solutionSection.findMany({ where: { solutionId: s.id }, select: { id: true } }),
        db.benchmarkChart.findMany({ where: { solutionId: s.id }, select: { id: true } }),
      ])
      return { ...s, sections, benchmarks }
    })
  )

  return { solutions, total, totalPages: Math.ceil(total / limit) }
}

async function loadBenchmarks(solutionId: string) {
  const charts = await db.benchmarkChart.findMany({ where: { solutionId }, orderBy: { sortOrder: "asc" } })
  return Promise.all(
    charts.map(async (c) => {
      const datasets = await db.benchmarkDataset.findMany({ where: { chartId: c.id }, orderBy: { sortOrder: "asc" } })
      return {
        ...c,
        labels: safeJsonParse<string[]>(c.labels, []),
        datasets: datasets.map((d) => ({ ...d, values: safeJsonParse<number[]>(d.values, []) })),
      }
    })
  )
}

export async function getSolution(id: string) {
  await requireStaff()
  const solution = await db.solution.findUnique({ where: { id }, include: { category: true } })
  if (!solution) return null
  const [sections, benchmarks, recommendedProducts] = await Promise.all([
    db.solutionSection.findMany({ where: { solutionId: id }, orderBy: { sortOrder: "asc" } }),
    loadBenchmarks(id),
    db.solutionProduct.findMany({
      where: { solutionId: id },
      orderBy: { sortOrder: "asc" },
      include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } },
    }),
  ])
  return {
    ...solution, sections, benchmarks,
    recommendedProducts: recommendedProducts.map((rp) => ({
      id: rp.id,
      productId: rp.product.id,
      name: rp.product.name,
      slug: rp.product.slug,
      sku: rp.product.sku,
      price: rp.product.price,
      currency: rp.product.currency,
      specs: rp.product.specs as Record<string, string> | null,
      images: rp.product.images.map((img) => img.url),
      note: rp.note,
      sortOrder: rp.sortOrder,
    })),
  }
}

export async function getSolutionBySlug(slug: string) {
  const solution = await db.solution.findUnique({ where: { slug }, include: { category: true } })
  if (!solution || !solution.isActive) return null
  let parentCategory = null
  if (solution.category?.parentId) {
    parentCategory = await db.solutionCategory.findUnique({ where: { id: solution.category.parentId } })
  }
  const [sections, benchmarks, recommendedProducts] = await Promise.all([
    db.solutionSection.findMany({ where: { solutionId: solution.id }, orderBy: { sortOrder: "asc" } }),
    loadBenchmarks(solution.id),
    db.solutionProduct.findMany({
      where: { solutionId: solution.id },
      orderBy: { sortOrder: "asc" },
      include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } },
    }),
  ])
  return {
    ...solution,
    category: solution.category ? { ...solution.category, parent: parentCategory } : null,
    sections, benchmarks,
    recommendedProducts: recommendedProducts.map((rp) => ({
      id: rp.id,
      productId: rp.product.id,
      name: rp.product.name,
      slug: rp.product.slug,
      sku: rp.product.sku,
      price: rp.product.price,
      currency: rp.product.currency,
      specs: rp.product.specs as Record<string, string> | null,
      images: rp.product.images.map((img) => img.url),
      note: rp.note,
      sortOrder: rp.sortOrder,
    })),
  }
}

export async function getSolutionCategories() {
  const parents = await db.solutionCategory.findMany({ where: { isActive: true, parentId: null }, orderBy: { sortOrder: "asc" } })
  return Promise.all(parents.map(async (p) => ({
    ...p,
    children: await db.solutionCategory.findMany({ where: { parentId: p.id, isActive: true }, orderBy: { sortOrder: "asc" } }),
  })))
}

export async function getSolutionMenuData() {
  const parents = await db.solutionCategory.findMany({ where: { isActive: true, parentId: null }, orderBy: { sortOrder: "asc" } })
  return Promise.all(parents.map(async (p) => {
    const children = await db.solutionCategory.findMany({ where: { parentId: p.id, isActive: true }, orderBy: { sortOrder: "asc" } })
    return {
      id: p.id, name: p.name, slug: p.slug,
      children: await Promise.all(children.map(async (child) => ({
        id: child.id, name: child.name, slug: child.slug,
        solutions: await db.solution.findMany({ where: { categoryId: child.id, isActive: true }, select: { title: true, slug: true, icon: true }, orderBy: { sortOrder: "asc" } }),
      }))),
      solutions: await db.solution.findMany({ where: { categoryId: p.id, isActive: true }, select: { title: true, slug: true, icon: true }, orderBy: { sortOrder: "asc" } }),
    }
  }))
}

export async function getSolutionCategoryPage(slug: string) {
  const category = await db.solutionCategory.findUnique({ where: { slug } })
  if (!category || !category.isActive) return null

  // Get parent if this is a subcategory
  let parent = null
  if (category.parentId) {
    parent = await db.solutionCategory.findUnique({ where: { id: category.parentId } })
  }

  // Get child categories (if this is a parent)
  const children = await db.solutionCategory.findMany({
    where: { parentId: category.id, isActive: true },
    orderBy: { sortOrder: "asc" },
  })

  // Get solutions: from this category + all children
  const categoryIds = [category.id, ...children.map((c) => c.id)]
  const solutions = await db.solution.findMany({
    where: { categoryId: { in: categoryIds }, isActive: true },
    select: { id: true, title: true, slug: true, subtitle: true, icon: true, categoryId: true },
    orderBy: { sortOrder: "asc" },
  })

  // Group solutions by category for filtering
  const solutionsByCategory = new Map<string, typeof solutions>()
  for (const sol of solutions) {
    const catId = sol.categoryId || category.id
    if (!solutionsByCategory.has(catId)) solutionsByCategory.set(catId, [])
    solutionsByCategory.get(catId)!.push(sol)
  }

  return {
    category,
    parent,
    children,
    solutions,
    solutionsByCategory: Object.fromEntries(solutionsByCategory),
  }
}

export async function createSolution(data: { title: string; titleEn?: string; slug: string; subtitle?: string; heroImage?: string; metaTitle?: string; metaDescription?: string; categoryId?: string }) {
  await requireStaff()
  const { categoryId, ...rest } = data
  const solution = await db.solution.create({ data: { ...rest, ...(categoryId && { category: { connect: { id: categoryId } } }) } })
  await db.solutionSection.createMany({
    data: [
      { tabKey: "intro", tabLabel: "Giriş", sortOrder: 0 },
      { tabKey: "cpu", tabLabel: "İşlemci", sortOrder: 1 },
      { tabKey: "gpu", tabLabel: "GPU", sortOrder: 2 },
      { tabKey: "ram", tabLabel: "Bellek", sortOrder: 3 },
      { tabKey: "storage", tabLabel: "Depolama", sortOrder: 4 },
      { tabKey: "faq", tabLabel: "Sıkça Sorulan Sorular", sortOrder: 5 },
    ].map((s) => ({ ...s, solutionId: solution.id })),
  })
  revalidatePath("/admin/solutions")
  return solution
}

export async function updateSolution(id: string, data: { title?: string; titleEn?: string; slug?: string; subtitle?: string; icon?: string; heroImage?: string; metaTitle?: string; metaDescription?: string; categoryId?: string | null; isActive?: boolean }) {
  await requireStaff()
  const { categoryId, ...rest } = data
  await db.solution.update({ where: { id }, data: { ...rest, ...(categoryId === null ? { category: { disconnect: true } } : categoryId ? { category: { connect: { id: categoryId } } } : {}) } })
  revalidatePath("/admin/solutions")
  revalidatePath(`/admin/solutions/${id}`)
}

export async function deleteSolution(id: string) {
  await requireStaff()
  await db.solution.delete({ where: { id } })
  revalidatePath("/admin/solutions")
}

export async function updateSectionContent(solutionId: string, tabKey: string, content: string) {
  await requireStaff()
  await db.solutionSection.update({ where: { solutionId_tabKey: { solutionId, tabKey } }, data: { content } })
  revalidatePath(`/admin/solutions/${solutionId}`)
}

export async function addSection(solutionId: string, tabKey: string, tabLabel: string, sortOrder: number) {
  await requireStaff()
  await db.solutionSection.create({ data: { solutionId, tabKey, tabLabel, sortOrder } })
  revalidatePath(`/admin/solutions/${solutionId}`)
}

export async function deleteSection(solutionId: string, tabKey: string) {
  await requireStaff()
  await db.solutionSection.delete({ where: { solutionId_tabKey: { solutionId, tabKey } } })
  revalidatePath(`/admin/solutions/${solutionId}`)
}

export async function createBenchmark(data: {
  solutionId: string; title: string; chartType?: string; unit?: string; sectionKey?: string
  labels: string[]; datasets: { name: string; color: string; values: number[] }[]
}) {
  await requireStaff()
  const chart = await db.benchmarkChart.create({
    data: { solutionId: data.solutionId, title: data.title, chartType: data.chartType || "bar", unit: data.unit || "points", sectionKey: data.sectionKey, labels: JSON.stringify(data.labels) },
  })
  if (data.datasets.length > 0) {
    await db.benchmarkDataset.createMany({
      data: data.datasets.map((d, i) => ({ chartId: chart.id, name: d.name, color: d.color, values: JSON.stringify(d.values), sortOrder: i })),
    })
  }
  revalidatePath(`/admin/solutions/${data.solutionId}`)
  return chart
}

export async function updateBenchmark(id: string, solutionId: string, data: {
  title?: string; chartType?: string; unit?: string; sectionKey?: string
  labels?: string[]; datasets?: { name: string; color: string; values: number[] }[]
}) {
  await requireStaff()
  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.chartType !== undefined) updateData.chartType = data.chartType
  if (data.unit !== undefined) updateData.unit = data.unit
  if (data.sectionKey !== undefined) updateData.sectionKey = data.sectionKey
  if (data.labels !== undefined) updateData.labels = JSON.stringify(data.labels)
  await db.benchmarkChart.update({ where: { id }, data: updateData })
  if (data.datasets) {
    await db.benchmarkDataset.deleteMany({ where: { chartId: id } })
    await db.benchmarkDataset.createMany({
      data: data.datasets.map((d, i) => ({ chartId: id, name: d.name, color: d.color, values: JSON.stringify(d.values), sortOrder: i })),
    })
  }
  revalidatePath(`/admin/solutions/${solutionId}`)
}

export async function deleteBenchmark(id: string, solutionId: string) {
  await requireStaff()
  await db.benchmarkChart.delete({ where: { id } })
  revalidatePath(`/admin/solutions/${solutionId}`)
}

// ==========================================
// RECOMMENDED PRODUCTS
// ==========================================

export async function addRecommendedProduct(solutionId: string, productId: string, note?: string) {
  await requireStaff()
  const count = await db.solutionProduct.count({ where: { solutionId } })
  await db.solutionProduct.create({
    data: { solutionId, productId, note, sortOrder: count },
  })
  revalidatePath(`/admin/solutions/${solutionId}`)
}

export async function updateRecommendedProduct(id: string, solutionId: string, data: { note?: string; sortOrder?: number }) {
  await requireStaff()
  await db.solutionProduct.update({ where: { id }, data })
  revalidatePath(`/admin/solutions/${solutionId}`)
}

export async function removeRecommendedProduct(id: string, solutionId: string) {
  await requireStaff()
  await db.solutionProduct.delete({ where: { id } })
  revalidatePath(`/admin/solutions/${solutionId}`)
}

export async function searchProducts(query: string) {
  await requireStaff()
  if (!query || query.length < 2) return []
  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { sku: { contains: query, mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, sku: true, price: true, currency: true },
    take: 10,
  })
}
