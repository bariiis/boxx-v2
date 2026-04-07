"use client"

export interface StatItem {
  value: string
  label: string
}

export interface StatsCounterProps {
  headline?: string
  description?: string
  stats?: StatItem[]
  dark?: boolean
}

export function StatsCounter({
  headline,
  description,
  stats = [],
  dark = false,
}: StatsCounterProps) {
  const bg = dark ? "bg-neutral-950" : "bg-white"
  const headingColor = dark ? "text-white" : "text-neutral-900"
  const mutedColor = dark ? "text-neutral-400" : "text-neutral-600"
  const accentColor = dark ? "text-blue-400" : "text-blue-600"
  const borderColor = dark ? "border-neutral-800" : "border-neutral-200"

  return (
    <section className={`relative w-full py-16 md:py-24 ${bg}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {(headline || description) && (
          <div className="mb-12 text-center">
            {headline && (
              <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${headingColor}`}>
                {headline}
              </h2>
            )}
            {description && (
              <p className={`mt-3 max-w-2xl mx-auto ${mutedColor}`}>{description}</p>
            )}
          </div>
        )}

        <div className={`grid gap-px overflow-hidden rounded-2xl border ${borderColor} bg-current/5 sm:grid-cols-2 lg:grid-cols-${Math.min(stats.length || 4, 4)}`}>
          {stats.map((s, i) => (
            <div
              key={i}
              className={`p-8 text-center ${dark ? "bg-neutral-950" : "bg-white"}`}
            >
              <p className={`text-5xl md:text-6xl font-bold tracking-tight ${accentColor}`}>
                {s.value}
              </p>
              <p className={`mt-2 text-sm font-medium ${mutedColor}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
