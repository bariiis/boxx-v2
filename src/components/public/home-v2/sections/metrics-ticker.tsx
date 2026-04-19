"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "../hooks/use-reduced-motion"
import type { HomeV2Metric } from "../data"

interface MetricsTickerProps {
  metrics: HomeV2Metric[]
}

export function MetricsTicker({ metrics }: MetricsTickerProps) {
  const reduced = useReducedMotion()
  const loop = [...metrics, ...metrics, ...metrics]

  return (
    <div
      data-home-section-theme="dark"
      aria-label="Öne çıkan metrikler"
      className="relative border-y border-white/5 bg-[var(--home-bg-dark)] py-5 overflow-hidden"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap font-mono text-sm text-white/70"
        animate={reduced ? undefined : { x: ["0%", "-33.333%"] }}
        transition={reduced ? undefined : { duration: 32, ease: "linear", repeat: Infinity }}
      >
        {loop.map((m, i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="h-1 w-1 rounded-full bg-[var(--home-brand)]" />
            <span className="text-white">{m.value}</span>
            <span className="text-white/50">{m.label}</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
