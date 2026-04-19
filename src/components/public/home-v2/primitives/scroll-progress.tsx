"use client"

import { useScroll, useSpring, motion } from "framer-motion"
import { useReducedMotion } from "../hooks/use-reduced-motion"

interface ScrollProgressProps {
  sections: { id: string; label: string }[]
}

export function ScrollProgress({ sections }: ScrollProgressProps) {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 160, damping: 30 })

  if (reduced) return null

  return (
    <div
      aria-hidden
      className="fixed bottom-8 right-6 z-40 hidden md:flex items-center gap-3 font-mono text-[11px] tracking-widest"
    >
      <div className="flex flex-col gap-1 text-[var(--home-muted-dark)]">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="opacity-60 hover:opacity-100 transition-opacity">
            {s.label.toUpperCase()}
          </a>
        ))}
      </div>
      <div className="relative h-32 w-px bg-white/10">
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute inset-0 bg-[var(--home-brand)]"
        />
      </div>
    </div>
  )
}
