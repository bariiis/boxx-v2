"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Star, Check, GripVertical } from "lucide-react"
import {
  createConfiguratorOption,
  updateConfiguratorOption,
  deleteConfiguratorOption,
  reorderConfiguratorOptions,
  listComponentCandidates,
  setSingleSelectCategory,
} from "@/lib/actions/configurator-actions"
import { useRouter } from "next/navigation"

// ============================================================
// CATEGORY DEFINITIONS
// ============================================================

type CategoryDef = {
  id: string
  label: string
  componentType?: string // filter for candidate picker
  affectsResources: boolean
}

const CATEGORIES: CategoryDef[] = [
  // Hardware (resource consumers)
  { id: "cpu", label: "CPU", componentType: "cpu", affectsResources: true },
  { id: "gpu", label: "GPU", componentType: "gpu", affectsResources: true },
  { id: "ram", label: "RAM", componentType: "ram", affectsResources: true },
  { id: "nvme_os", label: "OS Disk (NVMe)", componentType: "nvme", affectsResources: true },
  { id: "nvme", label: "NVMe Disk", componentType: "nvme", affectsResources: true },
  { id: "ssd", label: "2.5\" SSD", componentType: "ssd", affectsResources: true },
  { id: "hdd", label: "3.5\" HDD", componentType: "hdd", affectsResources: true },
  { id: "psu", label: "Güç Kaynağı", componentType: "psu", affectsResources: true },
  { id: "cooling", label: "Soğutma", componentType: "cooling", affectsResources: true },
  { id: "expansion_card", label: "Genişleme Kartı", componentType: "expansion_card", affectsResources: true },
  { id: "network_card", label: "Ağ Kartı", componentType: "network_card", affectsResources: true },
  // Configuration
  { id: "os", label: "İşletim Sistemi", componentType: "os", affectsResources: false },
  { id: "raid_config", label: "RAID Konfigürasyonu", affectsResources: false },
  { id: "power_cable", label: "Güç Kablosu", affectsResources: false },
  // Add-ons
  { id: "warranty", label: "Garanti", affectsResources: false },
  { id: "service", label: "Servis", affectsResources: false },
  { id: "software_license", label: "Yazılım Lisansı", affectsResources: false },
  { id: "peripheral", label: "Çevre Birimi", affectsResources: false },
  { id: "rack_kit", label: "Rack Kiti", affectsResources: false },
  { id: "shipping", label: "Kargo", affectsResources: false },
  { id: "customization", label: "Kişiselleştirme", affectsResources: false },
]

// ============================================================
// TYPES
// ============================================================

type SpecsJson = unknown

function readSpec(specs: SpecsJson, key: string): string | undefined {
  if (!Array.isArray(specs)) return undefined
  const hit = (specs as { key: string; value: string }[]).find((e) => e?.key === key)
  return hit?.value
}

type Option = {
  id: string
  basekitId: string
  componentId: string
  category: string
  priceDelta: number
  isDefault: boolean
  isRecommended: boolean
  affectsResources: boolean
  minQty: number
  maxQty: number | null
  sortOrder: number
  component: {
    id: string
    name: string
    sku: string
    price: number
    specs: SpecsJson
  }
}

type Candidate = {
  id: string
  name: string
  sku: string
  price: number
  specs: SpecsJson
}

interface Props {
  basekitId: string
  options: Option[]
  singleSelectCategories: string[]
}

// ============================================================
// COMPONENT
// ============================================================

