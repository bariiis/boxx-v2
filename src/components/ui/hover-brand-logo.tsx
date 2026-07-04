"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { IconType } from "react-icons"
import {
  SiGoogle,
  SiFacebook,
  SiApple,
  SiNetflix,
  SiAirbnb,
  SiTwitch,
} from "react-icons/si"
import { FaAmazon } from "react-icons/fa6"

export type HoverBrand = {
  id: string
  name: string
  Icon?: IconType
  imageSrc?: string
}

const DEFAULT_BRANDS: HoverBrand[] = [
  { id: "google", name: "Google", Icon: SiGoogle },
  { id: "amazon", name: "Amazon", Icon: FaAmazon },
  { id: "facebook", name: "Facebook", Icon: SiFacebook },
  { id: "apple", name: "Apple", Icon: SiApple },
  { id: "netflix", name: "Netflix", Icon: SiNetflix },
  { id: "airbnb", name: "Airbnb", Icon: SiAirbnb },
  { id: "twitch", name: "Twitch", Icon: SiTwitch },
]

export const HOVER_BRAND_ICON_MAP: Record<string, IconType> = {
  google: SiGoogle,
  amazon: FaAmazon,
  facebook: SiFacebook,
  apple: SiApple,
  netflix: SiNetflix,
  airbnb: SiAirbnb,
  twitch: SiTwitch,
}

type HoverBrandLogoProps = {
  label?: string
  defaultText?: string
  brands?: HoverBrand[]
}

export default function HoverBrandLogo({
  label = "Used by",
  defaultText = "leading companies",
  brands = DEFAULT_BRANDS,
}: HoverBrandLogoProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const activeBrand = brands.find((b) => b.id === hoveredId)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex-shrink-0 w-full sm:w-auto text-center sm:text-left">
        <p className="text-sm sm:text-base text-muted-foreground font-medium mb-0 tracking-tight">
          {label}
        </p>
        <div className="relative">
          <p
            aria-hidden
            className="text-3xl lg:text-3xl font-bold tracking-tight whitespace-nowrap opacity-0 pointer-events-none select-none leading-none sm:leading-tight"
          >
            {defaultText}
          </p>
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={hoveredId ?? "default"}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-none sm:leading-tight tracking-tight whitespace-nowrap"
              >
                {activeBrand?.name ?? defaultText}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center justify-center sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto md:mt-6 sm:mt-0">
        {brands.map(({ id, name, Icon, imageSrc }) => {
          const isActive = hoveredId === id
          const isDimmed = hoveredId !== null && !isActive
          return (
            <button
              key={id}
              aria-label={name}
              type="button"
              className={[
                "flex items-center justify-center p-2.5 sm:p-3 lg:p-3.5 rounded-lg border transition-all duration-200",
                isActive
                  ? "border-foreground/30 text-foreground bg-foreground/5"
                  : "border-transparent text-foreground/30 hover:text-foreground/50",
                isDimmed ? "opacity-40 " : "",
              ].join(" ")}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt={name}
                  className="w-8 h-8 sm:w-6 sm:h-6 object-contain"
                />
              ) : Icon ? (
                <Icon className="w-8 h-8 sm:w-6 sm:h-6" />
              ) : (
                <span className="text-xs font-semibold">{name.slice(0, 2)}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
