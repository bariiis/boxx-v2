"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight, Cpu, HardDrive, Zap } from "lucide-react"
import type { HomeV2HeroData } from "../data"

const HeroScene = dynamic(
  () => import("../3d/hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => null }
)

interface StuuxHeroIntroProps {
  data: HomeV2HeroData
}

export function StuuxHeroIntro({ data }: StuuxHeroIntroProps) {
  return (
    <section
      id="hero"
      aria-label="STUUX tanıtım"
      className="relative isolate min-h-[100svh] w-full overflow-hidden"
      style={{ backgroundColor: "var(--stuux-bg)" }}
    >
      {/* Iridescent morphing background */}
      <div className="pointer-events-none absolute inset-0 -z-10 stuux-iridescent" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-20 h-[60vmin] w-[60vmin] stuux-blob -z-10"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(3,105,161,0.28), rgba(3,105,161,0) 70%)",
          filter: "blur(30px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-[70vmin] w-[70vmin] stuux-blob -z-10"
        style={{
          background:
            "radial-gradient(circle at 70% 70%, rgba(99,102,241,0.22), rgba(99,102,241,0) 70%)",
          filter: "blur(40px)",
          animationDelay: "-6s",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-7 space-y-8">
          <p
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em]"
            style={{
              borderColor: "rgba(15,23,42,0.12)",
              color: "var(--stuux-secondary)",
              backgroundColor: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--stuux-cta)" }}
            />
            {data.eyebrow}
          </p>

          <h1
            className="stuux-heading text-[44px] leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[88px]"
            style={{ color: "var(--stuux-primary)" }}
          >
            {data.title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <span
                    className="italic"
                    style={{
                      fontWeight: 500,
                      color: "var(--stuux-cta)",
                    }}
                  >
                    {line}
                  </span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          <p
            className="max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--stuux-muted)" }}
          >
            {data.subtitle}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={data.primaryCta.href}
              className="stuux-btn-primary group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
            >
              {data.primaryCta.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={data.secondaryCta.href}
              className="stuux-btn-outline inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
            >
              {data.secondaryCta.label}
            </Link>
          </div>

          <dl className="grid grid-cols-3 gap-4 pt-6 sm:max-w-md">
            {[
              { k: "847", v: "aktif sistem" },
              { k: "99.8%", v: "uptime" },
              { k: "3 yıl", v: "garanti" },
            ].map((s) => (
              <div key={s.k}>
                <dt
                  className="stuux-heading text-2xl sm:text-3xl"
                  style={{ color: "var(--stuux-primary)" }}
                >
                  {s.k}
                </dt>
                <dd
                  className="text-xs uppercase tracking-[0.18em]"
                  style={{ color: "var(--stuux-muted)" }}
                >
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative md:col-span-5">
          <div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl"
            style={{
              background:
                "linear-gradient(160deg, #1E293B 0%, #0F172A 55%, #0369A1 120%)",
              boxShadow:
                "0 40px 80px -30px rgba(15,23,42,0.45), 0 1px 0 rgba(255,255,255,0.06) inset",
            }}
          >
            {/* Iridescent spot highlights */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 h-[55%] w-[55%] rounded-full stuux-blob"
              style={{
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.55) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-12 -left-16 h-[55%] w-[55%] rounded-full stuux-blob"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%)",
                filter: "blur(40px)",
                animationDelay: "-6s",
              }}
            />
            {/* Grid lines */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* 3D hero model */}
            <div className="absolute inset-0 z-0">
              <HeroScene modelUrl="/models/killer-beats-mixstation.glb" modelFitSize={3.5} />
            </div>

            {/* Brand watermark */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <span
                className="stuux-heading select-none text-white/[0.14]"
                style={{
                  fontSize: "clamp(120px, 18vw, 200px)",
                  fontStyle: "italic",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                  fontWeight: 600,
                }}
              >
                STUUX
              </span>
            </div>

            {/* Floating spec chips */}
            <div className="absolute left-5 top-5 z-10 flex flex-col gap-2">
              {[
                { Icon: Cpu, label: "Threadripper 7980X" },
                { Icon: Zap, label: "Dual RTX 5000 Ada" },
                { Icon: HardDrive, label: "8 TB NVMe Gen5" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  <s.Icon className="h-3.5 w-3.5" />
                  {s.label}
                </div>
              ))}
            </div>

            {/* Live status tag top-right */}
            <div
              className="absolute right-5 top-5 z-10 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] font-medium"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: "#34D399",
                  boxShadow: "0 0 8px #34D399",
                }}
              />
              stokta
            </div>

            {/* Öne çıkan info card */}
            <div
              className="absolute inset-x-5 bottom-5 z-10 rounded-2xl px-5 py-4"
              style={{
                background: "rgba(15,23,42,0.55)",
                backdropFilter: "blur(14px) saturate(1.1)",
                WebkitBackdropFilter: "blur(14px) saturate(1.1)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F8FAFC",
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.22em] opacity-70">
                Öne çıkan
              </p>
              <p className="mt-1 stuux-heading text-lg">
                APEXX W4L · Dual RTX 5000 Ada
              </p>
              <div className="mt-3 flex items-center justify-between text-xs opacity-80">
                <span>Özel üretim · TR</span>
                <span>Benchmark raporu ile</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-6 mx-auto flex w-fit items-center gap-3 text-[10px] uppercase tracking-[0.28em]"
        style={{ color: "var(--stuux-muted)" }}
      >
        <span className="h-px w-6" style={{ background: "currentColor" }} />
        kaydır — yolculuğa gir
        <span className="h-px w-6" style={{ background: "currentColor" }} />
      </div>
    </section>
  )
}