export function ConfiguratorOptionsManager({
  basekitId,
  options,
  singleSelectCategories,
}: Props) {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id)
  const [pending, startTransition] = useTransition()
  const [singleSet, setSingleSet] = useState<Set<string>>(
    () => new Set(singleSelectCategories)
  )

  const def = CATEGORIES.find((c) => c.id === activeCategory)!
  const filtered = useMemo(
    () => options.filter((o) => o.category === activeCategory),
    [options, activeCategory]
  )

  const counts = useMemo(() => {
    const m: Record<string, number> = {}
    for (const o of options) m[o.category] = (m[o.category] ?? 0) + 1
    return m
  }, [options])

  function refresh() {
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === c.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/70"
            }`}
          >
            {c.label}
            {counts[c.id] ? (
              <span className="ml-1.5 opacity-70">({counts[c.id]})</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Options list */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">{def.label} Seçenekleri</CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={singleSet.has(def.id)}
                disabled={pending}
                onCheckedChange={(v) => {
                  const next = new Set(singleSet)
                  if (v) next.add(def.id)
                  else next.delete(def.id)
                  setSingleSet(next)
                  startTransition(async () => {
                    await setSingleSelectCategory(basekitId, def.id, v)
                    refresh()
                  })
                }}
              />
              <Label className="text-xs text-muted-foreground">
                Tek Seçim (radio)
              </Label>
            </div>
            <AddOptionDialog
              basekitId={basekitId}
              category={def}
              existingComponentIds={new Set(filtered.map((o) => o.componentId))}
              onAdded={refresh}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Bu kategoride henüz seçenek yok. Yukarıdan ekleyin.
            </p>
          )}
          <DraggableOptionList
            basekitId={basekitId}
            options={filtered}
            pending={pending}
            onUpdate={(id, data) =>
              startTransition(async () => {
                await updateConfiguratorOption(id, data)
                refresh()
              })
            }
            onDelete={(id, name) =>
              startTransition(async () => {
                if (!confirm(`"${name}" silinsin mi?`)) return
                await deleteConfiguratorOption(id)
                refresh()
              })
            }
            onReorder={(ids) =>
              startTransition(async () => {
                await reorderConfiguratorOptions(basekitId, ids)
                refresh()
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================
// DRAGGABLE OPTION LIST
// ============================================================

function DraggableOptionList({
  basekitId,
  options,
  pending,
  onUpdate,
  onDelete,
  onReorder,
}: {
  basekitId: string
  options: Option[]
  pending: boolean
  onUpdate: (id: string, data: Partial<Option>) => void
  onDelete: (id: string, name: string) => void
  onReorder: (ids: string[]) => void
}) {
  const [items, setItems] = useState(options)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  // Sync when props change
  useEffect(() => {
    setItems(options)
  }, [options])

  function handleDragStart(index: number) {
    setDraggedIdx(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === index) return
    const copy = [...items]
    const [moved] = copy.splice(draggedIdx, 1)
    copy.splice(index, 0, moved)
    setItems(copy)
    setDraggedIdx(index)
  }

  function handleDragEnd() {
    setDraggedIdx(null)
    const ids = items.map((o) => o.id)
    // Only save if order actually changed
    const originalIds = options.map((o) => o.id)
    if (ids.some((id, i) => id !== originalIds[i])) {
      onReorder(ids)
    }
  }

  return (
    <div className="space-y-2">
      {items.map((opt, i) => (
        <div
          key={opt.id}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDragEnd={handleDragEnd}
          className={`transition-opacity ${draggedIdx === i ? "opacity-50" : ""}`}
        >
          <OptionRow
            opt={opt}
            disabled={pending}
            onUpdate={(data) => onUpdate(opt.id, data)}
            onDelete={() => onDelete(opt.id, opt.component.name)}
          />
        </div>
      ))}
    </div>
  )
}

// ============================================================
// OPTION ROW
// ============================================================

function OptionRow({
  opt,
  disabled,
  onUpdate,
  onDelete,
}: {
  opt: Option
  disabled: boolean
  onUpdate: (data: Partial<Option>) => void
  onDelete: () => void
}) {
  const [priceDelta, setPriceDelta] = useState(opt.priceDelta / 100)
  const [maxQty, setMaxQty] = useState<string>(opt.maxQty?.toString() ?? "")
  const [defaultQty, setDefaultQty] = useState<string>(opt.minQty?.toString() ?? "0")

  function commitPrice() {
    const cents = Math.round(priceDelta * 100)
    if (cents !== opt.priceDelta) onUpdate({ priceDelta: cents })
  }

  function commitMaxQty() {
    const n = maxQty.trim() === "" ? null : Number(maxQty)
    if (n !== opt.maxQty) onUpdate({ maxQty: n })
  }

  function commitDefaultQty() {
    const n = Number(defaultQty) || 0
    if (n !== opt.minQty) onUpdate({ minQty: n })
  }

  const specs = opt.component.specs
  const specBadges: string[] = []
  const tdp = readSpec(specs, "tdpWatts")
  const slot = readSpec(specs, "pcieSlotWidth")
  const ramGb = readSpec(specs, "ramCapacityGb")
  const storGb = readSpec(specs, "storageGb")
  const psuW = readSpec(specs, "psuWatts")
  if (tdp) specBadges.push(`${tdp}W TDP`)
  if (slot) specBadges.push(`${slot} slot`)
  if (ramGb) specBadges.push(`${ramGb}GB`)
  if (storGb) specBadges.push(`${storGb}GB`)
  if (psuW) specBadges.push(`${psuW}W PSU`)

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3 hover:bg-muted/30">
      <div className="flex cursor-grab items-center active:cursor-grabbing">
        <GripVertical className="size-4 text-muted-foreground/50" />
      </div>
      <div className="flex-1 min-w-[200px]">
        <div className="flex items-center gap-2">
          <span className="font-medium">{opt.component.name}</span>
          {opt.isDefault && (
            <Badge variant="secondary" className="text-[10px]">
              Varsayılan
            </Badge>
          )}
          {opt.isRecommended && (
            <Badge className="text-[10px]">
              <Star className="mr-1 size-2.5" />
              Önerilen
            </Badge>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="font-mono">{opt.component.sku}</span>
          {specBadges.map((b, i) => (
            <span key={i} className="rounded bg-muted px-1.5 py-0.5">
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-[11px] text-muted-foreground">Δ Fiyat ($)</Label>
        <Input
          type="number"
          step="0.01"
          value={priceDelta}
          onChange={(e) => setPriceDelta(Number(e.target.value) || 0)}
          onBlur={commitPrice}
          className="h-8 w-24 text-xs"
          disabled={disabled}
        />
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-[11px] text-muted-foreground">Max</Label>
        <Input
          type="text"
          placeholder="auto"
          value={maxQty}
          onChange={(e) => setMaxQty(e.target.value)}
          onBlur={commitMaxQty}
          className="h-8 w-16 text-xs"
          disabled={disabled}
        />
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-[11px] text-muted-foreground">Vars. Adet</Label>
        <Input
          type="number"
          min="0"
          value={defaultQty}
          onChange={(e) => setDefaultQty(e.target.value)}
          onBlur={commitDefaultQty}
          className="h-8 w-16 text-xs"
          disabled={disabled}
        />
      </div>

      <div className="flex items-center gap-1.5">
        <Switch
          checked={opt.isDefault}
          onCheckedChange={(v) => onUpdate({ isDefault: v })}
          disabled={disabled}
        />
        <Label className="text-[11px]">Default</Label>
      </div>

      <div className="flex items-center gap-1.5">
        <Switch
          checked={opt.isRecommended}
          onCheckedChange={(v) => onUpdate({ isRecommended: v })}
          disabled={disabled}
        />
        <Label className="text-[11px]">Önerilen</Label>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground hover:text-destructive"
        onClick={onDelete}
        disabled={disabled}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  )
}

// ============================================================
// ADD OPTION DIALOG
// ============================================================

function AddOptionDialog({
  basekitId,
  category,
  existingComponentIds,
  onAdded,
}: {
  basekitId: string
  category: CategoryDef
  existingComponentIds: Set<string>
  onAdded: () => void
}) {
  const [open, setOpen] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [adding, setAdding] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    listComponentCandidates(category.componentType)
      .then(setCandidates)
      .finally(() => setLoading(false))
  }, [open, category.componentType])

  const filtered = candidates.filter(
    (c) =>
      c.id !== basekitId &&
      !existingComponentIds.has(c.id) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
       c.sku.toLowerCase().includes(search.toLowerCase()))
  )

  async function add(component: Candidate) {
    setAdding(component.id)
    try {
      await createConfiguratorOption({
        basekitId,
        componentId: component.id,
        category: category.id,
        priceDelta: Math.round(component.price * 100),
        affectsResources: category.affectsResources,
      })
      onAdded()
      setOpen(false)
    } catch (e) {
      alert((e as Error).message || "Eklenemedi")
    } finally {
      setAdding(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            <Plus className="mr-1 size-4" />
            {category.label} Ekle
          </Button>
        }
      />
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{category.label} Seçeneği Ekle</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Ürün ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />
        <div className="max-h-[60vh] space-y-1 overflow-y-auto">
          {loading && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Yükleniyor...
            </p>
          )}
          {!loading && filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {category.componentType
                ? `"${category.componentType}" tipinde uygun ürün yok. Önce ürün oluşturun ve ComponentSpec → componentType alanını doldurun.`
                : "Uygun ürün yok."}
            </p>
          )}
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => add(c)}
              disabled={adding === c.id}
              className="flex w-full items-center justify-between rounded border px-3 py-2 text-left text-sm hover:border-primary hover:bg-muted/30 disabled:opacity-50"
            >
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  <span className="font-mono">{c.sku}</span>
                  {readSpec(c.specs, "tdpWatts") && (
                    <span className="ml-2">{readSpec(c.specs, "tdpWatts")}W</span>
                  )}
                  {readSpec(c.specs, "pcieSlotWidth") && (
                    <span className="ml-2">{readSpec(c.specs, "pcieSlotWidth")} slot</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs">${c.price.toFixed(2)}</span>
                {adding === c.id ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <Plus className="size-4 text-muted-foreground" />
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
