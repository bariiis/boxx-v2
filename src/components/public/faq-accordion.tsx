"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

function parseHtmlToFaq(html: string): FaqItem[] {
  const items: FaqItem[] = []
  // Split by heading tags (h1-h6, strong in p) to find Q&A pairs
  // Strategy: headings become questions, content between headings becomes answers
  const parts = html.split(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi)

  // parts[0] = content before first heading (skip)
  // parts[1] = first heading text, parts[2] = content after first heading
  // parts[3] = second heading text, parts[4] = content after second heading, etc.
  for (let i = 1; i < parts.length; i += 2) {
    const question = parts[i]?.replace(/<[^>]*>/g, "").trim()
    const answer = parts[i + 1]?.trim()
    if (question && answer) {
      items.push({ question, answer })
    }
  }

  // If no headings found, try splitting by <strong> or <b> tags in paragraphs
  if (items.length === 0) {
    const strongParts = html.split(/<p[^>]*>\s*<strong>(.*?)<\/strong>\s*<\/p>/gi)
    for (let i = 1; i < strongParts.length; i += 2) {
      const question = strongParts[i]?.replace(/<[^>]*>/g, "").trim()
      const answer = strongParts[i + 1]?.trim()
      if (question && answer) {
        items.push({ question, answer })
      }
    }
  }

  return items
}

export function FaqAccordion({ html }: { html: string }) {
  const items = parseHtmlToFaq(html)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (items.length === 0) {
    // Fallback: render as regular HTML if parsing fails
    return (
      <div
        className="prose prose-sm sm:prose-base max-w-none prose-headings:font-bold prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <div className="divide-y">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/50"
            >
              <span className="text-base font-medium">{item.question}</span>
              <ChevronDown
                className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div
                  className="px-6 pb-5 prose prose-sm max-w-none prose-a:text-primary text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
