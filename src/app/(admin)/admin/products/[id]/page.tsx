import { notFound } from "next/navigation"
import { getProduct, getAllCategories } from "@/lib/actions/product-actions"
import { getProductSections, getProductFaqs } from "@/lib/actions/product-landing-actions"
import { ProductForm } from "@/components/admin/product-form"
import { ProductImageManager } from "@/components/admin/product-image-manager"
import { ProductLandingEditor } from "@/components/admin/product-landing-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories, sections, faqs] = await Promise.all([
    getProduct(id),
    getAllCategories(),
    getProductSections(id),
    getProductFaqs(id),
  ])

  if (!product) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Bilgiler</TabsTrigger>
          <TabsTrigger value="images">
            Görseller ({product.images.length})
          </TabsTrigger>
          <TabsTrigger value="landing">
            Landing Page ({sections.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <ProductForm product={product} categories={categories} />
        </TabsContent>
        <TabsContent value="images">
          <ProductImageManager
            productId={product.id}
            images={product.images}
            heroImage={product.heroImage}
          />
        </TabsContent>
        <TabsContent value="landing">
          <ProductLandingEditor
            productId={product.id}
            product={{
              heroTitle: product.heroTitle,
              heroSubtitle: product.heroSubtitle,
              heroVideo: product.heroVideo,
              features: product.features,
            }}
            sections={sections}
            faqs={faqs}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
