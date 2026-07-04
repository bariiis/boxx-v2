import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Box } from "lucide-react"
import {
  getPublicCategoryBySlug,
  getPublicProducts,
  getPublicCategories,
} from "@/lib/actions/public-product-actions"
import { ProductCard } from "@/components/public/product-card"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getPublicCategoryBySlug(slug)
  if (!category) return { title: "Kategori Bulunamadı" }
  return {
    title: `${category.name} | BOXX Ürünler`,
    description: category.description || `${category.name} kategorisindeki tüm ürünler.`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sayfa?: string }>
}) {
  const { slug } = await params
  const { sayfa } = await searchParams
  const page = Number(sayfa) || 1

  const [category, allCategories, { products, total, totalPages }] = await Promise.all([
    getPublicCategoryBySlug(slug),
    getPublicCategories(),
    getPublicProducts({ categorySlug: slug, page }),
  ])

  if (!category) notFound()

  const parentSlug = category.parent?.slug || slug
  const parentCat = category.parent
    ? allCategories.find((c) => c.slug === category.parent!.slug)
    : allCategories.find((c) => c.slug === slug)
  const subcategories = parentCat?.children || category.children

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-white via-orange-50/30 to-teal-50/20 dark:border-slate-800/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-orange-400/20 to-teal-400/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-1.5 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <Link href="/" className="transition-colors hover:text-orange-600 dark:hover:text-orange-300">
              Ana Sayfa
            </Link>
            <span aria-hidden>/</span>
            <Link href="/urunler" className="transition-colors hover:text-orange-600 dark:hover:text-orange-300">
              Ürünler
            </Link>
            {category.parent && (
              <>
                <span aria-hidden>/</span>
                <Link
                  href={`/urunler/kategori/${category.parent.slug}`}
                  className="transition-colors hover:text-orange-600 dark:hover:text-orange-300"
                >
                  {category.parent.name}
                </Link>
              </>
            )}
            <span aria-hidden>/</span>
            <span className="text-slate-700 dark:text-slate-200">{category.name}</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
                Ürün Kategorisi · {total} ürün
              </div>
              <h1 className="mt-2 font-['Space_Grotesk'] text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                {category.name}
                <span aria-hidden className="text-orange-500">.</span>
              </h1>
              {category.description && (
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                  {category.description}
                </p>
              )}
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Box className="size-8 text-orange-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar: main + sub categories */}
      <section className="sticky top-16 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800/80 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
          {allCategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 overflow-x-auto">
              <CategoryPill href="/urunler" active={false} label="Tüm Ürünler" />
              {allCategories.map((cat) => {
                const isActiveParent =
                  cat.slug === slug || cat.slug === category.parent?.slug
                return (
                  <CategoryPill
                    key={cat.id}
                    href={`/urunler/kategori/${cat.slug}`}
                    active={isActiveParent}
                    label={cat.name}
                  />
                )
              })}
            </div>
          )}
          {subcategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 overflow-x-auto border-t border-slate-100 pt-3 dark:border-slate-800">
              <CategoryPill
                href={`/urunler/kategori/${parentSlug}`}
                active={!category.parent && category.children.length > 0}
                label="Tümü"
                subtle
              />
              {subcategories.map((child) => (
                <CategoryPill
                  key={child.id}
                  href={`/urunler/kategori/${child.slug}`}
                  active={child.slug === slug}
                  label={child.name}
                  subtle
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        {products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-950/60">
            <Box className="size-8 text-slate-400" />
            <h4 className="font-['Space_Grotesk'] text-base font-semibold text-slate-900 dark:text-white">
              Bu kategoride henüz ürün yok
            </h4>
            <p className="max-w-sm text-sm text-slate-500">
              Yakında yeni ürünler eklenecek.
            </p>
            <Link
              href="/urunler"
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 font-['Space_Grotesk'] text-xs font-semibold text-slate-700 transition hover:border-orange-400 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <ArrowLeft className="size-3" />
              Tüm Ürünlere Dön
            </Link>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/urunler/kategori/${slug}?sayfa=${page - 1}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 font-['Space_Grotesk'] text-xs font-medium text-slate-600 transition hover:border-orange-400 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                ← Önceki
              </Link>
            )}
            <span className="px-4 font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-slate-500">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/urunler/kategori/${slug}?sayfa=${page + 1}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 font-['Space_Grotesk'] text-xs font-medium text-slate-600 transition hover:border-orange-400 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                Sonraki →
              </Link>
            )}
          </div>
        )}

        <div className="mt-16 rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-50/60 via-white to-teal-50/30 p-8 text-center dark:border-slate-800 dark:from-orange-500/5 dark:via-slate-950 dark:to-teal-500/5 sm:p-10">
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
            Özel ihtiyaç mı var?
          </div>
          <h3 className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {category.name.toLowerCase()} için sana özel yapılandıralım
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            İhtiyacına uygun sistemi birlikte tasarlayalım.
          </p>
          <Link
            href="/iletisim"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 font-['Space_Grotesk'] text-sm font-semibold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-600"
          >
            Teklif İste
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function CategoryPill({
  href,
  active,
  label,
  subtle,
}: {
  href: string
  active: boolean
  label: string
  subtle?: boolean
}) {
  const base =
    "inline-flex shrink-0 items-center rounded-full px-3 py-1 font-['Space_Grotesk'] text-xs font-medium transition"
  if (active) {
    return (
      <Link
        href={href}
        className={`${base} bg-orange-500 text-white shadow shadow-orange-500/20`}
      >
        {label}
      </Link>
    )
  }
  if (subtle) {
    return (
      <Link
        href={href}
        className={`${base} text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-300`}
      >
        {label}
      </Link>
    )
  }
  return (
    <Link
      href={href}
      className={`${base} border border-slate-200 bg-white text-slate-600 hover:border-orange-400 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300`}
    >
      {label}
    </Link>
  )
}
