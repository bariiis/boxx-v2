import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react"
import { getPublicCategories, getPublicProducts } from "@/lib/actions/public-product-actions"
import { ProductCard } from "@/components/public/product-card"

export const metadata = {
  title: "Ürünler | STUUX",
  description: "Yüksek performanslı iş istasyonları, GPU sunucular, depolama ve ağ çözümleri.",
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
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Ürünler</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Her iş yüküne uygun, özel yapılandırılmış donanım çözümleri. İş istasyonlarından
            GPU sunuculara, depolamadan ağ altyapısına.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-lg font-semibold">Kategoriler</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/urunler">
                <Badge
                  variant={!search ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 text-sm"
                >
                  Tümü ({total})
                </Badge>
              </Link>
              {categories.map((cat) => {
                const productCount =
                  cat._count.products +
                  cat.children.reduce((sum, c) => sum + c._count.products, 0)
                return (
                  <Link key={cat.id} href={`/urunler/kategori/${cat.slug}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                    >
                      {cat.name} ({productCount})
                    </Badge>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-8">
          <form className="flex max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Ürün ara..."
                defaultValue={search}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="secondary">
              <SlidersHorizontal className="mr-2 size-4" />
              Ara
            </Button>
          </form>
          {search && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span>&quot;{search}&quot; için {total} sonuç bulundu</span>
              <Link href="/urunler" className="text-primary hover:underline">
                Temizle
              </Link>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-medium">Ürün bulunamadı</p>
            <p className="mt-2 text-muted-foreground">
              {search
                ? "Farklı anahtar kelimelerle tekrar deneyin."
                : "Henüz ürün eklenmemiş."}
            </p>
            {search && (
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/urunler">Tüm Ürünleri Göster</Link>
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/urunler?${new URLSearchParams({ ...(search && { search }), sayfa: String(page - 1) })}`}
                >
                  Önceki
                </Link>
              </Button>
            )}
            <span className="px-4 text-sm text-muted-foreground">
              Sayfa {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/urunler?${new URLSearchParams({ ...(search && { search }), sayfa: String(page + 1) })}`}
                >
                  Sonraki
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-lg bg-muted/50 p-8 text-center">
          <h3 className="text-xl font-bold">Aradığınız Sistemi Bulamadınız mı?</h3>
          <p className="mt-2 text-muted-foreground">
            İhtiyacınıza özel konfigürasyon için uzman ekibimizle iletişime geçin.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/iletisim">
              Uzmanla Konuş <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
