import Link from "next/link"
import {
  ArrowUpRight,
  Cpu,
  Download,
  Sparkles,
  Wrench,
} from "lucide-react"
import { CompareButton } from "@/components/public/compare-button"

const NEW_THRESHOLD_DAYS = 30

interface SpecRow {
  key?: string
  label?: string
  unit?: string
  value: string
}

interface ProductDetailHeroProps {
  product: {
    id: string
    name: string
    nameEn?: string | null
    slug: string
    sku: string
    type: "STANDALONE" | "CONFIGURABLE" | "COMPONENT"
    description: string | null
    price: number
    currency: string
    showPrice: boolean
    heroImage: string | null
    sortOrder: number
    createdAt: Date
    images: { id: string; url: string; alt: string | null }[]
    category: {
      id: string
      name: string
      slug: string
      parent: { id: string; name: string; slug: string } | null
    } | null
    specs: unknown
  }
  /** Optional override for "Featured" badge if you set this manually */
  isFeatured?: boolean
  /** Optional tagline shown under the title (falls back to first sentence of description) */
  tagline?: string
  /** Optional list of use case labels for pills (maps to Solutions) */
  useCases?: { id: string; name: string; slug: string; icon?: string | null }[]
  /** Free-form product tags */
  tags?: string[]
  /** Optional datasheet URL — if absent the button is hidden */
  datasheetUrl?: string | null
}

const currencySymbols: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
}

