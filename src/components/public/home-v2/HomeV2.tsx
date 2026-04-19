"use client"

import { useSectionTheme } from "./hooks/use-section-theme"
import { ScrollProgress } from "./primitives/scroll-progress"
import { HeroSection } from "./sections/hero-3d"
import { MetricsTicker } from "./sections/metrics-ticker"
import { FeaturedProducts } from "./sections/featured-products"
import { SolutionsRail } from "./sections/solutions-rail"
import { WhyBoxxBento } from "./sections/why-boxx-bento"
import { LiveBenchmark } from "./sections/live-benchmark"
import { SocialProof } from "./sections/social-proof"
import { CategoryQuick } from "./sections/category-quick"
import { CtaClosing } from "./sections/cta-closing"
import { homeV2Data } from "./data"

const NAV_SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "urunler", label: "Products" },
  { id: "cozumler", label: "Solutions" },
  { id: "neden-boxx", label: "Why" },
  { id: "benchmark", label: "Bench" },
  { id: "musteriler", label: "Clients" },
  { id: "iletisim", label: "Contact" },
]

export function HomeV2() {
  useSectionTheme()

  return (
    <>
      <ScrollProgress sections={NAV_SECTIONS} />
      <main className="relative">
        <HeroSection data={homeV2Data.hero} />
        <MetricsTicker metrics={homeV2Data.tickerMetrics} />
        <FeaturedProducts products={homeV2Data.featuredProducts} />
        <SolutionsRail solutions={homeV2Data.solutions} />
        <WhyBoxxBento tiles={homeV2Data.bentoTiles} />
        <LiveBenchmark data={homeV2Data.benchmark} />
        <SocialProof logos={homeV2Data.logos} testimonial={homeV2Data.testimonial} />
        <CategoryQuick categories={homeV2Data.categories} />
        <CtaClosing data={homeV2Data.closingCta} />
      </main>
    </>
  )
}
