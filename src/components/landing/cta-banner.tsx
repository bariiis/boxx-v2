"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export interface CtaBannerProps {
  headline?: string
  description?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  variant?: "gradient" | "solid" | "minimal"
}

export function CtaBanner({
  headline = "Hemen Başlayın",
  description,
  ctaText = "Teklif İste",
  ctaHref = "/iletisim",
  secondaryCtaText,
  secondaryCtaHref,
  variant = "gradient",
}: CtaBannerProps) {
  const bgClass =
    variant === "gradient"
      ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white"
      : variant === "solid"
        ? "bg-neutral-900 text-white"
        : "bg-neutral-50 text-neutral-900 border-y"

  const isLight = variant === "minimal"
  const descColor = isLight ? "text-neutral-600" : "text-white/80"

  return (
    <section className={`relative w-full overflow-hidden py-16 md:py-24 ${bgClass}`}>
      {variant === "gradient" && (
        <>
          <div className="pointer-events-none absolute -top-20 -left-20 size-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full bg-white/10 blur-3xl" />
        </>
      )}
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{headline}</h2>
        {description && (
          <p className={`mt-4 text-lg ${descColor}`}>{description}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            variant={isLight ? "default" : "secondary"}
          >
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
              className={
                isLight
                  ? ""
                  : "border-white/30 bg-transparent text-white hover:bg-white/10"
              }
            >
              <Link href={secondaryCtaHref}>{secondaryCtaText}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
