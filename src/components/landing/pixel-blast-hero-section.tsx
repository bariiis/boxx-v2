"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMemo } from "react"
import { useHydrated } from "@/hooks/use-hydrated"

const PixelBlast = dynamic(() => import("@/components/ui/pixel-blast"), {
  ssr: false,
  loading: () => null,
})

type Variant = "square" | "circle" | "triangle" | "diamond"

type PixelBlastHeroProps = {
  eyebrow?: string
  headline?: string
  description?: string
  primaryCtaText?: string
  primaryCtaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  variant?: Variant
  pixelSize?: number
  color?: string
  patternScale?: number
  patternDensity?: number
  pixelSizeJitter?: number
  enableRipples?: boolean
  rippleSpeed?: number
  rippleThickness?: number
  rippleIntensityScale?: number
  liquid?: boolean
  liquidStrength?: number
  liquidRadius?: number
  liquidWobbleSpeed?: number
  speed?: number
  edgeFade?: number
  transparent?: boolean
  bgColor?: string
  textColor?: string
  height?: string
  heroImage?: string
  heroImageAlt?: string
}

export function PixelBlastHeroSection({
  eyebrow = "INTERACTIVE BACKGROUND",
  headline = "Pixel Blast",
  description = "WebGL ile sürüklenen, tıklanan, dalgalanan piksel desenli interaktif arka plan. Hover ve tıkla — yüzey tepki versin.",
  primaryCtaText = "Keşfet",
  primaryCtaHref = "#",
  secondaryCtaText = "",
  secondaryCtaHref = "",
  variant = "circle",
  pixelSize = 6,
  color = "#B497CF",
  patternScale = 3,
  patternDensity = 1.2,
  pixelSizeJitter = 0.5,
  enableRipples = true,
  rippleSpeed = 0.4,
  rippleThickness = 0.12,
  rippleIntensityScale = 1.5,
  liquid = true,
  liquidStrength = 0.12,
  liquidRadius = 1.2,
  liquidWobbleSpeed = 5,
  speed = 0.6,
  edgeFade = 0.25,
  transparent = true,
  bgColor = "#070b0a",
  textColor = "#FFFFFF",
  height = "100vh",
  heroImage,
  heroImageAlt = "",
}: PixelBlastHeroProps) {
  // Fallback during SSR/hydration; resolved from the CSS variable on the client
  const hydrated = useHydrated()
  const fontFamily = useMemo(() => {
    if (!hydrated) return "'Urbanist', sans-serif"
    const val = getComputedStyle(document.documentElement).getPropertyValue("--font-urbanist").trim()
    return val || "'Urbanist', sans-serif"
  }, [hydrated])

  return (
    <section
      aria-label="Pixel Blast hero"
      className="relative isolate w-full overflow-hidden"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        minHeight: height,
        fontFamily,
      }}
    >
      {/* Interactive WebGL background */}
      <div className="pointer-events-auto absolute inset-0 -z-0">
        <PixelBlast
          variant={variant}
          pixelSize={pixelSize}
          color={color}
          patternScale={patternScale}
          patternDensity={patternDensity}
          pixelSizeJitter={pixelSizeJitter}
          enableRipples={enableRipples}
          rippleSpeed={rippleSpeed}
          rippleThickness={rippleThickness}
          rippleIntensityScale={rippleIntensityScale}
          liquid={liquid}
          liquidStrength={liquidStrength}
          liquidRadius={liquidRadius}
          liquidWobbleSpeed={liquidWobbleSpeed}
          speed={speed}
          edgeFade={edgeFade}
          transparent={transparent}
        />
      </div>

      {/* Bottom-up readability gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(180deg, transparent 30%, ${bgColor}99 70%, ${bgColor} 100%)`,
        }}
      />

      <div
        className="pointer-events-none relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center"
        style={{ minHeight: height, justifyContent: "center", paddingTop: "10vh", paddingBottom: "10vh" }}
      >
        {eyebrow && (
          <p
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.24em]"
            style={{
              borderColor: "rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.78)",
              backgroundColor: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            {eyebrow}
          </p>
        )}

        {headline && (
          <h1
            className="pointer-events-auto max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[96px]"
            style={{ color: textColor, fontFamily }}
          >
            {headline}
          </h1>
        )}

        {description && (
          <p
            className="pointer-events-auto max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: "rgba(255,255,255,0.72)", fontFamily }}
          >
            {description}
          </p>
        )}

        {heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={heroImageAlt}
            className="pointer-events-auto w-full object-contain"
            style={{ maxWidth: "500px" }}
          />
        )}

        {(primaryCtaText || secondaryCtaText) && (
          <div className="pointer-events-auto mt-2 flex flex-wrap items-center justify-center gap-3">
            {primaryCtaText && (
              <Link
                href={primaryCtaHref || "#"}
                className={cn(
                  "group inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-transform duration-200 active:scale-[0.98]",
                )}
                style={{
                  backgroundColor: color,
                  color: bgColor,
                }}
              >
                {primaryCtaText}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
            {secondaryCtaText && (
              <Link
                href={secondaryCtaHref || "#"}
                className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors duration-200"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  color: textColor,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {secondaryCtaText}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
