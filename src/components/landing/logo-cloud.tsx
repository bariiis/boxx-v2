"use client"

import { InfiniteSlider } from "@/components/ui/infinite-slider"

interface LogoCloudProps {
  headline?: string
  subheadline?: string
  logos: { src: string; alt: string }[]
  speed?: number
  reverse?: boolean
  dark?: boolean
}

export function LogoCloud({
  headline,
  subheadline,
  logos = [],
  speed = 80,
  reverse = false,
  dark = true,
}: LogoCloudProps) {
  if (!logos.length) return null

  const mutedText = dark ? "text-neutral-400" : "text-neutral-500"
  const borderColor = dark ? "bg-neutral-800" : "bg-neutral-200"

  return (
    <section className={`py-16 md:py-24 ${dark ? "bg-[#0a0a0a] text-white" : "bg-white text-[#0a0a0a]"}`}>
      <div className="relative mx-auto max-w-3xl px-4">
        {(headline || subheadline) && (
          <h2 className="mb-5 text-center text-xl font-medium tracking-tight md:text-3xl">
            {subheadline && (
              <>
                <span className={mutedText}>{subheadline}</span>
                <br />
              </>
            )}
            {headline && <span className="font-semibold">{headline}</span>}
          </h2>
        )}

        <div
          className={`mx-auto my-5 h-px max-w-sm ${borderColor}`}
          style={{ maskImage: "linear-gradient(to right, transparent, black, transparent)" }}
        />

        <div
          className="overflow-hidden py-4"
          style={{ maskImage: "linear-gradient(to right, transparent, black, transparent)" }}
        >
          <InfiniteSlider gap={42} reverse={reverse} speed={speed} speedOnHover={25}>
            {logos.filter((logo) => logo.src).map((logo, i) => (
              <img
                key={i}
                alt={logo.alt}
                className={`pointer-events-none h-4 select-none md:h-5 ${dark ? "invert" : ""}`}
                loading="lazy"
                src={logo.src}
              />
            ))}
          </InfiniteSlider>
        </div>

        <div
          className={`mt-5 h-px ${borderColor}`}
          style={{ maskImage: "linear-gradient(to right, transparent, black, transparent)" }}
        />
      </div>
    </section>
  )
}
