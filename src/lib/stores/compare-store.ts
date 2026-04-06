import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CompareItem {
  id: string
  name: string
  slug: string
  heroImage: string | null
  /** Root category slug (parent or self if root) */
  rootCategorySlug: string
  rootCategoryName: string
}

interface CompareState {
  items: CompareItem[]
  add: (item: CompareItem) => boolean
  remove: (id: string) => void
  clear: () => void
  has: (id: string) => boolean
  /** Check if a product can be added (same root category, max 4) */
  canAdd: (rootCategorySlug: string) => boolean
  /** Current root category slug (from first item) */
  activeCategory: () => string | null
}

const MAX_ITEMS = 4

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => {
        const state = get()
        if (state.items.length >= MAX_ITEMS) return false
        if (state.items.some((i) => i.id === item.id)) return false
        // Must be same root category as existing items
        if (state.items.length > 0 && state.items[0].rootCategorySlug !== item.rootCategorySlug) {
          return false
        }
        set({ items: [...state.items, item] })
        return true
      },

      remove: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      clear: () => set({ items: [] }),

      has: (id) => get().items.some((i) => i.id === id),

      canAdd: (rootCategorySlug) => {
        const state = get()
        if (state.items.length >= MAX_ITEMS) return false
        if (state.items.length === 0) return true
        return state.items[0].rootCategorySlug === rootCategorySlug
      },

      activeCategory: () => {
        const state = get()
        return state.items.length > 0 ? state.items[0].rootCategorySlug : null
      },
    }),
    { name: "stuux-compare" }
  )
)
