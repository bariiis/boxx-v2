import { db } from "@/lib/db"
import { SolutionsIndexPage } from "@/components/public/cozumler/SolutionsIndexPage"
import type { IndustryPreset, Solution, SolutionAccent, SolutionCategory } from "@/components/public/cozumler/types"

export const metadata = {
  title: "Çözümler | BOXX",
  description:
    "Yapay zeka eğitimi, render farm, CAD/CAM ve veri merkezi için kürate edilmiş BOXX donanım çözümleri.",
}

const ACCENT_CYCLE: SolutionAccent[] = ["orange", "teal", "sky", "violet", "slate"]

const INDUSTRY_PRESETS: Omit<IndustryPreset, "categoryIds">[] = [
  {
    id: "ind-studio",
    label: "Prodüksiyon stüdyosu",
    description: "Animasyon, VFX, post-prodüksiyon ekipleri için.",
  },
  {
    id: "ind-engineering",
    label: "Mühendislik & tasarım",
    description: "CAD, CAE ve üretim simülasyonu ekipleri için.",
  },
  {
    id: "ind-research",
    label: "Araştırma & akademi",
    description: "Üniversiteler ve AR-GE merkezleri için.",
  },
  {
    id: "ind-datacenter",
    label: "Veri merkezi",
    description: "Kurumsal altyapı ve HPC kümeleri için.",
  },
]

export default async function SolutionsPage() {
  const parentCategories = await db.solutionCategory.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: "asc" },
    include: { children: { where: { isActive: true } } },
  })

  const categories: SolutionCategory[] = await Promise.all(
    parentCategories.map(async (cat, i) => {
      const childIds = cat.children.map((c) => c.id)
      const solutionCount = await db.solution.count({
        where: { categoryId: { in: [cat.id, ...childIds] }, isActive: true },
      })
      return {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description ?? "",
        icon: cat.icon ?? "Server",
        accent: ACCENT_CYCLE[i % ACCENT_CYCLE.length],
        solutionCount,
        heroImageUrl: cat.heroImage ?? "",
        keywords: [],
      }
    }),
  )

  const solutionsRaw = await db.solution.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { sortOrder: "asc" },
    take: 9,
  })

  const featuredSolutions: Solution[] = solutionsRaw.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.title,
    categoryId: s.categoryId ?? "",
    categoryName: s.category?.name ?? "",
    shortDescription: s.subtitle ?? "",
    longDescription: "",
    difficulty: "profesyonel" as const,
    popularity: 0,
    isFeatured: true,
    heroImageUrl: s.heroImage ?? "",
    highlights: [],
    priceFrom: 0,
    currency: "USD",
  }))

  // Wire industry presets to actual category IDs (cycle through available categories)
  const industryPresets: IndustryPreset[] = INDUSTRY_PRESETS.map((preset, i) => ({
    ...preset,
    categoryIds: categories[i % categories.length] ? [categories[i % categories.length].id] : [],
  }))

  return (
    <SolutionsIndexPage
      categories={categories}
      featuredSolutions={featuredSolutions}
      industryPresets={industryPresets}
    />
  )
}
