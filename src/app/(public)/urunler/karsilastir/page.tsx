import { Fragment } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Check, Minus, Package } from "lucide-react"
import { getProductsForComparison } from "@/lib/actions/public-product-actions"
import { ComparePageActions } from "@/components/public/compare-page-actions"

export const metadata = {
  title: "Ürün Karşılaştırma | BOXX",
}

const currencySymbols: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
}

interface SpecEntry {
  key: string
  label?: string
  unit?: string
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

/** Display name for a spec: prefer label, fall back to key */
function specDisplayName(key: string, allSpecs: SpecEntry[][]): string {
  for (const specs of allSpecs) {
    const found = specs.find((s) => s.key === key)
    if (found?.label) return found.label
  }
  return key
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids: idsParam } = await searchParams
  const ids = idsParam?.split(",").filter(Boolean) || []

  if (ids.length < 2) {
    return <EmptyCompare message="Karşılaştırmak için en az 2 ürün seçmelisin." />
  }

  const products = await getProductsForComparison(ids)

  if (products.length < 2) {
    return <EmptyCompare message="Seçilen ürünlerden bazıları bulunamadı." />
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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-white via-orange-50/30 to-teal-50/20 dark:border-slate-800/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-orange-400/20 to-teal-400/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <nav className="mb-5 flex items-center gap-1.5 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <Link href="/" className="transition-colors hover:text-orange-600 dark:hover:text-orange-300">
              Ana Sayfa
            </Link>
            <span aria-hidden>/</span>
            <Link href="/urunler" className="transition-colors hover:text-orange-600 dark:hover:text-orange-300">
              Ürünler
            </Link>
            {rootCat && (
              <>
                <span aria-hidden>/</span>
                <Link
                  href={`/urunler/kategori/${rootCat.slug}`}
                  className="transition-colors hover:text-orange-600 dark:hover:text-orange-300"
                >
                  {rootCat.name}
                </Link>
              </>
            )}
            <span aria-hidden>/</span>
            <span className="text-slate-700 dark:text-slate-200">Karşılaştırma</span>
          </nav>
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
            Karşılaştırma · {ordered.length} ürün
          </div>
          <h1 className="mt-1 font-['Space_Grotesk'] text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Yan yana değerlendir
            <span aria-hidden className="text-orange-500">.</span>
          </h1>
          {rootCat && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {rootCat.name} kategorisinde seçilen ürünler.
            </p>
          )}
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
                <div key={product.id} className="sticky top-0 bg-white p-4 text-center dark:bg-slate-950">
                  <Link href={`/urunler/${product.slug}`} className="group block">
                    <div className="mx-auto mb-3 relative aspect-square w-32 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
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
                          <Package className="size-8 text-slate-300 dark:text-slate-700" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-sm font-semibold text-slate-900 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-300">
                      {product.name}
                    </h3>
                  </Link>
                  {product.price > 0 ? (
                    <p className="mt-1 font-['Space_Grotesk'] text-lg font-semibold tabular-nums text-slate-900 dark:text-white">
                      {symbol}
                      {product.price.toLocaleString("tr-TR")}
                    </p>
                  ) : (
                    <p className="mt-1 font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-slate-500">
                      Teklif Alın
                    </p>
                  )}
                  <Link
                    href={`/iletisim?urun=${product.slug}`}
                    className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 font-['Space_Grotesk'] text-xs font-semibold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-600"
                  >
                    Teklif İste
                    <ArrowRight className="size-3" />
                  </Link>
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
                  <Fragment key={specKey}>
                    <RowLabel>{specDisplayName(specKey, productSpecs)}</RowLabel>
                    {ordered.map((p, pi) => {
                      const specs = productSpecs[pi]
                      const spec = specs.find((s) => s.key === specKey)
                      const value = spec?.value || "—"
                      const unit = spec?.unit
                      const display = value === "—" ? "—" : unit ? `${value} ${unit}` : value
                      const isMultiline = display.includes("\n")

                      return (
                        <Cell key={p.id} multiline={isMultiline}>
                          {display}
                        </Cell>
                      )
                    })}
                  </Fragment>
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
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 font-['Space_Grotesk'] text-xs font-medium text-slate-500 transition hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-300"
          >
            <ArrowLeft className="size-3.5" />
            Ürünlere dön
          </Link>
          <ComparePageActions />
        </div>
      </section>
    </div>
  )
}

function EmptyCompare({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
        Karşılaştırma
      </div>
      <h1 className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        Karşılaştırma boş
        <span aria-hidden className="text-orange-500">.</span>
      </h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{message}</p>
      <Link
        href="/urunler"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 font-['Space_Grotesk'] text-sm font-semibold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-600"
      >
        <ArrowLeft className="size-4" />
        Ürünlere dön
      </Link>
    </div>
  )
}

// ==========================================
// Sub-components
// ==========================================

function SectionHeader({ label }: { label: string; colCount: number }) {
  return (
    <div className="col-span-full mt-4 border-b-2 border-orange-400/50 bg-slate-50 px-4 py-2 dark:border-orange-500/40 dark:bg-slate-900">
      <h2 className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
        {label}
      </h2>
    </div>
  )
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start border-b border-slate-100 bg-slate-50/60 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/40">
      <span className="font-['Space_Grotesk'] text-sm font-medium text-slate-700 dark:text-slate-200">
        {children}
      </span>
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
    <div className="flex items-start border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
      {multiline ? (
        <p className="whitespace-pre-line font-['Space_Grotesk'] text-sm text-slate-900 dark:text-white">
          {children}
        </p>
      ) : (
        <span className="font-['Space_Grotesk'] text-sm text-slate-900 dark:text-white">
          {children}
        </span>
      )}
    </div>
  )
}
