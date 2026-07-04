/**
 * STUUX BOXX — Configurator Engine
 *
 * Pure TypeScript constraint solver for hardware configurations.
 * No DB, no React, no I/O — just data in / decision out.
 *
 * Concepts:
 *  - Basekit (chassis) provides RESOURCES (slots, bays, ports, power capacity).
 *  - Components CONSUME resources (PCIe slots, RAM slots, watts, ...).
 *  - Engine validates a Selection: usage ≤ resources, returns issues + dynamic max quantities.
 *
 * PCIe modeling:
 *  - If basekit has `pcieLayout` (e.g. "16,0,8o,0,0,0,1"), engine runs positional
 *    greedy packing per request — this handles real-world boards with mixed slot
 *    sizes, gaps, and open-ended slots. Takes precedence over `pcieSlots`.
 *  - Otherwise, falls back to simple `pcieSlots` total clearance check.
 */

import {
  parseLayout,
  packCards,
  type Card as PackCard,
  type SlotState,
} from "./pcie-packing"

// ============================================================
// TYPES
// ============================================================

/** Subset of ComponentSpec the engine cares about. Keep DB-agnostic. */
export interface SpecLite {
  componentType?: string | null
  // Basekit-provided resources
  ramSlots?: number | null
  maxRamCapacity?: number | null
  pcieSlots?: number | null
  /** Per-position PCIe layout, e.g. "16,0,8o,0,0,0,1". When set, packing engine
   *  uses positional placement instead of simple slot counts. */
  pcieLayout?: string | null
  nvmePorts?: number | null
  ssdBays?: number | null
  hddBays?: number | null
  maxGpuLength?: number | null
  maxGpuCount?: number | null
  supportsDualPsu?: boolean | null
  socketType?: string | null
  ramType?: string | null
  // Component consumption
  pcieSlotWidth?: number | null
  pcieLanesUsed?: number | null
  /** Required physical slot lane size (16 for typical GPU). Defaults to lanesUsed. */
  pcieMinPhysical?: number | null
  lengthMm?: number | null
  ramCapacityGb?: number | null
  storageGb?: number | null
  storageInterface?: string | null
  socketRequired?: string | null
  psuWatts?: number | null
  idleWatts?: number | null
  tdpWatts?: number | null
}

export interface ProductLite {
  id: string
  name: string
  price: number
  componentSpecs?: SpecLite | null
}

/** Category names — must mirror ConfiguratorOption.category in DB. */
export type Category =
  | "cpu"
  | "gpu"
  | "ram"
  | "nvme_os"
  | "nvme"
  | "ssd"
  | "hdd"
  | "psu"
  | "cooling"
  | "expansion_card"
  | "network_card"
  | "os"
  | "raid_config"
  | "power_cable"
  | "warranty"
  | "service"
  | "software_license"
  | "peripheral"
  | "shipping"
  | "rack_kit"
  | "customization"

/** Categories that consume basekit resources. */
export const HARDWARE_CATEGORIES: Category[] = [
  "cpu",
  "gpu",
  "ram",
  "nvme_os",
  "nvme",
  "ssd",
  "hdd",
  "psu",
  "cooling",
  "expansion_card",
  "network_card",
]

/** A single line in the user's selection. */
export interface SelectionLine {
  category: Category
  componentId: string
  qty: number
}

/** What the user has chosen, plus the basekit they started from. */
export interface Selection {
  basekitId: string
  lines: SelectionLine[]
}

/** Option as exposed to the engine (DB row + joined component). */
export interface OptionLite {
  id: string
  basekitId: string
  componentId: string
  category: Category
  priceDelta: number
  isDefault: boolean
  isRecommended: boolean
  affectsResources: boolean
  minQty: number
  maxQty: number | null
  component: ProductLite
}

// ============================================================
// CONSTANTS
// ============================================================

/** Power headroom multiplier (PSU should be sized × this above draw). */
export const POWER_HEADROOM = 1.4

