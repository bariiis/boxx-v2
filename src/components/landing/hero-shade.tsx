"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BorderBeam } from "@/components/ui/border-beam"

interface HeroShadeProps {
  headline: string
  description?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  image?: string
  imageAlt?: string
  beamColorFrom?: string
  beamColorTo?: string
  dark?: boolean
}

export function HeroShade({
  headline,
  description,
  ctaText = "Teklif İste",
  ctaHref = "/iletisim",
  secondaryCtaText,
  secondaryCtaHref,
  image,
  imageAlt = "",
  beamColorFrom = "#ffaa40",
  beamColorTo = "#9c40ff",
  dark = true,
}: HeroShadeProps) {
  const bg = dark ? "bg-[#0a0a0a] text-white" : "bg-white text-[#0a0a0a]"
  const mutedText = dark ? "text-neutral-400" : "text-neutral-500"
  const cardBg = dark ? "bg-neutral-900/50 border-neutral-800" : "bg-white border-neutral-200"
  const badgeBg = dark
    ? "border-neutral-700 bg-neutral-800/50 text-neutral-300"
    : "border-neutral-200 bg-neutral-100 text-neutral-600"

  return (
    <section className={`relative overflow-hidden ${bg}`}>
      {/* Gradient background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
          style={{ background: beamColorFrom }}
        />
        <div
          className="absolute right-1/4 bottom-0 size-[600px] translate-x-1/2 translate-y-1/2 rounded-full opacity-15 blur-[120px]"
          style={{ background: beamColorTo }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 md:py-32 lg:py-40">
        {/* Badge */}
        <div className="mb-8 flex justify-center">
          <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium ${badgeBg}`}>
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            </span>
            Yeni
          </span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {headline}
        </h1>

        {/* Description */}
        {description && (
          <p className={`mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed ${mutedText}`}>
            {description}
          </p>
        )}

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={ctaHref}
            className={`group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-200 ${
              dark
                ? "bg-white text-black hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)]"
                : "bg-[#0a0a0a] text-white hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
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
        </div>

        {/* Image card with border beam */}
        {image && (
          <div className="relative mx-auto mt-16 max-w-4xl">
            <div className={`relative overflow-hidden rounded-xl border ${cardBg}`}>
              <img
                src={image}
                alt={imageAlt}
                className="w-full object-cover"
              />
              <BorderBeam
                size={250}
                duration={12}
                colorFrom={beamColorFrom}
                colorTo={beamColorTo}
                borderWidth={1.5}
              />
            </div>
            {/* Reflection glow */}
            <div
              className="absolute -bottom-8 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
              style={{ background: `linear-gradient(90deg, ${beamColorFrom}, ${beamColorTo})` }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
