"use client"

import { useState, useEffect } from "react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { getContacts } from "@/lib/actions/contact-actions"

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string | null
}

interface ContactSelectorProps {
  organizationId: string | null
  value: string | null
  defaultLabel?: string
  onSelect: (id: string | null) => void
}

export function ContactSelector({
  organizationId,
  value,
  defaultLabel,
  onSelect,
}: ContactSelectorProps) {
  const [result, setResult] = useState<{ orgId: string; contacts: Contact[] } | null>(null)

  useEffect(() => {
    if (!organizationId) return
    let cancelled = false
    getContacts({ organizationId, limit: 50 }).then(({ contacts }) => {
      if (!cancelled) setResult({ orgId: organizationId, contacts })
    })
    return () => {
      cancelled = true
    }
  }, [organizationId])

  // Derived during render: stale results from another org are ignored
  const contacts = organizationId && result?.orgId === organizationId ? result.contacts : []
  const loading = !!organizationId && result?.orgId !== organizationId

  if (!organizationId) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Önce organizasyon seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-">-</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  return (
    <Select value={value || ""} onValueChange={(v) => onSelect(v || null)}>
      <SelectTrigger>
        <SelectValue placeholder={loading ? "Yükleniyor..." : "Kişi seçin"} />
      </SelectTrigger>
      <SelectContent>
        {contacts.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.firstName} {c.lastName} {c.email && `(${c.email})`}
          </SelectItem>
        ))}
        {contacts.length === 0 && !loading && (
          <SelectItem value="-" disabled>Bu organizasyonda kişi yok</SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
