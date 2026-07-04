"use client"

import { Quote } from "lucide-react"
import type { HomeV2Data } from "../data"

interface StuuxDetailRevealProps {
  logos: HomeV2Data["logos"]
  testimonial: HomeV2Data["testimonial"]
}

const STATS = [
  { k: "5×", v: "ortalama render hızlanması" },
  { k: "14 ay", v: "ortalama ROI" },
  { k: "72 saat", v: "kurulum → production" },
  { k: "24/7", v: "mühendis desteği" },
]

export function StuuxDetailReveal({ logos, testimonial }: StuuxDetailRevealProps) {
  return (
    <section
      id="detay"
      aria-label="Müşteri sonuçları"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--stuux-bg)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[50vh] -z-10 stuux-iridescent"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 py-28 md:py-36">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <p
            className="md:col-span-3 text-[11px] uppercase tracking-[0.28em]"
            style={{ color: "var(--stuux-muted)" }}
          >
            02 — Detay
          </p>
          <h2
            className="stuux-heading md:col-span-9 text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            style={{ color: "var(--stuux-primary)" }}
          >
            Sayılar konuşuyor — <span className="italic">ölçülmüş</span> sonuçlar,
            spekülasyon değil.
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {STATS.map((s) => (
            <div
              key={s.k}
              className="group relative rounded-2xl p-6 stuux-glass md:p-8"
            >
              <div
                className="stuux-heading text-4xl leading-none tracking-tight md:text-5xl"
                style={{ color: "var(--stuux-primary)" }}
              >
                {s.k}
              </div>
              <div
                className="mt-3 text-xs uppercase leading-snug tracking-[0.16em] md:text-sm"
                style={{ color: "var(--stuux-muted)" }}
              >
                {s.v}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <figure
          className="relative mx-auto w-full max-w-4xl rounded-3xl p-10 md:p-16 stuux-glass"
        >
          <Quote
            aria-hidden
            className="mb-6 h-10 w-10"
            style={{ color: "var(--stuux-cta)" }}
          />
          <blockquote
            className="stuux-heading text-2xl leading-snug tracking-tight md:text-4xl"
            style={{ color: "var(--stuux-primary)" }}
          >
            “{testimonial.quote}”
          </blockquote>
          <figcaption
            className="mt-8 flex items-center gap-4 text-sm"
            style={{ color: "var(--stuux-muted)" }}
          >
            <span
              className="block h-10 w-10 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, var(--stuux-cta) 0%, var(--stuux-primary) 100%)",
              }}
            />
            <div>
              <div
                className="font-medium"
                style={{ color: "var(--stuux-primary)" }}
              >
                {testimonial.author}
              </div>
              <div>
                {testimonial.role} · {testimonial.company}
              </div>
            </div>
          </figcaption>
        </figure>

        {/* Logo row */}
        {logos.length > 0 && (
          <div className="flex flex-col gap-6">
            <p
              className="text-center text-[11px] uppercase tracking-[0.28em]"
              style={{ color: "var(--stuux-muted)" }}
            >
              Türkiye&apos;nin önde gelen ajans, stüdyo ve araştırma merkezlerinin tercihi
            </p>
            <div
              className="mx-auto grid w-full max-w-5xl grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-4"
              style={{
                borderTop: "1px solid rgba(15,23,42,0.08)",
                borderBottom: "1px solid rgba(15,23,42,0.08)",
                paddingTop: "2rem",
                paddingBottom: "2rem",
              }}
            >
              {logos.slice(0, 8).map((l, idx) => (
                <div
                  key={`${l.name}-${idx}`}
                  className="flex items-center justify-center opacity-60 transition-opacity duration-200 hover:opacity-100"
                >
                  <span
                    className="stuux-heading text-xl tracking-tight"
                    style={{ color: "var(--stuux-secondary)" }}
                  >
                    {l.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
