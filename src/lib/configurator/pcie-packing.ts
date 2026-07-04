/**
 * PCIe slot layout parsing + greedy positional packing.
 *
 * The basekit's pcieLayout string is the source of truth for what fits where:
 *
 *   "16,0,16,0,0,0,1"   — ATX with 2 full x16 slots, gap, gap, gap, x1
 *   "16,0,8o,0,0,0,1"   — second slot is x8 open (accepts x16 GPU at x8)
 *   "8o,0,0,0"          — mini-ITX-ish, 1 x8-open slot
 *
 * Tokens (top-to-bottom physical slot positions):
 *   0           — gap (no PCIe connector at this position)
 *   1|4|8|16    — closed slot with that many physical lanes
 *   1o|4o|8o|16o — open-ended slot (accepts larger cards physically)
 *
 * Card width handling:
 *   A card of W slot heights occupies ceil(W) consecutive positions.
 *   3.5-slot card → 4 positions (heatsink visually blocks the position below).
 */

export type Slot = { kind: "slot"; lanes: number; open: boolean }
export type Gap = { kind: "gap" }
export type LayoutCell = Slot | Gap

export interface Card {
  /** stable id, used to map back to selection lines */
  key: string
  /** display name (for issues) */
  name: string
  /** physical width in slot heights (1, 1.5, 2, 2.5, 3, 3.5, 4) */
  width: number
  /** required physical slot lane count (16 for typical GPU, 8/4 for NIC etc) */
  minPhysical: number
}

export type SlotState = { cell: LayoutCell; occupiedBy: string | null }

export interface PackResult {
  ok: boolean
  /** index in `cards` of the card that failed to fit (when ok=false) */
  failedAt: number | null
  /** post-pack slot state, suitable for visual rendering */
  state: SlotState[]
  /** total slot positions used by all placed cards */
  used: number
  /** total slot positions in the layout */
  total: number
  /** sum of `1`-tagged connectors in the layout */
  connectors: number
  /** number of cards successfully placed */
  placedCount: number
}

// ============================================================
// PARSE
// ============================================================
export function parseLayout(raw: string | null | undefined): LayoutCell[] {
  if (!raw || typeof raw !== "string") return []
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0)
    .map<LayoutCell>((t) => {
      if (t === "0") return { kind: "gap" }
      const open = t.endsWith("o")
      const num = parseInt(open ? t.slice(0, -1) : t, 10)
      if (!Number.isFinite(num) || num <= 0) return { kind: "gap" }
      return { kind: "slot", lanes: num, open }
    })
}

// ============================================================
// FIT CHECK
// ============================================================
export function canFit(slot: Slot, card: Card): boolean {
  if (slot.open) return true
  return slot.lanes >= card.minPhysical
}

// ============================================================
// PACK
// ============================================================
/**
 * Thermal-aware packing: sort cards by descending width (larger first so they
 * claim contiguous space before smaller cards fragment it). For each card, of
 * all valid positions, pick the one whose CENTER is farthest from any already-
 * placed card's center. This spreads cards apart for better airflow / cooling.
 *
 * Tie-breaker: leftmost position (deterministic).
 */
export function packCards(layout: LayoutCell[], cards: Card[]): PackResult {
  const state: SlotState[] = layout.map((cell) => ({ cell, occupiedBy: null }))
  const total = state.length
  const connectors = state.filter((s) => s.cell.kind === "slot").length

  // Stable sort by width descending; ties keep input order
  const indexed = cards.map((c, i) => ({ c, i }))
  indexed.sort((a, b) => b.c.width - a.c.width)

  // Track placed card centers (continuous index space) for distance scoring
  const placedCenters: number[] = []

  let placed = 0
  let failedAt: number | null = null

  for (const { c, i } of indexed) {
    const need = Math.max(1, Math.ceil(c.width))
    type Cand = { pos: number; minDist: number }
    const candidates: Cand[] = []

    for (let pos = 0; pos + need <= total; pos++) {
      const first = state[pos]
      if (first.cell.kind !== "slot") continue
      if (first.occupiedBy) continue
      if (!canFit(first.cell, c)) continue
      let blocked = false
      for (let k = 1; k < need; k++) {
        if (state[pos + k].occupiedBy) {
          blocked = true
          break
        }
      }
      if (blocked) continue
      const center = pos + need / 2 - 0.5
      const minDist =
        placedCenters.length === 0
          ? Infinity
          : Math.min(...placedCenters.map((pc) => Math.abs(pc - center)))
      candidates.push({ pos, minDist })
    }

    if (candidates.length === 0) {
      failedAt = i
      break
    }

    // Pick farthest-from-others; tie → leftmost
    candidates.sort((a, b) => b.minDist - a.minDist || a.pos - b.pos)
    const chosen = candidates[0]
    for (let k = 0; k < need; k++) {
      state[chosen.pos + k].occupiedBy = c.key
    }
    placedCenters.push(chosen.pos + need / 2 - 0.5)
    placed++
  }

  const used = state.filter((s) => s.occupiedBy != null).length

  return {
    ok: failedAt === null,
    failedAt,
    state,
    used,
    total,
    connectors,
    placedCount: placed,
  }
}

// ============================================================
// HELPERS
// ============================================================
export function isLayoutEmpty(raw: string | null | undefined): boolean {
  return parseLayout(raw).length === 0
}
