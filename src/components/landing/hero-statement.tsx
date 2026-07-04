"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface HeroStatementProps {
  headline: string
  subheadline?: string
  description?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  image?: string
  imageAlt?: string
  imageAspect?: "16/9" | "4/3" | "1/1" | "21/9" | "3/2" | "9/16" | "auto"
  imageFit?: "cover" | "contain"
  imageMaxWidth?: number
  imageBg?: string
  /** @deprecated No longer used — theme panel now controls all colors. */
  dark?: boolean
  demoteHeading?: boolean
}

const ASPECT_CLASS: Record<NonNullable<HeroStatementProps["imageAspect"]>, string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "3/2": "aspect-[3/2]",
  "9/16": "aspect-[9/16]",
  auto: "",
}

export function HeroStatement({
  headline,
  subheadline,
  description,
  ctaText = "Teklif İste",
  ctaHref = "/iletisim",
  secondaryCtaText,
  secondaryCtaHref,
  image,
  imageAlt = "",
  imageAspect = "16/9",
  imageFit = "cover",
  imageMaxWidth = 1000,
  imageBg,
  demoteHeading = false,
}: HeroStatementProps) {
  const words = headline.split(" ")
  const Heading = demoteHeading ? "h2" : "h1"

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--lp-bg)", color: "var(--lp-fg)" }}
    >
      {/* Subtle radial overlay using muted tone */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--lp-muted) 0%, transparent 70%)",
          opacity: 0.35,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-32 text-center sm:px-8">
        {/* Subheadline / label */}
        {subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 text-xs font-medium uppercase tracking-[0.08em] sm:text-sm"
            style={{ color: "var(--lp-muted-fg)" }}
          >
            {subheadline}
          </motion.p>
        )}

        {/* Animated headline - word by word */}
        <Heading className="font-medium leading-[0.95] tracking-[-0.03em]">
          <span className="block text-[clamp(3rem,8vw,7.5rem)]">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block mr-[0.25em] last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </Heading>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5 + words.length * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mx-auto mt-8 max-w-[560px] text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed"
            style={{ color: "var(--lp-muted-fg)" }}
          >
            {description}
          </motion.p>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.7 + words.length * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--lp-primary)",
              color: "var(--lp-primary-fg)",
            }}
          >
            {ctaText}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          {secondaryCtaText && secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className="inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-medium transition-all duration-200"
              style={{
                borderColor: "var(--lp-border)",
                color: "var(--lp-muted-fg)",
              }}
            >
              {secondaryCtaText}
            </Link>
          )}
        </motion.div>

        {/* Optional hero image below */}
        {image && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.9 + words.length * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`relative mx-auto mt-16 overflow-hidden rounded-xl ${ASPECT_CLASS[imageAspect]}`}
            style={{
              maxWidth: `${imageMaxWidth}px`,
              ...(imageBg ? { background: imageBg } : {}),
            }}
          >
            {imageAspect === "auto" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={imageAlt}
                className="mx-auto h-auto w-full"
              />
            ) : (
              <Image
                src={image}
                alt={imageAlt}
                fill
                className={imageFit === "contain" ? "object-contain" : "object-cover"}
                sizes="(max-width: 1024px) 100vw, 1000px"
                priority
              />
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
