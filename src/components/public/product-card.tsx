import Link from "next/link"
import Image from "next/image"
import { Package } from "lucide-react"
import { CompareButton } from "@/components/public/compare-button"
import type { Currency } from "@/generated/prisma"

export interface ProductCardData {
  id: string
  name: string
  slug: string
  type: string
  description: string | null
  currency: Currency
  price: number
  heroImage: string | null
  isSaleOpen: boolean
  showPrice: boolean
  category: {
    name: string
    slug: string
    parent?: { name: string; slug: string } | null
  } | null
  images: { url: string; alt: string | null }[]
  specs?: unknown
  tags?: string[]
  solutionProducts?: {
    solution: {
      id: string
      title: string
      slug: string
      icon: string | null
      isActive: boolean
    }
  }[]
}

const TAG_PALETTE = [
  "bg-orange-100 text-orange-700 dark:bg-orange-500/25 dark:text-orange-200",
  "bg-teal-100 text-teal-700 dark:bg-teal-500/25 dark:text-teal-200",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-200",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-200",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/25 dark:text-rose-200",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-200",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-200",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-200",
]

function tagColorClass(tag: string): string {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) | 0
  }
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length]
}

interface SpecRow {
  key?: string
  label?: string
  unit?: string
  value: string
}

function getTopSpecs(raw: unknown, count = 4): SpecRow[] {
  if (!raw) return []
  const list: SpecRow[] = Array.isArray(raw)
    ? (raw as SpecRow[])
    : Object.entries(raw as Record<string, string>).map(([key, value]) => ({
        key,
        value,
      }))
  return list.slice(0, count)
}

interface ProductCardProps {
  product: ProductCardData
  showCompare?: boolean
}

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

export function getRootCategory(category: ProductCardData["category"]) {
  if (!category) return null
  const root = category.parent || category
  return { slug: root.slug, name: root.name }
}

export function ProductCard({ product, showCompare = true }: ProductCardProps) {
  const imageUrl = product.heroImage || product.images[0]?.url
  const symbol = currencySymbols[product.currency] || product.currency
  const rootCat = getRootCategory(product.category)
  const topSpecs = getTopSpecs(product.specs, 4)
  const solutions =
    product.solutionProducts
      ?.filter((sp) => sp.solution.isActive !== false)
      .map((sp) => sp.solution) ?? []
  const tags = product.tags ?? []

  return (
    <div className="group relative flex h-full flex-col overflow-hidden border bg-background transition-shadow hover:shadow-lg">
      {/* Image area */}
      <div className="relative">
        <Link href={`/urunler/${product.slug}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <Package className="size-12 text-muted-foreground/30" />
              </div>
            )}

            {/* Top-right badge */}
            {product.type === "CONFIGURABLE" && (
              <span className="absolute right-0 top-3 bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                {typeLabels[product.type]}
              </span>
            )}
            {!product.isSaleOpen && (
              <span className="absolute right-0 top-3 bg-muted-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-background">
                Yakında
              </span>
            )}
          </div>
        </Link>

        {/* Compare button - top-left, outside Link */}
        {showCompare && rootCat && (
          <div className="absolute left-2 top-2 z-10">
            <CompareButton
              size="icon"
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                heroImage: imageUrl || null,
                rootCategorySlug: rootCat.slug,
                rootCategoryName: rootCat.name,
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={`/urunler/${product.slug}`} className="flex flex-1 flex-col px-4 pt-4 pb-0">
        {/* Category */}
        {product.category && (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary">
            {product.category.name}
          </p>
        )}

        {/* Product name */}
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        {/* Description as bullets */}
        {product.description && (
          <div className="mt-2">
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
        )}

        {/* Top specs (4 rows) */}
        {topSpecs.length > 0 && (
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t pt-3">
            {topSpecs.map((spec, i) => (
              <div key={`${spec.key ?? spec.label ?? i}`} className="min-w-0">
                <dt className="truncate font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  {spec.label ?? spec.key}
                </dt>
                <dd className="mt-0.5 truncate text-[11px] font-semibold text-foreground">
                  {spec.value}
                  {spec.unit ? ` ${spec.unit}` : ""}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Solutions */}
        {solutions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1 border-t pt-3">
            {solutions.slice(0, 4).map((sol) => (
              <span
                key={sol.id}
                className="inline-flex items-center gap-1 border bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground"
              >
                {sol.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sol.icon} alt="" className="h-3 w-3 object-contain" />
                )}
                {sol.title}
              </span>
            ))}
            {solutions.length > 4 && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] text-muted-foreground">
                +{solutions.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 mb-3 flex flex-wrap gap-1 border-t pt-3">
            {tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center rounded-full px-2 py-0.5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.1em] ${tagColorClass(tag)}`}
              >
                #{tag}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] text-muted-foreground">
                +{tags.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="flex-1" />
      </Link>

      {/* Price bar - bottom separated */}
      <Link href={`/urunler/${product.slug}`} className="mt-auto border-t px-4 py-3">
        {product.showPrice && product.price > 0 ? (
          <p className="text-base font-bold text-primary">
            {symbol}
            {product.price.toLocaleString("tr-TR")}
          </p>
        ) : (
          <p className="text-sm font-medium text-muted-foreground">Teklif Alın</p>
        )}
      </Link>
    </div>
  )
}
