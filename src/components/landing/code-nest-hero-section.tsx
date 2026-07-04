"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = { label: string; href: string }

type CodeNestHeroProps = {
  videoSrc?: string
  eyebrow?: string
  headline?: string
  headlineAccentWord?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  cardTag?: string
  cardHeadline?: string
  cardItalicWord?: string
  cardDescription?: string
  brandName?: string
  showInternalNav?: boolean
  navItems?: NavItem[]
  accent?: string
  bgColor?: string
}

const DEFAULT_NAV: NavItem[] = [
  { label: "PROJECTS", href: "#projects" },
  { label: "BLOG", href: "#blog" },
  { label: "ABOUT", href: "#about" },
  { label: "RESUME", href: "#resume" },
]

export function CodeNestHeroSection({
  videoSrc = "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8",
  eyebrow = "Career-Ready Curriculum",
  headline = "LAUNCH YOUR CODING CAREER",
  description = "Master in-demand coding skills with our comprehensive curriculum. From fundamentals to advanced projects, we prepare you for the tech industry.",
  ctaLabel = "Get Started",
  ctaHref = "#",
  cardTag = "[ 2025 ]",
  cardHeadline = "Taught by Industry Professionals",
  cardItalicWord = "Industry",
  cardDescription = "Learn from engineers shipping code at scale today.",
  brandName = "CodeNest",
  showInternalNav = false,
  navItems = DEFAULT_NAV,
  accent = "#5ed29c",
  bgColor = "#070b0a",
}: CodeNestHeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return
    let hls: import("hls.js").default | null = null
    let cancelled = false

    const setup = async () => {
      // Native HLS (Safari / iOS)
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc
        return
      }
      const HlsMod = await import("hls.js").catch(() => null)
      if (cancelled || !HlsMod) return
      const Hls = HlsMod.default
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: false })
        hls.loadSource(videoSrc)
        hls.attachMedia(video)
      } else {
        video.src = videoSrc
      }
    }
    setup()

    return () => {
      cancelled = true
      hls?.destroy()
    }
  }, [videoSrc])

  // Render splits: headline ends with "." → color the period with accent.
  const headlineHasDot = headline.endsWith(".")
  const headlineBody = headlineHasDot ? headline.slice(0, -1) : headline

  // Split card headline into runs: italicize `cardItalicWord` occurrence.
  const renderCardHeadline = () => {
    if (!cardItalicWord || !cardHeadline.includes(cardItalicWord)) return cardHeadline
    const idx = cardHeadline.indexOf(cardItalicWord)
    const before = cardHeadline.slice(0, idx)
    const after = cardHeadline.slice(idx + cardItalicWord.length)
    return (
      <>
        {before}
        <span
          className="italic"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          {cardItalicWord}
        </span>
        {after}
      </>
    )
  }

  return (
    <section
      aria-label="CodeNest hero"
      className="relative isolate min-h-[100svh] w-full overflow-hidden"
      style={{ backgroundColor: bgColor, color: "#FFFFFF" }}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        loop
        style={{ opacity: 0.6 }}
      />

      {/* Left-to-transparent gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(90deg, ${bgColor} 0%, ${bgColor}E6 20%, transparent 80%)`,
        }}
      />
      {/* Bottom-up gradient for text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(0deg, ${bgColor} 0%, ${bgColor}CC 25%, transparent 70%)`,
        }}
      />

      {/* Vertical grid lines (desktop only) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
        <div
          className="absolute inset-y-0"
          style={{ left: "25%", width: "1px", background: "rgba(255,255,255,0.08)" }}
        />
        <div
          className="absolute inset-y-0"
          style={{ left: "50%", width: "1px", background: "rgba(255,255,255,0.08)" }}
        />
        <div
          className="absolute inset-y-0"
          style={{ left: "75%", width: "1px", background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Central ellipse glow (top) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-14%] -z-10 h-[520px] w-[140%] -translate-x-1/2"
        viewBox="0 0 1200 520"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="codenest-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="25" />
          </filter>
          <radialGradient id="codenest-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
            <stop offset="60%" stopColor="#0B3B2E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0B3B2E" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx="600"
          cy="260"
          rx="520"
          ry="150"
          fill="url(#codenest-glow)"
          filter="url(#codenest-blur)"
        />
      </svg>

      {/* Internal nav (optional — defaults off so it doesn't clash with PublicHeader) */}
      {showInternalNav && (
        <>
          <nav className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
            <Link href="/" className="group inline-flex items-center gap-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-200 group-hover:scale-110"
              >
                <path
                  d="M4 6 L12 2 L20 6 L20 18 L12 22 L4 18 Z"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M12 2 L12 22" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.5" />
              </svg>
              <span
                className="text-[15px] font-semibold tracking-tight text-white"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                {brandName}
              </span>
            </Link>

            <ul
              className="hidden items-center gap-8 md:flex"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[16px] text-white/85 transition-colors duration-200 hover:[color:var(--codenest-accent)]"
                    style={{ ["--codenest-accent" as string]: accent }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white/90 transition-colors hover:text-white md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </nav>

          {/* Mobile full-screen overlay */}
          <div
            className={cn(
              "fixed inset-0 z-50 flex flex-col transition-opacity duration-200 md:hidden",
              menuOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0",
            )}
            style={{ background: bgColor }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span
                className="text-[15px] font-semibold tracking-tight text-white"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                {brandName}
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white/90 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul
              className="flex flex-1 flex-col items-center justify-center gap-8"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl font-medium text-white/90 transition-colors duration-200 hover:[color:var(--codenest-accent)]"
                    style={{ ["--codenest-accent" as string]: accent }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start gap-8 px-6 pb-28 pt-24 md:px-10 md:pt-36 lg:pt-44">
        {/* Liquid Glass card (floating above headline) */}
        <div
          className="codenest-liquid-card relative flex h-[200px] w-[200px] flex-col justify-between rounded-2xl p-5"
          style={{
            transform: "translateY(-50px)",
            background: "rgba(255, 255, 255, 0.01)",
            backgroundBlendMode: "luminosity",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          <span
            className="text-[14px] leading-none tracking-wide text-white/75"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            {cardTag}
          </span>
          <h3
            className="text-[18px] font-medium leading-tight text-white"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            {renderCardHeadline()}
          </h3>
          <p
            className="text-[11px] leading-snug text-white/55"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            {cardDescription}
          </p>
        </div>

        {/* Eyebrow */}
        <p
          className="text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            color: accent,
          }}
        >
          {eyebrow}
        </p>

        {/* Main headline */}
        <h1
          className="max-w-4xl text-[40px] font-extrabold uppercase leading-[0.98] tracking-tight sm:text-5xl md:text-6xl lg:text-[72px]"
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            color: "#FFFFFF",
          }}
        >
          {headlineBody}
          {headlineHasDot && <span style={{ color: accent }}>.</span>}
        </h1>

        {/* Description */}
        <p
          className="max-w-[512px] text-[14px] leading-relaxed text-white/70"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          {description}
        </p>

        {/* CTA */}
        <Link
          href={ctaHref}
          className="group mt-2 inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition-transform duration-200 active:scale-[0.98]"
          style={{
            backgroundColor: accent,
            color: bgColor,
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  )
}
