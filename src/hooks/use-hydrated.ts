"use client"

import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

/**
 * Returns false on the server / initial hydration render and true after
 * hydration. Replaces the `useEffect(() => setMounted(true), [])` pattern
 * without calling setState synchronously inside an effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}
