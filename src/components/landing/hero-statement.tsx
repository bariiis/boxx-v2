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
  dark?: boolean
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
  dark = true,
}: HeroStatementProps) {
  const words = headline.split(" ")

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        dark ? "bg-[#0a0a0a] text-white" : "bg-white text-[#0a0a0a]"
      }`}
    >
      {/* Subtle gradient overlay */}
      <div
        className={`absolute inset-0 ${
          dark
            ? "bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)]"
        }`}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-32 text-center sm:px-8">
        {/* Subheadline / label */}
        {subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`mb-8 text-xs font-medium uppercase tracking-[0.08em] sm:text-sm ${
              dark ? "text-neutral-500" : "text-neutral-400"
            }`}
          >
            {subheadline}
          </motion.p>
        )}

        {/* Animated headline - word by word */}
        <h1 className="font-medium leading-[0.95] tracking-[-0.03em]">
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
        </h1>

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
            className={`mx-auto mt-8 max-w-[560px] text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed ${
              dark ? "text-neutral-400" : "text-neutral-500"
            }`}
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
            className={`group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-200 ${
              dark
                ? "bg-white text-black hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)]"
                : "bg-[#0a0a0a] text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
            }`}
          >
            {ctaText}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          {secondaryCtaText && secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className={`inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-medium transition-all duration-200 ${
                dark
                  ? "border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white"
                  : "border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-black"
              }`}
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
            className="relative mx-auto mt-16 aspect-[16/9] max-w-[1000px] overflow-hidden rounded-xl"
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1000px"
              priority
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
