"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function StuuxFooterCta() {
  return (
    <section
      id="iletisim"
      aria-label="İletişim çağrısı"
      className="relative w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--stuux-bg) 0%, #E2E8F0 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 stuux-blob -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(3,105,161,0.18), transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-14 px-6 py-32 md:py-44">
        <p
          className="text-[11px] uppercase tracking-[0.28em]"
          style={{ color: "var(--stuux-muted)" }}
        >
          03 — Başla
        </p>

        <h2
          className="stuux-heading text-5xl leading-[0.95] tracking-tight sm:text-7xl md:text-[128px] lg:text-[160px]"
          style={{ color: "var(--stuux-primary)" }}
        >
          Birlikte
          <br />
          <span className="italic" style={{ fontWeight: 500 }}>
            inşa
          </span>{" "}
          edelim.
        </h2>

        <p
          className="max-w-xl text-lg leading-relaxed md:text-xl"
          style={{ color: "var(--stuux-secondary)" }}
        >
          İki dakikalık formu doldur. Mühendis ekibi 24 saat içinde iş yüküne özel
          konfigürasyonla geri döner. Hazır reçete yok — sadece senin için üretilen
          sistem.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/yapilandirici"
            className="stuux-btn-primary group inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full px-7 py-3.5 text-base font-medium"
          >
            Yapılandırmaya başla
            <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/destek"
            className="stuux-btn-outline inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full px-7 py-3.5 text-base font-medium"
          >
            Satış ekibiyle görüş
          </Link>
        </div>

        <div
          className="grid w-full grid-cols-1 gap-6 border-t pt-10 sm:grid-cols-3"
          style={{ borderColor: "rgba(15,23,42,0.1)" }}
        >
          {[
            { k: "Merkez", v: "İstanbul · Maslak" },
            { k: "E-posta", v: "info@stuux.com" },
            { k: "Destek", v: "09:00 — 21:00 · TR" },
          ].map((item) => (
            <div key={item.k}>
              <dt
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: "var(--stuux-muted)" }}
              >
                {item.k}
              </dt>
              <dd
                className="mt-2 text-base"
                style={{ color: "var(--stuux-primary)" }}
              >
                {item.v}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
