import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight } from "lucide-react"
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
    title: `${category.name} | STUUX Ürünler`,
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

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/urunler" className="hover:text-foreground transition-colors">
              Ürünler
            </Link>
            <span>/</span>
            {category.parent && (
              <>
                <Link
                  href={`/urunler/kategori/${category.parent.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {category.parent.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{category.name}</span>
          </nav>

          <h1 className="text-3xl font-bold sm:text-4xl">{category.name}</h1>
          {category.description && (
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {category.description}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">{total} ürün</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Ana kategoriler — her zaman göster */}
        {allCategories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <Link href="/urunler">
              <Badge variant="outline" className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-accent">
                Tüm Ürünler
              </Badge>
            </Link>
            {allCategories.map((cat) => {
              // Aktif üst kategori: ya doğrudan bu slug, ya da parent'ı bu olan bir alt kategori
              const isActiveParent = cat.slug === slug || cat.slug === category.parent?.slug
              return (
                <Link key={cat.id} href={`/urunler/kategori/${cat.slug}`}>
                  <Badge
                    variant={isActiveParent ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                  >
                    {cat.name}
                  </Badge>
                </Link>
              )
            })}
          </div>
        )}

        {/* Alt kategoriler — üst kategorininkileri veya kardeşleri göster */}
        {(() => {
          // Eğer bu bir üst kategoriyse, kendi children'ını göster
          // Eğer bu bir alt kategoriyse, parent'ın children'ını göster (kardeşleri)
          const parentSlug = category.parent?.slug || slug
          const parentCat = category.parent
            ? allCategories.find((c) => c.slug === category.parent!.slug)
            : allCategories.find((c) => c.slug === slug)
          const subcategories = parentCat?.children || category.children

          return subcategories.length > 0 ? (
            <div className="mb-8 flex flex-wrap gap-2">
              <Link href={`/urunler/kategori/${parentSlug}`}>
                <Badge
                  variant={!category.parent && category.children.length > 0 ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                >
                  Tümü
                </Badge>
              </Link>
              {subcategories.map((child) => (
                <Link key={child.id} href={`/urunler/kategori/${child.slug}`}>
                  <Badge
                    variant={child.slug === slug ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                  >
                    {child.name}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : null
        })()}

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-medium">Bu kategoride henüz ürün yok</p>
            <p className="mt-2 text-muted-foreground">
              Yakında yeni ürünler eklenecek.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/urunler">
                <ArrowLeft className="mr-2 size-4" />
                Tüm Ürünlere Dön
              </Link>
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/urunler/kategori/${slug}?sayfa=${page - 1}`}>
                  Önceki
                </Link>
              </Button>
            )}
            <span className="px-4 text-sm text-muted-foreground">
              Sayfa {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/urunler/kategori/${slug}?sayfa=${page + 1}`}>
                  Sonraki
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-lg bg-muted/50 p-8 text-center">
          <h3 className="text-xl font-bold">Özel Konfigürasyon mu İstiyorsunuz?</h3>
          <p className="mt-2 text-muted-foreground">
            İhtiyacınıza uygun sistemi birlikte tasarlayalım.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/iletisim">
              Teklif İste <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
