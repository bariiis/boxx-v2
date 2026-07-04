"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { SpecFieldType } from "@/generated/prisma"

// ==========================================
// PRESETS
// ==========================================

export async function getSpecPresets() {
  return db.specPreset.findMany({
    include: {
      fields: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  })
}

export async function getSpecPreset(id: string) {
  return db.specPreset.findUnique({
    where: { id },
    include: {
      fields: { orderBy: { sortOrder: "asc" } },
    },
  })
}

export async function createSpecPreset(data: { name: string; description?: string }) {
  const maxOrder = await db.specPreset.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  })
  const preset = await db.specPreset.create({
    data: { ...data, sortOrder: (maxOrder?.sortOrder ?? -1) + 1 },
  })
  revalidatePath("/admin/products/presets")
  return preset
}

export async function updateSpecPreset(
  id: string,
  data: { name?: string; description?: string }
) {
  const preset = await db.specPreset.update({ where: { id }, data })
  revalidatePath("/admin/products/presets")
  return preset
}

export async function deleteSpecPreset(id: string) {
  await db.specPreset.delete({ where: { id } })
  revalidatePath("/admin/products/presets")
}

export async function reorderSpecPresets(ids: string[]) {
  await db.$transaction(
    ids.map((id, index) =>
      db.specPreset.update({ where: { id }, data: { sortOrder: index } })
    )
  )
  revalidatePath("/admin/products/presets")
}

// ==========================================
// PRESET FIELDS
// ==========================================

export async function addPresetField(
  presetId: string,
  data: {
    key: string
    label?: string
    unit?: string
    fieldType?: SpecFieldType
    options?: string[]
    defaultValue?: string
  }
) {
  const maxOrder = await db.specPresetField.findFirst({
    where: { presetId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  })

  const field = await db.specPresetField.create({
    data: {
      presetId,
      key: data.key,
      label: data.label || null,
      unit: data.unit || null,
      fieldType: data.fieldType || "TEXT",
      options: data.options ? (data.options as never) : undefined,
      defaultValue: data.defaultValue,
      sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
    },
  })
  revalidatePath("/admin/products/presets")
  return field
}

export async function updatePresetField(
  id: string,
  data: {
    key?: string
    label?: string | null
    unit?: string | null
    fieldType?: SpecFieldType
    options?: string[] | null
    defaultValue?: string | null
  }
) {
  const { options, ...rest } = data
  const field = await db.specPresetField.update({
    where: { id },
    data: {
      ...rest,
      ...(options !== undefined && { options: options as never }),
    },
  })
  revalidatePath("/admin/products/presets")
  return field
}

export async function deletePresetField(id: string) {
  await db.specPresetField.delete({ where: { id } })
  revalidatePath("/admin/products/presets")
}

export async function reorderPresetFields(presetId: string, fieldIds: string[]) {
  await db.$transaction(
    fieldIds.map((id, index) =>
      db.specPresetField.update({ where: { id }, data: { sortOrder: index } })
    )
  )
  revalidatePath("/admin/products/presets")
}
