"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

interface PurchaseCtaProps {
  headline: string
  description?: string
  price?: string
  priceNote?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  dark?: boolean
}

export function PurchaseCta({
  headline,
  description,
  price,
  priceNote,
  ctaText = "Teklif İste",
  ctaHref = "/iletisim",
  secondaryCtaText,
  secondaryCtaHref,
  dark = true,
}: PurchaseCtaProps) {
  return (
    <section
      className={`relative overflow-hidden ${
        dark ? "bg-[#0a0a0a] text-white" : "bg-white text-[#0a0a0a]"
      }`}
    >
      {/* Subtle top/bottom borders */}
      <div
        className={`absolute inset-x-0 top-0 h-px ${
          dark ? "bg-neutral-800" : "bg-neutral-200"
        }`}
      />

      <div className="mx-auto max-w-[1200px] px-5 py-[clamp(5rem,12vh,10rem)] sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <ScrollReveal variant="fade-up">
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em]">
              {headline}
            </h2>
          </ScrollReveal>

          {description && (
            <ScrollReveal variant="fade-up" delay={0.1}>
              <p
                className={`mt-6 text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed ${
                  dark ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                {description}
              </p>
            </ScrollReveal>
          )}

          {price && (
            <ScrollReveal variant="fade-up" delay={0.15}>
              <div className="mt-8">
                <span className="text-[clamp(2.5rem,5vw,4rem)] font-medium tracking-[-0.03em]">
                  {price}
                </span>
                {priceNote && (
                  <p
                    className={`mt-2 text-sm ${
                      dark ? "text-neutral-500" : "text-neutral-400"
                    }`}
                  >
                    {priceNote}
                  </p>
                )}
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal variant="fade-up" delay={0.2}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={ctaHref}
                className={`group inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-medium transition-all duration-200 ${
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
                  className={`inline-flex items-center gap-2 rounded-full border px-10 py-4 text-sm font-medium transition-all duration-200 ${
                    dark
                      ? "border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white"
                      : "border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-black"
                  }`}
                >
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
