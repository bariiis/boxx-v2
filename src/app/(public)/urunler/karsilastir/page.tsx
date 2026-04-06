import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Check, Minus, Package } from "lucide-react"
import { getProductsForComparison } from "@/lib/actions/public-product-actions"
import { ComparePageActions } from "@/components/public/compare-page-actions"

export const metadata = {
  title: "Ürün Karşılaştırma | STUUX",
}

const currencySymbols: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
}

interface SpecEntry {
  key: string
  value: string
}

function normalizeSpecs(raw: unknown): SpecEntry[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw as SpecEntry[]
  if (typeof raw === "object") {
    return Object.entries(raw as Record<string, string>).map(([key, value]) => ({
      key,
      value,
    }))
  }
  return []
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids: idsParam } = await searchParams
  const ids = idsParam?.split(",").filter(Boolean) || []

  if (ids.length < 2) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Ürün Karşılaştırma</h1>
        <p className="mt-4 text-muted-foreground">
          Karşılaştırmak için en az 2 ürün seçmelisiniz.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/urunler">
            <ArrowLeft className="mr-2 size-4" />
            Ürünlere Dön
          </Link>
        </Button>
      </div>
    )
  }

  const products = await getProductsForComparison(ids)

  if (products.length < 2) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Ürünler Bulunamadı</h1>
        <p className="mt-4 text-muted-foreground">
          Seçilen ürünlerden bazıları bulunamadı.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/urunler">
            <ArrowLeft className="mr-2 size-4" />
            Ürünlere Dön
          </Link>
        </Button>
      </div>
    )
  }

  // Order products in the same order as ids
  const ordered = ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products

  // Collect all unique spec keys in order
  const allSpecKeys: string[] = []
  const productSpecs = ordered.map((p) => normalizeSpecs(p.specs))
  for (const specs of productSpecs) {
    for (const spec of specs) {
      if (!allSpecKeys.includes(spec.key)) {
        allSpecKeys.push(spec.key)
      }
    }
  }

  // Collect all component spec fields
  const csFields: { key: string; label: string }[] = [
    { key: "componentType", label: "Bileşen Tipi" },
    { key: "socketType", label: "Soket" },
    { key: "ramType", label: "RAM Tipi" },
    { key: "maxRamCapacity", label: "Maks. RAM (GB)" },
    { key: "ramSlots", label: "RAM Slot" },
    { key: "pcieSlots", label: "PCIe Slot" },
    { key: "maxGpuCount", label: "Maks. GPU" },
    { key: "maxGpuLength", label: "Maks. GPU Uzunluğu (mm)" },
    { key: "tdpWatts", label: "TDP (W)" },
    { key: "coolingType", label: "Soğutma" },
    { key: "formFactor", label: "Form Faktörü" },
  ]

  // Filter to only fields that at least one product has
  const activeCSFields = csFields.filter((f) =>
    ordered.some((p) => {
      const cs = p.componentSpecs as Record<string, unknown> | null
      return cs && cs[f.key] != null
    })
  )

  const colCount = ordered.length
  const gridCols =
    colCount === 2
      ? "grid-cols-[200px_1fr_1fr]"
      : colCount === 3
        ? "grid-cols-[200px_1fr_1fr_1fr]"
        : "grid-cols-[200px_1fr_1fr_1fr_1fr]"

  const rootCat = ordered[0].category?.parent || ordered[0].category

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/urunler" className="hover:text-foreground transition-colors">
              Ürünler
            </Link>
            {rootCat && (
              <>
                <span>/</span>
                <Link
                  href={`/urunler/kategori/${rootCat.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {rootCat.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground">Karşılaştırma</span>
          </nav>
          <h1 className="text-3xl font-bold">Ürün Karşılaştırma</h1>
          <p className="mt-2 text-muted-foreground">
            {ordered.length} ürün karşılaştırılıyor
            {rootCat && ` — ${rootCat.name}`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="overflow-x-auto">
          <div className={`grid min-w-[640px] ${gridCols}`}>
            {/* ========== PRODUCT HEADER ROW ========== */}
            <div className="sticky top-0 bg-background" />
            {ordered.map((product) => {
              const imageUrl = product.heroImage || product.images[0]?.url
              const symbol = currencySymbols[product.currency] || product.currency

              return (
                <div key={product.id} className="sticky top-0 bg-background p-4 text-center">
                  <Link href={`/urunler/${product.slug}`} className="group">
                    <div className="mx-auto mb-3 relative aspect-square w-32 overflow-hidden rounded-lg bg-muted">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="128px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Package className="size-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  {product.price > 0 ? (
                    <p className="mt-1 text-lg font-bold">
                      {symbol}{product.price.toLocaleString("tr-TR")}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">Teklif Alın</p>
                  )}
                  <Button size="sm" className="mt-2" asChild>
                    <Link href={`/iletisim?urun=${product.slug}`}>
                      Teklif İste <ArrowRight className="ml-1 size-3" />
                    </Link>
                  </Button>
                </div>
              )
            })}

            {/* ========== BASIC INFO ========== */}
            <SectionHeader label="Genel" colCount={colCount} />

            <RowLabel>SKU</RowLabel>
            {ordered.map((p) => (
              <Cell key={p.id}>{p.sku}</Cell>
            ))}

            <RowLabel>Ürün Tipi</RowLabel>
            {ordered.map((p) => (
              <Cell key={p.id}>
                {p.type === "STANDALONE"
                  ? "Hazır Sistem"
                  : p.type === "CONFIGURABLE"
                    ? "Yapılandırılabilir"
                    : "Bileşen"}
              </Cell>
            ))}

            <RowLabel>Garanti</RowLabel>
            {ordered.map((p) => (
              <Cell key={p.id}>{p.warrantyMonths} Ay</Cell>
            ))}

            {ordered.some((p) => p.weight) && (
              <>
                <RowLabel>Ağırlık</RowLabel>
                {ordered.map((p) => (
                  <Cell key={p.id}>{p.weight ? `${p.weight} kg` : "—"}</Cell>
                ))}
              </>
            )}

            {ordered.some((p) => p.dimensions) && (
              <>
                <RowLabel>Boyutlar</RowLabel>
                {ordered.map((p) => (
                  <Cell key={p.id}>{p.dimensions || "—"}</Cell>
                ))}
              </>
            )}

            <RowLabel>Satışta</RowLabel>
            {ordered.map((p) => (
              <Cell key={p.id}>
                {p.isSaleOpen ? (
                  <Check className="mx-auto size-4 text-green-600" />
                ) : (
                  <Minus className="mx-auto size-4 text-muted-foreground" />
                )}
              </Cell>
            ))}

            {/* ========== SPECS ========== */}
            {allSpecKeys.length > 0 && (
              <>
                <SectionHeader label="Teknik Özellikler" colCount={colCount} />
                {allSpecKeys.map((specKey) => (
                  <>
                    <RowLabel key={`label-${specKey}`}>{specKey}</RowLabel>
                    {ordered.map((p, pi) => {
                      const specs = productSpecs[pi]
                      const spec = specs.find((s) => s.key === specKey)
                      const value = spec?.value || "—"
                      const isMultiline = value.includes("\n")

                      return (
                        <Cell key={p.id} multiline={isMultiline}>
                          {value}
                        </Cell>
                      )
                    })}
                  </>
                ))}
              </>
            )}

            {/* ========== COMPONENT SPECS ========== */}
            {activeCSFields.length > 0 && (
              <>
                <SectionHeader label="Donanım Detayları" colCount={colCount} />
                {activeCSFields.map((field) => (
                  <>
                    <RowLabel key={`cs-label-${field.key}`}>{field.label}</RowLabel>
                    {ordered.map((p) => {
                      const cs = p.componentSpecs as Record<string, unknown> | null
                      const val = cs?.[field.key]
                      return (
                        <Cell key={p.id}>
                          {val != null ? String(val) : "—"}
                        </Cell>
                      )
                    })}
                  </>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/urunler">
              <ArrowLeft className="mr-2 size-4" />
              Ürünlere Dön
            </Link>
          </Button>
          <ComparePageActions />
        </div>
      </section>
    </div>
  )
}

// ==========================================
// Sub-components
// ==========================================

function SectionHeader({ label, colCount }: { label: string; colCount: number }) {
  return (
    <div
      className="col-span-full mt-4 border-b-2 border-primary/20 bg-muted/50 px-4 py-2"
    >
      <h2 className="text-sm font-bold text-primary">{label}</h2>
    </div>
  )
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start border-b bg-muted/30 px-4 py-2.5">
      <span className="text-sm font-medium">{children}</span>
    </div>
  )
}

function Cell({
  children,
  multiline = false,
}: {
  children: React.ReactNode
  multiline?: boolean
}) {
  return (
    <div className="flex items-start border-b px-4 py-2.5">
      {multiline ? (
        <p className="whitespace-pre-line text-sm text-muted-foreground">{children}</p>
      ) : (
        <span className="text-sm text-muted-foreground">{children}</span>
      )}
    </div>
  )
}
