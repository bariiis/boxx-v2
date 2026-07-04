/**
 * Convert Product.specs JSON (the [{key,value,type,options?}] format the
 * admin form uses) into a SpecLite object the engine understands.
 *
 * The `key` names below MUST match the seeded SpecPreset field keys so that
 * when admin imports a preset and fills in values, the engine can consume
 * them without any extra mapping.
 */

import type { SpecLite } from "./engine"

type SpecEntry = { key: string; value: string; type?: string; options?: string[] }

function toNum(s: unknown): number | undefined {
  if (s == null || s === "") return undefined
  const n = typeof s === "number" ? s : parseFloat(String(s).replace(",", "."))
  return Number.isFinite(n) ? n : undefined
}

function toBool(s: unknown): boolean | undefined {
  if (s == null || s === "") return undefined
  const v = String(s).toLowerCase().trim()
  if (["true", "evet", "yes", "1", "var"].includes(v)) return true
  if (["false", "hayır", "hayir", "no", "0", "yok"].includes(v)) return false
  return undefined
}

function toStr(s: unknown): string | undefined {
  if (s == null || s === "") return undefined
  return String(s)
}

/**
 * Canonical keys the engine reads. Field labels in presets can be Turkish
 * but the `key` MUST match one of these exactly.
 */
export const SPEC_KEYS = {
  componentType: "componentType",
  // Basekit resources
  ramSlots: "ramSlots",
  maxRamCapacity: "maxRamCapacity",
  pcieSlots: "pcieSlots",
  pcieLayout: "pcieLayout",
  nvmePorts: "nvmePorts",
  ssdBays: "ssdBays",
  hddBays: "hddBays",
  maxGpuLength: "maxGpuLength",
  maxGpuCount: "maxGpuCount",
  supportsDualPsu: "supportsDualPsu",
  socketType: "socketType",
  ramType: "ramType",
  // Consumption
  pcieSlotWidth: "pcieSlotWidth",
  pcieLanesUsed: "pcieLanesUsed",
  pcieMinPhysical: "pcieMinPhysical",
  lengthMm: "lengthMm",
  ramCapacityGb: "ramCapacityGb",
  storageGb: "storageGb",
  storageInterface: "storageInterface",
  socketRequired: "socketRequired",
  psuWatts: "psuWatts",
  idleWatts: "idleWatts",
  tdpWatts: "tdpWatts",
} as const

export function specsJsonToSpecLite(specs: unknown): SpecLite {
  const entries: SpecEntry[] = Array.isArray(specs)
    ? (specs as SpecEntry[])
    : []
  const map = new Map<string, string>()
  for (const e of entries) {
    if (e && typeof e.key === "string" && e.value != null) {
      map.set(e.key, String(e.value))
    }
  }
  const get = (k: string) => map.get(k)

  return {
    componentType: toStr(get(SPEC_KEYS.componentType)),
    ramSlots: toNum(get(SPEC_KEYS.ramSlots)),
    maxRamCapacity: toNum(get(SPEC_KEYS.maxRamCapacity)),
    pcieSlots: toNum(get(SPEC_KEYS.pcieSlots)),
    pcieLayout: toStr(get(SPEC_KEYS.pcieLayout)),
    nvmePorts: toNum(get(SPEC_KEYS.nvmePorts)),
    ssdBays: toNum(get(SPEC_KEYS.ssdBays)),
    hddBays: toNum(get(SPEC_KEYS.hddBays)),
    maxGpuLength: toNum(get(SPEC_KEYS.maxGpuLength)),
    maxGpuCount: toNum(get(SPEC_KEYS.maxGpuCount)),
    supportsDualPsu: toBool(get(SPEC_KEYS.supportsDualPsu)),
    socketType: toStr(get(SPEC_KEYS.socketType)),
    ramType: toStr(get(SPEC_KEYS.ramType)),

    pcieSlotWidth: toNum(get(SPEC_KEYS.pcieSlotWidth)),
    pcieLanesUsed: toNum(get(SPEC_KEYS.pcieLanesUsed)),
    pcieMinPhysical: toNum(get(SPEC_KEYS.pcieMinPhysical)),
    lengthMm: toNum(get(SPEC_KEYS.lengthMm)),
    ramCapacityGb: toNum(get(SPEC_KEYS.ramCapacityGb)),
    storageGb: toNum(get(SPEC_KEYS.storageGb)),
    storageInterface: toStr(get(SPEC_KEYS.storageInterface)),
    socketRequired: toStr(get(SPEC_KEYS.socketRequired)),
    psuWatts: toNum(get(SPEC_KEYS.psuWatts)),
    idleWatts: toNum(get(SPEC_KEYS.idleWatts)),
    tdpWatts: toNum(get(SPEC_KEYS.tdpWatts)),
  }
}
