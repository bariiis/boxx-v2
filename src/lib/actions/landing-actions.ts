"use server"


import { requireStaff } from "@/lib/auth-guard"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// ==========================================
// LANDING PAGE CRUD
// ==========================================

export async function getLandingPages(params?: { search?: string; page?: number; limit?: number }) {
  await requireStaff()
  const { search, page = 1, limit = 50 } = params || {}
  const skip = (page - 1) * limit

  const where = search
    ? { OR: [{ title: { contains: search } }, { slug: { contains: search } }] }
    : {}

  const [landingPages, total] = await Promise.all([
    db.landingPage.findMany({
      where,
      include: {
        _count: { select: { sections: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    db.landingPage.count({ where }),
  ])

  return { landingPages, total, totalPages: Math.ceil(total / limit) }
}

export async function getLandingPage(id: string) {
  await requireStaff()
  return db.landingPage.findUnique({
    where: { id },
    include: {
      sections: { orderBy: { sortOrder: "asc" } },
      product: { select: { id: true, name: true, slug: true } },
    },
  })
}

export async function getLandingPageBySlug(slug: string) {
  return db.landingPage.findUnique({
    where: { slug, isActive: true },
    include: {
      sections: { orderBy: { sortOrder: "asc" } },
      product: { select: { id: true, name: true, slug: true } },
    },
  })
}

export async function createLandingPage(data: {
  title: string
  slug: string
  description?: string
  productId?: string
  templateId?: string
}) {
  await requireStaff()
  const landing = await db.landingPage.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      productId: data.productId || null,
    },
  })

  // Apply template sections if specified
  if (data.templateId && data.templateId !== "blank") {
    const { getLandingTemplates } = await import("@/lib/landing-templates")
    const tpl = getLandingTemplates().find((t) => t.id === data.templateId)
    if (tpl && tpl.sections.length > 0) {
      await db.landingSection.createMany({
        data: tpl.sections.map((s, i) => ({
          landingPageId: landing.id,
          sectionType: s.type,
          config: JSON.stringify(s.config),
          sortOrder: i,
        })),
      })
    }
  }

  revalidatePath("/admin/landing-pages")
  return landing
}

export async function updateLandingPage(
  id: string,
  data: {
    title?: string
    slug?: string
    description?: string
    metaTitle?: string
    metaDescription?: string
    productId?: string | null
    isActive?: boolean
    theme?: Record<string, unknown> | null
  }
) {
  await requireStaff()
  const { theme, ...rest } = data
  const landing = await db.landingPage.update({
    where: { id },
    data: {
      ...rest,
      ...(theme !== undefined ? { theme: theme === null ? null : JSON.stringify(theme) } : {}),
    },
  })

  revalidatePath("/admin/landing-pages")
  revalidatePath(`/landing/${landing.slug}`)
  return landing
}

export async function deleteLandingPage(id: string) {
  await requireStaff()
  const landing = await db.landingPage.delete({ where: { id } })
  revalidatePath("/admin/landing-pages")
  revalidatePath(`/landing/${landing.slug}`)
}

// ==========================================
// SECTION CRUD
// ==========================================

export async function addSection(
  landingPageId: string,
  sectionType: string,
  config: Record<string, unknown>
) {
  await requireStaff()
  // Get max sortOrder
  const last = await db.landingSection.findFirst({
    where: { landingPageId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  })

  const section = await db.landingSection.create({
    data: {
      landingPageId,
      sectionType,
      config: JSON.stringify(config),
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  })

  revalidatePath("/admin/landing-pages")
  return section
}

export async function updateSection(
  sectionId: string,
  data: { sectionType?: string; config?: Record<string, unknown>; sortOrder?: number }
) {
  await requireStaff()
  const updateData: Record<string, unknown> = {}
  if (data.sectionType) updateData.sectionType = data.sectionType
  if (data.config) updateData.config = JSON.stringify(data.config)
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder

  const section = await db.landingSection.update({
    where: { id: sectionId },
    data: updateData,
  })

  revalidatePath("/admin/landing-pages")
  return section
}

export async function duplicateSection(sectionId: string) {
  await requireStaff()
  const original = await db.landingSection.findUnique({ where: { id: sectionId } })
  if (!original) throw new Error("Section bulunamadı")

  // Shift all sections after the original by +1
  await db.landingSection.updateMany({
    where: {
      landingPageId: original.landingPageId,
      sortOrder: { gt: original.sortOrder },
    },
    data: { sortOrder: { increment: 1 } },
  })

  const copy = await db.landingSection.create({
    data: {
      landingPageId: original.landingPageId,
      sectionType: original.sectionType,
      config: original.config,
      sortOrder: original.sortOrder + 1,
    },
  })

  revalidatePath("/admin/landing-pages")
  return copy
}

export async function deleteSection(sectionId: string) {
  await requireStaff()
  await db.landingSection.delete({ where: { id: sectionId } })
  revalidatePath("/admin/landing-pages")
}

export async function reorderSections(landingPageId: string, sectionIds: string[]) {
  await requireStaff()
  await db.$transaction(
    sectionIds.map((id, index) =>
      db.landingSection.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  )
  revalidatePath("/admin/landing-pages")
}

