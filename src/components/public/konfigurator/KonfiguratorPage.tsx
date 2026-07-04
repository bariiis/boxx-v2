"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Configurator } from "./Configurator"
import data from "./sample-data.json"
import type {
  BaseProduct,
  ComponentCategory,
  ComponentCategoryId,
  ComponentOption,
  CompatibilityWarning,
  PowerSummary,
  PricingSummary,
  QuoteFormValues,
  Selection,
} from "./types"

interface KonfiguratorPageProps {
  initialBaseSlug?: string
}

export function KonfiguratorPage({ initialBaseSlug }: KonfiguratorPageProps) {
  const router = useRouter()

  const baseProducts = data.baseProducts as BaseProduct[]
  const categories = data.categories as ComponentCategory[]
  const options = data.options as ComponentOption[]

  const initialBase =
    baseProducts.find((b) => b.slug === initialBaseSlug) ?? baseProducts[0]

  const [selection, setSelection] = useState<Selection>({
    baseProductId: initialBase.id,
    selections: { ...initialBase.defaultSelection },
  })
  const [activeCategoryId, setActiveCategoryId] = useState<ComponentCategoryId>(
    categories[0]?.id ?? "cpu",
  )

  const activeBase =
    baseProducts.find((b) => b.id === selection.baseProductId) ?? initialBase

  const { warnings, power, pricing, completionPercent } = useMemo(
    () => computeDerived(activeBase, categories, options, selection),
    [activeBase, categories, options, selection],
  )

  const handleSelectBase = (baseId: string) => {
    const next = baseProducts.find((b) => b.id === baseId)
    if (!next) return
    setSelection({
      baseProductId: next.id,
      selections: { ...next.defaultSelection },
    })
  }

  const handleSelectOption = (categoryId: ComponentCategoryId, optionId: string | null) => {
    setSelection((prev) => ({
      ...prev,
      selections: { ...prev.selections, [categoryId]: optionId },
    }))
  }

  const handleResetToRecommended = () => {
    setSelection((prev) => ({
      ...prev,
      selections: { ...activeBase.defaultSelection },
    }))
    toast.success("Önerilen konfigürasyona sıfırlandı")
  }

  const handleRequestQuote = (values: QuoteFormValues) => {
    console.log("quote request:", values, selection)
    toast.success("Teklif talebin alındı")
  }

  const handleShare = async () => {
    if (typeof window === "undefined") return
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Bağlantı kopyalandı")
    } catch {
      toast.error("Kopyalama başarısız")
    }
  }

  const handleDownloadPdf = () => toast.info("PDF çıktısı yakında")

  const handleAddToCompare = () => {
    toast.success("Karşılaştırmaya eklendi")
    router.push("/urunler/karsilastir")
  }

  const handleAcceptSuggestion = (warningId: string) => {
    console.log("accept suggestion:", warningId)
  }

  return (
    <Configurator
      baseProducts={baseProducts}
      categories={categories}
      options={options}
      selection={selection}
      activeCategoryId={activeCategoryId}
      warnings={warnings}
      power={power}
      pricing={pricing}
      completionPercent={completionPercent}
      onSelectBaseProduct={handleSelectBase}
      onSelectCategory={setActiveCategoryId}
      onSelectOption={handleSelectOption}
      onResetToRecommended={handleResetToRecommended}
      onRequestQuote={handleRequestQuote}
      onShareConfiguration={handleShare}
      onDownloadPdf={handleDownloadPdf}
      onAddToCompare={handleAddToCompare}
      onAcceptSuggestion={handleAcceptSuggestion}
      onFocusCategoryFromSummary={setActiveCategoryId}
    />
  )
}

function computeDerived(
  baseProduct: BaseProduct,
  categories: ComponentCategory[],
  options: ComponentOption[],
  selection: Selection,
): {
  warnings: CompatibilityWarning[]
  power: PowerSummary
  pricing: PricingSummary
  completionPercent: number
} {
  const selectedOptions = categories
    .map((cat) => {
      const optId = selection.selections[cat.id]
      if (!optId) return null
      return options.find((o) => o.id === optId) ?? null
    })
    .filter((o): o is ComponentOption => o !== null)

  const totalDraw = selectedOptions.reduce((sum, o) => sum + (o.powerDraw ?? 0), 0)
  const psuCapacity = baseProduct.maxPsuWatt
  const utilizationPercent = psuCapacity > 0 ? Math.min(100, Math.round((totalDraw / psuCapacity) * 100)) : 0
  const powerStatus: PowerSummary["status"] =
    totalDraw > psuCapacity ? "over" : totalDraw > psuCapacity * 0.8 ? "high" : "ok"

  const componentsDelta = selectedOptions.reduce((sum, o) => sum + (o.priceDelta ?? 0), 0)
  const warrantyOpt = selectedOptions.find((o) => o.categoryId === "warranty")
  const warrantyDelta = warrantyOpt?.priceDelta ?? 0
  const subtotal = baseProduct.basePrice + componentsDelta

  const requiredCount = categories.filter((c) => c.requirement === "required").length
  const filledRequired = categories.filter(
    (c) => c.requirement === "required" && selection.selections[c.id],
  ).length
  const completionPercent =
    requiredCount > 0 ? Math.round((filledRequired / requiredCount) * 100) : 100

  const warnings: CompatibilityWarning[] = []
  if (powerStatus === "over") {
    warnings.push({
      id: "power-overload",
      categoryId: "psu",
      optionId: selection.selections.psu ?? "",
      severity: "error",
      message: `Toplam çekiş ${totalDraw}W; seçili güç kaynağı ${psuCapacity}W. Daha yüksek kapasiteli bir PSU seçmen gerekiyor.`,
      suggestion: "Daha yüksek watt'lı PSU'yu öner",
    })
  }

  return {
    warnings,
    power: {
      totalDraw,
      psuCapacity,
      utilizationPercent,
      status: powerStatus,
    },
    pricing: {
      basePrice: baseProduct.basePrice,
      componentsDelta,
      warrantyDelta,
      subtotal,
      currency: baseProduct.currency,
      monthlyInstallmentEstimate: Math.round(subtotal / 12),
    },
    completionPercent,
  }
}
