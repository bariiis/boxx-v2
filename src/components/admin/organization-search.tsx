"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function OrganizationSearch({ defaultSearch = "" }: { defaultSearch?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultSearch)

  const updateSearch = useCallback(
    (search: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) {
        params.set("search", search)
      } else {
        params.delete("search")
      }
      params.delete("page")
      router.push(`/admin/organizations?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Ara... (isim, e-posta, telefon)"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          // Debounce
          const timeout = setTimeout(() => updateSearch(e.target.value), 400)
          return () => clearTimeout(timeout)
        }}
        className="pl-10"
      />
    </div>
  )
}
