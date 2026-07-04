"use client"

import type { CSSProperties } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BenchmarkPreview } from "@/components/admin/benchmark-preview"

export interface BenchmarkDataset {
  name: string
  color: string
  values: number[]
}

export interface BenchmarkChartItem {
  id?: string
  title: string
  chartType: string
  unit: string
  labels: string[]
  datasets: BenchmarkDataset[]
}

export interface BenchmarkChartsProps {
  headline?: string
  description?: string
  charts?: BenchmarkChartItem[]
  columns?: 1 | 2 | 3
  light?: boolean
  demoteHeading?: boolean
}

export function BenchmarkCharts({
  headline,
  description,
  charts = [],
  columns = 2,
  light = false,
  demoteHeading = false,
}: BenchmarkChartsProps) {
  const lightVars = light
    ? ({
        ["--lp-bg" as string]: "#ffffff",
        ["--lp-fg" as string]: "#0a0a0a",
        ["--lp-muted" as string]: "#f5f5f5",
        ["--lp-muted-fg" as string]: "#6b7280",
        ["--lp-border" as string]: "#e5e7eb",
      } as CSSProperties)
    : {}
  const Heading = demoteHeading ? "h3" : "h2"
  const validCharts = charts.filter(
    (c) => c.datasets && c.datasets.length > 0 && c.labels && c.labels.length > 0,
  )

  if (validCharts.length === 0 && !headline) return null

  const gridClass =
    columns === 1 ? "" : columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"

  return (
    <section
      className="relative w-full py-16 md:py-24"
      style={{ backgroundColor: "var(--lp-bg)", color: "var(--lp-fg)", ...lightVars }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-6 lg:px-8">
        {(headline || description) && (
          <div className="mb-10 md:mb-14 text-center">
            {headline && (
              <Heading className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                {headline}
              </Heading>
            )}
            {description && (
              <p
                className="mt-4 max-w-2xl mx-auto text-base md:text-lg"
                style={{ color: "var(--lp-muted-fg)" }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 gap-6 ${gridClass}`}>
          {validCharts.map((chart, i) => (
            <Card key={chart.id || i} className="border-0 ring-0 shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-base text-center">{chart.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <BenchmarkPreview
                  chartType={chart.chartType}
                  unit={chart.unit}
                  labels={chart.labels}
                  datasets={chart.datasets}
                />
                {chart.unit && (
                  <p className="mt-2 text-center text-xs" style={{ color: "var(--lp-muted-fg)" }}>
                    Birim: {chart.unit}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
