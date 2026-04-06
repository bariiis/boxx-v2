import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  category: {
    name: string
    slug: string
    parent?: { name: string; slug: string } | null
  } | null
  images: { url: string; alt: string | null }[]
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

  return (
    <div className="relative h-full">
      <Link href={`/urunler/${product.slug}`}>
        <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <Package className="size-12 text-muted-foreground/30" />
              </div>
            )}
            {product.type === "CONFIGURABLE" && (
              <Badge className="absolute left-3 top-3" variant="secondary">
                {typeLabels[product.type]}
              </Badge>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-4">
            {product.category && (
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {product.category.name}
              </p>
            )}
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                {product.description}
              </p>
            )}
            <div className="mt-3 flex items-center justify-between">
              {product.price > 0 ? (
                <p className="text-sm font-bold">
                  {symbol}
                  {product.price.toLocaleString("tr-TR")}
                </p>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">Teklif Alın</p>
              )}
              {!product.isSaleOpen && (
                <Badge variant="outline" className="text-xs">
                  Yakında
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Compare button - positioned absolute top-right on image */}
      {showCompare && rootCat && (
        <div className="absolute right-3 top-3 z-10">
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
  )
}
