"use client"

import { motion } from "framer-motion"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import { useReducedMotion } from "../hooks/use-reduced-motion"
import type { HomeV2BenchmarkRow } from "../data"

interface LiveBenchmarkProps {
  data: { title: string; subtitle: string; rows: HomeV2BenchmarkRow[] }
}

export function LiveBenchmark({ data }: LiveBenchmarkProps) {
  const reduced = useReducedMotion()
  const max = Math.max(...data.rows.map((r) => r.comparison))

  return (
    <SectionContainer id="benchmark" theme="dark" ariaLabel="Benchmark">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-data)]">
            Benchmark · Q1 2026
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-white max-w-3xl">
            {data.title}
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl">{data.subtitle}</p>
        </Reveal>

        <div className="mt-14 space-y-8">
          {data.rows.map((row, i) => {
            const widthPercent = (row.value / max) * 100
            const highlight = i < data.rows.length - 1
            return (
              <Reveal key={row.label} delay={i * 0.1}>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between font-mono text-xs">
                    <span className={highlight ? "text-white" : "text-white/50"}>
                      {row.label}
                    </span>
                    <span className="text-white tabular-nums">
                      {row.value}
                      <span className="text-white/40">{row.unit}</span>
                    </span>
                  </div>
                  <div className="relative h-8 overflow-hidden rounded-md bg-white/5">
                    <motion.div
                      className="h-full rounded-md"
                      initial={{ width: reduced ? `${widthPercent}%` : "0%" }}
                      whileInView={{ width: `${widthPercent}%` }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        background: highlight
                          ? "linear-gradient(90deg, var(--home-brand), var(--home-data))"
                          : "rgba(255,255,255,0.2)",
                      }}
                    />
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