/** Baseline draw for motherboard, fans, USB, etc. */
export const BASELINE_WATTS = 50

/** Default idle draw assumptions when spec missing. */
const DEFAULT_RAM_IDLE_W = 3
const DEFAULT_NVME_IDLE_W = 7
const DEFAULT_SATA_IDLE_W = 6

// ============================================================
// USAGE & ISSUES
// ============================================================

export interface ResourcePool {
  used: number
  total: number
}

export interface ResourceUsage {
  pcieSlots: ResourcePool
  /** PCIe physical connectors (only populated when layout-aware mode is used) */
  pcieConnectors: ResourcePool
  /** Per-position slot state for layout-aware visualization (null in simple mode) */
  pcieLayoutState: SlotState[] | null
  ramSlots: ResourcePool
  ramCapacityGb: ResourcePool
  nvmeBays: ResourcePool
  ssdBays: ResourcePool
  hddBays: ResourcePool
  powerDrawW: number
  psuCapacityW: number
  recommendedPsuW: number
  longestGpuMm: number
  maxGpuLengthMm: number
}

export type Issue =
  | { kind: "slot_overflow"; resource: keyof ResourceUsage; over: number; message: string }
  | { kind: "socket_mismatch"; expected: string; got: string; message: string }
  | { kind: "ram_type_mismatch"; expected: string; got: string; message: string }
  | { kind: "gpu_too_long"; max: number; got: number; message: string }
  | { kind: "psu_underpowered"; need: number; have: number; message: string }
  | { kind: "dual_psu_unsupported"; message: string }
  | { kind: "missing_required"; category: Category; message: string }
  | { kind: "max_qty_exceeded"; category: Category; max: number; got: number; message: string }
  | { kind: "ram_capacity"; max: number; got: number; message: string }

export interface ValidationResult {
  ok: boolean
  usage: ResourceUsage
  issues: Issue[]
  totalPriceCents: number
  /** Per-component dynamic max quantity (after current selection). */
  maxQty: Record<string, number>
  /** Per-category, set of component IDs that cannot be added at all right now. */
  unavailable: Record<Category, Set<string>>
}

// ============================================================
// HELPERS
// ============================================================

function lookupOption(
  options: OptionLite[],
  componentId: string,
  category: Category
): OptionLite | undefined {
  return options.find((o) => o.componentId === componentId && o.category === category)
}

const PCIE_CATEGORIES: ReadonlySet<Category> = new Set<Category>([
  "gpu",
  "expansion_card",
  "network_card",
])

/** Convert one selection line to N PackCards (one per qty unit).
 *  Returns empty array when the component has no PCIe spec data at all,
 *  which means the engine skips layout-aware packing for it (admin hasn't
 *  filled in the spec yet). */
function expandToPackCards(
  category: Category,
  componentId: string,
  spec: SpecLite,
  qty: number,
  name: string
): PackCard[] {
  // When no PCIe-related spec is set, skip packing — don't guess defaults
  // that will produce false-positive "slot çakışıyor" errors.
  if (
    spec.pcieSlotWidth == null &&
    spec.pcieLanesUsed == null &&
    spec.pcieMinPhysical == null
  ) {
    return []
  }
  const width = spec.pcieSlotWidth ?? (category === "gpu" ? 2 : 1)
  const minPhysical =
    spec.pcieMinPhysical ??
    spec.pcieLanesUsed ??
    (category === "gpu" ? 16 : 1)
  const out: PackCard[] = []
  for (let i = 0; i < qty; i++) {
    out.push({
      key: `${category}:${componentId}:${i}`,
      name,
      width,
      minPhysical,
    })
  }
  return out
}

