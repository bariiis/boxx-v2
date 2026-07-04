"use client"

import { useEffect, useState, type CSSProperties } from "react"
import Link from "next/link"

export interface ClipHoverItem {
  image: string
  date?: string
  title: string
  linkText?: string
  linkHref?: string
}

export interface ClipHoverGridProps {
  headline?: string
  description?: string
  items?: ClipHoverItem[]
  orientation?: "vertical" | "horizontal"
  slicesTotal?: number
  columns?: 1 | 2 | 3
  demoteHeading?: boolean
}

/**
 * Ported from codrops/ClipHoverEffect (MIT) — GSAP replaced with CSS transitions.
 * On hover the background image is revealed as N vertical (or horizontal) slices
 * that slide in from random offsets.
 */
function Card({
  item,
  orientation,
  slicesTotal,
}: {
  item: ClipHoverItem
  orientation: "vertical" | "horizontal"
  slicesTotal: number
}) {
  const [hovered, setHovered] = useState(false)
  const [offsets, setOffsets] = useState<number[]>([])
  const isVertical = orientation === "vertical"

  useEffect(() => {
    setOffsets(
      Array.from({ length: slicesTotal }, (_, i) => {
        const r = 25 + Math.random() * 50
        return i % 2 === 0 ? r : -r
      }),
    )
  }, [slicesTotal])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative grid min-h-[60vh] cursor-pointer grid-rows-[auto_1fr_auto] overflow-hidden p-[4vw]"
      style={{ borderBottom: "1px solid var(--lp-border)" }}
    >
      {/* Slice layer */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        {Array.from({ length: slicesTotal }).map((_, i) => {
          const a1 = (i * 100) / slicesTotal
          const b1 = a1 + 100 / slicesTotal
          const clipPath = isVertical
            ? `polygon(${a1}% 0%, ${b1}% 0%, ${b1}% 100%, ${a1}% 100%)`
            : `polygon(0% ${a1}%, 100% ${a1}%, 100% ${b1}%, 0% ${b1}%)`

          const translate = hovered ? "translate(0,0)" : isVertical ? `translate(0,${offsets[i]}%)` : `translate(${offsets[i]}%,0)`

          const sliceStyle: CSSProperties = {
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${item.image})`,
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
            clipPath,
            filter: "brightness(0.6)",
            transform: translate,
            transition: "transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.5s",
            opacity: hovered ? 1 : 0,
          }
          return <div key={i} style={sliceStyle} />
        })}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between text-xs uppercase tracking-widest">
        {item.date && <span>{item.date}</span>}
      </div>

      <div className="relative z-10 flex items-end">
        <h3 className="font-normal" style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>
          {item.title}
        </h3>
      </div>

      <div className="relative z-10 mt-4 text-xs uppercase tracking-widest">
        {item.linkText && item.linkHref && (
          <Link href={item.linkHref} className="inline-flex items-center">
            <span className="mr-2">+</span>
            {item.linkText}
          </Link>
        )}
      </div>
    </div>
  )
}

export function ClipHoverGrid({
  headline,
  description,
  items = [],
  orientation = "vertical",
  slicesTotal = 5,
  columns = 3,
  demoteHeading = false,
}: ClipHoverGridProps) {
  const Heading = demoteHeading ? "h3" : "h2"
  const colClass = columns === 1 ? "" : columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3"

  return (
    <section
      className="relative w-full py-16 md:py-24"
      style={{ backgroundColor: "var(--lp-bg)", color: "var(--lp-fg)" }}
    >
      {(headline || description) && (
        <div className="mx-auto max-w-7xl px-6 md:px-12 mb-12">
          {headline && (
            <Heading className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
              {headline}
            </Heading>
          )}
          {description && (
            <p className="mt-4 max-w-2xl text-lg" style={{ color: "var(--lp-muted-fg)" }}>
              {description}
            </p>
          )}
        </div>
      )}
      <div className={`grid grid-cols-1 ${colClass}`}>
        {items.map((item, i) => (
          <Card key={i} item={item} orientation={orientation} slicesTotal={slicesTotal} />
        ))}
      </div>
    </section>
  )
}
