"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { searchOrganizations } from "@/lib/actions/organization-actions"

interface Org {
  id: string
  name: string
  email: string | null
  type: string
}

interface OrganizationComboboxProps {
  value?: string | null
  defaultLabel?: string
  onSelect: (id: string | null) => void
}

export function OrganizationCombobox({
  value,
  defaultLabel,
  onSelect,
}: OrganizationComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Org[]>([])
  const [selectedLabel, setSelectedLabel] = useState(defaultLabel || "")

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      return
    }
    const data = await searchOrganizations(q)
    setResults(data)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => search(query), 300)
    return () => clearTimeout(timeout)
  }, [query, search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {selectedLabel || "Organizasyon seçin..."}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Organizasyon ara..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {query.length < 2 ? "En az 2 karakter yazın..." : "Sonuç bulunamadı."}
            </CommandEmpty>
            <CommandGroup>
              {results.map((org) => (
                <CommandItem
                  key={org.id}
                  value={org.id}
                  onSelect={() => {
                    const newValue = org.id === value ? null : org.id
                    onSelect(newValue)
                    setSelectedLabel(newValue ? org.name : "")
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === org.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <p className="font-medium">{org.name}</p>
                    {org.email && (
                      <p className="text-xs text-muted-foreground">{org.email}</p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
