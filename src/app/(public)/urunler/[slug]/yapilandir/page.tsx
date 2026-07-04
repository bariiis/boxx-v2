import { notFound } from "next/navigation"
import { getConfiguratorPayloadBySlug } from "@/lib/actions/configurator-actions"
import { ConfiguratorShell } from "@/components/configurator/configurator-shell"
import { specsJsonToSpecLite } from "@/lib/configurator/specs-from-json"
import type { OptionLite, ProductLite } from "@/lib/configurator/engine"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getConfiguratorPayloadBySlug(slug)
  if (!payload) return { title: "Yapılandırıcı" }
  return {
    title: `${payload.basekit.name} Yapılandır | STUUX`,
    description: `${payload.basekit.name} workstation'ınızı ihtiyaçlarınıza göre özelleştirin.`,
  }
}

export default async function ConfigurePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getConfiguratorPayloadBySlug(slug)
  if (!payload) notFound()

  const basekit: ProductLite & {
    heroImage: string | null
    description: string | null
    images: { url: string }[]
  } = {
    id: payload.basekit.id,
    name: payload.basekit.name,
    price: payload.basekit.price,
    // Spec is read from Product.specs JSON (populated via SpecPreset form entries)
    componentSpecs: specsJsonToSpecLite(payload.basekit.specs),
    heroImage: payload.basekit.heroImage,
    description: payload.basekit.description,
    images: payload.basekit.images.map((i) => ({ url: i.url })),
  }

  const options: OptionLite[] = payload.options.map((o) => ({
    id: o.id,
    basekitId: o.basekitId,
    componentId: o.componentId,
    category: o.category as OptionLite["category"],
    priceDelta: o.priceDelta,
    isDefault: o.isDefault,
    isRecommended: o.isRecommended,
    affectsResources: o.affectsResources,
    minQty: o.minQty,
    maxQty: o.maxQty,
    component: {
      id: o.component.id,
      name: o.component.name,
      price: o.component.price,
      componentSpecs: specsJsonToSpecLite(o.component.specs),
    },
  }))

  return (
    <ConfiguratorShell
      basekit={basekit}
      options={options}
      singleSelectCategories={payload.meta.singleSelectCategories ?? []}
    />
  )
}
