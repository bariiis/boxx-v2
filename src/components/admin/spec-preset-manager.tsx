"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Trash2,
  Pencil,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ListChecks,
  Type,
  AlignLeft,
  ChevronDown as ChevronDownIcon,
  X,
} from "lucide-react"
import {
  createSpecPreset,
  updateSpecPreset,
  deleteSpecPreset,
  addPresetField,
  updatePresetField,
  deletePresetField,
  reorderPresetFields,
} from "@/lib/actions/spec-preset-actions"
import { toast } from "sonner"
import type { SpecFieldType } from "@/generated/prisma"

interface PresetField {
  id: string
  key: string
  fieldType: SpecFieldType
  options: unknown
  defaultValue: string | null
  sortOrder: number
}

interface Preset {
  id: string
  name: string
  description: string | null
  sortOrder: number
  fields: PresetField[]
}

const fieldTypeLabels: Record<SpecFieldType, string> = {
  TEXT: "Kısa Metin",
  TEXTAREA: "Uzun Metin",
  SELECT: "Açılır Liste",
}

const fieldTypeIcons: Record<SpecFieldType, typeof Type> = {
  TEXT: Type,
  TEXTAREA: AlignLeft,
  SELECT: ChevronDownIcon,
}

export function SpecPresetManager({ presets: initialPresets }: { presets: Preset[] }) {
  const router = useRouter()
  const [presets, setPresets] = useState(initialPresets)
  const [selectedId, setSelectedId] = useState<string | null>(
    initialPresets[0]?.id || null
  )
  const [newPresetOpen, setNewPresetOpen] = useState(false)
  const [editPresetOpen, setEditPresetOpen] = useState(false)
  const [deletePresetId, setDeletePresetId] = useState<string | null>(null)

  const selected = presets.find((p) => p.id === selectedId) || null

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Left: Preset List */}
      <div className="space-y-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Presetler</CardTitle>
              <NewPresetDialog
                open={newPresetOpen}
                onOpenChange={setNewPresetOpen}
                onCreated={(preset) => {
                  setPresets((prev) => [...prev, { ...preset, fields: [] }])
                  setSelectedId(preset.id)
                  setNewPresetOpen(false)
                }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {presets.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Henüz preset oluşturulmamış.
              </p>
            ) : (
              presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedId(preset.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    selectedId === preset.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div>
                    <p className="font-medium">{preset.name}</p>
                    <p
                      className={`text-xs ${
                        selectedId === preset.id
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {preset.fields.length} alan
                    </p>
                  </div>
                  <ListChecks className="size-4 opacity-50" />
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Selected Preset Fields */}
      <div>
        {selected ? (
          <PresetDetail
            preset={selected}
            onUpdate={(updated) => {
              setPresets((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
              )
            }}
            onDelete={() => {
              setPresets((prev) => prev.filter((p) => p.id !== selected.id))
              setSelectedId(presets.find((p) => p.id !== selected.id)?.id || null)
            }}
          />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ListChecks className="mb-4 size-12 text-muted-foreground/20" />
              <p className="text-muted-foreground">
                {presets.length === 0
                  ? 'İlk presetinizi oluşturmak için "Yeni Preset" butonuna tıklayın.'
                  : "Sol taraftan bir preset seçin."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// ==========================================
// New Preset Dialog
// ==========================================

function NewPresetDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (preset: { id: string; name: string; description: string | null; sortOrder: number }) => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const preset = await createSpecPreset({
        name: fd.get("name") as string,
        description: (fd.get("description") as string) || undefined,
      })
      toast.success("Preset oluşturuldu")
      onCreated(preset)
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button size="sm" variant="outline" className="h-7" />}>
          <Plus className="mr-1 size-3" />
          Yeni
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yeni Preset</DialogTitle>
            <DialogDescription>
              Ürün teknik özellikleri için yeni bir şablon oluşturun.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Adı *</Label>
              <Input
                id="preset-name"
                name="name"
                required
                placeholder="ör: İş İstasyonu, GPU Sunucu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preset-desc">Açıklama</Label>
              <Input
                id="preset-desc"
                name="description"
                placeholder="ör: Temel iş istasyonu konfigürasyonu"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ==========================================
// Preset Detail (Fields Management)
// ==========================================

function PresetDetail({
  preset,
  onUpdate,
  onDelete,
}: {
  preset: Preset
  onUpdate: (updated: Preset) => void
  onDelete: () => void
}) {
  const router = useRouter()
  const [fields, setFields] = useState(preset.fields)
  const [presetId, setPresetId] = useState(preset.id)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [editFieldId, setEditFieldId] = useState<string | null>(null)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Sync when preset changes
  if (preset.id !== presetId) {
    setPresetId(preset.id)
    setFields(preset.fields)
    setEditFieldId(null)
    setAddOpen(false)
  }

  async function handleDeletePreset() {
    setDeleting(true)
    try {
      await deleteSpecPreset(preset.id)
      toast.success("Preset silindi")
      onDelete()
    } catch {
      toast.error("Silme başarısız")
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  async function handleEditPreset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await updateSpecPreset(preset.id, {
        name: fd.get("name") as string,
        description: (fd.get("description") as string) || undefined,
      })
      toast.success("Preset güncellendi")
      setEditOpen(false)
      router.refresh()
    } catch {
      toast.error("Hata oluştu")
    }
  }

  async function handleAddField(data: {
    key: string
    fieldType: SpecFieldType
    options?: string[]
    defaultValue?: string
  }) {
    try {
      const field = await addPresetField(preset.id, data)
      const updated = [...fields, field]
      setFields(updated)
      onUpdate({ ...preset, fields: updated })
      toast.success("Alan eklendi")
      setAddOpen(false)
    } catch {
      toast.error("Hata oluştu")
    }
  }

  async function handleUpdateField(
    id: string,
    data: {
      key?: string
      fieldType?: SpecFieldType
      options?: string[] | null
      defaultValue?: string | null
    }
  ) {
    try {
      const updated = await updatePresetField(id, data)
      const newFields = fields.map((f) => (f.id === id ? updated : f))
      setFields(newFields)
      onUpdate({ ...preset, fields: newFields })
      toast.success("Alan güncellendi")
      setEditFieldId(null)
    } catch {
      toast.error("Hata oluştu")
    }
  }

  async function handleDeleteField(id: string) {
    try {
      await deletePresetField(id)
      const newFields = fields.filter((f) => f.id !== id)
      setFields(newFields)
      onUpdate({ ...preset, fields: newFields })
      toast.success("Alan silindi")
    } catch {
      toast.error("Silme başarısız")
    }
  }

  async function moveField(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= fields.length) return
    const copy = [...fields]
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
    setFields(copy)
    onUpdate({ ...preset, fields: copy })
    await reorderPresetFields(
      preset.id,
      copy.map((f) => f.id)
    )
  }

  function handleDragStart(index: number) {
    setDraggedIdx(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === index) return
    const copy = [...fields]
    const [moved] = copy.splice(draggedIdx, 1)
    copy.splice(index, 0, moved)
    setFields(copy)
    setDraggedIdx(index)
  }

  async function handleDragEnd() {
    setDraggedIdx(null)
    onUpdate({ ...preset, fields })
    await reorderPresetFields(
      preset.id,
      fields.map((f) => f.id)
    )
  }

  return (
    <Card key={preset.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{preset.name}</CardTitle>
            {preset.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {preset.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {/* Edit Preset */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger render={<Button size="sm" variant="outline" />}>
                  <Pencil className="mr-1 size-3" />
                  Düzenle
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleEditPreset}>
                  <DialogHeader>
                    <DialogTitle>Preseti Düzenle</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Preset Adı *</Label>
                      <Input name="name" required defaultValue={preset.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>Açıklama</Label>
                      <Input
                        name="description"
                        defaultValue={preset.description || ""}
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                      İptal
                    </Button>
                    <Button type="submit">Kaydet</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Delete Preset */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger render={<Button size="sm" variant="destructive" />}>
                  <Trash2 className="size-3" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Preseti Sil</DialogTitle>
                  <DialogDescription>
                    &quot;{preset.name}&quot; presetini ve tüm alanlarını silmek istediğinize emin misiniz?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                    İptal
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeletePreset}
                    disabled={deleting}
                  >
                    {deleting ? "Siliniyor..." : "Sil"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Fields Header */}
        {fields.length > 0 && (
          <div className="grid grid-cols-[28px_1fr_120px_120px_72px_36px] items-center gap-2 px-1 text-xs font-medium text-muted-foreground">
            <span />
            <span>Alan Adı</span>
            <span>Tip</span>
            <span>Varsayılan</span>
            <span className="text-center">Sıra</span>
            <span />
          </div>
        )}

        {/* Field Rows */}
        {fields.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Bu presette henüz alan yok. Aşağıdan alan ekleyin.
          </p>
        ) : (
          <div className="space-y-1">
            {fields.map((field, i) => {
              const Icon = fieldTypeIcons[field.fieldType]
              const opts = Array.isArray(field.options)
                ? (field.options as string[])
                : []

              if (editFieldId === field.id) {
                return (
                  <FieldEditRow
                    key={field.id}
                    field={field}
                    onSave={(data) => handleUpdateField(field.id, data)}
                    onCancel={() => setEditFieldId(null)}
                  />
                )
              }

              return (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                  className={`grid grid-cols-[28px_1fr_120px_120px_72px_36px] items-center gap-2 rounded-md px-1 py-1.5 transition-colors hover:bg-muted/50 ${
                    draggedIdx === i ? "opacity-50 bg-muted" : ""
                  }`}
                >
                  <div className="flex cursor-grab items-center justify-center active:cursor-grabbing">
                    <GripVertical className="size-4 text-muted-foreground/50" />
                  </div>
                  <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => setEditFieldId(field.id)}
                  >
                    <span className="text-sm font-medium">{field.key}</span>
                    {opts.length > 0 && (
                      <Badge variant="outline" className="text-[10px]">
                        {opts.length} seçenek
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon className="size-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {fieldTypeLabels[field.fieldType]}
                    </span>
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {field.defaultValue || "—"}
                  </span>
                  <div className="flex items-center justify-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      disabled={i === 0}
                      onClick={() => moveField(i, -1)}
                    >
                      <ChevronUp className="size-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      disabled={i === fields.length - 1}
                      onClick={() => moveField(i, 1)}
                    >
                      <ChevronDown className="size-3" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteField(field.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        {/* Add Field */}
        <div className="border-t pt-4">
          {addOpen ? (
            <FieldAddRow
              onSave={handleAddField}
              onCancel={() => setAddOpen(false)}
            />
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="mr-1 size-3" />
              Alan Ekle
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {fields.length} alan. Sıralamak için sürükleyin veya ok tuşlarını kullanın.
          Alan adına tıklayarak düzenleyin.
        </p>
      </CardContent>
    </Card>
  )
}

// ==========================================
// Field Add Row
// ==========================================

function FieldAddRow({
  onSave,
  onCancel,
}: {
  onSave: (data: {
    key: string
    fieldType: SpecFieldType
    options?: string[]
    defaultValue?: string
  }) => void
  onCancel: () => void
}) {
  const [key, setKey] = useState("")
  const [fieldType, setFieldType] = useState<SpecFieldType>("TEXT")
  const [defaultValue, setDefaultValue] = useState("")
  const [optionsText, setOptionsText] = useState("")

  function handleSave() {
    if (!key.trim()) return
    const options =
      fieldType === "SELECT"
        ? optionsText
            .split("\n")
            .map((o) => o.trim())
            .filter(Boolean)
        : undefined
    onSave({
      key: key.trim(),
      fieldType,
      options,
      defaultValue: defaultValue || undefined,
    })
  }

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs">Alan Adı *</Label>
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="ör: İşlemci, GPU Bellek, Form Faktörü"
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSave()
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Alan Tipi</Label>
          <Select
            value={fieldType}
            onValueChange={(v) => setFieldType(v as SpecFieldType)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEXT">Kısa Metin</SelectItem>
              <SelectItem value="TEXTAREA">Uzun Metin</SelectItem>
              <SelectItem value="SELECT">Açılır Liste</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {fieldType === "SELECT" && (
        <div className="space-y-2">
          <Label className="text-xs">Seçenekler (her satıra bir tane)</Label>
          <Textarea
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            placeholder={"Tower\nRack 1U\nRack 2U\nRack 4U\nMini"}
            rows={4}
            className="text-sm"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs">Varsayılan Değer</Label>
        <Input
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
          placeholder="Boş bırakılabilir"
          className="h-8 text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={handleSave} disabled={!key.trim()}>
          <Plus className="mr-1 size-3" />
          Ekle
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          İptal
        </Button>
      </div>
    </div>
  )
}

// ==========================================
// Field Edit Row (Inline)
// ==========================================

function FieldEditRow({
  field,
  onSave,
  onCancel,
}: {
  field: PresetField
  onSave: (data: {
    key?: string
    fieldType?: SpecFieldType
    options?: string[] | null
    defaultValue?: string | null
  }) => void
  onCancel: () => void
}) {
  const opts = Array.isArray(field.options) ? (field.options as string[]) : []
  const [key, setKey] = useState(field.key)
  const [fieldType, setFieldType] = useState(field.fieldType)
  const [defaultValue, setDefaultValue] = useState(field.defaultValue || "")
  const [optionsText, setOptionsText] = useState(opts.join("\n"))

  function handleSave() {
    if (!key.trim()) return
    const newOptions =
      fieldType === "SELECT"
        ? optionsText
            .split("\n")
            .map((o) => o.trim())
            .filter(Boolean)
        : null
    onSave({
      key: key.trim(),
      fieldType,
      options: newOptions,
      defaultValue: defaultValue || null,
    })
  }

  return (
    <div className="space-y-3 rounded-lg border-2 border-primary/30 bg-muted/30 p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-xs">Alan Adı *</Label>
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="h-8 text-sm"
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Alan Tipi</Label>
          <Select
            value={fieldType}
            onValueChange={(v) => setFieldType(v as SpecFieldType)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEXT">Kısa Metin</SelectItem>
              <SelectItem value="TEXTAREA">Uzun Metin</SelectItem>
              <SelectItem value="SELECT">Açılır Liste</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Varsayılan Değer</Label>
          <Input
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {fieldType === "SELECT" && (
        <div className="space-y-2">
          <Label className="text-xs">Seçenekler (her satıra bir tane)</Label>
          <Textarea
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            rows={4}
            className="text-sm"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={handleSave}>
          Kaydet
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          İptal
        </Button>
      </div>
    </div>
  )
}
