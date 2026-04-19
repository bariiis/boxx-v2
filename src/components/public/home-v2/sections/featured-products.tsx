"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import type { HomeV2Product } from "../data"
import { cn } from "@/lib/utils"

interface FeaturedProductsProps {
  products: HomeV2Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [hero, second, third, fourth, fifth] = products
  if (!hero) return null

  return (
    <SectionContainer id="urunler" theme="light" ariaLabel="Öne çıkan ürünler">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-brand)]">
                Öne çıkan sistemler
              </p>
              <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
                Hangi iş yükü için hazırsın?
              </h2>
            </div>
            <Link
              href="/urunler"
              className="hidden md:inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-black/70 hover:text-black cursor-pointer"
            >
              Tüm ürünler
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
          <ProductCard product={hero} className="md:col-span-2 md:row-span-2" size="hero" />
          {second && <ProductCard product={second} className="md:col-span-2" />}
          {third && <ProductCard product={third} />}
          {fourth && <ProductCard product={fourth} />}
          {fifth && <ProductCard product={fifth} className="md:col-span-2" />}
        </div>
      </div>
    </SectionContainer>
  )
}

function ProductCard({
  product,
  className,
  size = "default",
}: {
  product: HomeV2Product
  className?: string
  size?: "default" | "hero"
}) {
  const accent = product.accent === "orange" ? "var(--home-brand)" : "var(--home-data)"
  return (
    <Reveal className={cn("group relative overflow-hidden rounded-2xl border border-black/5 bg-white cursor-pointer", className)}>
      <Link href={`/urunler/${product.slug}`} className="block h-full w-full">
        <div className="relative h-full w-full p-6 md:p-8 flex flex-col justify-between transition-colors group-hover:bg-black/[0.02]">
          {product.badge && (
            <span
              className="absolute top-4 right-4 font-mono text-[10px] tracking-wider uppercase px-2 py-1 rounded-full"
              style={{ background: accent, color: "#fff" }}
            >
              {product.badge}
            </span>
          )}
          <div>
            <p className="font-mono text-[11px] tracking-widest uppercase text-black/50">
              {product.priceLabel}
            </p>
            <h3
              className={cn(
                "mt-3 font-semibold tracking-tight",
                size === "hero" ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
              )}
            >
              {product.name}
            </h3>
            <p className="mt-2 text-sm text-black/60 max-w-md">{product.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-6">
            {product.specs.slice(0, size === "hero" ? 5 : 3).map((s) => (
              <span
                key={s}
                className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-black/[0.04] text-black/70"
              >
                {s}
              </span>
            ))}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at 80% 0%, ${accent}22, transparent 60%)`,
            }}
          />
        </div>
      </Link>
    </Reveal>
  )
}
