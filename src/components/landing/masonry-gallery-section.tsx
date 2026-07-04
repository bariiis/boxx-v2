"use client"

import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import type { MasonryItem } from "@/components/ui/masonry"

const Masonry = dynamic(() => import("@/components/ui/masonry"), {
  ssr: false,
  loading: () => null,
})

type AnimateFrom = "top" | "bottom" | "left" | "right" | "center" | "random"

type MasonryGallerySectionProps = {
  label?: string
  headline?: string
  description?: string
  items?: MasonryItem[]
  ease?: string
  duration?: number
  stagger?: number
  animateFrom?: AnimateFrom
  scaleOnHover?: boolean
  hoverScale?: number
  blurToFocus?: boolean
  colorShiftOnHover?: boolean
  dark?: boolean
}

const FALLBACK_ITEMS: MasonryItem[] = [
  { id: "1", img: "https://picsum.photos/id/1015/600/900?grayscale", url: "", height: 400 },
  { id: "2", img: "https://picsum.photos/id/1011/600/750?grayscale", url: "", height: 250 },
  { id: "3", img: "https://picsum.photos/id/1020/600/800?grayscale", url: "", height: 600 },
  { id: "4", img: "https://picsum.photos/id/1025/600/700?grayscale", url: "", height: 300 },
  { id: "5", img: "https://picsum.photos/id/1043/600/900?grayscale", url: "", height: 500 },
  { id: "6", img: "https://picsum.photos/id/1050/600/750?grayscale", url: "", height: 350 },
  { id: "7", img: "https://picsum.photos/id/1060/600/900?grayscale", url: "", height: 450 },
  { id: "8", img: "https://picsum.photos/id/1074/600/700?grayscale", url: "", height: 280 },
]

export function MasonryGallerySection({
  label = "",
  headline = "Galeri",
  description = "",
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  dark = false,
}: MasonryGallerySectionProps) {
  const safeItems =
    items && items.length > 0
      ? items.filter((it) => it.img && it.img.trim().length > 0)
      : FALLBACK_ITEMS

  return (
    <section
      aria-label={headline || "Galeri"}
      className={cn(
        "relative w-full py-20 md:py-28",
        dark ? "bg-black text-white" : "bg-background text-foreground",
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        {(label || headline || description) && (
          <header className="mb-10 flex flex-col gap-3 md:mb-14">
            {label && (
              <p className="text-[11px] uppercase tracking-[0.28em] opacity-70">
                {label}
              </p>
            )}
            {headline && (
              <h2 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                {headline}
              </h2>
            )}
            {description && (
              <p className="max-w-2xl text-base leading-relaxed opacity-70 md:text-lg">
                {description}
              </p>
            )}
          </header>
        )}

        <Masonry
          items={safeItems}
          ease={ease}
          duration={duration}
          stagger={stagger}
          animateFrom={animateFrom}
          scaleOnHover={scaleOnHover}
          hoverScale={hoverScale}
          blurToFocus={blurToFocus}
          colorShiftOnHover={colorShiftOnHover}
        />
      </div>
    </section>
  )
}
