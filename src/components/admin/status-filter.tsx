import Link from "next/link"

interface StatusFilterProps {
  basePath: string
  config: Record<string, { label: string; class: string }>
  currentStatus: string | null
  searchParams?: Record<string, string>
}

export function StatusFilter({ basePath, config, currentStatus, searchParams = {} }: StatusFilterProps) {
  function buildHref(status: string | null) {
    const params = new URLSearchParams(searchParams)
    params.delete("page")
    if (status) {
      params.set("status", status)
    } else {
      params.delete("status")
    }
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const allActive = !currentStatus

  return (
    <div className="flex flex-wrap gap-1.5">
      <Link
        href={buildHref(null)}
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          allActive
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        Tümü
      </Link>
      {Object.entries(config).map(([key, val]) => {
        const isActive = currentStatus === key
        return (
          <Link
            key={key}
            href={buildHref(key)}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? `${val.class} ring-2 ring-offset-1 ring-current`
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {val.label}
          </Link>
        )
      })}
    </div>
  )
}
