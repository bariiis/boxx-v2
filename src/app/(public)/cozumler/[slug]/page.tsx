import { notFound } from "next/navigation"
import Link from "next/link"
import { getSolutionBySlug } from "@/lib/actions/solution-actions"
import { Button } from "@/components/ui/button"
import { ArrowRight, Box } from "lucide-react"
import { SolutionBenchmarkChart } from "@/components/public/solution-benchmark-chart"
import { FaqAccordion } from "@/components/public/faq-accordion"
import { SolutionSectionNav } from "@/components/public/solution-section-nav"
import { SolutionRecommendedProducts } from "@/components/public/solution-recommended-products"

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const solution = await getSolutionBySlug(slug)

  if (!solution) notFound()

  const parentCategory = solution.category?.parent?.name || solution.category?.name

  // Filter sections that have content
  const sectionsWithContent = solution.sections.filter(
    (s) => s.content && s.content.replace(/<[^>]*>/g, "").trim().length > 0
  )

  const sectionAccentColors: Record<string, string> = {
    intro: "#3b82f6",   // blue
    cpu: "#f59e0b",     // amber
    gpu: "#22c55e",     // green
    ram: "#8b5cf6",     // violet
    storage: "#06b6d4", // cyan
    faq: "#6366f1",     // indigo
    recommended: "#10b981", // emerald
    _default: "#64748b", // slate
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white pt-[234px] pb-10 lg:pt-[226px] md:pt-[190px] sm:pt-[166px] md:pb-[34px]">
        {/* Background SVG */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <img
            src="/hero-waves.svg"
            alt=""
            width={1920}
            height={520}
            className="max-w-none"
            style={{
              maskImage: "radial-gradient(circle 500px at 18% 50%, black 35%, transparent 60%), radial-gradient(circle 500px at 83% 50%, black 35%, transparent 56%)",
              WebkitMaskImage: "radial-gradient(circle 500px at 18% 50%, black 35%, transparent 60%), radial-gradient(circle 500px at 83% 50%, black 35%, transparent 56%)",
            }}
          />
        </div>

        {/* App Icon with grid lines */}
        <div className="absolute left-1/2 top-[92px] z-10 flex h-[142px] w-[220px] -translate-x-1/2 items-center justify-center lg:top-[88px] lg:h-[138px] lg:w-[192px] md:top-[52px] sm:top-[60px] sm:h-[104px]">
          {solution.icon ? (
            <img src={solution.icon} alt="" className="object-cover w-[68px] rounded-[10px] lg:w-14 sm:w-[52px]" />
          ) : (
            <div className="flex size-[68px] items-center justify-center rounded-[10px] border bg-white lg:size-14 sm:size-[52px]">
              <Box className="size-8 text-muted-foreground lg:size-7 sm:size-6" />
            </div>
          )}
          {/* Horizontal dashed lines */}
          <span className="absolute inset-x-0 top-7 h-px bg-white bg-[linear-gradient(90deg,white,transparent_10%,transparent_90%,white),linear-gradient(90deg,transparent_50%,#ABAEBB_0)] bg-[length:100%_1px,8px_1px] lg:top-[30px] sm:top-[15px]" />
          <span className="absolute inset-x-0 bottom-7 h-px bg-white bg-[linear-gradient(90deg,white,transparent_10%,transparent_90%,white),linear-gradient(90deg,transparent_50%,#ABAEBB_0)] bg-[length:100%_1px,8px_1px] lg:bottom-[30px] sm:bottom-[15px]" />
          {/* Vertical gradient lines */}
          <span className="absolute inset-y-0 left-[62px] w-px bg-[linear-gradient(180deg,transparent_0%,#D4D6DD_19%,#D4D6DD_81%,transparent_100%)] lg:left-[54px] sm:left-[58px]" />
          <span className="absolute inset-y-0 right-[62px] w-px bg-[linear-gradient(180deg,transparent_0%,#D4D6DD_19%,#D4D6DD_81%,transparent_100%)] lg:right-[54px] sm:right-[58px]" />
        </div>

        {/* Content */}
        <div className="container relative z-10 flex flex-col items-center mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="max-w-[704px] text-balance text-center font-['Space_Grotesk'] text-5xl font-semibold leading-none tracking-tight text-slate-900 lg:text-[56px] md:text-5xl sm:text-[32px]">
            {solution.title}
            <span aria-hidden className="text-orange-500">.</span>
          </h1>

          {solution.subtitle && (
            <p className="mt-4 max-w-[704px] text-center text-lg leading-snug tracking-tight text-slate-600 md:max-w-xl sm:mt-3 sm:text-base">
              {solution.subtitle}
            </p>
          )}

          {/* Breadcrumb */}
          <nav className="mt-6 flex items-center justify-center gap-1.5 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.15em] text-slate-500">
            <Link href="/" className="transition-colors hover:text-orange-600">
              Ana Sayfa
            </Link>
            <span aria-hidden>/</span>
            <Link href="/cozumler" className="transition-colors hover:text-orange-600">
              Çözümler
            </Link>
            {parentCategory && (
              <>
                <span aria-hidden>/</span>
                <span className="text-slate-700">{parentCategory}</span>
              </>
            )}
            {solution.category?.parent && (
              <>
                <span aria-hidden>/</span>
                <span className="text-slate-700">{solution.category.name}</span>
              </>
            )}
          </nav>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 font-['Space_Grotesk'] text-sm font-semibold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-600"
            >
              Teklif İste
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 font-['Space_Grotesk'] text-sm font-semibold text-slate-700 transition hover:border-orange-400 hover:text-orange-600"
            >
              Ürünleri İncele
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky Section Nav + Content */}
      {sectionsWithContent.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex gap-10 lg:gap-8">
            {/* Sticky sidebar TOC - hidden on mobile */}
            <aside className="hidden md:block w-52 shrink-0">
              <SolutionSectionNav
                sections={[
                  ...sectionsWithContent.map((s) => ({ key: s.tabKey, label: s.tabLabel })),
                  ...(solution.recommendedProducts.length > 0
                    ? [{ key: "recommended", label: "Önerilen Sistemler" }]
                    : []),
                ]}
              />
            </aside>

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-16">
              {sectionsWithContent.map((section) => {
                const sectionCharts = solution.benchmarks.filter(
                  (b) => b.sectionKey === section.tabKey
                )
                const accentColor = sectionAccentColors[section.tabKey] || sectionAccentColors._default

                return (
                  <div key={section.tabKey} id={section.tabKey} className="scroll-mt-24">
                    {/* Section heading with left accent */}
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-1 h-8 rounded-full" style={{ backgroundColor: accentColor }} />
                      <h2 className="text-2xl font-bold">{section.tabLabel}</h2>
                    </div>

                    {section.tabKey === "faq" ? (
                      <div className="rounded-xl border">
                        <FaqAccordion html={section.content!} />
                      </div>
                    ) : (
                      <>
                        <div
                          className="prose prose-sm sm:prose-base max-w-none prose-headings:font-semibold prose-a:text-primary prose-img:rounded-lg prose-p:text-muted-foreground prose-li:text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: section.content! }}
                        />

                        {sectionCharts.length > 0 && (
                          <div className="mt-10 space-y-8">
                            {sectionCharts.map((chart) => (
                              <SolutionBenchmarkChart key={chart.id} chart={chart} />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}

              {/* Recommended Products */}
              {solution.recommendedProducts.length > 0 && (
                <div id="recommended" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 rounded-full bg-emerald-500" />
                    <h2 className="text-2xl font-bold">Önerilen Sistemler</h2>
                  </div>
                  <SolutionRecommendedProducts
                    products={solution.recommendedProducts}
                    solutionTitle={solution.title}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* General benchmarks (not assigned to a section) */}
      {solution.benchmarks.filter((b) => !b.sectionKey).length > 0 && (
        <section className="border-t bg-[#F8F9FB] py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-8 text-2xl font-bold text-center">Performans Karşılaştırmaları</h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {solution.benchmarks
                .filter((b) => !b.sectionKey)
                .map((chart) => (
                  <SolutionBenchmarkChart key={chart.id} chart={chart} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-slate-200/80 py-20 dark:border-slate-800/80">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
            Hazır mısın?
          </div>
          <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {solution.title} için donanım önerileri
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Uzman ekibimiz iş akışına en uygun konfigürasyonu belirleyecek.
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
              Konfigüratör
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