function emptyUsage(basekit: SpecLite | null | undefined): ResourceUsage {
  return {
    pcieSlots: { used: 0, total: basekit?.pcieSlots ?? 0 },
    pcieConnectors: { used: 0, total: 0 },
    pcieLayoutState: null,
    ramSlots: { used: 0, total: basekit?.ramSlots ?? 0 },
    ramCapacityGb: { used: 0, total: basekit?.maxRamCapacity ?? 0 },
    nvmeBays: { used: 0, total: basekit?.nvmePorts ?? 0 },
    ssdBays: { used: 0, total: basekit?.ssdBays ?? 0 },
    hddBays: { used: 0, total: basekit?.hddBays ?? 0 },
    powerDrawW: BASELINE_WATTS,
    psuCapacityW: 0,
    recommendedPsuW: 0,
    longestGpuMm: 0,
    maxGpuLengthMm: basekit?.maxGpuLength ?? 0,
  }
}

const DEFAULT_COOLING_DRAW_W = 12 // AIO pump + fans baseline

function isEmptySpec(spec: SpecLite): boolean {
  // Treat as empty when none of the engine-relevant fields have values.
  return (
    spec.tdpWatts == null &&
    spec.pcieSlotWidth == null &&
    spec.ramCapacityGb == null &&
    spec.storageGb == null &&
    spec.psuWatts == null &&
    spec.socketRequired == null &&
    spec.pcieSlots == null &&
    spec.ramSlots == null &&
    spec.nvmePorts == null
  )
}

function idleWatts(spec: SpecLite, category: Category): number {
  if (typeof spec.idleWatts === "number" && spec.idleWatts > 0) return spec.idleWatts
  if (category === "ram") return DEFAULT_RAM_IDLE_W
  if (category === "nvme" || category === "nvme_os") return DEFAULT_NVME_IDLE_W
  if (category === "ssd" || category === "hdd") return DEFAULT_SATA_IDLE_W
  if (category === "cooling") return DEFAULT_COOLING_DRAW_W
  return 0
}

/** Categories where `tdpWatts` represents the component's own draw, not capacity. */
const TDP_IS_DRAW: ReadonlySet<Category> = new Set<Category>([
  "cpu",
  "gpu",
  "expansion_card",
  "network_card",
])

function consume(
  usage: ResourceUsage,
  spec: SpecLite,
  category: Category,
  qty: number,
  issues: Issue[]
): void {
  // Power: cpu/gpu/expansion/network use tdpWatts as their own draw.
  // Cooling/RAM/storage use idleWatts (tdpWatts on cooling = supported capacity).
  const draw = TDP_IS_DRAW.has(category)
    ? spec.tdpWatts ?? idleWatts(spec, category)
    : idleWatts(spec, category)
  usage.powerDrawW += draw * qty

  switch (category) {
    case "cpu":
      // Single cpu, no slot consumption (sits in socket)
      break

    case "gpu": {
      const width = spec.pcieSlotWidth ?? 2
      usage.pcieSlots.used += width * qty
      const len = spec.lengthMm ?? 0
      if (len > usage.longestGpuMm) usage.longestGpuMm = len
      if (usage.maxGpuLengthMm > 0 && len > usage.maxGpuLengthMm) {
        issues.push({
          kind: "gpu_too_long",
          max: usage.maxGpuLengthMm,
          got: len,
          message: `GPU çok uzun: ${len}mm > ${usage.maxGpuLengthMm}mm chassis limit`,
        })
      }
      break
    }

    case "ram":
      usage.ramSlots.used += qty
      usage.ramCapacityGb.used += (spec.ramCapacityGb ?? 0) * qty
      break

    case "nvme":
    case "nvme_os":
      usage.nvmeBays.used += qty
      break

    case "ssd":
      usage.ssdBays.used += qty
      break

    case "hdd":
      usage.hddBays.used += qty
      break

    case "psu":
      usage.psuCapacityW += (spec.psuWatts ?? 0) * qty
      break

    case "expansion_card":
    case "network_card":
      usage.pcieSlots.used += (spec.pcieSlotWidth ?? 1) * qty
      break

    case "cooling":
      // No slot/bay consumption; power already added
      break
  }
}

// ============================================================
// MAIN VALIDATE
// ============================================================

