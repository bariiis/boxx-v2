"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export interface ScrollBlurItem {
  label?: string
  text: string
  imageUrl?: string
}

export interface ScrollBlurTypographyProps {
  items?: ScrollBlurItem[]
  fontSize?: "sm" | "md" | "lg" | "xl"
  align?: "left" | "center" | "right"
  demoteHeading?: boolean
}

const FONT_SIZE_CLASS: Record<string, string> = {
  sm: "text-[24px]",
  md: "text-4xl md:text-5xl lg:text-6xl",
  lg: "text-5xl md:text-6xl lg:text-7xl",
  xl: "text-6xl md:text-7xl lg:text-8xl",
}

const ALIGN_CLASS: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

function isHtml(str: string) {
  return /<[a-z][\s\S]*>/i.test(str)
}

function BlurTextItem({
  item,
  index,
}: {
  item: ScrollBlurItem
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const html = isHtml(item.text)

  const textContent = html ? (
    /* Rich text — animate the whole block */
    <div
      className="leading-tight font-medium tracking-tight prose prose-invert max-w-none"
      style={{
        filter: revealed ? "blur(0px)" : "blur(12px)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(8px)",
        transition: revealed
          ? "filter 0.7s ease, opacity 0.7s ease, transform 0.7s ease"
          : "none",
        willChange: "filter, opacity, transform",
      }}
      dangerouslySetInnerHTML={{ __html: item.text }}
    />
  ) : (
    /* Plain text — animate word by word */
    <p className="leading-tight font-medium tracking-tight" aria-label={item.text}>
      {item.text.split(/(\s+)/).map((word, wi) => {
        if (/^\s+$/.test(word)) return <span key={wi}>{word}</span>
        const wordIndex = item.text.split(/(\s+)/).slice(0, wi).filter((w) => !/^\s+$/.test(w)).length
        const delay = wordIndex * 35
        return (
          <span
            key={wi}
            style={{
              display: "inline-block",
              filter: revealed ? "blur(0px)" : "blur(12px)",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(8px)",
              transition: revealed
                ? `filter 0.6s ease ${delay}ms, opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
                : "none",
              willChange: "filter, opacity, transform",
            }}
          >
            {word}
          </span>
        )
      })}
    </p>
  )

  const textBlock = (
    <div className="flex-1 min-w-0">
      {item.label && (
        <span
          className="mb-6 block text-xs uppercase tracking-widest"
          style={{ color: "var(--lp-muted-fg)" }}
        >
          {String(index + 1).padStart(2, "0")} — {item.label}
        </span>
      )}
      {textContent}
    </div>
  )

  return (
    <div ref={ref} className="py-12 md:py-16">
      {item.imageUrl ? (
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
          {textBlock}
          <div className="shrink-0 w-full md:w-64 lg:w-80">
            <Image
              src={item.imageUrl}
              alt={item.label || "görsel"}
              width={320}
              height={240}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>
        </div>
      ) : (
        textBlock
      )}
    </div>
  )
}

export function ScrollBlurTypography({
  items = [],
  fontSize = "lg",
  align = "left",
  demoteHeading = false,
}: ScrollBlurTypographyProps) {
  const sizeClass = FONT_SIZE_CLASS[fontSize] ?? FONT_SIZE_CLASS.lg
  const alignClass = ALIGN_CLASS[align] ?? ALIGN_CLASS.left

  return (
    <section
      className="relative w-full py-16 md:py-24"
      style={{ backgroundColor: "var(--lp-bg)", color: "var(--lp-fg)" }}
    >
      <div className={`mx-auto max-w-5xl px-6 md:px-12 ${sizeClass} ${alignClass}`}>
        {items.map((item, i) => (
          <BlurTextItem
            key={i}
            item={item}
            index={i}
          />
        ))}
      </div>
    </section>
  )
}
