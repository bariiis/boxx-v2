"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"

interface AzParallaxDividerProps {
  image?: string
  imageAlt?: string
  headline?: string
  ctaText?: string
  ctaHref?: string
  overlayOpacity?: number
}

export function AzParallaxDivider({
  image = "",
  imageAlt = "",
  headline = "Small but powerful team",
  ctaText = "Let's meet",
  ctaHref = "#",
  overlayOpacity = 40,
}: AzParallaxDividerProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const progress = -rect.top / rect.height
      setOffset(progress * 60)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[var(--lp-bg,#0a0a0a)] text-white"
    >
      {/* Parallax background image */}
      <div
        className="absolute inset-[-60px] z-0"
        style={{ transform: `translateY(${offset}px)` }}
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-neutral-700 to-neutral-900" />
        )}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}
      />

      {/* Content */}
      <div className="relative z-[2] mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">
        {ctaText && (
          <div className="mb-8">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium tracking-wider transition-colors hover:bg-white/10"
            >
              {ctaText}
            </a>
          </div>
        )}

        <h2
          className="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-tight tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {headline}
        </h2>
      </div>
    </section>
  )
}
