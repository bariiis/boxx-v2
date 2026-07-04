import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Cpu,
  Fan,
  Gauge,
  HardDrive,
  MemoryStick,
  Monitor,
  Package,
  Plug,
  Server,
  Shield,
  Thermometer,
  Weight,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { getPublicProduct, getRelatedProducts } from "@/lib/actions/public-product-actions"
import { ProductCard } from "@/components/public/product-card"
import { ProductLandingSections } from "@/components/public/product-landing-sections"
import { ProductDetailHero } from "@/components/public/product-detail-hero"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getPublicProduct(slug)
  if (!product) return { title: "Ürün Bulunamadı" }
  return {
    title: `${product.name} | BOXX`,
    description: product.description || `${product.name} - BOXX profesyonel donanım çözümleri.`,
  }
}

const specIconMap: [RegExp, LucideIcon][] = [
  [/cpu|işlemci|processor|socket/i, Cpu],
  [/ram|bellek|memory|ddr/i, MemoryStick],
  [/gpu|ekran|grafik|video|display/i, Monitor],
  [/ssd|hdd|disk|storage|depolama|nvme|sata/i, HardDrive],
  [/soğut|cool|fan|termal/i, Fan],
  [/güç|power|psu|watt/i, Zap],
  [/ağ|network|ethernet|wifi|lan/i, Wifi],
  [/kasa|case|chassis|form/i, Box],
  [/ağırlık|weight/i, Weight],
  [/boyut|dimension|ölçü/i, Package],
  [/garanti|warranty/i, Shield],
  [/port|usb|io|bağlantı/i, Plug],
  [/sıcaklık|temp|tdp/i, Thermometer],
  [/hız|speed|freq|ghz|mhz|clock/i, Gauge],
  [/sunucu|server/i, Server],
]

