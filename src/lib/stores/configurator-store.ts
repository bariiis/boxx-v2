"use client"

import { create } from "zustand"
import {
  validate,
  type Selection,
  type SelectionLine,
  type Category,
  type OptionLite,
  type ProductLite,
  type ValidationResult,
} from "@/lib/configurator/engine"

interface ConfiguratorState {
  basekit: ProductLite | null
  options: OptionLite[]
  selection: Selection
  result: ValidationResult | null

  // actions
  init: (basekit: ProductLite, options: OptionLite[], initial: Selection) => void
  setLine: (category: Category, componentId: string, qty: number) => void
  incLine: (category: Category, componentId: string) => void
  decLine: (category: Category, componentId: string) => void
  /** Replace the single selection in this category (radio behavior). */
  selectSingle: (category: Category, componentId: string) => void
  /** Toggle a multi-pick option (warranty add-on, peripheral, etc.). */
  toggleMulti: (category: Category, componentId: string) => void
}

function recompute(
  basekit: ProductLite,
  selection: Selection,
  options: OptionLite[]
): ValidationResult {
  return validate({ basekit, selection, options })
}

export const useConfigurator = create<ConfiguratorState>((set, get) => ({
  basekit: null,
  options: [],
  selection: { basekitId: "", lines: [] },
  result: null,

  init(basekit, options, initial) {
    set({
      basekit,
      options,
      selection: initial,
      result: recompute(basekit, initial, options),
    })
  },

  setLine(category, componentId, qty) {
    const { basekit, selection, options } = get()
    if (!basekit) return
    const next: SelectionLine[] = selection.lines.filter(
      (l) => !(l.category === category && l.componentId === componentId)
    )
    if (qty > 0) next.push({ category, componentId, qty })
    const newSel = { ...selection, lines: next }
    set({ selection: newSel, result: recompute(basekit, newSel, options) })
  },

  incLine(category, componentId) {
    const { selection, setLine } = get()
    const cur = selection.lines.find(
      (l) => l.category === category && l.componentId === componentId
    )
    setLine(category, componentId, (cur?.qty ?? 0) + 1)
  },

  decLine(category, componentId) {
    const { selection, setLine } = get()
    const cur = selection.lines.find(
      (l) => l.category === category && l.componentId === componentId
    )
    setLine(category, componentId, Math.max(0, (cur?.qty ?? 0) - 1))
  },

  selectSingle(category, componentId) {
    const { basekit, selection, options } = get()
    if (!basekit) return
    const next = selection.lines.filter((l) => l.category !== category)
    next.push({ category, componentId, qty: 1 })
    const newSel = { ...selection, lines: next }
    set({ selection: newSel, result: recompute(basekit, newSel, options) })
  },

  toggleMulti(category, componentId) {
    const { selection, setLine } = get()
    const cur = selection.lines.find(
      (l) => l.category === category && l.componentId === componentId
    )
    setLine(category, componentId, cur ? 0 : 1)
  },
}))
