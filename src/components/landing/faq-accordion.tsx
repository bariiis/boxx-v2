"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqAccordionProps {
  headline?: string
  description?: string
  items?: FaqItem[]
  dark?: boolean
}

export function FaqAccordion({
  headline = "Sıkça Sorulan Sorular",
  description,
  items = [],
  dark = false,
}: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0)
  const bg = dark ? "bg-neutral-950" : "bg-white"
  const headingColor = dark ? "text-white" : "text-neutral-900"
  const mutedColor = dark ? "text-neutral-400" : "text-neutral-600"
  const borderColor = dark ? "border-neutral-800" : "border-neutral-200"
  const cardBg = dark ? "bg-neutral-900" : "bg-neutral-50"

  return (
    <section className={`relative w-full py-16 md:py-24 ${bg}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${headingColor}`}>
            {headline}
          </h2>
          {description && (
            <p className={`mt-3 ${mutedColor}`}>{description}</p>
          )}
        </div>

        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={`rounded-2xl border ${borderColor} ${cardBg} transition-colors`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className={`font-medium ${headingColor}`}>{item.question}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 ${mutedColor} transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className={`px-6 pb-5 leading-relaxed ${mutedColor}`}>
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
