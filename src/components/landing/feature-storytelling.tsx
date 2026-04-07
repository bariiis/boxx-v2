"use client"

import Image from "next/image"
import { ScrollReveal } from "./scroll-reveal"

interface FeatureStorytellingProps {
  label?: string
  headline: string
  description?: string
  image: string
  imageAlt?: string
  reverse?: boolean
  dark?: boolean
}

export function FeatureStorytelling({
  label,
  headline,
  description,
  image,
  imageAlt = "",
  reverse = false,
  dark = true,
}: FeatureStorytellingProps) {
  return (
    <section
      className={`relative overflow-hidden ${
        dark ? "bg-[#0f0f0f] text-white" : "bg-[#f8f8f8] text-[#0a0a0a]"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-[clamp(5rem,12vh,10rem)] sm:px-8">
        <div
          className={`grid items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20 ${
            reverse ? "lg:[direction:rtl]" : ""
          }`}
        >
          {/* Text */}
          <div className={reverse ? "lg:[direction:ltr]" : ""}>
            {label && (
              <ScrollReveal variant="fade-up" delay={0}>
                <p
                  className={`mb-4 text-xs font-medium uppercase tracking-[0.08em] sm:text-sm ${
                    dark ? "text-neutral-500" : "text-neutral-400"
                  }`}
                >
                  {label}
                </p>
              </ScrollReveal>
            )}
            <ScrollReveal variant="fade-up" delay={0.1}>
              <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.02em]">
                {headline}
              </h2>
            </ScrollReveal>
            {description && (
              <ScrollReveal variant="fade-up" delay={0.2}>
                <p
                  className={`mt-6 max-w-[480px] text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed ${
                    dark ? "text-neutral-400" : "text-neutral-500"
                  }`}
                >
                  {description}
                </p>
              </ScrollReveal>
            )}
          </div>

          {/* Image */}
          <ScrollReveal
            variant={reverse ? "fade-left" : "fade-right"}
            delay={0.15}
            duration={1}
            className={reverse ? "lg:[direction:ltr]" : ""}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
