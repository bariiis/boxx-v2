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
  demoteHeading?: boolean
  image?: string
  imageAlt?: string
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
  demoteHeading = false,
  image,
  imageAlt = "",
}: HeroVideoProps) {
  const Heading = demoteHeading ? "h2" : "h1"
  const heightClasses = {
    small: "py-16 md:pb-20 lg:pb-24 lg:pt-32",
    medium: "py-20 md:pb-28 lg:pb-32 lg:pt-48",
    large: "py-24 md:pb-32 lg:pb-36 lg:pt-72",
    full: "min-h-screen flex items-center py-24",
  }

  return (
    <div style={{ backgroundColor: "var(--lp-bg)", color: "var(--lp-fg)" }}>
      <section className="relative overflow-hidden">
        <div className={heightClasses[height]}>
          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
            <div className="max-w-lg text-center lg:max-w-full lg:text-left">
              <Heading className="mt-8 text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl">
                {headline}
              </Heading>
              {description && (
                <div
                  className="mt-8 text-balance text-lg prose prose-invert max-w-none"
                  style={{ color: "var(--lp-muted-fg)" }}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}

              <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full pl-5 pr-3 text-base"
                  style={{
                    backgroundColor: "var(--lp-primary)",
                    color: "var(--lp-primary-fg)",
                  }}
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
                    className="h-12 rounded-full px-5 text-base"
                    style={{ color: "var(--lp-muted-fg)" }}
                  >
                    <Link href={secondaryCtaHref}>
                      <span className="text-nowrap">{secondaryCtaText}</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {image && (
              <div className="relative w-full overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={imageAlt} className="w-full h-auto object-cover" />
              </div>
            )}
          </div>

          {/* Background video */}
          {videoSrc && (
            <div className="absolute inset-1 overflow-hidden rounded-3xl border border-black/10 aspect-[2/3] sm:aspect-video lg:rounded-[3rem] dark:border-white/5">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="size-full object-cover opacity-35 lg:opacity-75"
                src={videoSrc}
              />
            </div>
          )}
        </div>
      </section>

      {/* Logo banner */}
      {showLogoBanner && logos.length > 0 && (
        <section className="pb-2" style={{ backgroundColor: "var(--lp-bg)" }}>
          <div className="group relative m-auto max-w-7xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div
                className="md:max-w-44 md:pr-6 md:border-r"
                style={{ borderColor: "var(--lp-border)" }}
              >
                <p className="text-end text-sm" style={{ color: "var(--lp-muted-fg)" }}>
                  {logoBannerText}
                </p>
              </div>
              <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                  {logos.map((logo, i) => (
                    <div key={i} className="flex">
                      <img
                        className="mx-auto w-fit"
                        src={logo.src}
                        alt={logo.alt}
                        style={{ height: logo.height || 20 }}
                      />
                    </div>
                  ))}
                </InfiniteSlider>

                <div
                  className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r"
                  style={{ backgroundImage: "linear-gradient(to right, var(--lp-bg), transparent)" }}
                />
                <div
                  className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l"
                  style={{ backgroundImage: "linear-gradient(to left, var(--lp-bg), transparent)" }}
                />
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
