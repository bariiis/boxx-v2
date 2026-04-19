"use client"

import { useEffect } from "react"

type Theme = "dark" | "light"

export function useSectionTheme(): void {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-section-theme]")
    )
    if (sections.length === 0) return

    const visibility = new Map<Element, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target, entry.intersectionRatio)
        }
        let best: { theme: Theme; ratio: number } = { theme: "dark", ratio: 0 }
        for (const [el, ratio] of visibility.entries()) {
          if (ratio > best.ratio) {
            const theme = (el as HTMLElement).dataset.homeSectionTheme as Theme
            best = { theme, ratio }
          }
        }
        if (best.ratio > 0) {
          document.body.dataset.homeTheme = best.theme
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      delete document.body.dataset.homeTheme
    }
  }, [])
}
