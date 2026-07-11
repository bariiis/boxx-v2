"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Check,
  Crown,
  Shield,
  Heart,
  ShoppingCart,
  ChevronRight,
  ExternalLink,
  Stars,
  CreditCard,
  Sparkles,
  Zap,
  Package,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { useRef, type CSSProperties } from "react"

const ICONS: Record<string, LucideIcon> = {
  check: Check,
  crown: Crown,
  shield: Shield,
  heart: Heart,
  "shopping-cart": ShoppingCart,
  "chevron-right": ChevronRight,
  "external-link": ExternalLink,
  stars: Stars,
  "credit-card": CreditCard,
  sparkles: Sparkles,
  zap: Zap,
  package: Package,
}

function icon(name: string | undefined, fallback: LucideIcon): LucideIcon {
  if (!name) return fallback
  return ICONS[name] || fallback
}

function DynamicIcon({
  name,
  fallback: Fallback,
  className,
}: {
  name?: string
  fallback: LucideIcon
  className?: string
}) {
  const Icon = (name && ICONS[name]) || Fallback
  return <Icon className={className} />
}

export interface SinglePricingCard3ColProps {
  // Section headline
  sectionHeadline?: string
  sectionDescription?: string
  sectionBadgeText?: string
  sectionBadgeIcon?: string

  // Card header
  badgeText?: string
  badgeIcon?: string
  title: string
  subtitle: string

  // Pricing
  priceCurrent: string
  priceOriginal?: string
  priceDiscount?: string

  // Benefits (left column bullets)
  benefits?: { text: string; icon?: string }[]

  // Features (middle column list)
  features?: { text: string }[]
  featuresIcon?: string
  featuresTitle?: string
  featuresImage?: string
  featuresImageAlt?: string

  // 3rd column rich content (HTML)
  richTitle?: string
  richContent?: string

  // Buttons
  primaryButtonText?: string
  primaryButtonIcon?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonIcon?: string
  secondaryButtonHref?: string

  light?: boolean
  demoteHeading?: boolean
}

export function SinglePricingCard3Col({
  sectionHeadline,
  sectionDescription,
  sectionBadgeText,
  sectionBadgeIcon,
  badgeText,
  badgeIcon,
  title,
  subtitle,
  priceCurrent,
  priceOriginal,
  priceDiscount,
  benefits = [],
  features = [],
  featuresIcon,
  featuresTitle = "Öne Çıkan Özellikler",
  featuresImage,
  featuresImageAlt = "",
  richTitle = "Detaylar",
  richContent = "",
  primaryButtonText = "Satın Al",
  primaryButtonIcon,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonIcon,
  secondaryButtonHref,
  light = false,
  demoteHeading = false,
}: SinglePricingCard3ColProps) {
  const lightVars = light
    ? ({
        ["--lp-bg" as string]: "#ffffff",
        ["--lp-fg" as string]: "#0a0a0a",
        ["--lp-muted" as string]: "#f5f5f5",
        ["--lp-muted-fg" as string]: "#6b7280",
        ["--lp-border" as string]: "#e5e7eb",
      } as CSSProperties)
    : {}
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const FeaturesIcon = icon(featuresIcon, Check)
  const Heading = demoteHeading ? "h3" : "h2"

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden flex justify-center"
      style={{ backgroundColor: "var(--lp-bg)", color: "var(--lp-fg)", ...lightVars }}
    >
      <div className="container px-4 md:px-6 relative z-10">
        {(sectionHeadline || sectionBadgeText || sectionDescription) && (
          <div className="flex flex-col items-center mb-12 text-center">
            {sectionBadgeText && (
              <div
                className="inline-flex items-center gap-1 px-3 py-1 mb-4 rounded-full border shadow-sm"
                style={{ borderColor: "var(--lp-border)" }}
              >
                <DynamicIcon name={sectionBadgeIcon} fallback={CreditCard} className="mr-1 h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium">{sectionBadgeText}</span>
              </div>
            )}
            {sectionHeadline && (
              <Heading className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                {sectionHeadline}
              </Heading>
            )}
            {sectionDescription && (
              <p className="max-w-[700px] md:text-xl/relaxed" style={{ color: "var(--lp-muted-fg)" }}>
                {sectionDescription}
              </p>
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[1200px] mx-auto"
        >
          <Card className="overflow-hidden border border-primary/10 relative group rounded-none">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* LEFT: pricing */}
              <div className="p-6 md:p-8 flex flex-col">
                {badgeText && (
                  <div className="flex items-center mb-4">
                    <Badge className="px-3 py-1 bg-primary/5 border-primary/10 text-primary hover:bg-primary/10">
                      <DynamicIcon name={badgeIcon} fallback={Crown} className="h-3.5 w-3.5 mr-1" />
                      <span>{badgeText}</span>
                    </Badge>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="mb-4" style={{ color: "var(--lp-muted-fg)" }}>
                  {subtitle}
                </p>

                <div className="flex items-baseline mb-6 flex-wrap">
                  <span className="text-4xl font-bold">{priceCurrent}</span>
                  {priceOriginal && (
                    <span className="ml-2 line-through" style={{ color: "var(--lp-muted-fg)" }}>
                      {priceOriginal}
                    </span>
                  )}
                  {priceDiscount && (
                    <Badge variant="outline" className="ml-3 border-green-400/30 text-green-500">
                      <span>{priceDiscount}</span>
                    </Badge>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  {benefits.map((b, i) => {
                    const Icn = icon(b.icon, Check)
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <Icn className="h-4 w-4 text-primary" />
                        <span className="text-sm">{b.text}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-auto space-y-3">
                  <Button className="w-full gap-2 group" size="lg" asChild={!!primaryButtonHref}>
                    {primaryButtonHref ? (
                      <Link href={primaryButtonHref}>
                        <DynamicIcon name={primaryButtonIcon} fallback={ShoppingCart} className="h-4 w-4" />
                        <span>{primaryButtonText}</span>
                        <ChevronRight className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-1" />
                      </Link>
                    ) : (
                      <>
                        <DynamicIcon name={primaryButtonIcon} fallback={ShoppingCart} className="h-4 w-4" />
                        <span>{primaryButtonText}</span>
                      </>
                    )}
                  </Button>

                  {secondaryButtonText && secondaryButtonHref && (
                    <Button variant="outline" className="w-full gap-2" size="lg" asChild>
                      <Link href={secondaryButtonHref} target="_blank">
                        <span>{secondaryButtonText}</span>
                        <DynamicIcon name={secondaryButtonIcon} fallback={ExternalLink} className="h-4 w-4 ml-auto" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* MIDDLE: features */}
              <div
                className="p-6 md:p-8 md:border-l"
                style={{ borderColor: "var(--lp-border)" }}
              >
                {featuresImage && (
                  <div className="mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuresImage}
                      alt={featuresImageAlt}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
                <div className="flex items-center mb-4">
                  <h4 className="font-semibold">{featuresTitle}</h4>
                </div>

                <div className="space-y-3">
                  {features.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <FeaturesIcon className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{f.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* RIGHT: rich content (editor output) */}
              <div
                className="p-6 md:p-8 md:border-l"
                style={{ borderColor: "var(--lp-border)" }}
              >
                {richTitle && (
                  <div className="flex items-center mb-4">
                    <h4 className="font-semibold">{richTitle}</h4>
                  </div>
                )}
                {richContent ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    style={{ color: "var(--lp-fg)" }}
                    dangerouslySetInnerHTML={{ __html: richContent }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: "var(--lp-muted-fg)" }}>
                    İçerik henüz eklenmedi.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