function getSpecsList(raw: unknown): SpecRow[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw as SpecRow[]
  return Object.entries(raw as Record<string, string>).map(([key, value]) => ({
    key,
    value,
  }))
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

function firstSentence(text: string, maxLength = 220): string {
  const cleaned = text.trim().replace(/\s+/g, " ")
  const period = cleaned.indexOf(". ")
  const head =
    period > 0 && period < maxLength ? cleaned.slice(0, period + 1) : cleaned
  return head.length > maxLength ? head.slice(0, maxLength - 1).trimEnd() + "…" : head
}

export function ProductDetailHero({
  product,
  isFeatured,
  tagline,
  useCases = [],
  tags = [],
  datasheetUrl,
}: ProductDetailHeroProps) {
  const ageMs = Date.now() - new Date(product.createdAt).getTime()
  const isNew = ageMs < NEW_THRESHOLD_DAYS * 24 * 60 * 60 * 1000
  const featured = isFeatured ?? product.sortOrder > 0

  const symbol = currencySymbols[product.currency] || product.currency
  const specs = getSpecsList(product.specs).slice(0, 6)
  const galleryCount = product.images.length

  const heroTagline =
    tagline ?? (product.description ? firstSentence(product.description) : null)

  const rootCat = product.category?.parent ?? product.category
  const breadcrumbCats: { name: string; slug: string }[] = []
  if (product.category?.parent) breadcrumbCats.push(product.category.parent)
  if (product.category) breadcrumbCats.push(product.category)

  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 90% 15%, rgba(249,115,22,0.20), transparent 55%), radial-gradient(ellipse 45% 40% at 5% 85%, rgba(20,184,166,0.10), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-[0.04] dark:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-slate-500"
        >
          <Link href="/" className="transition-colors hover:text-orange-600 dark:hover:text-orange-300">
            Ana Sayfa
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <Link
            href="/urunler"
            className="transition-colors hover:text-orange-600 dark:hover:text-orange-300"
          >
            Ürünler
          </Link>
          {breadcrumbCats.map((cat) => (
            <span key={cat.slug} className="flex items-center gap-2">
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <Link
                href={`/urunler/kategori/${cat.slug}`}
                className="transition-colors hover:text-orange-600 dark:hover:text-orange-300"
              >
                {cat.name}
              </Link>
            </span>
          ))}
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-orange-600 dark:text-orange-400">{product.name}</span>
        </nav>

        {/* 3-column hero */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr_0.65fr] lg:items-start">
          {/* Left — title, badges, tagline, price */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {featured && (
                <span className="inline-flex items-center gap-1.5 border border-orange-500/40 bg-orange-500/10 px-2.5 py-1 font-['Space_Grotesk'] text-[10px] font-semibold uppercase tracking-[0.25em] text-orange-700 dark:text-orange-300">
                  <Sparkles className="h-3 w-3" />
                  Öne Çıkan
                </span>
              )}
              {isNew && (
                <span className="border border-teal-500/40 bg-teal-500/10 px-2.5 py-1 font-['Space_Grotesk'] text-[10px] font-semibold uppercase tracking-[0.25em] text-teal-700 dark:text-teal-300">
                  Yeni
                </span>
              )}
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
                SKU / {product.sku}
              </span>
            </div>

            <h1 className="mt-6 font-['Space_Grotesk'] text-5xl font-bold leading-[0.98] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-[4.5rem]">
              {product.name}
              <span className="text-orange-500">.</span>
            </h1>

            {product.nameEn && (
              <p className="mt-3 font-['JetBrains_Mono'] text-xs uppercase tracking-[0.2em] text-slate-500">
                {product.nameEn}
              </p>
            )}

            {heroTagline && (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                {heroTagline}
              </p>
            )}

            {useCases.length > 0 && (
              <div className="mt-6">
                <div className="mb-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Çözümler
                </div>
                <div className="flex flex-wrap gap-2">
                  {useCases.map((uc) => (
                    <Link
                      key={uc.id}
                      href={`/cozumler/${uc.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-slate-300 bg-white px-2.5 py-1 font-['Space_Grotesk'] text-[11px] font-medium text-slate-700 transition-colors hover:border-orange-500/60 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500/60 dark:hover:text-orange-400"
                    >
                      {uc.icon && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={uc.icon} alt="" className="h-3.5 w-3.5 object-contain" />
                      )}
                      {uc.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Etiketler
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.15em] ${tagColorClass(tag)}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-end gap-8 border-t border-slate-200 pt-8 dark:border-slate-800">
              <div>
                <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  {product.type === "CONFIGURABLE" ? "Başlangıç" : "Liste fiyatı"}
                </div>
                {product.showPrice && product.price > 0 ? (
                  <>
                    <div className="mt-1 font-['Space_Grotesk'] text-4xl font-bold text-orange-600 dark:text-orange-400">
                      {symbol}
                      {product.price.toLocaleString("tr-TR")}
                    </div>
                    <div className="mt-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600">
                      KDV hariç · kurumsal satış
                    </div>
                  </>
                ) : (
                  <div className="mt-1 font-['Space_Grotesk'] text-2xl font-medium text-slate-700 dark:text-slate-200">
                    Fiyat için teklif alın
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center — visual */}
          <HeroVisual
            heroImage={product.heroImage}
            name={product.name}
            sku={product.sku}
            galleryCount={galleryCount}
          />

          {/* Right — specs rail + CTAs */}
          <HeroSpecsRail
            specs={specs}
            productSlug={product.slug}
            productType={product.type}
            datasheetUrl={datasheetUrl ?? null}
            compareProduct={
              rootCat
                ? {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    heroImage: product.heroImage,
                    rootCategorySlug: rootCat.slug,
                    rootCategoryName: rootCat.name,
                  }
                : null
            }
          />
        </div>
      </div>
    </section>
  )
}

function HeroVisual({
  heroImage,
  name,
  sku,
  galleryCount,
}: {
  heroImage: string | null
  name: string
  sku: string
  galleryCount: number
}) {
  return (
    <div className="relative border border-slate-200 dark:border-slate-800">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-black">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] dark:hidden"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #0f172a 0 1px, transparent 1px 14px)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden opacity-[0.08] dark:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 14px)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, rgba(249,115,22,0.22), transparent 55%)",
          }}
        />

        <div className="absolute left-4 top-4 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
          01 / Ürün Görseli
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-orange-500" />
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
            {sku}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-6">
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt={name}
              className="max-h-full max-w-full object-contain drop-shadow-2xl"
            />
          ) : (
            <Cpu
              className="h-48 w-48 text-slate-300 dark:text-slate-700"
              strokeWidth={0.8}
            />
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-700">
            stuux.com / hero
          </div>
          {galleryCount > 0 && (
            <div className="flex flex-col items-end font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <span>galeri · {galleryCount} görsel</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function HeroSpecsRail({
  specs,
  productSlug,
  productType,
  datasheetUrl,
  compareProduct,
}: {
  specs: SpecRow[]
  productSlug: string
  productType: "STANDALONE" | "CONFIGURABLE" | "COMPONENT"
  datasheetUrl: string | null
  compareProduct: {
    id: string
    name: string
    slug: string
    heroImage: string | null
    rootCategorySlug: string
    rootCategoryName: string
  } | null
}) {
  return (
    <aside className="flex flex-col border border-slate-200 bg-white/60 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 lg:sticky lg:top-6">
      {specs.length > 0 && (
        <>
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Özet Specs
            </div>
            <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-orange-600 dark:text-orange-400">
              {String(specs.length).padStart(2, "0")}
            </div>
          </div>
          <dl className="divide-y divide-slate-200 dark:divide-slate-800">
            {specs.map((spec, i) => (
              <div key={`${spec.key ?? spec.label ?? i}`} className="px-4 py-3">
                <dt className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  {spec.label ?? spec.key}
                </dt>
                <dd className="mt-1 font-['Space_Grotesk'] text-sm font-semibold leading-snug text-slate-900 dark:text-white">
                  {spec.value}
                  {spec.unit ? ` ${spec.unit}` : ""}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}

      <div className="flex flex-col gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
        {productType === "CONFIGURABLE" && (
          <Link
            href={`/konfigurator?base=${productSlug}`}
            className="inline-flex h-11 items-center justify-center gap-2 bg-orange-500 px-4 font-['Space_Grotesk'] text-sm font-semibold text-white shadow-lg shadow-orange-900/20 transition-colors hover:bg-orange-600"
          >
            <Wrench className="h-4 w-4" />
            Yapılandır
          </Link>
        )}
        <Link
          href={`/iletisim?urun=${productSlug}`}
          className="inline-flex h-11 items-center justify-center gap-2 border border-slate-300 bg-white px-4 font-['Space_Grotesk'] text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
        >
          Teklif İste
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <div className="grid grid-cols-2 gap-2">
          {compareProduct && <CompareButton product={compareProduct} />}
          {datasheetUrl ? (
            <a
              href={datasheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-1.5 border border-slate-300 bg-white font-['Space_Grotesk'] text-xs font-medium text-slate-600 transition-colors hover:border-orange-500/60 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500/60 dark:hover:text-orange-400"
            >
              <Download className="h-3.5 w-3.5" />
              Datasheet
            </a>
          ) : (
            <span
              aria-hidden
              className="inline-flex h-10 items-center justify-center gap-1.5 border border-dashed border-slate-200 font-['Space_Grotesk'] text-xs font-medium text-slate-400 dark:border-slate-800 dark:text-slate-600"
            >
              <Download className="h-3.5 w-3.5" />
              Datasheet
            </span>
          )}
        </div>
      </div>
    </aside>
  )
}
