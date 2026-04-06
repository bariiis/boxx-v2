"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Layers } from "lucide-react"
import { AuroraBackground } from "@/components/public/aurora-background"

interface Solution {
  id: string
  title: string
  slug: string
  subtitle: string | null
  icon: string | null
  categoryId: string | null
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  subtitle: string | null
  intro: string | null
  icon: string | null
  heroImage: string | null
}

interface SolutionCategoryGridProps {
  data: {
    category: Category
    parent: Category | null
    children: Category[]
    solutions: Solution[]
    solutionsByCategory: Record<string, Solution[]>
  }
}

export function SolutionCategoryGrid({ data }: SolutionCategoryGridProps) {
  const { category, parent, children, solutions } = data
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const filteredSolutions = activeFilter
    ? solutions.filter((s) => s.categoryId === activeFilter)
    : solutions

  const filters = children.length > 0 ? children : []

  return (
    <div className="bg-[#0a0a0f] text-white min-h-screen">
      <AuroraBackground />
      <div className="fixed inset-0 z-[1] bg-black/60 pointer-events-none" />

      <div className="relative z-10">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center px-6 pt-[100px] pb-[100px]">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center justify-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white/70 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="hover:text-white/70 transition-colors">Çözümler</span>
              {parent && (
                <>
                  <span>/</span>
                  <Link href={`/cozumler/kategori/${parent.slug}`} className="hover:text-white/70 transition-colors">
                    {parent.name}
                  </Link>
                </>
              )}
            </div>

            {/* Icon */}
            <div className="float-animation mb-8">
              <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                {category.icon ? (
                  <img src={category.icon} alt="" className="size-12 object-contain" />
                ) : (
                  <Layers className="size-10 text-blue-400" />
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight mb-4">
              <span className="gradient-text">{category.name}</span>
            </h1>

            {/* Subtitle */}
            {category.subtitle && (
              <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed font-light">
                {category.subtitle}
              </p>
            )}

            <p className="mt-4 text-sm text-white/60">
              {solutions.length} çözüm sayfası
            </p>
          </div>
        </section>

        <div className="aurora-divider" />

        {/* Filters */}
        {filters.length > 0 && (
          <section className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
                <button
                  onClick={() => setActiveFilter(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === null
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-white/75 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  Tümü
                </button>
                {filters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeFilter === f.id
                        ? "bg-white/10 text-white border border-white/20"
                        : "text-white/75 hover:text-white/80 hover:bg-white/5"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section title */}
        <section className="mx-auto max-w-7xl px-6 pt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Yazılımınızı Seçin
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-white/70 font-light">
            En sık kullandığınız yazılımı seçin. Uygulamanız aşağıda listelenmemişse veya projeniz için gerekli
            donanım gereksinimlerinden emin değilseniz, uzman danışmanlarımız size özel rehberlik veya özel bir{" "}
            {category.name.toLowerCase()} iş istasyonu için fiyat teklifi sunmak üzere hazırdır.
          </p>
        </section>

        {/* Card Grid */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          {filteredSolutions.length === 0 ? (
            <p className="py-16 text-center text-white/60">Bu kategoride henüz çözüm sayfası yok.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSolutions.map((sol) => {
                const subCat = children.find((c) => c.id === sol.categoryId)
                return (
                  <Link
                    key={sol.id}
                    href={`/cozumler/${sol.slug}`}
                    className="glass-card group rounded-2xl p-6 block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                        {sol.icon ? (
                          <img src={sol.icon} alt="" className="size-7 object-contain" />
                        ) : (
                          <span className="text-lg font-bold text-white/60">
                            {sol.title.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors">
                          {sol.title}
                        </h3>
                        {sol.subtitle && (
                          <p className="mt-1 text-sm text-white/70 line-clamp-2 font-light">
                            {sol.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {subCat && (
                        <span className="px-2 py-1 rounded text-xs text-white/70 bg-white/5 border border-white/10">
                          {subCat.name}
                        </span>
                      )}
                      <span className="ml-auto flex items-center gap-1 text-xs font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        İncele <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        <div className="aurora-divider" />

        {/* Intro */}
        {category.intro && (
          <section className="mx-auto max-w-4xl px-6 py-16">
            <div
              className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-blue-400 prose-p:text-white/60 prose-li:text-white/60 prose-strong:text-white/80"
              dangerouslySetInnerHTML={{ __html: category.intro }}
            />
          </section>
        )}

        {/* Stats */}
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-center">
            {[
              { value: `${solutions.length}+`, label: "Çözüm Sayfası" },
              { value: "3 Yıl", label: "Garanti" },
              { value: "7/24", label: "Teknik Destek" },
            ].map((stat, index, arr) => (
              <div key={stat.label} className="flex items-center gap-8">
                <div>
                  <div className="text-3xl md:text-4xl font-light text-white tracking-tight">{stat.value}</div>
                  <div className="text-white/70 text-sm font-light">{stat.label}</div>
                </div>
                {index < arr.length - 1 && (
                  <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="aurora-divider" />

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
              İhtiyacınıza Uygun Sistemi Bulalım
            </h2>
            <p className="mt-3 text-white/70 font-light">
              Uzman ekibimiz {category.name.toLowerCase()} iş akışınıza en uygun konfigürasyonu belirleyecek.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/iletisim"
                className="px-6 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-400 hover:to-purple-400 transition-all">
                Uzmanla Konuş
              </Link>
              <Link href="/urunler"
                className="glass-button px-6 py-3 rounded-lg text-sm font-medium text-white">
                Ürünleri İncele
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
