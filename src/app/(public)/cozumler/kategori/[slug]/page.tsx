import { notFound } from "next/navigation"
import Link from "next/link"
import { getSolutionCategoryPage } from "@/lib/actions/solution-actions"
import { SolutionCategoryGrid } from "@/components/public/solution-category-grid"

export default async function SolutionCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getSolutionCategoryPage(slug)
  if (!data) notFound()

  return <SolutionCategoryGrid data={data} />
}
