"use client"

import { useEffect, useState } from "react"

interface SectionItem {
  key: string
  label: string
}

export function SolutionSectionNav({ sections }: { sections: SectionItem[] }) {
  const [activeKey, setActiveKey] = useState(sections[0]?.key || "")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveKey(entry.target.id)
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    )

    for (const s of sections) {
      const el = document.getElementById(s.key)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sections])

  return (
    <nav className="sticky top-24">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        İçindekiler
      </p>
      <ul className="space-y-1 border-l">
        {sections.map((s) => {
          const isActive = activeKey === s.key
          return (
            <li key={s.key}>
              <a
                href={`#${s.key}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(s.key)?.scrollIntoView({ behavior: "smooth" })
                }}
                className={`block border-l-2 py-1.5 pl-4 text-sm transition-colors -ml-px ${
                  isActive
                    ? "border-foreground text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                }`}
              >
                {s.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
