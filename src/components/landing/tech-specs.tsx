"use client"

import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll-reveal"

interface SpecGroup {
  title: string
  specs: { label: string; value: string }[]
}

interface TechSpecsProps {
  headline?: string
  description?: string
  groups: SpecGroup[]
  dark?: boolean
}

export function TechSpecs({
  headline = "Teknik Özellikler",
  description,
  groups,
  dark = true,
}: TechSpecsProps) {
  return (
    <section
      className={`relative overflow-hidden ${
        dark ? "bg-[#141414] text-white" : "bg-[#f5f5f5] text-[#0a0a0a]"
      }`}
      id="specs"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-[clamp(5rem,12vh,10rem)] sm:px-8">
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.02em]">
            {headline}
          </h2>
        </ScrollReveal>
        {description && (
          <ScrollReveal variant="fade-up" delay={0.1}>
            <p
              className={`mt-4 max-w-[560px] text-[clamp(1rem,1.4vw,1.15rem)] leading-relaxed ${
                dark ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              {description}
            </p>
          </ScrollReveal>
        )}

        {/* Spec Groups */}
        <div className="mt-16 space-y-12">
          {groups.map((group, gi) => (
            <ScrollReveal key={gi} variant="fade-up" delay={gi * 0.05}>
              <div>
                <h3
                  className={`mb-6 text-xs font-medium uppercase tracking-[0.08em] ${
                    dark ? "text-neutral-500" : "text-neutral-400"
                  }`}
                >
                  {group.title}
                </h3>
                <StaggerContainer
                  stagger={0.03}
                  className={`divide-y ${
                    dark ? "divide-neutral-800" : "divide-neutral-200"
                  }`}
                >
                  {group.specs.map((spec, si) => (
                    <StaggerItem key={si} variant="fade">
                      <div className="flex justify-between gap-4 py-4">
                        <span
                          className={`text-sm ${
                            dark ? "text-neutral-400" : "text-neutral-500"
                          }`}
                        >
                          {spec.label}
                        </span>
                        <span className="text-right text-sm font-medium tabular-nums">
                          {spec.value}
                        </span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
