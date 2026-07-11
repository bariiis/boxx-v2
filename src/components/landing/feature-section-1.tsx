"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Heart,
  WifiOff,
  ShieldCheck,
  BatteryCharging,
  Network,
  Check,
  Crown,
  Shield,
  ShoppingCart,
  ChevronRight,
  ExternalLink,
  Stars,
  CreditCard,
  Sparkles,
  Zap,
  Package,
  Cpu,
  Box,
  Rocket,
  Award,
  Download,
  type LucideIcon,
} from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  "wifi-off": WifiOff,
  "shield-check": ShieldCheck,
  "battery-charging": BatteryCharging,
  network: Network,
  check: Check,
  crown: Crown,
  shield: Shield,
  "shopping-cart": ShoppingCart,
  "chevron-right": ChevronRight,
  "external-link": ExternalLink,
  stars: Stars,
  "credit-card": CreditCard,
  sparkles: Sparkles,
  zap: Zap,
  package: Package,
  cpu: Cpu,
  box: Box,
  rocket: Rocket,
  award: Award,
  download: Download,
}

export const FEATURE_SECTION_1_ICON_NAMES = Object.keys(ICONS)

function resolveIcon(name: string | undefined, fallback: LucideIcon = Check): LucideIcon {
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

export interface FeatureSection1Feature {
  icon?: string
  title: string
  description: string
}

export interface FeatureSection1Props {
  mainIcon?: string
  title: string
  subtitle?: string
  features?: FeatureSection1Feature[]
  ctaTitle?: string
  ctaDescription?: string
  primaryButtonText?: string
  primaryButtonIcon?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonIcon?: string
  secondaryButtonHref?: string
  demoteHeading?: boolean
}

export function FeatureSection1({
  mainIcon,
  title,
  subtitle,
  features = [],
  ctaTitle,
  ctaDescription,
  primaryButtonText,
  primaryButtonIcon,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonIcon,
  secondaryButtonHref,
  demoteHeading = false,
}: FeatureSection1Props) {
  const Heading = demoteHeading ? "h2" : "h1"
  const showCta =
    ctaTitle ||
    ctaDescription ||
    (primaryButtonText && primaryButtonHref) ||
    (secondaryButtonText && secondaryButtonHref)

  return (
    <section
      className="relative w-full py-12 sm:py-24"
      style={{ backgroundColor: "var(--lp-bg)", color: "var(--lp-fg)" }}
    >
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <DynamicIcon name={mainIcon} fallback={Heart} className="h-8 w-8" />
          </div>

          <Heading className="text-3xl font-bold tracking-tight sm:text-5xl">
            {title}
          </Heading>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-lg" style={{ color: "var(--lp-muted-fg)" }}>
              {subtitle}
            </p>
          )}
        </div>

        {features.length > 0 && (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-left sm:mt-20 lg:max-w-none lg:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = resolveIcon(feature.icon, Check)
              return (
                <div key={index} className="flex gap-x-6">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold leading-7">{feature.title}</h3>
                    <p className="mt-1 text-base leading-7" style={{ color: "var(--lp-muted-fg)" }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {showCta && (
          <div
            className="mt-16 rounded-2xl border p-8 text-center sm:mt-20"
            style={{ borderColor: "var(--lp-border)", backgroundColor: "var(--lp-muted)" }}
          >
            {ctaTitle && (
              <h2 className="text-xl font-semibold tracking-tight">{ctaTitle}</h2>
            )}
            {ctaDescription && (
              <p className="mt-2" style={{ color: "var(--lp-muted-fg)" }}>
                {ctaDescription}
              </p>
            )}
            {(primaryButtonText || secondaryButtonText) && (
              <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {primaryButtonText && primaryButtonHref && (
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href={primaryButtonHref}>
                      <DynamicIcon name={primaryButtonIcon} fallback={Download} className="mr-2 h-5 w-5" />
                      {primaryButtonText}
                    </Link>
                  </Button>
                )}
                {secondaryButtonText && secondaryButtonHref && (
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href={secondaryButtonHref}>
                      <DynamicIcon name={secondaryButtonIcon} fallback={ExternalLink} className="mr-2 h-5 w-5" />
                      {secondaryButtonText}
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
