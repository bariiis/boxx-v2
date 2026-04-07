"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export interface ImageTextSplitProps {
  label?: string
  headline?: string
  description?: string
  bullets?: string[]
  image?: string
  imageAlt?: string
  ctaText?: string
  ctaHref?: string
  reverse?: boolean
  dark?: boolean
}

export function ImageTextSplit({
  label,
  headline = "Başlık",
  description,
  bullets = [],
  image,
  imageAlt,
  ctaText,
  ctaHref,
  reverse = false,
  dark = false,
}: ImageTextSplitProps) {
  const bg = dark ? "bg-neutral-950" : "bg-white"
  const headingColor = dark ? "text-white" : "text-neutral-900"
  const mutedColor = dark ? "text-neutral-400" : "text-neutral-600"
  const labelColor = dark ? "text-blue-400" : "text-blue-600"

  return (
    <section className={`relative w-full py-16 md:py-24 ${bg}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`grid items-center gap-12 lg:gap-16 lg:grid-cols-2 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div>
            {label && (
              <p className={`text-sm font-semibold uppercase tracking-wider ${labelColor}`}>
                {label}
              </p>
            )}
            <h2 className={`mt-3 text-3xl md:text-4xl font-bold tracking-tight ${headingColor}`}>
              {headline}
            </h2>
            {description && (
              <p className={`mt-4 text-lg leading-relaxed ${mutedColor}`}>{description}</p>
            )}
            {bullets.length > 0 && (
              <ul className="mt-6 space-y-3">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" />
                    <span className={mutedColor}>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {ctaText && ctaHref && (
              <Button asChild className="mt-8">
                <Link href={ctaHref}>
                  {ctaText}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            )}
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-900">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={imageAlt || ""} className="h-full w-full object-cover" />
            ) : (
              <div className={`flex h-full w-full items-center justify-center ${mutedColor}`}>
                Görsel
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
