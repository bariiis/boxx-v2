"use client"

import { useCompareStore, type CompareItem } from "@/lib/stores/compare-store"
import { Button } from "@/components/ui/button"
import { GitCompareArrows, Check } from "lucide-react"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CompareButtonProps {
  product: CompareItem
  size?: "sm" | "icon"
}

export function CompareButton({ product, size = "sm" }: CompareButtonProps) {
  const { has, add, remove, canAdd, items } = useCompareStore()
  const isSelected = has(product.id)
  const sameCategory = canAdd(product.rootCategorySlug)
  const isFull = items.length >= 4
  const disabled = !isSelected && (!sameCategory || isFull)

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (isSelected) {
      remove(product.id)
      return
    }

    if (!sameCategory) {
      toast.error(
        `Yalnızca aynı kategorideki ürünler karşılaştırılabilir. Şu an "${items[0]?.rootCategoryName}" kategorisi seçili.`,
      )
      return
    }

    if (isFull) {
      toast.error("En fazla 4 ürün karşılaştırabilirsiniz.")
      return
    }

    const added = add(product)
    if (added) {
      toast.success(`${product.name} karşılaştırmaya eklendi`)
    }
  }

  if (size === "icon") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="icon"
                className="size-8"
                onClick={handleToggle}
                disabled={disabled}
              />
            }
          >
              {isSelected ? (
                <Check className="size-4" />
              ) : (
                <GitCompareArrows className="size-4" />
              )}
          </TooltipTrigger>
          <TooltipContent>
            {isSelected ? "Karşılaştırmadan çıkar" : disabled ? "Farklı kategori" : "Karşılaştır"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      size="sm"
      className="h-7 text-xs"
      onClick={handleToggle}
      disabled={disabled}
    >
      {isSelected ? (
        <>
          <Check className="mr-1 size-3" />
          Eklendi
        </>
      ) : (
        <>
          <GitCompareArrows className="mr-1 size-3" />
          Karşılaştır
        </>
      )}
    </Button>
  )
}
