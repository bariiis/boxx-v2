"use client"

import { Boxes, FileText, Headset, LineChart, ShieldCheck, Wrench, type LucideIcon } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import type { HomeV2BentoTile } from "../data"
import { cn } from "@/lib/utils"

const ICONS: Record<HomeV2BentoTile["icon"], LucideIcon> = {
  shield: ShieldCheck,
  headset: Headset,
  wrench: Wrench,
  chart: LineChart,
  file: FileText,
  boxes: Boxes,
}

const SIZE_CLASSES: Record<HomeV2BentoTile["size"], string> = {
  lg: "md:col-span-2 md:row-span-2",
  md: "md:col-span-1 md:row-span-1",
  sm: "md:col-span-1",
}

interface WhyBoxxBentoProps {
  tiles: HomeV2BentoTile[]
}

export function WhyBoxxBento({ tiles }: WhyBoxxBentoProps) {
  return (
    <SectionContainer id="neden-boxx" theme="light" ariaLabel="Neden BOXX">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-brand)]">
            Neden BOXX
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
            Kutudan çıktığı günkü performans.
            <br />
            <span className="text-black/50">Beş yıl sonra da.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[180px]">
          {tiles.map((tile, i) => {
            const Icon = ICONS[tile.icon]
            return (
              <Reveal key={tile.id} delay={i * 0.06} className={cn(SIZE_CLASSES[tile.size], "group")}>
                <div className="relative h-full rounded-2xl border border-black/5 bg-white p-6 md:p-8 transition-colors hover:border-black/20 cursor-default flex flex-col justify-between">
                  <Icon className="h-7 w-7 text-[var(--home-brand)] transition-transform group-hover:-translate-y-0.5" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold tracking-tight">{tile.title}</h3>
                    <p className="mt-2 text-sm text-black/60">{tile.description}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </SectionContainer>
  )
}
