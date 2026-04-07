"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export interface HeroGradientProps {
  badge?: string
  headline?: string
  highlight?: string
  description?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  image?: string
}

export function HeroGradient({
  badge,
  headline = "Başlık",
  highlight,
  description,
  ctaText = "Başla",
  ctaHref = "/iletisim",
  secondaryCtaText,
  secondaryCtaHref,
  image,
}: HeroGradientProps) {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white">
      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-transparent blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -right-40 size-[500px] rounded-full bg-gradient-to-tl from-purple-500/40 via-pink-500/20 to-transparent blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32 lg:py-40 text-center">
        {badge && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
            <span className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
            {badge}
          </div>
        )}

        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          {headline}
          {highlight && (
            <>
              {" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {highlight}
              </span>
            </>
          )}
        </h1>

        {description && (
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
            {description}
          </p>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-white text-neutral-900 hover:bg-white/90">
            <Link href={ctaHref}>
              {ctaText}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          {secondaryCtaText && secondaryCtaHref && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10"
            >
              <Link href={secondaryCtaHref}>{secondaryCtaText}</Link>
            </Button>
          )}
        </div>

        {image && (
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="w-full" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
