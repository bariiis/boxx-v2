import { getAllCategories } from "@/lib/actions/product-actions"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  const categories = await getAllCategories()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Yeni Ürün</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
