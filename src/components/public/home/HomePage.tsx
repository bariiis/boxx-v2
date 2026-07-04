"use client"

import { useRouter } from "next/navigation"
import { Home } from "./Home"
import rawData from "./sample-data.json"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = rawData as any
import type {
  HomeBrandValue,
  HomeCategoryCard,
  HomeCtaTile,
  HomeCustomerLogo,
  HomeHero,
  HomeProductCard,
  HomeSolutionCard,
  HomeSuccessMetric,
  HomeTestimonial,
} from "./types"

const difficultyLabels = {
  giris: "Giriş",
  profesyonel: "Profesyonel",
  kurumsal: "Kurumsal",
} as const

export function HomePage() {
  const router = useRouter()

  return (
    <Home
      hero={data.hero as HomeHero}
      featuredCategories={data.featuredCategories as HomeCategoryCard[]}
      featuredSolutions={data.featuredSolutions as HomeSolutionCard[]}
      featuredProducts={data.featuredProducts as HomeProductCard[]}
      successMetrics={data.successMetrics as HomeSuccessMetric[]}
      brandValues={data.brandValues as HomeBrandValue[]}
      customerLogos={data.customerLogos as HomeCustomerLogo[]}
      testimonials={data.testimonials as HomeTestimonial[]}
      ctaTiles={data.ctaTiles as HomeCtaTile[]}
      difficultyLabels={difficultyLabels}
      onPrimaryHeroCta={(href) => router.push(href)}
      onSecondaryHeroCta={(href) => router.push(href)}
      onSelectCategory={(slug) => router.push(`/urunler?kategori=${slug}`)}
      onSelectSolution={(slug) => router.push(`/cozumler/${slug}`)}
      onSelectProduct={(slug) => router.push(`/urunler/${slug}`)}
      onViewAllProducts={() => router.push("/urunler")}
      onSelectCtaTile={(_id, href) => router.push(href)}
    />
  )
}
