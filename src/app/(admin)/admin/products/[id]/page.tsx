import { notFound } from "next/navigation"
import { getProduct, getAllCategories, getSolutionsForPicker } from "@/lib/actions/product-actions"
import { listConfiguratorOptions, getConfiguratorMeta } from "@/lib/actions/configurator-actions"
import { ProductForm } from "@/components/admin/product-form"
import { ProductImageManager } from "@/components/admin/product-image-manager"
import { ConfiguratorOptionsManager } from "@/components/admin/configurator-options-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories, solutions] = await Promise.all([
    getProduct(id),
    getAllCategories(),
    getSolutionsForPicker(),
  ])

  if (!product) notFound()

  const isConfigurable = product.type === "CONFIGURABLE"
  const configuratorOptions = isConfigurable ? await listConfiguratorOptions(id) : []
  const configuratorMeta = isConfigurable ? await getConfiguratorMeta(id) : {}

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Bilgiler</TabsTrigger>
          <TabsTrigger value="images">
            Görseller ({product.images.length})
          </TabsTrigger>
          {isConfigurable && (
            <TabsTrigger value="configurator">
              Configurator ({configuratorOptions.length})
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="info">
          <ProductForm product={product} categories={categories} solutions={solutions} />
        </TabsContent>
        <TabsContent value="images">
          <ProductImageManager
            productId={product.id}
            images={product.images}
            heroImage={product.heroImage}
          />
        </TabsContent>
        {isConfigurable && (
          <TabsContent value="configurator">
            <ConfiguratorOptionsManager
              basekitId={product.id}
              options={configuratorOptions}
              singleSelectCategories={configuratorMeta.singleSelectCategories ?? []}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
