import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cpu,
  HardDrive,
  MemoryStick,
  Package,
  Shield,
  Weight,
} from "lucide-react"
import { getPublicProduct, getRelatedProducts } from "@/lib/actions/public-product-actions"
import { ProductCard } from "@/components/public/product-card"
import { CompareButton } from "@/components/public/compare-button"
import { ProductLandingSections } from "@/components/public/product-landing-sections"

const currencySymbols: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
}

const typeLabels: Record<string, string> = {
  STANDALONE: "Hazır Sistem",
  CONFIGURABLE: "Yapılandırılabilir",
  COMPONENT: "Bileşen",
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getPublicProduct(slug)
  if (!product) return { title: "Ürün Bulunamadı" }
  return {
    title: `${product.name} | STUUX`,
    description: product.description || `${product.name} - STUUX profesyonel donanım çözümleri.`,
  }
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

  const symbol = currencySymbols[product.currency] || product.currency
  const specsRaw = product.specs
  const specs: { key: string; value: string }[] | null = !specsRaw
    ? null
    : Array.isArray(specsRaw)
      ? (specsRaw as { key: string; value: string }[])
      : Object.entries(specsRaw as Record<string, string>).map(([key, value]) => ({ key, value }))
  const cs = product.componentSpecs

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/urunler" className="hover:text-foreground transition-colors">
              Ürünler
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/urunler/kategori/${product.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Images */}
          <ProductImages
            images={product.images}
            heroImage={product.heroImage}
            name={product.name}
          />

          {/* Right: Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{typeLabels[product.type]}</Badge>
              {product.isSaleOpen ? (
                <Badge variant="outline" className="border-green-500/30 text-green-600">
                  <Check className="mr-1 size-3" />
                  Satışta
                </Badge>
              ) : (
                <Badge variant="outline">Yakında</Badge>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{product.name}</h1>
            {product.nameEn && (
              <p className="mt-1 text-sm text-muted-foreground">{product.nameEn}</p>
            )}

            <p className="mt-1 text-sm text-muted-foreground">SKU: {product.sku}</p>

            {/* Price */}
            <div className="mt-6">
              {product.price > 0 ? (
                <p className="text-3xl font-bold">
                  {symbol}
                  {product.price.toLocaleString("tr-TR")}
                </p>
              ) : (
                <p className="text-lg font-medium text-muted-foreground">
                  Fiyat için teklif alın
                </p>
              )}
              {product.currency !== "USD" && product.price > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Fiyat {product.currency} cinsindendir. KDV dahil değildir.
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-6 leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Quick Specs */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {product.warrantyMonths > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <Shield className="size-4 text-primary" />
                  <span className="text-sm">{product.warrantyMonths} Ay Garanti</span>
                </div>
              )}
              {product.weight && (
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <Weight className="size-4 text-primary" />
                  <span className="text-sm">{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <Package className="size-4 text-primary" />
                  <span className="text-sm">{product.dimensions}</span>
                </div>
              )}
              {cs?.socketType && (
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <Cpu className="size-4 text-primary" />
                  <span className="text-sm">{cs.socketType}</span>
                </div>
              )}
              {cs?.ramType && (
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <MemoryStick className="size-4 text-primary" />
                  <span className="text-sm">
                    {cs.ramType}
                    {cs.maxRamCapacity ? ` / ${cs.maxRamCapacity}GB` : ""}
                  </span>
                </div>
              )}
              {cs?.maxGpuCount && (
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <HardDrive className="size-4 text-primary" />
                  <span className="text-sm">{cs.maxGpuCount}x GPU Desteği</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href={`/iletisim?urun=${product.slug}`}>
                  Teklif İste <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              {product.type === "CONFIGURABLE" && (
                <Button size="lg" variant="outline" asChild>
                  <Link href={`/konfigurator?base=${product.slug}`}>
                    Yapılandır
                  </Link>
                </Button>
              )}
              {product.category && (() => {
                const rootCat = product.category.parent || product.category
                return (
                  <CompareButton
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      heroImage: product.heroImage,
                      rootCategorySlug: rootCat.slug,
                      rootCategoryName: rootCat.name,
                    }}
                  />
                )
              })()}
            </div>
          </div>
        </div>

        {/* Tabs: Specs & Details */}
        {(specs || cs || product.descriptionEn) && (
          <div className="mt-12">
            <Tabs defaultValue="specs">
              <TabsList>
                {specs && <TabsTrigger value="specs">Teknik Özellikler</TabsTrigger>}
                {cs && <TabsTrigger value="hardware">Donanım Detayları</TabsTrigger>}
                {product.descriptionEn && (
                  <TabsTrigger value="description-en">Description (EN)</TabsTrigger>
                )}
              </TabsList>

              {specs && (
                <TabsContent value="specs">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="divide-y">
                        {specs.map((spec, i) => {
                          const isMultiline = spec.value?.includes("\n")
                          return (
                            <div
                              key={`${spec.key}-${i}`}
                              className={
                                isMultiline
                                  ? "px-2 py-3"
                                  : "flex justify-between gap-4 px-2 py-3"
                              }
                            >
                              <span className="text-sm font-medium">{spec.key}</span>
                              {isMultiline ? (
                                <p className="mt-1.5 whitespace-pre-line text-sm text-muted-foreground">
                                  {spec.value}
                                </p>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  {spec.value}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {cs && (
                <TabsContent value="hardware">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid gap-px sm:grid-cols-2">
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
                <TabsContent value="description-en">
                  <Card>
                    <CardContent className="prose max-w-none pt-6">
                      <p className="leading-relaxed text-muted-foreground">
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
            <h2 className="mb-6 text-2xl font-bold">Benzer Ürünler</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-12">
          <Button variant="ghost" asChild>
            <Link href="/urunler">
              <ArrowLeft className="mr-2 size-4" />
              Tüm Ürünlere Dön
            </Link>
          </Button>
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

function ProductDetailSpecs({ product }: { product: { specs: unknown; price: number; currency: string; warrantyMonths: number; slug: string } }) {
  const specsRaw = product.specs
  const specs: { key: string; value: string }[] | null = !specsRaw
    ? null
    : Array.isArray(specsRaw)
      ? (specsRaw as { key: string; value: string }[])
      : Object.entries(specsRaw as Record<string, string>).map(([key, value]) => ({ key, value }))

  if (!specs || specs.length === 0) return null

  const sym = ({ TRY: "₺", USD: "$", EUR: "€", GBP: "£" } as Record<string, string>)[product.currency] || "$"

  return (
    <section className="py-16 bg-muted/30" id="specs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="mb-6 text-2xl font-bold">Teknik Özellikler</h2>
            <div className="rounded-lg border bg-background divide-y">
              {specs.map((spec, i) => {
                const isMultiline = spec.value?.includes("\n")
                return (
                  <div key={i} className={isMultiline ? "px-4 py-3" : "flex justify-between gap-4 px-4 py-3"}>
                    <span className="text-sm font-medium">{spec.key}</span>
                    {isMultiline ? (
                      <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{spec.value}</p>
                    ) : (
                      <span className="text-sm text-muted-foreground">{spec.value}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="space-y-4">
            {product.price > 0 && (
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

function ProductImages({
  images,
  heroImage,
  name,
}: {
  images: { id: string; url: string; alt: string | null }[]
  heroImage: string | null
  name: string
}) {
  const mainImage = heroImage || images[0]?.url
  const galleryImages = heroImage
    ? images
    : images.slice(1)

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Package className="size-20 text-muted-foreground/20" />
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {galleryImages.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {galleryImages.slice(0, 4).map((img) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-md bg-muted"
            >
              <Image
                src={img.url}
                alt={img.alt || name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 12vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