export interface ValidateInput {
  basekit: ProductLite
  selection: Selection
  options: OptionLite[]
}

export function validate({
  basekit,
  selection,
  options,
}: ValidateInput): ValidationResult {
  const basekitSpec = basekit.componentSpecs ?? null
  const usage = emptyUsage(basekitSpec)
  const issues: Issue[] = []

  let totalPriceCents = Math.round(basekit.price * 100)

  // Walk every selected line
  for (const line of selection.lines) {
    if (line.qty <= 0) continue

    const opt = lookupOption(options, line.componentId, line.category)
    if (!opt) {
      issues.push({
        kind: "missing_required",
        category: line.category,
        message: `Geçersiz seçim: ${line.category} / ${line.componentId}`,
      })
      continue
    }

    // Price always
    totalPriceCents += opt.priceDelta * line.qty

    // Per-line max
    if (opt.maxQty != null && line.qty > opt.maxQty) {
      issues.push({
        kind: "max_qty_exceeded",
        category: line.category,
        max: opt.maxQty,
        got: line.qty,
        message: `${opt.component.name}: en fazla ${opt.maxQty} adet seçilebilir`,
      })
    }

    if (!opt.affectsResources) continue
    if (!HARDWARE_CATEGORIES.includes(line.category)) continue

    const spec = opt.component.componentSpecs
    if (!spec || isEmptySpec(spec)) {
      issues.push({
        kind: "missing_required",
        category: line.category,
        message: `${opt.component.name}: spec verileri eksik (admin'de spec preset doldurulmalı)`,
      })
      continue
    }

    // CPU socket check (case-insensitive, trimmed)
    if (line.category === "cpu" && basekitSpec?.socketType && spec.socketRequired) {
      const normSocket = (s: string) => s.trim().toUpperCase().replace(/\s+/g, " ")
      if (normSocket(basekitSpec.socketType) !== normSocket(spec.socketRequired)) {
        issues.push({
          kind: "socket_mismatch",
          expected: basekitSpec.socketType,
          got: spec.socketRequired,
          message: `${opt.component.name} soketi uyumsuz: ${spec.socketRequired} ≠ ${basekitSpec.socketType}`,
        })
      }
    }

    // RAM type check (DDR4 vs DDR5 etc.)
    // Normalize: extract generation token (DDR4 / DDR5) for comparison so that
    // "DDR5" matches "DDR5 UDIMM", "DDR5 ECC RDIMM", etc.
    if (line.category === "ram" && basekitSpec?.ramType && spec.ramType) {
      const normalizeRamGen = (s: string) => {
        const m = s.toUpperCase().match(/DDR\d/)
        return m ? m[0] : s.toUpperCase().trim()
      }
      if (normalizeRamGen(basekitSpec.ramType) !== normalizeRamGen(spec.ramType)) {
        issues.push({
          kind: "ram_type_mismatch",
          expected: basekitSpec.ramType,
          got: spec.ramType,
          message: `${opt.component.name}: ${spec.ramType} bu chassis'in ${basekitSpec.ramType} desteğiyle uyumsuz`,
        })
      }
    }

    // Storage interface sanity (admin shouldn't add a SATA disk under "nvme")
    const expectedInterface =
      line.category === "nvme" || line.category === "nvme_os"
        ? "nvme_m2"
        : line.category === "ssd"
        ? "sata_2_5"
        : line.category === "hdd"
        ? "sata_3_5"
        : null
    if (expectedInterface && spec.storageInterface && spec.storageInterface !== expectedInterface) {
      issues.push({
        kind: "missing_required",
        category: line.category,
        message: `${opt.component.name}: arayüz uyumsuz (${spec.storageInterface} ≠ ${expectedInterface})`,
      })
    }

    consume(usage, spec, line.category, line.qty, issues)
  }

  // Recommended PSU sizing
  usage.recommendedPsuW = Math.ceil((usage.powerDrawW * POWER_HEADROOM) / 50) * 50

  // === PCIe layout-aware overflow check ===
  // If basekit has a layout string, run positional packing. Otherwise fall back
  // to the simple pcieSlots total comparison below.
  const layout = parseLayout(basekitSpec?.pcieLayout)
  if (layout.length > 0) {
    const allCards: PackCard[] = []
    for (const line of selection.lines) {
      if (line.qty <= 0) continue
      if (!PCIE_CATEGORIES.has(line.category)) continue
      const opt = lookupOption(options, line.componentId, line.category)
      if (!opt?.component.componentSpecs) continue
      allCards.push(
        ...expandToPackCards(
          line.category,
          line.componentId,
          opt.component.componentSpecs,
          line.qty,
          opt.component.name
        )
      )
    }
    const pack = packCards(layout, allCards)
    // Override usage counts with layout-derived values for the UI summary
    usage.pcieSlots.used = pack.used
    usage.pcieSlots.total = pack.total
    usage.pcieConnectors.used = Math.min(pack.placedCount, pack.connectors)
    usage.pcieConnectors.total = pack.connectors
    usage.pcieLayoutState = pack.state
    if (!pack.ok && pack.failedAt != null) {
      const failed = allCards[pack.failedAt]
      issues.push({
        kind: "slot_overflow",
        resource: "pcieSlots",
        over: 0,
        message: `${failed.name}: PCIe yerleşimi yapılamıyor (uygun konnektör yok veya slot çakışıyor)`,
      })
    }
  } else if (usage.pcieSlots.used > usage.pcieSlots.total) {
    issues.push({
      kind: "slot_overflow",
      resource: "pcieSlots",
      over: usage.pcieSlots.used - usage.pcieSlots.total,
      message: `PCIe slot taşması: ${usage.pcieSlots.used} / ${usage.pcieSlots.total}`,
    })
  }
  if (usage.ramSlots.used > usage.ramSlots.total) {
    issues.push({
      kind: "slot_overflow",
      resource: "ramSlots",
      over: usage.ramSlots.used - usage.ramSlots.total,
      message: `RAM slot taşması: ${usage.ramSlots.used} / ${usage.ramSlots.total}`,
    })
  }
  if (
    usage.ramCapacityGb.total > 0 &&
    usage.ramCapacityGb.used > usage.ramCapacityGb.total
  ) {
    issues.push({
      kind: "ram_capacity",
      max: usage.ramCapacityGb.total,
      got: usage.ramCapacityGb.used,
      message: `RAM kapasitesi aşıldı: ${usage.ramCapacityGb.used}GB > ${usage.ramCapacityGb.total}GB`,
    })
  }
  if (usage.nvmeBays.used > usage.nvmeBays.total) {
    issues.push({
      kind: "slot_overflow",
      resource: "nvmeBays",
      over: usage.nvmeBays.used - usage.nvmeBays.total,
      message: `NVMe yuva taşması: ${usage.nvmeBays.used} / ${usage.nvmeBays.total}`,
    })
  }
  if (usage.ssdBays.used > usage.ssdBays.total) {
    issues.push({
      kind: "slot_overflow",
      resource: "ssdBays",
      over: usage.ssdBays.used - usage.ssdBays.total,
      message: `2.5" yuva taşması: ${usage.ssdBays.used} / ${usage.ssdBays.total}`,
    })
  }
  if (usage.hddBays.used > usage.hddBays.total) {
    issues.push({
      kind: "slot_overflow",
      resource: "hddBays",
      over: usage.hddBays.used - usage.hddBays.total,
      message: `3.5" yuva taşması: ${usage.hddBays.used} / ${usage.hddBays.total}`,
    })
  }

  // PSU power check
  if (usage.psuCapacityW > 0 && usage.psuCapacityW < usage.recommendedPsuW) {
    issues.push({
      kind: "psu_underpowered",
      need: usage.recommendedPsuW,
      have: usage.psuCapacityW,
      message: `PSU yetersiz: ${usage.psuCapacityW}W < ${usage.recommendedPsuW}W (önerilen)`,
    })
  }

  // Dual PSU support
  const psuLines = selection.lines.filter((l) => l.category === "psu")
  const psuTotalQty = psuLines.reduce((s, l) => s + l.qty, 0)
  if (psuTotalQty > 1 && !basekitSpec?.supportsDualPsu) {
    issues.push({
      kind: "dual_psu_unsupported",
      message: "Bu chassis çift güç kaynağı desteklemiyor",
    })
  }

  // Compute dynamic max quantities for every available option
  const maxQty: Record<string, number> = {}
  const unavailable: Record<Category, Set<string>> = {} as Record<Category, Set<string>>

  for (const opt of options) {
    const currentQty =
      selection.lines.find(
        (l) => l.category === opt.category && l.componentId === opt.componentId
      )?.qty ?? 0
    const dynMax = computeMaxQty(opt, usage, selection, currentQty, basekitSpec, options)
    // Key by category+componentId — same product can appear in multiple
    // categories (e.g. an NVMe drive listed under both nvme_os and nvme).
    maxQty[`${opt.category}:${opt.componentId}`] = dynMax
    if (dynMax === 0) {
      if (!unavailable[opt.category]) unavailable[opt.category] = new Set()
      unavailable[opt.category].add(opt.componentId)
    }
  }

  return {
    ok: issues.length === 0,
    usage,
    issues,
    totalPriceCents,
    maxQty,
    unavailable,
  }
}

