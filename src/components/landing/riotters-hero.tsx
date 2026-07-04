"use client"

import type { CSSProperties } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

const ACCENT = "#28D7CE"

function HandDrawnUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M2 8C40 4 80 6 100 5C120 4 160 8 198 4"
        stroke={ACCENT}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.path
        d="M5 10C45 6 85 9 105 8C125 7 165 10 195 7"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      />
    </svg>
  )
}

export interface RiottersHeroProps {
  headlineLine1?: string
  headlineLine2?: string
  highlightedWord?: string
  authorName?: string
  authorTitle?: string
  authorAvatar?: string
  quote?: string
  ctaText?: string
  ctaHref?: string
  image1?: string
  image2?: string
  image3?: string
  image4?: string
  light?: boolean
  demoteHeading?: boolean
}

export function RiottersHero({
  headlineLine1 = "Detaylı tasarım,",
  headlineLine2 = "üstün",
  highlightedWord = "performans",
  authorName = "",
  authorTitle = "",
  authorAvatar,
  quote = "",
  ctaText = "İncele",
  ctaHref = "#",
  image1,
  image2,
  image3,
  image4,
  light = false,
  demoteHeading = false,
}: RiottersHeroProps) {
  const Heading = demoteHeading ? "h2" : "h1"
  const lightVars = light
    ? ({
        ["--lp-bg" as string]: "#ffffff",
        ["--lp-fg" as string]: "#0a0a0a",
        ["--lp-muted" as string]: "#f5f5f5",
        ["--lp-muted-fg" as string]: "#6b7280",
        ["--lp-border" as string]: "#e5e7eb",
      } as CSSProperties)
    : {}

  return (
    <section
      className="relative w-full overflow-hidden py-16 lg:py-24"
      style={{ backgroundColor: "var(--lp-bg)", color: "var(--lp-fg)", ...lightVars }}
    >
      {/* Override global theme heading sizes for this section's headline */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .lp-themed .rh-heading,
            .lp-themed .rh-heading * { font-size: 18px !important; }
            @media (min-width: 768px) {
              .lp-themed .rh-heading,
              .lp-themed .rh-heading * { font-size: 22px !important; }
            }
            @media (min-width: 1024px) {
              .lp-themed .rh-heading,
              .lp-themed .rh-heading * { font-size: 60px !important; }
            }
          `,
        }}
      />
      <div className="px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-[1152px] mx-auto items-center">
          {/* LEFT: author + quote + cta — compact, vertically centered vs right images */}
          <div className="flex flex-col justify-center gap-4 order-2 lg:order-1">
            {(authorName || authorTitle) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--lp-muted)" }}
                >
                  {authorAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  )}
                </div>
                <div>
                  {authorName && <p className="text-sm font-medium">{authorName}</p>}
                  {authorTitle && (
                    <p className="text-sm" style={{ color: "var(--lp-muted-fg)" }}>
                      {authorTitle}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {quote && (
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-base lg:text-lg leading-relaxed max-w-md prose prose-sm"
                dangerouslySetInnerHTML={{ __html: quote }}
              />
            )}

            {ctaText && ctaHref && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link
                  href={ctaHref}
                  className="group inline-flex items-center gap-2 text-sm transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current group-hover:opacity-70 transition-opacity" />
                  {ctaText}
                </Link>
              </motion.div>
            )}
          </div>

          {/* RIGHT: headline + collage */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Heading className="rh-heading font-normal leading-tight">
                {headlineLine1}
                <br />
                {headlineLine2}{" "}
                {highlightedWord && (
                  <span className="relative inline-block">
                    <span
                      className="relative z-10 px-2 -mx-2"
                      style={{ backgroundColor: `${ACCENT}33` }}
                    >
                      {highlightedWord}
                    </span>
                    <HandDrawnUnderline className="absolute -bottom-2 left-0 w-full" />
                  </span>
                )}
              </Heading>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative"
            >
              <div className="grid grid-cols-12 gap-3">
                <div
                  className="col-span-7 relative aspect-[4/3] rounded-lg overflow-hidden"
                  style={{ backgroundColor: "var(--lp-muted)" }}
                >
                  {image1 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image1} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
                <div
                  className="col-span-5 relative aspect-[4/3] rounded-lg overflow-hidden"
                  style={{ backgroundColor: "var(--lp-muted)" }}
                >
                  {image2 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image2} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
                <div
                  className="col-span-5 relative aspect-[3/4] rounded-lg overflow-hidden"
                  style={{ backgroundColor: "var(--lp-muted)" }}
                >
                  {image3 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image3} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
                <div
                  className="col-span-7 relative aspect-[16/9] rounded-lg overflow-hidden"
                  style={{ backgroundColor: "var(--lp-muted)" }}
                >
                  {image4 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image4} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
