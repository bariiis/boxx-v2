"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface PricingPlan {
  name: string
  price: string
  priceNote?: string
  description?: string
  features: string[]
  ctaText?: string
  ctaHref?: string
  highlighted?: boolean
}

export interface PricingTableProps {
  headline?: string
  description?: string
  plans?: PricingPlan[]
  dark?: boolean
}

export function PricingTable({
  headline = "Fiyatlandırma",
  description,
  plans = [],
  dark = false,
}: PricingTableProps) {
  const bg = dark ? "bg-neutral-950" : "bg-white"
  const headingColor = dark ? "text-white" : "text-neutral-900"
  const mutedColor = dark ? "text-neutral-400" : "text-neutral-600"
  const cardBg = dark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"
  const highlightBg = dark
    ? "bg-blue-950/40 border-blue-500"
    : "bg-blue-50 border-blue-500"

  return (
    <section className={`relative w-full py-16 md:py-24 ${bg}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${headingColor}`}>
            {headline}
          </h2>
          {description && (
            <p className={`mt-3 max-w-2xl mx-auto ${mutedColor}`}>{description}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-3xl border-2 p-8 ${
                plan.highlighted ? highlightBg : cardBg
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                  En Popüler
                </div>
              )}
              <h3 className={`text-xl font-bold ${headingColor}`}>{plan.name}</h3>
              {plan.description && (
                <p className={`mt-2 text-sm ${mutedColor}`}>{plan.description}</p>
              )}
              <div className="mt-6">
                <span className={`text-4xl font-bold ${headingColor}`}>{plan.price}</span>
                {plan.priceNote && (
                  <span className={`ml-2 text-sm ${mutedColor}`}>{plan.priceNote}</span>
                )}
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-5 shrink-0 text-blue-600" />
                    <span className={`text-sm ${mutedColor}`}>{f}</span>
                  </li>
                ))}
              </ul>
              {plan.ctaText && plan.ctaHref && (
                <Button
                  asChild
                  className="mt-8 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href={plan.ctaHref}>{plan.ctaText}</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
