"use client"

import Image from "next/image"
import { Quote } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import type { HomeV2Data } from "../data"

interface SocialProofProps {
  logos: HomeV2Data["logos"]
  testimonial: HomeV2Data["testimonial"]
}

export function SocialProof({ logos, testimonial }: SocialProofProps) {
  return (
    <SectionContainer id="musteriler" theme="light" ariaLabel="Müşteriler ve referanslar">
      <div className="mx-auto w-full max-w-7xl px-6 grid gap-12 md:grid-cols-12 items-center">
        <div className="md:col-span-5">
          <Reveal>
            <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-brand)]">
              Birlikte çalıştığımız ekipler
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
              Türkiye&apos;nin ajans, araştırma ve üretim ekipleri
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 grid grid-cols-2 gap-6 items-center">
              {logos.map((logo) =>
                logo.src ? (
                  <Image
                    key={logo.name}
                    src={logo.src}
                    alt={logo.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span
                    key={logo.name}
                    className="font-mono text-xs uppercase tracking-wider text-black/40"
                  >
                    {logo.name}
                  </span>
                )
              )}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="md:col-span-7">
          <figure className="relative rounded-3xl border border-black/5 bg-white p-8 md:p-12">
            <Quote className="absolute -top-4 -left-2 h-10 w-10 text-[var(--home-brand)]" />
            <blockquote className="text-2xl md:text-3xl leading-[1.35] tracking-tight text-black/80">
              &quot;{testimonial.quote}&quot;
            </blockquote>
            <figcaption className="mt-6 font-mono text-xs uppercase tracking-wider text-black/50">
              {testimonial.author} · {testimonial.role} · {testimonial.company}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </SectionContainer>
  )
}
