"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { GripVertical, Package } from "lucide-react"
import { reorderProducts } from "@/lib/actions/product-actions"
import { toast } from "sonner"

const typeLabels: Record<string, string> = {
  STANDALONE: "Tek Ürün",
  CONFIGURABLE: "Konfigüre Edilebilir",
  COMPONENT: "Bileşen",
}

const currencySymbols: Record<string, string> = {
  TRY: "₺", USD: "$", EUR: "€", GBP: "£",
}

interface ProductItem {
  id: string
  sku: string
  name: string
  type: string
  currency: string
  price: number
  stock: number
  isActive: boolean
  isSaleOpen: boolean
  sortOrder: number
  category: { id: string; name: string } | null
  images: { id: string }[]
}

export function ProductList({ products: initialProducts }: { products: ProductItem[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  const key = initialProducts.map((p) => p.id).join(",")
  const [lastKey, setLastKey] = useState(key)
  if (key !== lastKey) {
    setProducts(initialProducts)
    setLastKey(key)
  }

  function handleDragStart(index: number) {
    setDraggedIdx(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === index) return
    const copy = [...products]
    const [moved] = copy.splice(draggedIdx, 1)
    copy.splice(index, 0, moved)
    setProducts(copy)
    setDraggedIdx(index)
  }

  async function handleDragEnd() {
    if (draggedIdx === null) return
    setDraggedIdx(null)
    try {
      await reorderProducts(products.map((p) => p.id))
    } catch {
      toast.error("Sıralama kaydedilemedi")
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                <Package className="mx-auto mb-2 size-8 opacity-50" />
                Henüz ürün bulunmuyor
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]" />
            <TableHead>SKU</TableHead>
            <TableHead>Ürün Adı</TableHead>
            <TableHead>Tip</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Fiyat</TableHead>
            <TableHead className="text-center">Stok</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="w-[100px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, i) => (
            <TableRow
              key={product.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className={draggedIdx === i ? "opacity-50 bg-muted" : ""}
            >
              <TableCell>
                <div className="flex cursor-grab items-center justify-center active:cursor-grabbing">
                  <GripVertical className="size-4 text-muted-foreground/50" />
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{product.sku}</TableCell>
              <TableCell>
                <Link href={`/admin/products/${product.id}`} className="font-medium hover:underline">
                  {product.name}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{typeLabels[product.type]}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {product.category?.name || "-"}
              </TableCell>
              <TableCell className="text-right font-medium">
                {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {currencySymbols[product.currency] || "₺"}
              </TableCell>
              <TableCell className="text-center">{product.stock}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {product.isActive ? (
                    <Badge>Aktif</Badge>
                  ) : (
                    <Badge variant="secondary">Pasif</Badge>
                  )}
                  {product.isSaleOpen && <Badge variant="outline">Satışta</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/products/${product.id}`}>Düzenle</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
