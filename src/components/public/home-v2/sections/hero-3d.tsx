"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { NoiseOverlay } from "../primitives/noise-overlay"
import type { HomeV2HeroData } from "../data"

const HeroScene = dynamic(
  () => import("../3d/hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => null }
)

interface HeroSectionProps {
  data: HomeV2HeroData
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <SectionContainer
      id="hero"
      theme="dark"
      density="tight"
      ariaLabel="Ana görsel ve tanıtım"
      className="min-h-screen flex items-center"
    >
      <NoiseOverlay />
      <div className="absolute inset-0 -z-0 opacity-80">
        <HeroScene />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 grid gap-12 md:grid-cols-12 items-center">
        <div className="md:col-span-7 space-y-8">
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--home-brand)]">
            {data.eyebrow}
          </p>
          <h1 className="font-sans text-5xl md:text-7xl lg:text-[88px] leading-[1.02] tracking-tight whitespace-pre-line">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-[var(--home-muted-dark)] max-w-xl">
            {data.subtitle}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={data.primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--home-brand)] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-orange-400 cursor-pointer"
            >
              {data.primaryCta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={data.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5 cursor-pointer"
            >
              {data.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-white/40">
        SCROLL ↓
      </div>
    </SectionContainer>
  )
}
