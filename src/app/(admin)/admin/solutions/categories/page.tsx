import { getSolutionCategoryTree } from "@/lib/actions/solution-category-actions"
import { SolutionCategoryManager } from "@/components/admin/solution-category-manager"

export default async function SolutionCategoriesPage() {
  const categories = await getSolutionCategoryTree()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Çözüm Kategorileri</h1>
      <p className="text-muted-foreground">
        Menüde görünen kategori ağacını buradan yönetin. Ana kategori ekleyin, altına alt kategoriler oluşturun.
      </p>
      <SolutionCategoryManager categories={categories} />
    </div>
  )
}
