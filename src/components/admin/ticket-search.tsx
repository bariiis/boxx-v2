"use client"

import { useRouter } from "next/navigation"
import { useState, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function TicketSearch({ defaultSearch = "", status }: { defaultSearch?: string; status?: string }) {
  const router = useRouter()
  const [value, setValue] = useState(defaultSearch)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const navigate = useCallback(
    (search: string) => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (status) params.set("status", status)
      router.push(`/admin/tickets?${params.toString()}`)
    },
    [router, status]
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setValue(v)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => navigate(v), 400)
  }

  return (
    <div className="relative max-w-sm flex-1">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder="Talep no, konu, organizasyon..." value={value} onChange={handleChange} className="pl-10" />
    </div>
  )
}
