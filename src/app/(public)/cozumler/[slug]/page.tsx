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
          <h1 className="max-w-[704px] text-balance text-center text-5xl font-medium leading-none tracking-tighter text-black lg:text-[56px] md:text-5xl sm:text-[32px]">
            {solution.title}
          </h1>

          {solution.subtitle && (
            <p className="mt-4 max-w-[704px] text-center text-lg leading-snug tracking-tight text-black/70 md:max-w-xl sm:mt-3 sm:text-base">
              {solution.subtitle}
            </p>
          )}

          {/* Breadcrumb */}
          <nav className="mt-6 flex items-center justify-center gap-1.5 text-sm text-black/50">
            <Link href="/" className="hover:text-black transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/cozumler" className="hover:text-black transition-colors">Çözümler</Link>
            {parentCategory && (
              <>
                <span>/</span>
                <span>{parentCategory}</span>
              </>
            )}
            {solution.category?.parent && (
              <>
                <span>/</span>
                <span>{solution.category.name}</span>
              </>
            )}
          </nav>

          <div className="mt-6 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/iletisim">
                Teklif İste <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white" asChild>
              <Link href="/urunler">Ürünleri İncele</Link>
            </Button>
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
      <section className="border-t py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">{solution.title} İçin Donanım Önerileri</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Uzman ekibimiz iş akışınıza en uygun konfigürasyonu belirleyecek.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild><Link href="/iletisim">Uzmanla Konuş</Link></Button>
            <Button size="lg" variant="outline" asChild><Link href="/urunler">Konfiguratör</Link></Button>
          </div>
        </div>
      </section>
    </div>
  )
}
