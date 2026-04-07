"use client"

import { StaggerContainer, StaggerItem } from "./scroll-reveal"

interface FeatureGridItem {
  title: string
  description: string
  icon?: string
}

interface FeatureGridProps {
  headline?: string
  items: FeatureGridItem[]
  columns?: 2 | 3
  dark?: boolean
}

export function FeatureGrid({
  headline,
  items,
  columns = 2,
  dark = true,
}: FeatureGridProps) {
  return (
    <section
      className={`relative overflow-hidden ${
        dark ? "bg-[#0a0a0a] text-white" : "bg-white text-[#0a0a0a]"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-[clamp(5rem,12vh,10rem)] sm:px-8">
        {headline && (
          <StaggerContainer className="mb-16">
            <StaggerItem>
              <h2 className="text-center text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.02em]">
                {headline}
              </h2>
            </StaggerItem>
          </StaggerContainer>
        )}

        <StaggerContainer
          stagger={0.08}
          className={`grid border-t ${
            dark ? "border-neutral-800" : "border-neutral-200"
          } ${
            columns === 3
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "sm:grid-cols-2"
          }`}
        >
          {items.map((item, i) => (
            <StaggerItem key={i}>
              <div
                className={`p-[clamp(2rem,4vw,4rem)] ${
                  dark
                    ? "border-b border-r border-neutral-800"
                    : "border-b border-r border-neutral-200"
                }`}
              >
                {item.icon && (
                  <span className="mb-4 block text-2xl">{item.icon}</span>
                )}
                <h3 className="text-lg font-medium tracking-[-0.01em] sm:text-xl">
                  {item.title}
                </h3>
                <p
                  className={`mt-3 text-sm leading-relaxed sm:text-base ${
                    dark ? "text-neutral-400" : "text-neutral-500"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
