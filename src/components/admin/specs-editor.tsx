"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Download,
  AlertTriangle,
  Type,
  AlignLeft,
  ChevronDown as SelectIcon,
} from "lucide-react"
import { getSpecPresets } from "@/lib/actions/spec-preset-actions"
import type { SpecFieldType } from "@/generated/prisma"

// ==========================================
// TYPES
// ==========================================

export interface SpecEntry {
  key: string
  value: string
  type: SpecFieldType
  options?: string[]
}

interface SpecsEditorProps {
  specs: SpecEntry[]
  onChange: (specs: SpecEntry[]) => void
}

interface PresetData {
  id: string
  name: string
  description: string | null
  fields: {
    key: string
    fieldType: SpecFieldType
    options: unknown
    defaultValue: string | null
  }[]
}

const fieldTypeLabels: Record<SpecFieldType, string> = {
  TEXT: "Metin",
  TEXTAREA: "Uzun Metin",
  SELECT: "Seçim",
}

// ==========================================
// COMPONENT
// ==========================================

export function SpecsEditor({ specs, onChange }: SpecsEditorProps) {
  const [entries, setEntries] = useState<SpecEntry[]>(specs)
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [newType, setNewType] = useState<SpecFieldType>("TEXT")
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [presets, setPresets] = useState<PresetData[]>([])
  const [presetsLoaded, setPresetsLoaded] = useState(false)
  const [presetConfirm, setPresetConfirm] = useState<PresetData | null>(null)

  // Load presets from DB
  useEffect(() => {
    if (!presetsLoaded) {
      getSpecPresets().then((data) => {
        setPresets(data)
        setPresetsLoaded(true)
      })
    }
  }, [presetsLoaded])

  function sync(updated: SpecEntry[]) {
    setEntries(updated)
    onChange(updated)
  }

  function updateEntry(index: number, field: keyof SpecEntry, val: string) {
    const copy = [...entries]
    copy[index] = { ...copy[index], [field]: val }
    sync(copy)
  }

  function removeEntry(index: number) {
    sync(entries.filter((_, i) => i !== index))
  }

  function addEntry() {
    if (!newKey.trim()) return
    sync([...entries, { key: newKey.trim(), value: newValue, type: newType, options: undefined }])
    setNewKey("")
    setNewValue("")
    setNewType("TEXT")
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      addEntry()
    }
  }

  function moveEntry(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= entries.length) return
    const copy = [...entries]
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
    sync(copy)
  }

  function handleDragStart(index: number) {
    setDraggedIdx(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === index) return
    const copy = [...entries]
    const [moved] = copy.splice(draggedIdx, 1)
    copy.splice(index, 0, moved)
    setEntries(copy)
    setDraggedIdx(index)
  }

  function handleDragEnd() {
    setDraggedIdx(null)
    onChange(entries)
  }

  function applyPreset(preset: PresetData, mode: "replace" | "merge") {
    const presetEntries: SpecEntry[] = preset.fields.map((f) => ({
      key: f.key,
      value: f.defaultValue || "",
      type: f.fieldType,
      options: Array.isArray(f.options) ? (f.options as string[]) : undefined,
    }))

    if (mode === "replace") {
      sync(presetEntries)
    } else {
      const existingKeys = new Set(entries.map((e) => e.key))
      sync([...entries, ...presetEntries.filter((e) => !existingKeys.has(e.key))])
    }
    setPresetConfirm(null)
  }

  return (
    <div className="space-y-3">
      {/* Preset Selector */}
      {presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-3">
          <Download className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Presetten Yükle:</span>
          {presets.map((preset) => (
            <Dialog
              key={preset.id}
              open={presetConfirm?.id === preset.id}
              onOpenChange={(open) => !open && setPresetConfirm(null)}
            >
              <DialogTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setPresetConfirm(preset)}
                  />
                }
              >
                  {preset.name}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Preset Yükle: {preset.name}</DialogTitle>
                  {preset.description && (
                    <DialogDescription>{preset.description}</DialogDescription>
                  )}
                </DialogHeader>
                <div className="space-y-3">
                  <p className="text-sm">
                    Bu preset <strong>{preset.fields.length}</strong> alan içeriyor.
                  </p>
                  {entries.length > 0 && (
                    <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-950/30">
                      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                      <span>
                        Şu anda <strong>{entries.length}</strong> özellik mevcut.
                        &quot;Değiştir&quot; seçeneği mevcut özellikleri silecek.
                      </span>
                    </div>
                  )}
                  <div className="max-h-48 overflow-y-auto rounded border p-2">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Preset içeriği:
                    </p>
                    {preset.fields.map((f, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        {i + 1}. {f.key}{" "}
                        <span className="text-muted-foreground/50">
                          ({fieldTypeLabels[f.fieldType]})
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPresetConfirm(null)}
                  >
                    İptal
                  </Button>
                  {entries.length > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => applyPreset(preset, "merge")}
                    >
                      Birleştir
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => applyPreset(preset, "replace")}
                  >
                    {entries.length > 0 ? "Değiştir" : "Yükle"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      {/* Entries */}
      {entries.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Henüz özellik eklenmemiş.{" "}
          {presets.length > 0
            ? "Presetten yükleyin veya manuel ekleyin."
            : "Aşağıdan ekleyin."}
        </p>
      ) : (
        <div className="space-y-1">
          <div className="grid grid-cols-[28px_1fr_1fr_72px_36px] gap-1.5 px-1">
            <span />
            <Label className="text-xs text-muted-foreground">Özellik Adı</Label>
            <Label className="text-xs text-muted-foreground">Değer</Label>
            <Label className="text-xs text-center text-muted-foreground">Sıra</Label>
            <span />
          </div>

          {entries.map((entry, i) => {
            const isTextarea = entry.type === "TEXTAREA"

            return (
              <div
                key={`${i}-${entry.key}`}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                className={`rounded-md px-1 py-0.5 transition-colors hover:bg-muted/50 ${
                  draggedIdx === i ? "opacity-50 bg-muted" : ""
                }`}
              >
                {/* Top row: handle, key, (value if not textarea), move, delete */}
                <div className="grid grid-cols-[28px_1fr_1fr_72px_36px] items-center gap-1.5">
                  <div className="flex cursor-grab items-center justify-center active:cursor-grabbing">
                    <GripVertical className="size-4 text-muted-foreground/50" />
                  </div>

                  <Input
                    value={entry.key}
                    onChange={(e) => updateEntry(i, "key", e.target.value)}
                    placeholder="Özellik adı"
                    className="h-8 text-sm"
                  />

                  {isTextarea ? (
                    <span className="text-xs text-muted-foreground italic">
                      Uzun metin (aşağıda)
                    </span>
                  ) : (
                    <SpecValueInput
                      entry={entry}
                      onChange={(val) => updateEntry(i, "value", val)}
                    />
                  )}

                  <div className="flex items-center justify-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      disabled={i === 0}
                      onClick={() => moveEntry(i, -1)}
                    >
                      <ChevronUp className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      disabled={i === entries.length - 1}
                      onClick={() => moveEntry(i, 1)}
                    >
                      <ChevronDown className="size-3.5" />
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => removeEntry(i)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                {/* Textarea below the row */}
                {isTextarea && (
                  <div className="mt-1 pl-[34px] pr-[116px]">
                    <Textarea
                      value={entry.value}
                      onChange={(e) => updateEntry(i, "value", e.target.value)}
                      placeholder="Değer (çok satırlı)"
                      rows={4}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add new */}
      <div className="grid grid-cols-[1fr_1fr_100px_80px] items-end gap-2 border-t pt-3">
        <div className="space-y-1">
          <Label className="text-xs">Özellik Adı</Label>
          <Input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ör: VRAM, CUDA Core"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Değer</Label>
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ör: 48 GB GDDR7"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Tip</Label>
          <Select value={newType} onValueChange={(v) => setNewType(v as SpecFieldType)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEXT">Metin</SelectItem>
              <SelectItem value="TEXTAREA">Uzun</SelectItem>
              <SelectItem value="SELECT">Seçim</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addEntry}
          className="h-9"
        >
          <Plus className="mr-1 size-3" />
          Ekle
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {entries.length} özellik. Sıralamak için sürükleyin veya ok tuşlarını kullanın.
      </p>
    </div>
  )
}

// ==========================================
// Value Input by Type
// ==========================================

function SpecValueInput({
  entry,
  onChange,
}: {
  entry: SpecEntry
  onChange: (value: string) => void
}) {
  switch (entry.type) {
    case "TEXTAREA":
      return (
        <Textarea
          value={entry.value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Değer"
          rows={2}
          className="text-sm"
        />
      )
    case "SELECT":
      if (entry.options && entry.options.length > 0) {
        return (
          <Select value={entry.value} onValueChange={onChange}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Seçin..." />
            </SelectTrigger>
            <SelectContent>
              {entry.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }
      // Fallback to text if no options
      return (
        <Input
          value={entry.value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Değer"
          className="h-8 text-sm"
        />
      )
    default:
      return (
        <Input
          value={entry.value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Değer"
          className="h-8 text-sm"
        />
      )
  }
}
