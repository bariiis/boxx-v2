import { getProductCategoryTree } from "@/lib/actions/product-category-actions"
import { ProductCategoryManager } from "@/components/admin/product-category-manager"

export default async function ProductCategoriesPage() {
  const categories = await getProductCategoryTree()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ürün Kategorileri</h1>
      <p className="text-muted-foreground">
        Ürün kategorilerini buradan yönetin. Ana kategori ekleyin, altına alt kategoriler oluşturun.
      </p>
      <ProductCategoryManager categories={categories} />
    </div>
  )
}