function getSpecIcon(key: string, label?: string): LucideIcon {
  const text = `${key} ${label || ""}`.toLowerCase()
  for (const [pattern, icon] of specIconMap) {
    if (pattern.test(text)) return icon
  }
  return Cpu
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getPublicProduct(slug)

  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId)

  const pageUseCases = product.solutionProducts.map((sp) => ({
    id: sp.solution.id,
    name: sp.solution.title,
    slug: sp.solution.slug,
    icon: sp.solution.icon,
  }))
  const pageTags: string[] = product.tags ?? []

  // If product has landing page content, render landing page
  const hasLanding = product.heroTitle || product.sections.length > 0
  if (hasLanding) {
    return (
      <div>
        <ProductLandingSections
          product={{
            name: product.name,
            slug: product.slug,
            heroImage: product.heroImage,
            heroTitle: product.heroTitle,
            heroSubtitle: product.heroSubtitle,
            heroVideo: product.heroVideo,
            features: product.features,
            description: product.description,
          }}
          sections={product.sections}
          faqs={product.faqs}
        />
        <ProductMetaBar useCases={pageUseCases} tags={pageTags} />
        {/* Specs section for landing pages */}
        <ProductDetailSpecs product={product} />
        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <h2 className="mb-6 text-2xl font-bold">Benzer Ürünler</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  const specsRaw = product.specs
  const specs: { key: string; label?: string; unit?: string; value: string }[] | null = !specsRaw
    ? null
    : Array.isArray(specsRaw)
      ? (specsRaw as { key: string; label?: string; unit?: string; value: string }[])
      : Object.entries(specsRaw as Record<string, string>).map(([key, value]) => ({ key, value }))
  const cs = product.componentSpecs

  return (
    <div>
      <ProductDetailHero
        product={product}
        useCases={pageUseCases}
        tags={pageTags}
      />

      {/* Detail Content */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">

        {/* Tabs: Specs & Details */}
        {(specs || cs || product.descriptionEn) && (
          <div>
            <Tabs defaultValue="specs">
              <TabsList className="mx-auto flex w-fit gap-1 rounded-full border border-slate-200 bg-white p-1 font-['Space_Grotesk'] text-xs font-medium dark:border-slate-800 dark:bg-slate-950">
                {specs && (
                  <TabsTrigger
                    value="specs"
                    className="rounded-full px-4 py-1.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/30"
                  >
                    Teknik Özellikler
                  </TabsTrigger>
                )}
                {cs && (
                  <TabsTrigger
                    value="hardware"
                    className="rounded-full px-4 py-1.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/30"
                  >
                    Donanım Detayları
                  </TabsTrigger>
                )}
                {product.descriptionEn && (
                  <TabsTrigger
                    value="description-en"
                    className="rounded-full px-4 py-1.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/30"
                  >
                    Description (EN)
                  </TabsTrigger>
                )}
              </TabsList>

              {specs && (
                <TabsContent value="specs" className="mt-6">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {specs.map((spec, i) => {
                      const isMultiline = spec.value?.includes("\n")
                      const Icon = getSpecIcon(spec.key, spec.label)
                      return (
                        <div
                          key={`${spec.key}-${i}`}
                          className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-orange-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-orange-500/70"
                        >
                          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 ring-1 ring-inset ring-orange-200/70 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/30">
                            <Icon className="size-4" />
                          </div>
                          <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-slate-500">
                            {spec.label || spec.key}
                          </span>
                          {isMultiline ? (
                            <p className="mt-0.5 whitespace-pre-line font-['Space_Grotesk'] text-sm font-semibold text-slate-900 dark:text-white">
                              {spec.value}
                            </p>
                          ) : (
                            <p className="mt-0.5 font-['Space_Grotesk'] text-sm font-semibold text-slate-900 dark:text-white">
                              {spec.value}
                              {spec.unit ? ` ${spec.unit}` : ""}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
              )}

              {cs && (
                <TabsContent value="hardware" className="mt-6">
                  <Card className="border-slate-200 dark:border-slate-800">
                    <CardContent className="pt-6">
                      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                        {cs.componentType && (
                          <SpecRow label="Bileşen Tipi" value={cs.componentType} />
                        )}
                        {cs.socketType && (
                          <SpecRow label="Soket" value={cs.socketType} />
                        )}
                        {cs.ramType && (
                          <SpecRow label="RAM Tipi" value={cs.ramType} />
                        )}
                        {cs.maxRamCapacity && (
                          <SpecRow label="Maks. RAM" value={`${cs.maxRamCapacity} GB`} />
                        )}
                        {cs.ramSlots && (
                          <SpecRow label="RAM Slot" value={String(cs.ramSlots)} />
                        )}
                        {cs.pcieSlots && (
                          <SpecRow label="PCIe Slot" value={String(cs.pcieSlots)} />
                        )}
                        {cs.nvmePorts && (
                          <SpecRow label="NVMe Port" value={String(cs.nvmePorts)} />
                        )}
                        {cs.sataPorts && (
                          <SpecRow label="SATA Port" value={String(cs.sataPorts)} />
                        )}
                        {cs.maxGpuCount && (
                          <SpecRow label="Maks. GPU" value={String(cs.maxGpuCount)} />
                        )}
                        {cs.maxGpuLength && (
                          <SpecRow label="Maks. GPU Uzunluğu" value={`${cs.maxGpuLength} mm`} />
                        )}
                        {cs.tdpWatts && (
                          <SpecRow label="TDP" value={`${cs.tdpWatts} W`} />
                        )}
                        {cs.coolingType && (
                          <SpecRow label="Soğutma" value={cs.coolingType} />
                        )}
                        {cs.formFactor && (
                          <SpecRow label="Form Faktörü" value={cs.formFactor} />
                        )}
                        {cs.supportsDualPsu && (
                          <SpecRow label="Çift PSU" value="Evet" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {product.descriptionEn && (
                <TabsContent value="description-en" className="mt-6">
                  <Card className="border-slate-200 dark:border-slate-800">
                    <CardContent className="prose prose-slate max-w-none pt-6 dark:prose-invert">
                      <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                        {product.descriptionEn}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
              Benzer
            </div>
            <h2 className="mb-6 mt-1 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Benzer ürünler
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-12">
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 font-['Space_Grotesk'] text-xs font-medium text-slate-500 transition hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-300"
          >
            <ArrowLeft className="size-3.5" />
            Tüm ürünlere dön
          </Link>
        </div>
      </section>
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b px-2 py-3 last:border-0">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  )
}

function ProductDetailSpecs({ product }: { product: { specs: unknown; price: number; currency: string; warrantyMonths: number; slug: string; showPrice: boolean } }) {
  const specsRaw = product.specs
  const specs: { key: string; label?: string; unit?: string; value: string }[] | null = !specsRaw
    ? null
    : Array.isArray(specsRaw)
      ? (specsRaw as { key: string; label?: string; unit?: string; value: string }[])
      : Object.entries(specsRaw as Record<string, string>).map(([key, value]) => ({ key, value }))

  if (!specs || specs.length === 0) return null

  const sym = ({ TRY: "₺", USD: "$", EUR: "€", GBP: "£" } as Record<string, string>)[product.currency] || "$"

  return (
    <section className="py-16 bg-muted/30" id="specs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="mb-6 text-2xl font-bold">Teknik Özellikler</h2>
            <div className="border bg-background divide-y">
              {specs.map((spec, i) => {
                const isMultiline = spec.value?.includes("\n")
                return (
                  <div key={i} className={isMultiline ? "px-4 py-3" : "flex justify-between gap-4 px-4 py-3"}>
                    <span className="text-sm font-medium">{spec.label || spec.key}</span>
                    {isMultiline ? (
                      <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{spec.value}</p>
                    ) : (
                      <span className="text-sm text-muted-foreground">{spec.value}{spec.unit ? ` ${spec.unit}` : ""}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="space-y-4">
            {product.showPrice && product.price > 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{sym}{product.price.toLocaleString("tr-TR")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">KDV hariç</p>
                  <Button className="mt-4 w-full" size="lg" asChild>
                    <Link href={`/iletisim?urun=${product.slug}`}>
                      Teklif İste <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-lg font-medium text-muted-foreground">Fiyat için teklif alın</p>
                  <Button className="mt-4 w-full" size="lg" asChild>
                    <Link href={`/iletisim?urun=${product.slug}`}>
                      Teklif İste <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="pt-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Garanti</span>
                  <span className="font-medium">{product.warrantyMonths} Ay</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Para Birimi</span>
                  <span className="font-medium">{product.currency}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

const TAG_PALETTE = [
  "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
]

function tagColorClass(tag: string): string {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) | 0
  }
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length]
}

function ProductMetaBar({
  useCases,
  tags,
}: {
  useCases: { id: string; name: string; slug: string; icon?: string | null }[]
  tags: string[]
}) {
  if (useCases.length === 0 && tags.length === 0) return null
  return (
    <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {useCases.length > 0 && (
            <div>
              <div className="mb-3 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-orange-600 dark:text-orange-400">
                Çözümler
              </div>
              <div className="flex flex-wrap gap-2">
                {useCases.map((uc) => (
                  <Link
                    key={uc.id}
                    href={`/cozumler/${uc.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-slate-300 bg-white px-3 py-1.5 font-['Space_Grotesk'] text-xs font-medium text-slate-700 transition-colors hover:border-orange-500/60 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500/60 dark:hover:text-orange-400"
                  >
                    {uc.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={uc.icon} alt="" className="h-4 w-4 object-contain" />
                    )}
                    {uc.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {tags.length > 0 && (
            <div>
              <div className="mb-3 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-orange-600 dark:text-orange-400">
                Etiketler
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.15em] ${tagColorClass(tag)}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

