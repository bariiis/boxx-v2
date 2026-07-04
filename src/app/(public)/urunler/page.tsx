import Link from "next/link"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search, Box } from "lucide-react"
import { getPublicCategories, getPublicProducts } from "@/lib/actions/public-product-actions"
import { ProductCard } from "@/components/public/product-card"

export const metadata = {
  title: "Ürünler | BOXX",
  description:
    "Yüksek performanslı iş istasyonları, GPU sunucular, depolama ve ağ çözümleri.",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sayfa?: string }>
}) {
  const params = await searchParams
  const search = params.search || ""
  const page = Number(params.sayfa) || 1

  const [categories, { products, total, totalPages }] = await Promise.all([
    getPublicCategories(),
    getPublicProducts({ search, page }),
  ])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-white via-orange-50/30 to-teal-50/20 dark:border-slate-800/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-orange-400/20 to-teal-400/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
                Ürün Kataloğu · {total} ürün
              </div>
              <h1 className="mt-2 font-['Space_Grotesk'] text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Donanım portföyü
                <span aria-hidden className="text-orange-500">.</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                Her iş yüküne uygun özel yapılandırılmış sistemler — iş
                istasyonlarından GPU sunuculara, depolamadan ağ altyapısına.
              </p>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Box className="size-8 text-orange-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Filter + search sticky bar */}
      <section className="sticky top-16 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800/80 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 overflow-x-auto">
              <Link
                href="/urunler"
                className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 font-['Space_Grotesk'] text-xs font-medium transition ${
                  !search
                    ? "bg-orange-500 text-white shadow shadow-orange-500/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-orange-400 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                Tümü ({total})
              </Link>
              {categories.map((cat) => {
                const productCount =
                  cat._count.products +
                  cat.children.reduce(
                    (sum, c) =>
                      sum +
                      c._count.products +
                      c.children.reduce((s, gc) => s + gc._count.products, 0),
                    0,
                  )
                return (
                  <Link
                    key={cat.id}
                    href={`/urunler/kategori/${cat.slug}`}
                    className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white px-3 py-1 font-['Space_Grotesk'] text-xs font-medium text-slate-600 transition hover:border-orange-400 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {cat.name} ({productCount})
                  </Link>
                )
              })}
            </div>
          )}
          <form className="relative md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="search"
              placeholder="Ürün ara"
              defaultValue={search}
              className="w-full rounded-full border-slate-200 bg-white pl-9 font-['Inter'] text-sm text-slate-700 placeholder:text-slate-400 focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            />
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        {search && (
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span>
              &ldquo;{search}&rdquo; için {total} sonuç bulundu
            </span>
            <Link
              href="/urunler"
              className="font-['Space_Grotesk'] font-semibold text-orange-600 underline decoration-orange-400 decoration-2 underline-offset-4 hover:text-orange-700 dark:text-orange-300"
            >
              Temizle
            </Link>
          </div>
        )}

        {/* Product Grid */}
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
              Ürün bulunamadı
            </h4>
            <p className="max-w-sm text-sm text-slate-500">
              {search
                ? "Farklı anahtar kelimelerle tekrar dene."
                : "Henüz ürün eklenmemiş."}
            </p>
            {search && (
              <Link
                href="/urunler"
                className="mt-2 font-['Space_Grotesk'] text-xs font-semibold text-orange-600 underline decoration-orange-400 decoration-2 underline-offset-4 hover:text-orange-700"
              >
                Tüm ürünleri göster
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/urunler?${new URLSearchParams({ ...(search && { search }), sayfa: String(page - 1) })}`}
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
                href={`/urunler?${new URLSearchParams({ ...(search && { search }), sayfa: String(page + 1) })}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 font-['Space_Grotesk'] text-xs font-medium text-slate-600 transition hover:border-orange-400 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                Sonraki →
              </Link>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-50/60 via-white to-teal-50/30 p-8 text-center dark:border-slate-800 dark:from-orange-500/5 dark:via-slate-950 dark:to-teal-500/5 sm:p-10">
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
            Aradığın yok mu?
          </div>
          <h3 className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Sana özel yapılandıralım
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            İhtiyacına özel konfigürasyon için uzman ekibimizle konuş — 48 saat
            içinde size özel teklif hazırlarız.
          </p>
          <Link
            href="/iletisim"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 font-['Space_Grotesk'] text-sm font-semibold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-600"
          >
            Uzmanla Konuş
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
