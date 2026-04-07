"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InfiniteSlider } from "@/components/ui/infinite-slider"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"
import { ChevronRight } from "lucide-react"

interface HeroVideoProps {
  headline: string
  description?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  videoSrc?: string
  height?: "small" | "medium" | "large" | "full"
  showLogoBanner?: boolean
  logoBannerText?: string
  logos?: { src: string; alt: string; height?: number }[]
  dark?: boolean
}

export function HeroVideo({
  headline = "Sınırsız Güç",
  description,
  ctaText = "Teklif İste",
  ctaHref = "/iletisim",
  secondaryCtaText,
  secondaryCtaHref,
  videoSrc,
  height = "large",
  showLogoBanner = false,
  logoBannerText = "En iyi ekiplerin tercihi",
  logos = [],
  dark = true,
}: HeroVideoProps) {
  const heightClasses = {
    small: "py-16 md:pb-20 lg:pb-24 lg:pt-32",
    medium: "py-20 md:pb-28 lg:pb-32 lg:pt-48",
    large: "py-24 md:pb-32 lg:pb-36 lg:pt-72",
    full: "min-h-screen flex items-center py-24",
  }

  return (
    <div className={dark ? "bg-[#0a0a0a] text-white" : "bg-white text-[#0a0a0a]"}>
      <section className="relative overflow-hidden">
        <div className={heightClasses[height]}>
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
              <h1 className="mt-8 max-w-2xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl">
                {headline}
              </h1>
              {description && (
                <p className={`mt-8 max-w-2xl text-balance text-lg ${dark ? "text-neutral-400" : "text-neutral-600"}`}>
                  {description}
                </p>
              )}

              <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className={`h-12 rounded-full pl-5 pr-3 text-base ${
                    dark
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "bg-[#0a0a0a] text-white hover:bg-neutral-800"
                  }`}
                >
                  <Link href={ctaHref}>
                    <span className="text-nowrap">{ctaText}</span>
                    <ChevronRight className="ml-1" />
                  </Link>
                </Button>
                {secondaryCtaText && secondaryCtaHref && (
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className={`h-12 rounded-full px-5 text-base ${
                      dark
                        ? "text-neutral-300 hover:bg-white/5 hover:text-white"
                        : "text-neutral-600 hover:bg-zinc-950/5 hover:text-black"
                    }`}
                  >
                    <Link href={secondaryCtaHref}>
                      <span className="text-nowrap">{secondaryCtaText}</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Background video */}
          {videoSrc && (
            <div className="absolute inset-1 overflow-hidden rounded-3xl border border-black/10 aspect-[2/3] sm:aspect-video lg:rounded-[3rem] dark:border-white/5">
              <video
                autoPlay
                loop
                muted
                playsInline
                className={`size-full object-cover ${
                  dark
                    ? "opacity-35 lg:opacity-75"
                    : "opacity-50 invert"
                }`}
                src={videoSrc}
              />
            </div>
          )}
        </div>
      </section>

      {/* Logo banner */}
      {showLogoBanner && logos.length > 0 && (
        <section className={dark ? "bg-[#0a0a0a] pb-2" : "bg-white pb-2"}>
          <div className="group relative m-auto max-w-7xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div className={`md:max-w-44 md:pr-6 ${dark ? "md:border-r md:border-neutral-800" : "md:border-r"}`}>
                <p className={`text-end text-sm ${dark ? "text-neutral-400" : "text-neutral-600"}`}>
                  {logoBannerText}
                </p>
              </div>
              <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                  {logos.map((logo, i) => (
                    <div key={i} className="flex">
                      <img
                        className={`mx-auto w-fit ${dark ? "invert" : ""}`}
                        src={logo.src}
                        alt={logo.alt}
                        style={{ height: logo.height || 20 }}
                      />
                    </div>
                  ))}
                </InfiniteSlider>

                <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r ${dark ? "from-[#0a0a0a]" : "from-white"}`} />
                <div className={`absolute inset-y-0 right-0 w-20 bg-gradient-to-l ${dark ? "from-[#0a0a0a]" : "from-white"}`} />
                <ProgressiveBlur
                  className="pointer-events-none absolute left-0 top-0 h-full w-20"
                  direction="left"
                  blurIntensity={1}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute right-0 top-0 h-full w-20"
                  direction="right"
                  blurIntensity={1}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
