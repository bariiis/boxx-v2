"use client"

import { Zap, Target, Shield, HeartHandshake, type LucideIcon } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  target: Target,
  shield: Shield,
  heart: HeartHandshake,
}

interface FeatureItem {
  title: string
  description: string
  icon?: string
}

interface FeaturesBlockProps {
  headline: string
  description?: string
  marqueeItems?: string[]
  features: FeatureItem[]
  dark?: boolean
}

export function FeaturesBlock({
  headline,
  description,
  marqueeItems = [],
  features = [],
  dark = true,
}: FeaturesBlockProps) {
  const bg = dark ? "bg-[#0a0a0a] text-white" : "bg-neutral-50 text-[#0a0a0a]"
  const mutedText = dark ? "text-neutral-400" : "text-neutral-600"
  const borderColor = dark ? "border-neutral-800 divide-neutral-800" : "border-neutral-300 divide-neutral-300"
  const badgeBg = dark ? "border-neutral-700 bg-neutral-800/60 text-neutral-300" : "border-neutral-200 bg-neutral-100 text-neutral-600"
  const iconColor = dark ? "text-neutral-400" : "text-neutral-700"
  const fadeFrom = dark ? "from-[#0a0a0a]" : "from-neutral-50"

  const m1 = marqueeItems.slice(0, Math.ceil(marqueeItems.length / 3))
  const m2 = marqueeItems.slice(Math.ceil(marqueeItems.length / 3), Math.ceil((marqueeItems.length / 3) * 2))
  const m3 = marqueeItems.slice(Math.ceil((marqueeItems.length / 3) * 2))

  return (
    <section className={`relative pt-20 sm:pt-32 ${bg}`}>
      <div className="mx-auto max-w-full">
        {/* Header */}
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-4 px-5 text-center md:px-10">
          <h2 className="max-w-3xl text-4xl font-medium sm:text-5xl lg:text-6xl">
            {headline}
          </h2>
          {description && (
            <p className={`max-w-xl text-base md:text-lg ${mutedText}`}>
              {description}
            </p>
          )}

          {/* Marquee tags */}
          {marqueeItems.length > 0 && (
            <div className="relative mx-auto max-w-3xl overflow-hidden">
              <div className={`absolute left-0 z-10 h-full w-20 bg-gradient-to-r ${fadeFrom}`} />
              <div className={`absolute right-0 z-10 h-full w-20 bg-gradient-to-l ${fadeFrom}`} />

              <div className="flex w-full flex-col gap-3 py-6">
                {m1.length > 0 && (
                  <Marquee className="[--duration:45s] [--gap:0.75rem]" repeat={4}>
                    {m1.map((q) => (
                      <span key={q} className={`inline-block whitespace-nowrap rounded-sm border px-3 py-1 text-sm ${badgeBg}`}>
                        {q}
                      </span>
                    ))}
                  </Marquee>
                )}
                {m2.length > 0 && (
                  <Marquee className="[--duration:50s] [--gap:0.75rem]" repeat={4} reverse>
                    {m2.map((q) => (
                      <span key={q} className={`inline-block whitespace-nowrap rounded-sm border px-3 py-1 text-sm ${badgeBg}`}>
                        {q}
                      </span>
                    ))}
                  </Marquee>
                )}
                {m3.length > 0 && (
                  <Marquee className="[--duration:42s] [--gap:0.75rem]" repeat={4}>
                    {m3.map((q) => (
                      <span key={q} className={`inline-block whitespace-nowrap rounded-sm border px-3 py-1 text-sm ${badgeBg}`}>
                        {q}
                      </span>
                    ))}
                  </Marquee>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Feature cards */}
        <div className={`mx-auto mt-10 grid max-w-[1440px] grid-cols-1 divide-dashed border-t border-dashed sm:grid-cols-2 sm:divide-x lg:grid-cols-4 ${borderColor}`}>
          {features.map((feature) => {
            const Icon = iconMap[feature.icon || ""] || Zap
            return (
              <div
                key={feature.title}
                className="flex flex-col gap-5 px-5 py-8 lg:px-6 lg:py-10"
              >
                <Icon className={`size-12 ${iconColor}`} />
                <div className="flex flex-col gap-2 pt-10 lg:pt-20">
                  <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed ${mutedText}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
