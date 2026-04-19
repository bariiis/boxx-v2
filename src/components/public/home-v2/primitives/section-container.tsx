"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type Theme = "dark" | "light"

interface SectionContainerProps {
  id?: string
  theme: Theme
  className?: string
  children: ReactNode
  density?: "tight" | "default" | "loose"
  ariaLabel?: string
}

const PAD = {
  tight: "py-12 md:py-16",
  default: "py-20 md:py-28",
  loose: "py-28 md:py-40",
} as const

export function SectionContainer({
  id,
  theme,
  className,
  children,
  density = "default",
  ariaLabel,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      data-home-section-theme={theme}
      className={cn(
        "relative w-full overflow-hidden",
        PAD[density],
        theme === "dark"
          ? "bg-[var(--home-bg-dark)] text-[var(--home-fg-dark)]"
          : "bg-[var(--home-bg-light)] text-[var(--home-fg-light)]",
        className
      )}
    >
      {children}
    </section>
  )
}
