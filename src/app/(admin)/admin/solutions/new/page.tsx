import { getSolutionCategories } from "@/lib/actions/solution-actions"
import { SolutionCreateForm } from "@/components/admin/solution-create-form"

export default async function NewSolutionPage() {
  const categories = await getSolutionCategories()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Yeni Çözüm Sayfası</h1>
      <SolutionCreateForm categories={categories} />
    </div>
  )
}
