"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { useReducedMotion } from "../hooks/use-reduced-motion"
import type { HomeV2Solution } from "../data"

interface SolutionsRailProps {
  solutions: HomeV2Solution[]
}

export function SolutionsRail({ solutions }: SolutionsRailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (typeof window === "undefined") return
    let cleanup: (() => void) | undefined

    ;(async () => {
      const gsapModule = await import("gsap")
      const stModule = await import("gsap/ScrollTrigger")
      const gsap = gsapModule.default ?? gsapModule
      const ScrollTrigger = stModule.ScrollTrigger ?? (stModule as unknown as { default: unknown }).default
      gsap.registerPlugin(ScrollTrigger as never)

      if (!containerRef.current || !trackRef.current) return
      const track = trackRef.current
      const container = containerRef.current
      const scrollDistance = track.scrollWidth - window.innerWidth

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => `-${scrollDistance}px`,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 0.4,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
      }, container)

      cleanup = () => ctx.revert()
    })()

    return () => cleanup?.()
  }, [reduced])

  return (
    <SectionContainer id="cozumler" theme="dark" density="tight" ariaLabel="Çözümler">
      <div ref={containerRef} className="relative h-screen overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center">
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-brand)]">
            Çözümler
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-white">
            İş yüküne göre kurulmuş sistemler
          </h2>
        </div>
        <div
          ref={trackRef}
          className="absolute top-1/2 -translate-y-1/2 flex gap-6 pl-[10vw] pr-[10vw] will-change-transform"
          style={reduced ? { flexWrap: "wrap", overflowX: "auto" } : undefined}
        >
          {solutions.map((s) => {
            const accent = s.accent === "orange" ? "var(--home-brand)" : "var(--home-data)"
            return (
              <Link
                key={s.id}
                href={`/cozumler/${s.slug}`}
                className="group relative flex h-[480px] w-[420px] md:w-[520px] shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-colors hover:bg-white/[0.06] cursor-pointer"
              >
                <div>
                  <span
                    className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ background: `${accent}22`, color: accent }}
                  >
                    {s.id}
                  </span>
                  <h3 className="mt-6 text-3xl font-semibold tracking-tight text-white">
                    {s.title}
                  </h3>
                  <p className="mt-4 text-white/70 leading-relaxed">{s.description}</p>
                </div>
                <div className="space-y-4">
                  <ul className="space-y-2 font-mono text-xs text-white/60">
                    {s.useCases.map((uc) => (
                      <li key={uc} className="flex items-center gap-2">
                        <span className="h-px w-4" style={{ background: accent }} />
                        {uc}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    Detay
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </SectionContainer>
  )
}
