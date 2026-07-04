"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type Cat = { id: string; name: string; depth: number; parentId: string | null }

interface Props {
  categories: Cat[]
  selectedId?: string
  search?: string
  type?: string
}

export function ProductCategoryFilter({ categories, selectedId, search, type }: Props) {
  const router = useRouter()

  // Walk up parent chain from selectedId to determine current parent + sub
  const { initialParent, initialSub } = useMemo(() => {
    if (!selectedId) return { initialParent: "", initialSub: "" }
    const sel = categories.find((c) => c.id === selectedId)
    if (!sel) return { initialParent: "", initialSub: "" }
    if (!sel.parentId) return { initialParent: sel.id, initialSub: "" }
    return { initialParent: sel.parentId, initialSub: sel.id }
  }, [categories, selectedId])

  const [parentId, setParentId] = useState(initialParent)
  const [subId, setSubId] = useState(initialSub)

  const parents = categories.filter((c) => c.parentId === null)
  const subs = parentId
    ? categories.filter((c) => c.parentId === parentId)
    : []

  function applyFilter(parent: string, sub: string) {
    const target = sub || parent || undefined
    const qp = new URLSearchParams()
    if (search) qp.set("search", search)
    if (type) qp.set("type", type)
    if (target) qp.set("category", target)
    const qs = qp.toString()
    router.push(`/admin/products${qs ? `?${qs}` : ""}`)
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={parentId}
        onChange={(e) => {
          const next = e.target.value
          setParentId(next)
          setSubId("")
          applyFilter(next, "")
        }}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">Tüm kategoriler</option>
        {parents.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {parentId && subs.length > 0 && (
        <select
          value={subId}
          onChange={(e) => {
            const next = e.target.value
            setSubId(next)
            applyFilter(parentId, next)
          }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Tüm alt kategoriler</option>
          {subs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      {(parentId || subId) && (
        <button
          type="button"
          onClick={() => {
            setParentId("")
            setSubId("")
            applyFilter("", "")
          }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Temizle
        </button>
      )}
    </div>
  )
}
