import { notFound } from "next/navigation"
import { getSolutionCategoryById } from "@/lib/actions/solution-category-actions"
import { SolutionCategoryEditor } from "@/components/admin/solution-category-editor"

export default async function SolutionCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = await getSolutionCategoryById(id)
  if (!category) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{category.name} — Düzenle</h1>
      <SolutionCategoryEditor category={category} />
    </div>
  )
}
