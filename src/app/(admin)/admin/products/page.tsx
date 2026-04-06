import { getProducts } from "@/lib/actions/product-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { ProductList } from "@/components/admin/product-list"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; type?: string }>
}) {
  const params = await searchParams
  const search = params.search || ""
  const page = parseInt(params.page || "1")
  const type = params.type as "STANDALONE" | "CONFIGURABLE" | "COMPONENT" | undefined

  const { products, total, totalPages } = await getProducts({ search, page, type })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ürünler</h1>
          <p className="text-muted-foreground">{total} ürün</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/products/categories">Kategoriler</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 size-4" />
              Yeni Ürün
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <form className="flex gap-2" action="/admin/products">
          {type && <input type="hidden" name="type" value={type} />}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="search" defaultValue={search} placeholder="Ürün adı veya SKU ara..." className="pl-9 w-64" />
          </div>
        </form>
        {search && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/products${type ? `?type=${type}` : ""}`}>Temizle</Link>
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          {[
            { label: "Tümü", value: undefined },
            { label: "Tek Ürün", value: "STANDALONE" },
            { label: "Konfigüre Edilebilir", value: "CONFIGURABLE" },
            { label: "Bileşen", value: "COMPONENT" },
          ].map((f) => (
            <Button
              key={f.label}
              variant={type === f.value ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/admin/products${f.value ? `?type=${f.value}` : ""}${search ? `${f.value ? "&" : "?"}search=${search}` : ""}`}>
                {f.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <ProductList products={products} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button key={i + 1} variant={page === i + 1 ? "default" : "outline"} size="sm" asChild>
              <Link href={`/admin/products?page=${i + 1}${type ? `&type=${type}` : ""}`}>
                {i + 1}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
