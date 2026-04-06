"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BenchmarkPreview } from "@/components/admin/benchmark-preview"

interface Dataset {
  name: string
  color: string
  values: number[]
}

interface ChartData {
  id: string
  title: string
  chartType: string
  unit: string
  labels: string[]
  datasets: Dataset[]
}

export function SolutionBenchmarkChart({ chart }: { chart: ChartData }) {
  if (chart.datasets.length === 0 || chart.labels.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{chart.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <BenchmarkPreview
          chartType={chart.chartType}
          unit={chart.unit}
          labels={chart.labels}
          datasets={chart.datasets}
        />
        <p className="mt-2 text-right text-xs text-muted-foreground">
          Birim: {chart.unit}
        </p>
      </CardContent>
    </Card>
  )
}
