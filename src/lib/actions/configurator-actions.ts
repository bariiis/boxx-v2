"use server"


import { requireStaff } from "@/lib/auth-guard"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// ============================================================
// CATEGORY-LEVEL META (single-select toggles)
// ============================================================
export type ConfiguratorMeta = {
  singleSelectCategories?: string[]
}

export async function getConfiguratorMeta(basekitId: string): Promise<ConfiguratorMeta> {
  await requireStaff()
  const p = await db.product.findUnique({
    where: { id: basekitId },
    select: { configuratorMeta: true },
  })
  return (p?.configuratorMeta as ConfiguratorMeta | null) ?? {}
}

export async function setSingleSelectCategory(
  basekitId: string,
  category: string,
  enabled: boolean
) {
  await requireStaff()
  const p = await db.product.findUnique({
    where: { id: basekitId },
    select: { configuratorMeta: true },
  })
  const meta = (p?.configuratorMeta as ConfiguratorMeta | null) ?? {}
  const set = new Set(meta.singleSelectCategories ?? [])
  if (enabled) set.add(category)
  else set.delete(category)
  const next: ConfiguratorMeta = { ...meta, singleSelectCategories: [...set] }
  await db.product.update({
    where: { id: basekitId },
    data: { configuratorMeta: next },
  })
  revalidatePath(`/admin/products/${basekitId}`)
  return next
}

// ============================================================
// LOAD ENTIRE CONFIGURATOR PAYLOAD BY SLUG (public)
// ============================================================
export async function getConfiguratorPayloadBySlug(slug: string) {
  const basekit = await db.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  })
  if (!basekit || basekit.type !== "CONFIGURABLE") return null

  const options = await db.configuratorOption.findMany({
    where: { basekitId: basekit.id },
    include: { component: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  })

  const meta = (basekit.configuratorMeta as ConfiguratorMeta | null) ?? {}

  return { basekit, options, meta }
}

// ============================================================
// LIST OPTIONS FOR A BASEKIT
// ============================================================
export async function listConfiguratorOptions(basekitId: string) {
  await requireStaff()
  return db.configuratorOption.findMany({
    where: { basekitId },
    include: {
      component: {
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          specs: true,
        },
      },
    },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  })
}

// ============================================================
// LIST CANDIDATE COMPONENTS BY componentType
// (used in admin "add option" picker)
// ============================================================
export async function listComponentCandidates(componentType?: string) {
  await requireStaff()
  // Load all active products. Admin picks which to use as components.
  // Filter by componentType (stored in Product.specs JSON) in memory.
  const rows = await db.product.findMany({
    where: { isActive: true },
    select: candidateSelect,
    orderBy: { name: "asc" },
    take: 500,
  })

  if (!componentType) return rows

  const matches = rows.filter((r) => {
    const arr = Array.isArray(r.specs) ? (r.specs as { key: string; value: string }[]) : []
    return arr.some((e) => e?.key === "componentType" && e?.value === componentType)
  })

  // Fallback: if no product has componentType set, show all so admin can pick.
  return matches.length > 0 ? matches : rows
}

const candidateSelect = {
  id: true,
  name: true,
  sku: true,
  price: true,
  specs: true,
} as const

// ============================================================
// CREATE
// ============================================================
export async function createConfiguratorOption(data: {
  basekitId: string
  componentId: string
  category: string
  priceDelta?: number
  isDefault?: boolean
  isRecommended?: boolean
  affectsResources?: boolean
  minQty?: number
  maxQty?: number | null
  sortOrder?: number
}) {
  await requireStaff()
  const created = await db.configuratorOption.create({
    data: {
      basekitId: data.basekitId,
      componentId: data.componentId,
      category: data.category,
      priceDelta: data.priceDelta ?? 0,
      isDefault: data.isDefault ?? false,
      isRecommended: data.isRecommended ?? false,
      affectsResources: data.affectsResources ?? true,
      minQty: data.minQty ?? 0,
      maxQty: data.maxQty ?? null,
      sortOrder: data.sortOrder ?? 0,
    },
  })
  revalidatePath(`/admin/products/${data.basekitId}`)
  return created
}

// ============================================================
// UPDATE
// ============================================================
export async function updateConfiguratorOption(
  id: string,
  data: Partial<{
    priceDelta: number
    isDefault: boolean
    isRecommended: boolean
    affectsResources: boolean
    minQty: number
    maxQty: number | null
    sortOrder: number
    category: string
  }>
) {
  await requireStaff()
  const updated = await db.configuratorOption.update({
    where: { id },
    data,
  })
  revalidatePath(`/admin/products/${updated.basekitId}`)
  return updated
}

// ============================================================
// REORDER
// ============================================================
export async function reorderConfiguratorOptions(basekitId: string, ids: string[]) {
  await requireStaff()
  await db.$transaction(
    ids.map((id, index) =>
      db.configuratorOption.update({ where: { id }, data: { sortOrder: index } })
    )
  )
  revalidatePath(`/admin/products/${basekitId}`)
}

// ============================================================
// DELETE
// ============================================================
export async function deleteConfiguratorOption(id: string) {
  await requireStaff()
  const deleted = await db.configuratorOption.delete({ where: { id } })
  revalidatePath(`/admin/products/${deleted.basekitId}`)
}
