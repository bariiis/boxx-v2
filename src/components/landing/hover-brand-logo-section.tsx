"use client"

import HoverBrandLogo, {
  HOVER_BRAND_ICON_MAP,
  type HoverBrand,
} from "@/components/ui/hover-brand-logo"
import { cn } from "@/lib/utils"

type BrandConfig = {
  id: string
  name: string
  icon?: string
  image?: string
}

type HoverBrandLogoSectionProps = {
  label?: string
  defaultText?: string
  brands?: BrandConfig[]
  dark?: boolean
}

const FALLBACK_BRANDS: BrandConfig[] = [
  { id: "google", name: "Google", icon: "google" },
  { id: "amazon", name: "Amazon", icon: "amazon" },
  { id: "facebook", name: "Facebook", icon: "facebook" },
  { id: "apple", name: "Apple", icon: "apple" },
  { id: "netflix", name: "Netflix", icon: "netflix" },
  { id: "airbnb", name: "Airbnb", icon: "airbnb" },
  { id: "twitch", name: "Twitch", icon: "twitch" },
]

export function HoverBrandLogoSection({
  label = "Kullananlar",
  defaultText = "öncü şirketler",
  brands,
  dark = false,
}: HoverBrandLogoSectionProps) {
  const source = brands && brands.length > 0 ? brands : FALLBACK_BRANDS

  const resolved: HoverBrand[] = source
    .map<HoverBrand | null>((b) => {
      const id = b.id || (b.name || "").toLowerCase() || "brand"
      const imageSrc = b.image?.trim() || undefined
      if (imageSrc) {
        return { id, name: b.name, imageSrc }
      }
      const iconKey = (b.icon || b.id || "").toLowerCase()
      const Icon = HOVER_BRAND_ICON_MAP[iconKey]
      if (!Icon) return null
      return { id, name: b.name, Icon }
    })
    .filter((b): b is HoverBrand => b !== null)

  return (
    <section
      className={cn(
        "w-full",
        dark ? "bg-black text-white" : "bg-background text-foreground",
      )}
    >
      <HoverBrandLogo
        label={label}
        defaultText={defaultText}
        brands={resolved.length > 0 ? resolved : undefined}
      />
    </section>
  )
}
