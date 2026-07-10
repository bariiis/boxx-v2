"use server"


import { requireStaff } from "@/lib/auth-guard"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// ==========================================
// PRODUCT SECTIONS
// ==========================================

export async function getProductSections(productId: string) {
  await requireStaff()
  return db.productSection.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  })
}

export async function addProductSection(productId: string, data: {
  sectionType: string
  tabKey: string
  tabLabel: string
  content?: string
  sortOrder?: number
}) {
  await requireStaff()
  const maxOrder = await db.productSection.findFirst({
    where: { productId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  })
  const section = await db.productSection.create({
    data: {
      productId,
      ...data,
      sortOrder: data.sortOrder ?? (maxOrder?.sortOrder ?? -1) + 1,
    },
  })
  revalidatePath(`/admin/products/${productId}`)
  revalidatePath("/urunler")
  return section
}

export async function updateProductSection(id: string, data: {
  tabLabel?: string
  sectionType?: string
  content?: string
  sortOrder?: number
}) {
  await requireStaff()
  const section = await db.productSection.update({ where: { id }, data })
  revalidatePath(`/admin/products/${section.productId}`)
  revalidatePath("/urunler")
  return section
}

export async function deleteProductSection(id: string) {
  await requireStaff()
  const section = await db.productSection.delete({ where: { id } })
  revalidatePath(`/admin/products/${section.productId}`)
  revalidatePath("/urunler")
}

export async function reorderProductSections(productId: string, sectionIds: string[]) {
  await requireStaff()
  await db.$transaction(
    sectionIds.map((id, i) => db.productSection.update({ where: { id }, data: { sortOrder: i } }))
  )
  revalidatePath(`/admin/products/${productId}`)
}

// ==========================================
// PRODUCT FAQS
// ==========================================

export async function getProductFaqs(productId: string) {
  await requireStaff()
  return db.productFaq.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  })
}

export async function addProductFaq(productId: string, data: { question: string; answer: string }) {
  await requireStaff()
  const maxOrder = await db.productFaq.findFirst({
    where: { productId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  })
  const faq = await db.productFaq.create({
    data: { productId, ...data, sortOrder: (maxOrder?.sortOrder ?? -1) + 1 },
  })
  revalidatePath(`/admin/products/${productId}`)
  revalidatePath("/urunler")
  return faq
}

export async function updateProductFaq(id: string, data: { question?: string; answer?: string }) {
  await requireStaff()
  const faq = await db.productFaq.update({ where: { id }, data })
  revalidatePath(`/admin/products/${faq.productId}`)
  return faq
}

export async function deleteProductFaq(id: string) {
  await requireStaff()
  const faq = await db.productFaq.delete({ where: { id } })
  revalidatePath(`/admin/products/${faq.productId}`)
}

export async function reorderProductFaqs(productId: string, faqIds: string[]) {
  await requireStaff()
  await db.$transaction(
    faqIds.map((id, i) => db.productFaq.update({ where: { id }, data: { sortOrder: i } }))
  )
  revalidatePath(`/admin/products/${productId}`)
}

// ==========================================
// PRODUCT HERO & FEATURES
// ==========================================

export async function updateProductLanding(productId: string, data: {
  heroTitle?: string | null
  heroSubtitle?: string | null
  heroVideo?: string | null
  features?: { icon: string; title: string; description: string }[] | null
}) {
  await requireStaff()
  await db.product.update({
    where: { id: productId },
    data: {
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      heroVideo: data.heroVideo,
      features: data.features as never,
    },
  })
  revalidatePath(`/admin/products/${productId}`)
  revalidatePath("/urunler")
}

// ==========================================
// PRODUCT BENCHMARKS
// ==========================================

export async function getProductBenchmarks(productId: string) {
  await requireStaff()
  return db.benchmarkChart.findMany({
    where: { productId },
    include: { datasets: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  })
}

export async function addProductBenchmark(productId: string, data: {
  title: string
  chartType?: string
  unit?: string
  sectionKey?: string
  labels: string[]
  datasets: { name: string; color: string; values: number[] }[]
}) {
  await requireStaff()
  const chart = await db.benchmarkChart.create({
    data: {
      productId,
      title: data.title,
      chartType: data.chartType || "bar",
      unit: data.unit || "points",
      sectionKey: data.sectionKey,
      labels: JSON.stringify(data.labels),
      datasets: {
        create: data.datasets.map((ds, i) => ({
          name: ds.name,
          color: ds.color,
          values: JSON.stringify(ds.values),
          sortOrder: i,
        })),
      },
    },
  })
  revalidatePath(`/admin/products/${productId}`)
  return chart
}

export async function deleteProductBenchmark(id: string) {
  await requireStaff()
  const chart = await db.benchmarkChart.delete({ where: { id } })
  if (chart.productId) revalidatePath(`/admin/products/${chart.productId}`)
}
