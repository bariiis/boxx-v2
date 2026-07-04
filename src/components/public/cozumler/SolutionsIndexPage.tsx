"use client"

import { useRouter } from "next/navigation"
import { CategoryIndex } from "./CategoryIndex"
import type { IndustryPreset, Solution, SolutionCategory } from "./types"

interface SolutionsIndexPageProps {
  categories: SolutionCategory[]
  featuredSolutions: Solution[]
  industryPresets: IndustryPreset[]
}

export function SolutionsIndexPage({
  categories,
  featuredSolutions,
  industryPresets,
}: SolutionsIndexPageProps) {
  const router = useRouter()

  return (
    <CategoryIndex
      categories={categories}
      featuredSolutions={featuredSolutions}
      industryPresets={industryPresets}
      onSelectCategory={(id) => {
        const cat = categories.find((c) => c.id === id)
        if (cat) router.push(`/cozumler/kategori/${cat.slug}`)
      }}
      onSelectSolution={(slug) => router.push(`/cozumler/${slug}`)}
      onSelectIndustryPreset={(presetId) => {
        const preset = industryPresets.find((p) => p.id === presetId)
        if (preset && preset.categoryIds.length > 0) {
          const firstCat = categories.find((c) => preset.categoryIds.includes(c.id))
          if (firstCat) router.push(`/cozumler/kategori/${firstCat.slug}`)
        }
      }}
    />
  )
}
