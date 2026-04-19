"use client"

import Link from "next/link"
import { Boxes, HardDrive, Network, Server, type LucideIcon } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import type { HomeV2Category } from "../data"

const ICONS: Record<HomeV2Category["icon"], LucideIcon> = {
  boxes: Boxes,
  server: Server,
  harddrive: HardDrive,
  network: Network,
}

interface CategoryQuickProps {
  categories: HomeV2Category[]
}

export function CategoryQuick({ categories }: CategoryQuickProps) {
  return (
    <SectionContainer id="kategoriler" theme="dark" ariaLabel="Ürün kategorileri">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-brand)]">
                Hızlı keşif
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white">
                Kategoriye göre göz at
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = ICONS[cat.icon]
            return (
              <Reveal key={cat.slug} delay={i * 0.08}>
                <Link
                  href={`/urunler?kategori=${cat.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06] cursor-pointer"
                >
                  <Icon className="h-8 w-8 text-[var(--home-brand)] transition-transform group-hover:-translate-y-0.5" />
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/50">{cat.description}</p>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 80% 0%, rgba(255,106,44,0.18), transparent 60%)",
                    }}
                  />
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </SectionContainer>
  )
}
