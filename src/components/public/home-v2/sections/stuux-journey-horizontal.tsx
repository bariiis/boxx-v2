"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Boxes, Server, HardDrive, Network } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "../hooks/use-reduced-motion"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

type Panel = {
  slug: string
  href: string
  title: string
  tagline: string
  specs: string[]
  Icon: typeof Boxes
  cta: string
  accent: string
}

const PANELS: Panel[] = [
  {
    slug: "workstation",
    href: "/urunler/kategori/is-istasyonlari",
    title: "Workstation",
    tagline: "Tek elden kontrol: tasarım, render, simülasyon.",
    specs: ["Dual RTX 5000 Ada", "128 GB ECC DDR5", "Liquid cooling — 36 dB"],
    Icon: Boxes,
    cta: "APEXX serisini incele",
    accent: "rgba(3,105,161,0.22)",
  },
  {
    slug: "gpu-server",
    href: "/urunler",
    title: "GPU Server",
    tagline: "Multi-GPU pipeline. NVLink hazır iskelet. Data-center sertifikalı.",
    specs: ["8× H100 SXM", "NVLink + InfiniBand", "Redundant 3 kW PSU"],
    Icon: Server,
    cta: "HPX rack serisi",
    accent: "rgba(99,102,241,0.22)",
  },
  {
    slug: "storage",
    href: "/urunler",
    title: "Storage",
    tagline: "NVMe-first NAS. Yüksek throughput, saniyeler içinde snapshot.",
    specs: ["48× NVMe Gen5", "100 GbE uplink", "Hot-swap + IPMI"],
    Icon: HardDrive,
    cta: "Vault serisi",
    accent: "rgba(14,165,233,0.22)",
  },
  {
    slug: "networking",
    href: "/urunler/kategori/ag-ekipmanlari",
    title: "Networking",
    tagline: "25/40/100 GbE switch hattı. Low-latency, on-prem AI için hazır.",
    specs: ["32× 100 GbE", "Cut-through 450 ns", "Stacking + MLAG"],
    Icon: Network,
    cta: "Mesh anahtarlar",
    accent: "rgba(168,85,247,0.22)",
  },
]

export function StuuxJourneyHorizontal() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return
    if (window.matchMedia("(max-width: 767px)").matches) return

    const ctx = gsap.context(() => {
      const totalScroll = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -totalScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${totalScroll()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    }, root)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      ctx.revert()
    }
  }, [reduced])

  return (
    <section
      ref={rootRef}
      id="journey"
      aria-label="Ürün yolculuğu"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--stuux-bg)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(226,232,240,0) 0%, rgba(226,232,240,0.6) 50%, rgba(226,232,240,0) 100%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-6 pt-20 md:pb-10 md:pt-24">
        <p
          className="text-[11px] uppercase tracking-[0.28em]"
          style={{ color: "var(--stuux-muted)" }}
        >
          01 — Yolculuk
        </p>
        <h2
          className="stuux-heading max-w-2xl text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
          style={{ color: "var(--stuux-primary)" }}
        >
          Dört temel direk — <span className="italic">tek</span> sistem felsefesi.
        </h2>
        <p
          className="max-w-xl text-base leading-relaxed sm:text-lg"
          style={{ color: "var(--stuux-muted)" }}
        >
          Masaüstünden veri merkezine kadar, STUUX ekipman hattının bütünü. Yatay olarak kaydır, her kategoriye gir.
        </p>
      </div>

      {/* Horizontal track — native swipe/scroll fallback when GSAP pinning is
          inactive (mobile or prefers-reduced-motion); GSAP takes over on
          desktop where the wrapper becomes a clipped viewport. */}
      <div className="relative snap-x snap-mandatory overflow-x-auto md:motion-safe:snap-none md:motion-safe:overflow-x-hidden">
        <div
          ref={trackRef}
          className="flex w-max gap-6 px-6 pb-24 pt-6 md:gap-10 md:px-10 md:pb-32 md:pt-10"
        >
          {PANELS.map((p, i) => (
            <article
              key={p.slug}
              className="group relative flex h-[72vh] w-[85vw] max-w-[640px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-3xl p-8 stuux-glass md:h-[78vh] md:w-[44vw] md:p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-[60%] w-[60%] rounded-full"
                style={{
                  background: `radial-gradient(circle, ${p.accent} 0%, transparent 70%)`,
                  filter: "blur(40px)",
                }}
              />

              <header className="relative flex items-start justify-between">
                <span
                  className="text-[11px] uppercase tracking-[0.28em]"
                  style={{ color: "var(--stuux-muted)" }}
                >
                  0{i + 1} / 04
                </span>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: "rgba(15,23,42,0.06)",
                    color: "var(--stuux-primary)",
                  }}
                >
                  <p.Icon className="h-6 w-6" />
                </div>
              </header>

              <div className="relative space-y-6">
                <h3
                  className="stuux-heading text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl"
                  style={{ color: "var(--stuux-primary)" }}
                >
                  {p.title}
                </h3>
                <p
                  className="max-w-md text-base leading-relaxed sm:text-lg"
                  style={{ color: "var(--stuux-secondary)" }}
                >
                  {p.tagline}
                </p>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {p.specs.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--stuux-muted)" }}
                    >
                      <span
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: "var(--stuux-cta)" }}
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <footer className="relative flex items-center justify-between">
                <Link
                  href={p.href}
                  className="group/cta inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium transition-colors duration-200"
                  style={{ color: "var(--stuux-cta)" }}
                >
                  {p.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                </Link>
                <span
                  className="text-[10px] uppercase tracking-[0.28em]"
                  style={{ color: "var(--stuux-muted)" }}
                >
                  {p.slug}
                </span>
              </footer>
            </article>
          ))}

          {/* Final lock panel — track end */}
          <article
            className="flex h-[72vh] w-[65vw] max-w-[520px] shrink-0 snap-center flex-col items-start justify-center gap-6 rounded-3xl p-10 md:h-[78vh] md:w-[36vw]"
            style={{
              background:
                "linear-gradient(135deg, var(--stuux-primary) 0%, var(--stuux-secondary) 100%)",
              color: "#F8FAFC",
            }}
          >
            <p className="text-[11px] uppercase tracking-[0.28em] opacity-70">
              Track sonu — Detay bölümüne geç
            </p>
            <h3 className="stuux-heading text-4xl leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
              Senin iş yükün <span className="italic">seni</span> bekliyor.
            </h3>
            <Link
              href="/konfigurator"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium transition-transform duration-200 hover:translate-x-0.5"
              style={{ color: "var(--stuux-primary)" }}
            >
              Yapılandırıcıyı aç
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}
