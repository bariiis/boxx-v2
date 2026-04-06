"use client"

import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts"

interface Dataset {
  name: string
  color: string
  values: number[]
}

interface BenchmarkPreviewProps {
  chartType: string
  unit: string
  labels: string[]
  datasets: Dataset[]
}

export function BenchmarkPreview({ chartType, unit, labels, datasets }: BenchmarkPreviewProps) {
  // Transform data for recharts
  const data = labels.map((label, i) => {
    const row: Record<string, string | number> = { label }
    datasets.forEach((ds) => {
      row[ds.name] = ds.values[i] ?? 0
    })
    return row
  })

  const tooltipFormatter = (v: unknown) => [`${v} ${unit}`, ""]

  if (chartType === "radar") {
    return (
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="label" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} />
            {datasets.map((ds) => (
              <Radar key={ds.name} name={ds.name} dataKey={ds.name} stroke={ds.color} fill={ds.color} fillOpacity={0.2} />
            ))}
            <Legend />
            <Tooltip formatter={tooltipFormatter} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === "line") {
    return (
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            {datasets.map((ds) => (
              <Line key={ds.name} name={ds.name} type="monotone" dataKey={ds.name} stroke={ds.color} strokeWidth={2} dot={{ r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === "area") {
    return (
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            {datasets.map((ds) => (
              <Area key={ds.name} name={ds.name} type="monotone" dataKey={ds.name} stroke={ds.color} fill={ds.color} fillOpacity={0.15} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === "vertical-bar") {
    return (
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            {datasets.map((ds) => (
              <Bar key={ds.name} name={ds.name} dataKey={ds.name} fill={ds.color} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Default: horizontal bar
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 120 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="label" width={120} tick={{ fontSize: 11 }} />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          {datasets.map((ds) => (
            <Bar key={ds.name} name={ds.name} dataKey={ds.name} fill={ds.color} radius={[0, 4, 4, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
