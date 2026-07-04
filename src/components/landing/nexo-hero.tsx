"use client"

import { useEffect, useRef } from "react"

export type NexoHeroStat = { value: string; label: string }
export type NexoHeroStatus = { label: string; icon?: string }

const DEFAULT_STATS: NexoHeroStat[] = [
  { value: "99.9%", label: "UPTIME" },
  { value: "<30ms", label: "LATENCY" },
  { value: "24/7", label: "SUPPORT" },
  { value: "SGP.22", label: "COMPLIANT" },
]

const DEFAULT_STATUS_ITEMS: NexoHeroStatus[] = [
  {
    label: "SYSTEM ACTIVE",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  },
  {
    label: "GSMA CERTIFIED",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  },
  {
    label: "AI ENABLED",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/><path d="M2 17a10 10 0 0 1 20 0"/></svg>`,
  },
  {
    label: "VERCEL EDGE",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  },
]

export function NexoHero({
  brandNameLight,
  brandNameBold,
  brandSuperscript,
  subtitleLine1,
  subtitleLine2,
  statusItems,
  stats,
  heroImage,
  theme,
}: {
  brandNameLight?: string
  brandNameBold?: string
  brandSuperscript?: string
  subtitleLine1?: string
  subtitleLine2?: string
  statusItems?: NexoHeroStatus[]
  stats?: NexoHeroStat[]
  heroImage?: string
  theme?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const isDark = theme === "dark"
  const resolvedStats = stats && stats.length > 0 ? stats : DEFAULT_STATS
  const resolvedStatusItems = statusItems && statusItems.length > 0 ? statusItems : DEFAULT_STATUS_ITEMS

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    const particles: Array<{ x: number; y: number; vx: number; vy: number; opacity: number }> = []

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.fillStyle = `rgba(0, 0, 0, ${particle.opacity})`
        ctx.fillRect(particle.x, particle.y, 1, 1)
      })

      requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={isDark ? { backgroundColor: "#0a0a0a", color: "#fafafa" } : { backgroundColor: "var(--lp-bg)" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />

      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 border border-black opacity-20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 border border-black opacity-15 animate-bounce"></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-[var(--lp-bg)] opacity-30 animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-1 bg-[var(--lp-bg)] opacity-10 rotate-12"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 border border-black opacity-10 rotate-45"></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {heroImage && (
          <div className="mb-20 flex justify-center">
            <img
              src={heroImage}
              alt=""
              className="max-h-96 w-auto object-contain"
            />
          </div>
        )}

        <div className="mb-12">
          <h1 className="text-8xl font-light tracking-wider mb-6 font-mono">
            {brandNameLight ?? "NEXORA"}
            <span className="font-bold">{brandNameBold ?? "SIM"}</span>
            <sup className="text-2xl">{brandSuperscript ?? "™"}</sup>
          </h1>
          <div className="w-40 h-px bg-[var(--lp-bg)] mx-auto mb-8 relative">
            <div className="absolute left-0 top-0 h-full bg-[var(--lp-bg)] animate-pulse" style={{ width: "100%" }}></div>
          </div>
          <p className="text-2xl font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
            <span style={{ color: "#00BF60" }}>{subtitleLine1 ?? "MYANMAR'S NEXT-GEN ESIM INFRASTRUCTURE"}</span>
            <br />
            <span className="font-mono text-xs tracking-widest" style={{ color: isDark ? "rgba(250,250,250,0.45)" : "inherit" }}>
              {subtitleLine2 ?? "AI-DRIVEN • GSMA-COMPLIANT • VERCEL-POWERED"}
            </span>
          </p>
        </div>

        <div className="flex justify-center items-center text-sm font-mono mb-12">
          {resolvedStatusItems.map((item, i) => (
            <div key={i} className="contents">
              <div className="flex flex-col items-center gap-2 group px-6">
                {item.icon ? (
                  <span
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                    dangerouslySetInnerHTML={{ __html: item.icon }}
                  />
                ) : (
                  <span className="w-5 h-5" />
                )}
                <span className="transition-colors tracking-widest" style={{ color: isDark ? "rgba(250,250,250,0.6)" : undefined }}>{item.label}</span>
              </div>
              {i < resolvedStatusItems.length - 1 && (
                <div className="w-px h-8 bg-current opacity-20 shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-8 max-w-2xl mx-auto">
          {resolvedStats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-mono font-bold">{stat.value}</div>
              <div className="text-xs font-mono" style={{ color: isDark ? "rgba(250,250,250,0.4)" : "#6b7280" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-black rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[var(--lp-bg)] rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}
