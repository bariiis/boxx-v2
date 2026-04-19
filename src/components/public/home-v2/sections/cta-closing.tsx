"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import type { HomeV2Data } from "../data"

interface CtaClosingProps {
  data: HomeV2Data["closingCta"]
}

export function CtaClosing({ data }: CtaClosingProps) {
  return (
    <SectionContainer id="iletisim" theme="light" density="loose" ariaLabel="Kapanış çağrısı">
      <div className="mx-auto w-full max-w-6xl px-6 grid gap-12 md:grid-cols-12 items-center">
        <Reveal className="md:col-span-7">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            {data.title}
          </h2>
          <p className="mt-5 text-lg text-black/60 max-w-lg">{data.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={data.primary.href}
              className="group inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black/85 cursor-pointer"
            >
              {data.primary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={data.secondary.href}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-black/5 cursor-pointer"
            >
              {data.secondary.label}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-5">
          <div
            aria-hidden
            className="relative h-[320px] rounded-3xl overflow-hidden border border-black/5"
            style={{
              background:
                "radial-gradient(circle at 70% 40%, rgba(255,106,44,0.25), transparent 60%), radial-gradient(circle at 20% 70%, rgba(34,211,238,0.25), transparent 55%), #0A0A0B",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
              ◼ BOXX · APEXX
            </div>
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  )
}
