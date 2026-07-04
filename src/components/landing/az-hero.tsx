"use client"

import { useRef, useEffect, useState } from "react"

interface AzHeroProps {
  headline?: string
  subtext?: string
  brandText?: string
  tags?: string[]
  tags2?: string[]
  contactItems?: { label: string; href: string }[]
  videoSrc?: string
  videoPoster?: string
  ctaText?: string
  ctaHref?: string
}

export function AzHero({
  headline = "Design, tech & some magic",
  subtext = "Ready for the game changing project?",
  brandText = "STUUX",
  tags = ["Innovations", "Excellence", "Experience", "Competence", "Passion"],
  tags2 = ["UI/UX", "App design", "Development", "Branding", "Motion"],
  contactItems = [],
  videoSrc,
  videoPoster,
  ctaText = "New Case",
  ctaHref = "#",
}: AzHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[var(--lp-bg,#0a0a0a)] text-[var(--lp-fg,#fff)]"
    >
      {/* Cover overlay */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* Video background */}
      {videoSrc && (
        <div className="absolute inset-0 z-0">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={videoPoster}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      )}

      <div className="relative z-[2] flex min-h-screen flex-col justify-between px-6 py-8 lg:px-12 lg:py-12">
        {/* Top group: Tags + Video preview */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Tags columns */}
          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-medium tracking-wider uppercase transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {tags2.map((tag) => (
                <span
                  key={tag}
                  className={`inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-medium tracking-wider uppercase transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Contact info */}
          {contactItems.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-xs tracking-wider opacity-70 transition-opacity hover:opacity-100"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          {/* Video preview card */}
          {videoSrc && (
            <div
              className={`relative overflow-hidden rounded-xl transition-all duration-1000 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              style={{ width: 280, height: 200 }}
            >
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={videoPoster}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
              {ctaText && (
                <a
                  href={ctaHref}
                  className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  {ctaText}
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="currentColor">
                    <path d="M10.8,0v3.6h-3.6V0h3.6ZM14.4,10.8h3.6v-3.6h-3.6v-3.6h-3.6v3.6H0v3.6h10.8v3.6h3.6v-3.6ZM10.8,14.4h-3.6v3.6h3.6v-3.6Z" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Bottom group */}
        <div className="mt-auto">
          {/* Brand text - full width */}
          <div className="overflow-hidden">
            <h1
              className={`text-[clamp(4rem,15vw,14rem)] font-black leading-[0.85] tracking-tighter uppercase transition-all duration-1000 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[40px]"}`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {brandText}
            </h1>
          </div>

          {/* Subtext + Scroll CTA */}
          <div className="mt-6 flex items-end justify-between">
            <p className="max-w-md text-sm opacity-60 lg:text-base">{subtext}</p>
            <a
              href="#next-section"
              className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase opacity-70 transition-opacity hover:opacity-100"
            >
              Scroll to explore
              <svg width="14" height="14" viewBox="0 0 18 18" fill="currentColor">
                <path d="M18,10.8h-3.6v-3.6h3.6v3.6ZM7.2,14.4v3.6h3.6v-3.6h3.6v-3.6h-3.6V0h-3.6v10.8h-3.6v3.6s3.6,0,3.6,0ZM3.6,10.8v-3.6H0v3.6h3.6Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