// ============================================================
// MAX QTY (dynamic)
// ============================================================

/**
 * How many units of this option can the user add given current usage?
 * Considers resource headroom of the dominant constraint per category.
 *
 * Note: this assumes adding this option does NOT swap an existing one of the
 * same category. UI should subtract the currently-selected qty before display
 * if it wants "additional capacity" semantics.
 */
export function computeMaxQty(
  opt: OptionLite,
  usage: ResourceUsage,
  selection: Selection,
  currentQty: number = 0,
  basekitSpec: SpecLite | null = null,
  options: OptionLite[] = []
): number {
  // Add-on categories: respect explicit maxQty or unlimited
  if (!opt.affectsResources || !HARDWARE_CATEGORIES.includes(opt.category)) {
    return opt.maxQty ?? 99
  }

  const spec = opt.component.componentSpecs
  if (!spec) return opt.maxQty ?? 0

  // === Layout-aware path for PCIe categories ===
  // Try iteratively packing N copies of THIS option together with all other
  // PCIe selections (excluding this option itself); pick the largest N that fits.
  if (PCIE_CATEGORIES.has(opt.category) && basekitSpec?.pcieLayout) {
    const layout = parseLayout(basekitSpec.pcieLayout)
    if (layout.length > 0) {
      const otherCards: PackCard[] = []
      for (const line of selection.lines) {
        if (line.qty <= 0) continue
        if (!PCIE_CATEGORIES.has(line.category)) continue
        if (line.category === opt.category && line.componentId === opt.componentId) continue
        const o = options.find(
          (x) => x.componentId === line.componentId && x.category === line.category
        )
        if (!o?.component.componentSpecs) continue
        otherCards.push(
          ...expandToPackCards(
            line.category,
            line.componentId,
            o.component.componentSpecs,
            line.qty,
            o.component.name
          )
        )
      }
      // Binary-style search up to a sane upper bound (layout length is enough)
      const upperBound = layout.length + 1
      let max = 0
      for (let n = 1; n <= upperBound; n++) {
        const trial = [
          ...otherCards,
          ...expandToPackCards(opt.category, opt.componentId, spec, n, opt.component.name),
        ]
        const pack = packCards(layout, trial)
        if (pack.ok) max = n
        else break
      }
      // GPU max count chassis cap still applies
      if (opt.category === "gpu" && basekitSpec.maxGpuCount != null) {
        max = Math.min(max, basekitSpec.maxGpuCount)
      }
      if (opt.maxQty != null) max = Math.min(max, opt.maxQty)
      return Math.max(0, max)
    }
  }

  // Free up what THIS option is currently consuming so the returned number is
  // a total ("how many of this option can I have") instead of an additional
  // ("how many more can I add").
  const selfPcie =
    (spec.pcieSlotWidth ?? (opt.category === "gpu" ? 2 : 1)) *
    (opt.category === "gpu" || opt.category === "expansion_card" || opt.category === "network_card"
      ? currentQty
      : 0)
  const selfRam = opt.category === "ram" ? currentQty : 0
  const selfRamGb = opt.category === "ram" ? (spec.ramCapacityGb ?? 0) * currentQty : 0
  const selfNvme = opt.category === "nvme" || opt.category === "nvme_os" ? currentQty : 0
  const selfSsd = opt.category === "ssd" ? currentQty : 0
  const selfHdd = opt.category === "hdd" ? currentQty : 0

  const remainingPcie = Math.max(0, usage.pcieSlots.total - usage.pcieSlots.used + selfPcie)
  const remainingRam = Math.max(0, usage.ramSlots.total - usage.ramSlots.used + selfRam)
  const remainingRamGb = Math.max(
    0,
    usage.ramCapacityGb.total - usage.ramCapacityGb.used + selfRamGb
  )
  const remainingNvme = Math.max(0, usage.nvmeBays.total - usage.nvmeBays.used + selfNvme)
  const remainingSsd = Math.max(0, usage.ssdBays.total - usage.ssdBays.used + selfSsd)
  const remainingHdd = Math.max(0, usage.hddBays.total - usage.hddBays.used + selfHdd)

  let max: number
  switch (opt.category) {
    case "cpu":
      max = 1
      break
    case "gpu": {
      const width = spec.pcieSlotWidth ?? 2
      const bySlot = width > 0 ? Math.floor(remainingPcie / width) : 0
      // maxGpuCount is a CHASSIS-level limit, not a per-GPU one.
      const byCount = basekitSpec?.maxGpuCount ?? 99
      max = Math.min(bySlot, byCount)
      break
    }
    case "ram":
      max = remainingRam
      if (spec.ramCapacityGb && usage.ramCapacityGb.total > 0) {
        max = Math.min(max, Math.floor(remainingRamGb / spec.ramCapacityGb))
      }
      break
    case "nvme":
    case "nvme_os":
      max = remainingNvme
      break
    case "ssd":
      max = remainingSsd
      break
    case "hdd":
      max = remainingHdd
      break
    case "psu": {
      max = basekitSpec?.supportsDualPsu ? 2 : 1
      break
    }
    case "expansion_card":
    case "network_card": {
      const width = spec.pcieSlotWidth ?? 1
      max = width > 0 ? Math.floor(remainingPcie / width) : 0
      break
    }
    case "cooling":
      max = 1
      break
    default:
      max = opt.maxQty ?? 1
  }

  if (opt.maxQty != null) max = Math.min(max, opt.maxQty)
  return Math.max(0, max)
}

// ============================================================
// PRICING
// ============================================================

export function calculateTotal(
  basekit: ProductLite,
  selection: Selection,
  options: OptionLite[]
): number {
  let total = Math.round(basekit.price * 100)
  for (const line of selection.lines) {
    if (line.qty <= 0) continue
    const opt = lookupOption(options, line.componentId, line.category)
    if (opt) total += opt.priceDelta * line.qty
  }
  return total
}

// ============================================================
// DEFAULT SELECTION
// ============================================================

/** Build initial selection from `isDefault` flags. */
export function buildDefaultSelection(
  basekitId: string,
  options: OptionLite[]
): Selection {
  const lines: SelectionLine[] = []
  for (const opt of options) {
    if (!opt.isDefault) continue
    const qty = Math.max(1, opt.minQty)
    lines.push({ category: opt.category, componentId: opt.componentId, qty })
  }
  return { basekitId, lines }
}
