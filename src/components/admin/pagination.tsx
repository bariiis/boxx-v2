import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  basePath: string
  currentPage: number
  totalPages: number
  searchParams?: Record<string, string>
}

export function AdminPagination({ basePath, currentPage, totalPages, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(page))
    return `${basePath}?${params.toString()}`
  }

  // Show max 7 page buttons with ellipsis
  const pages: (number | "...")[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push("...")
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push("...")
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={buildHref(currentPage - 1)}>
            <ChevronLeft className="size-4" />
          </Link>
        ) : (
          <span><ChevronLeft className="size-4" /></span>
        )}
      </Button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-xs text-muted-foreground">...</span>
        ) : (
          <Button
            key={p}
            variant={currentPage === p ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 text-xs"
            asChild
          >
            <Link href={buildHref(p)}>{p}</Link>
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        className="size-8"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={buildHref(currentPage + 1)}>
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span><ChevronRight className="size-4" /></span>
        )}
      </Button>
    </div>
  )
}
