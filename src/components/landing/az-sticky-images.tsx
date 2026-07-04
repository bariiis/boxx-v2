"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"

interface StickySlide {
  title: string
  image: string
}

interface AzStickyImagesProps {
  slides?: StickySlide[]
  ctaText?: string
  ctaHref?: string
}

export function AzStickyImages({
  slides = [
    { title: "Strategy", image: "" },
    { title: "Design", image: "" },
    { title: "Development", image: "" },
  ],
  ctaText = "Process",
  ctaHref = "#",
}: AzStickyImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / (rect.height - window.innerHeight))
      )
      const idx = Math.min(
        Math.floor(progress * slides.length),
        slides.length - 1
      )
      setActiveIndex(idx)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [slides.length])

  return (
    <section
      ref={containerRef}
      className="relative bg-[var(--lp-bg,#0a0a0a)] text-[var(--lp-fg,#fff)]"
      style={{ height: `${slides.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Progress bar */}
        <div className="absolute left-6 top-1/2 z-10 h-48 w-0.5 -translate-y-1/2 bg-white/10 lg:left-12">
          <div
            className="w-full bg-[var(--lp-primary,#6366f1)] transition-all duration-500"
            style={{
              height: `${((activeIndex + 1) / slides.length) * 100}%`,
            }}
          />
        </div>

        {/* Images */}
        <div className="absolute inset-0">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === activeIndex ? "opacity-100" : "opacity-0"}`}
            >
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
              )}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>

        {/* Text content */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 text-center lg:px-12">
          {/* Counter */}
          <p className="mb-6 text-sm font-medium tracking-wider opacity-60">
            <span className="text-[var(--lp-primary,#6366f1)]">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            &nbsp;/&nbsp;
            {String(slides.length).padStart(2, "0")}
          </p>

          {/* Title */}
          <div className="overflow-hidden">
            <h2
              key={activeIndex}
              className="animate-[slideUp_0.5s_ease-out] text-[clamp(3rem,8vw,8rem)] font-black leading-none tracking-tighter"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {slides[activeIndex]?.title}
            </h2>
          </div>

          {/* CTA button */}
          {ctaText && (
            <a
              href={ctaHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium tracking-wider transition-colors hover:bg-white/10"
            >
              {ctaText}
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}
