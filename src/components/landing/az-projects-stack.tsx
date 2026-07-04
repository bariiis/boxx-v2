"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"

interface StackCard {
  title: string
  tags?: string[]
  image: string
  ctaText?: string
  ctaHref?: string
}

interface AzProjectsStackProps {
  cards?: StackCard[]
  marqueeItems?: string[]
}

export function AzProjectsStack({
  cards = [
    { title: "NFT project branding", tags: ["Design", "Illustrations", "Packaging"], image: "", ctaText: "Know More", ctaHref: "#" },
    { title: "Interactive app concept", tags: ["Design", "Development", "Branding"], image: "", ctaText: "Know More", ctaHref: "#" },
    { title: "Editorial illustrations set", tags: ["Design", "Illustrations"], image: "", ctaText: "Know More", ctaHref: "#" },
    { title: "Creative studio template", tags: ["Design", "Marketing"], image: "", ctaText: "Know More", ctaHref: "#" },
  ],
  marqueeItems = ["Design", "Development", "Branding", "eCommerce", "Marketing"],
}: AzProjectsStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const progress = scrollTop / (scrollHeight - clientHeight)
      const idx = Math.min(Math.floor(progress * cards.length), cards.length - 1)
      setActiveIndex(idx)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [cards.length])

  return (
    <section className="relative bg-[var(--lp-bg,#0a0a0a)] text-[var(--lp-fg,#fff)]">
      {/* Marquee */}
      {marqueeItems.length > 0 && (
        <div className="overflow-hidden border-y border-white/10 py-4">
          <div className="flex animate-[marquee_20s_linear_infinite] gap-12 whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="text-[clamp(2rem,5vw,5rem)] font-bold uppercase tracking-wider opacity-20"
              >
                {item}/
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="relative mx-auto w-full">
        {cards.map((card, i) => (
          <div
            key={i}
            className="group relative w-full overflow-hidden"
            style={{
              position: i === 0 ? "relative" : "relative",
            }}
          >
            {/* Background image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              {card.image ? (
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
              )}
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
              {/* Tags */}
              {card.tags && card.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/30 px-3 py-1 text-xs font-medium tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-end justify-between">
                {/* Title */}
                <h3 className="text-[clamp(1.5rem,4vw,3.5rem)] font-bold leading-tight">
                  {card.title}
                </h3>

                {/* CTA */}
                {card.ctaText && (
                  <a
                    href={card.ctaHref || "#"}
                    className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
                  >
                    {card.ctaText}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  )
}
