"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Layers, Search } from "lucide-react"

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
  const [query, setQuery] = useState("")

  const filteredSolutions = useMemo(() => {
    let list = activeFilter
      ? solutions.filter((s) => s.categoryId === activeFilter)
      : solutions
    if (query.trim()) {
      const needle = query.trim().toLowerCase()
      list = list.filter((s) =>
        [s.title, s.subtitle].filter(Boolean).some((v) => v!.toLowerCase().includes(needle)),
      )
    }
    return list
  }, [solutions, activeFilter, query])

  const filters = children.length > 0 ? children : []

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-white via-orange-50/30 to-teal-50/20 dark:border-slate-800/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-orange-400/20 to-teal-400/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-1.5 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <Link href="/" className="transition-colors hover:text-orange-600 dark:hover:text-orange-300">
              Ana Sayfa
            </Link>
            <span aria-hidden>/</span>
            <Link
              href="/cozumler"
              className="transition-colors hover:text-orange-600 dark:hover:text-orange-300"
            >
              Çözümler
            </Link>
            {parent && (
              <>
                <span aria-hidden>/</span>
                <Link
                  href={`/cozumler/kategori/${parent.slug}`}
                  className="transition-colors hover:text-orange-600 dark:hover:text-orange-300"
                >
                  {parent.name}
                </Link>
              </>
            )}
            <span aria-hidden>/</span>
            <span className="text-slate-700 dark:text-slate-200">{category.name}</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
                Çözümler · {solutions.length} çözüm sayfası
              </div>
              <h1 className="mt-2 font-['Space_Grotesk'] text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                {category.name}
                <span aria-hidden className="text-orange-500">.</span>
              </h1>
              {category.subtitle && (
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                  {category.subtitle}
                </p>
              )}
            </div>

            {/* Icon card */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {category.icon ? (
                <img src={category.icon} alt="" className="size-12 object-contain" />
              ) : (
                <Layers className="size-8 text-orange-500" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter + search */}
      <section className="sticky top-16 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800/80 dark:bg-slate-950/90 dark:supports-[backdrop-filter]:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between">
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-1.5 overflow-x-auto">
              <FilterPill
                active={activeFilter === null}
                onClick={() => setActiveFilter(null)}
                label="Tümü"
              />
              {filters.map((f) => (
                <FilterPill
                  key={f.id}
                  active={activeFilter === f.id}
                  onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
                  label={f.name}
                />
              ))}
            </div>
          )}
          <div className="relative md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Çözüm ara"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 font-['Inter'] text-sm text-slate-700 outline-none ring-orange-500/30 transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-6 pt-14 text-center">
        <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
          01 / Yazılım
        </div>
        <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Yazılımına göre seç
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          En sık kullandığın yazılımı seç. Uygulaman aşağıda listelenmemişse uzman
          danışmanlarımız {category.name.toLowerCase()} iş istasyonun için özel teklif sunar.
        </p>
      </section>

      {/* Card grid */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {filteredSolutions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-950/60">
            <Layers className="size-8 text-slate-400" />
            <h4 className="font-['Space_Grotesk'] text-base font-semibold text-slate-900 dark:text-white">
              Aradığın kriterlere uyan çözüm yok
            </h4>
            <button
              type="button"
              onClick={() => {
                setActiveFilter(null)
                setQuery("")
              }}
              className="mt-2 font-['Space_Grotesk'] text-xs font-semibold text-orange-600 underline decoration-orange-400 decoration-2 underline-offset-4 hover:text-orange-700 dark:text-orange-300"
            >
              Filtreyi temizle
            </button>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSolutions.map((sol) => {
              const subCat = children.find((c) => c.id === sol.categoryId)
              return (
                <li key={sol.id}>
                  <Link
                    href={`/cozumler/${sol.slug}`}
                    className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/5 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-orange-500/70"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition group-hover:border-orange-300 group-hover:bg-orange-50/60 dark:border-slate-800 dark:bg-slate-900 dark:group-hover:border-orange-500/50 dark:group-hover:bg-orange-500/10">
                        {sol.icon ? (
                          <img src={sol.icon} alt="" className="size-7 object-contain" />
                        ) : (
                          <span className="font-['Space_Grotesk'] text-lg font-bold text-slate-500 dark:text-slate-400">
                            {sol.title.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-['Space_Grotesk'] text-base font-semibold text-slate-900 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-300">
                          {sol.title}
                        </h3>
                        {sol.subtitle && (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            {sol.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                      {subCat ? (
                        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                          {subCat.name}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="ml-auto inline-flex items-center gap-1 font-['Space_Grotesk'] text-[11px] font-semibold text-slate-500 transition group-hover:text-orange-600 dark:text-slate-400 dark:group-hover:text-orange-300">
                        İncele
                        <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Intro HTML from DB */}
      {category.intro && (
        <section className="mx-auto max-w-3xl px-6 py-10">
          <div
            className="prose prose-sm sm:prose-base max-w-none prose-headings:font-['Space_Grotesk'] prose-headings:font-semibold prose-a:text-orange-600 prose-p:text-slate-600 prose-li:text-slate-600 dark:prose-invert dark:prose-a:text-orange-300 dark:prose-p:text-slate-400 dark:prose-li:text-slate-400"
            dangerouslySetInnerHTML={{ __html: category.intro }}
          />
        </section>
      )}

      {/* Stats */}
      <section className="border-t border-slate-200/80 bg-slate-50/60 py-12 dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
          {[
            { value: `${solutions.length}+`, label: "Çözüm Sayfası" },
            { value: "3 Yıl", label: "Garanti" },
            { value: "7/24", label: "Teknik Destek" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-['Space_Grotesk'] text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.18em] text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200/80 bg-white py-16 dark:border-slate-800/80 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
            Hazır mısın?
          </div>
          <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            İhtiyacına uygun sistemi bulalım
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            Uzman ekibimiz {category.name.toLowerCase()} iş akışına en uygun konfigürasyonu belirleyecek.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 font-['Space_Grotesk'] text-sm font-semibold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-600"
            >
              Uzmanla Konuş
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 font-['Space_Grotesk'] text-sm font-semibold text-slate-700 transition hover:border-orange-400 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-orange-500 dark:hover:text-orange-300"
            >
              Ürünleri İncele
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 font-['Space_Grotesk'] text-xs font-medium transition ${
        active
          ? "bg-orange-500 text-white shadow shadow-orange-500/20"
          : "border border-slate-200 bg-white text-slate-600 hover:border-orange-400 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      }`}
    >
      {label}
    </button>
  )
}
