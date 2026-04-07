"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Plus,
  Trash2,
  GripVertical,
  Settings2,
  Eye,
  Layers,
  Copy,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
} from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  updateLandingPage,
  addSection,
  updateSection,
  deleteSection,
  duplicateSection,
  reorderSections,
} from "@/lib/actions/landing-actions"
import {
  getSectionTypes,
  getCategoryForType,
  SECTION_CATEGORY_LABELS,
  type SectionTypeInfo,
  type SectionCategory,
} from "@/lib/landing-section-types"
import { LandingSectionConfigEditor } from "./landing-section-config"

type LandingSection = {
  id: string
  sectionType: string
  config: string
  sortOrder: number
}

type LandingData = {
  id: string
  title: string
  slug: string
  description: string | null
  metaTitle: string | null
  metaDescription: string | null
  isActive: boolean
  productId: string | null
  sections: LandingSection[]
  product: { id: string; name: string; slug: string } | null
}

const sectionTypeLabels: Record<string, string> = {
  "hero-statement": "Hero Statement",
  "feature-storytelling": "Feature Storytelling",
  "feature-grid": "Feature Grid",
  "full-bleed-media": "Full-Bleed Media",
  "tech-specs": "Tech Specs",
  "purchase-cta": "Purchase CTA",
}

// Extract a meaningful preview from a section's config
function getSectionPreview(sectionType: string, configRaw: string): string {
  try {
    const c = JSON.parse(configRaw) as Record<string, unknown>
    const pick = (...keys: string[]) => {
      for (const k of keys) {
        const v = c[k]
        if (typeof v === "string" && v.trim()) return v.trim()
      }
      return ""
    }
    switch (sectionType) {
      case "main-hero": {
        const slides = c.slides as { line1?: string }[] | undefined
        return slides?.[0]?.line1 || ""
      }
      case "tech-specs":
      case "stats-counter":
      case "faq-accordion":
      case "pricing-table":
      case "image-text-split":
        return pick("headline", "title")
      case "hero-gradient":
        return [pick("headline"), pick("highlight")].filter(Boolean).join(" ")
      default:
        return pick("headline", "title", "label", "badge")
    }
  } catch {
    return ""
  }
}

export function LandingEditor({ landing }: { landing: LandingData }) {
  const router = useRouter()
  const [sections, setSections] = useState(landing.sections)
  const [selectedId, setSelectedId] = useState<string | null>(
    sections[0]?.id ?? null
  )
  const [showSettings, setShowSettings] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [activeCategory, setActiveCategory] = useState<SectionCategory | "all">("all")

  // Settings state
  const [title, setTitle] = useState(landing.title)
  const [slug, setSlug] = useState(landing.slug)
  const [isActive, setIsActive] = useState(landing.isActive)
  const [metaTitle, setMetaTitle] = useState(landing.metaTitle || "")
  const [metaDescription, setMetaDescription] = useState(landing.metaDescription || "")

  const sectionTypes = getSectionTypes()
  const selectedSection = sections.find((s) => s.id === selectedId)

  async function handleAddSection(typeInfo: SectionTypeInfo) {
    const section = await addSection(landing.id, typeInfo.type, typeInfo.defaultConfig)
    const newSection = { ...section, config: JSON.stringify(typeInfo.defaultConfig) }
    setSections((prev) => [...prev, newSection])
    setSelectedId(section.id)
    setAddDialogOpen(false)
  }

  async function handleDuplicateSection(sectionId: string) {
    const original = sections.find((s) => s.id === sectionId)
    if (!original) return
    const copy = await duplicateSection(sectionId)
    const idx = sections.findIndex((s) => s.id === sectionId)
    const newSection = {
      id: copy.id,
      sectionType: copy.sectionType,
      config: original.config,
      sortOrder: copy.sortOrder,
    }
    const next = [...sections]
    next.splice(idx + 1, 0, newSection)
    setSections(next)
    setSelectedId(copy.id)
  }

  async function handleDeleteSection(sectionId: string) {
    await deleteSection(sectionId)
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
    if (selectedId === sectionId) {
      const remaining = sections.filter((s) => s.id !== sectionId)
      setSelectedId(remaining[0]?.id ?? null)
    }
    router.refresh()
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = sections.findIndex((s) => s.id === active.id)
    const newIdx = sections.findIndex((s) => s.id === over.id)
    if (oldIdx === -1 || newIdx === -1) return
    const newSections = arrayMove(sections, oldIdx, newIdx)
    setSections(newSections)
    await reorderSections(landing.id, newSections.map((s) => s.id))
  }

  async function handleSaveConfig(sectionId: string, config: Record<string, unknown>) {
    setSaving(true)
    await updateSection(sectionId, { config })
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, config: JSON.stringify(config) } : s))
    )
    setSaving(false)
    setPreviewKey((k) => k + 1)
  }

  function refreshPreview() {
    setPreviewKey((k) => k + 1)
  }

  async function handleSaveSettings() {
    setSaving(true)
    await updateLandingPage(landing.id, {
      title,
      slug,
      isActive,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
    })
    setSaving(false)
    setShowSettings(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{landing.title}</h1>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Aktif" : "Pasif"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings2 className="mr-2 size-4" />
            Ayarlar
          </Button>
          <Button
            variant={previewOpen ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewOpen(!previewOpen)}
          >
            {previewOpen ? (
              <PanelRightClose className="mr-2 size-4" />
            ) : (
              <PanelRightOpen className="mr-2 size-4" />
            )}
            Canlı Önizleme
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/landing/${landing.slug}`} target="_blank">
              <Eye className="mr-2 size-4" />
              Yeni Sekmede Aç
            </Link>
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sayfa Ayarları</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Input
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Aktif</Label>
            </div>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button variant="outline" size="sm" onClick={() => setShowSettings(false)}>
                İptal
              </Button>
              <Button size="sm" onClick={handleSaveSettings} disabled={saving}>
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Editor: Sidebar + Config (+ Preview) */}
      <div
        className={`grid gap-4 ${
          previewOpen
            ? "lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1.4fr)]"
            : "lg:grid-cols-[280px_1fr]"
        }`}
      >
        {/* Left: Section List */}
        <div className="space-y-3">
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Sections</CardTitle>
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                  <DialogTrigger render={
                    <Button variant="ghost" size="icon" className="size-7">
                      <Plus className="size-4" />
                    </Button>
                  } />
                  <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Section Ekle</DialogTitle>
                    </DialogHeader>
                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-2 border-b pb-3">
                      <button
                        type="button"
                        onClick={() => setActiveCategory("all")}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          activeCategory === "all"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/70"
                        }`}
                      >
                        Tümü ({sectionTypes.length})
                      </button>
                      {(Object.keys(SECTION_CATEGORY_LABELS) as SectionCategory[]).map((cat) => {
                        const count = sectionTypes.filter(
                          (st) => getCategoryForType(st.type) === cat
                        ).length
                        if (count === 0) return null
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setActiveCategory(cat)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                              activeCategory === cat
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/70"
                            }`}
                          >
                            {SECTION_CATEGORY_LABELS[cat]} ({count})
                          </button>
                        )
                      })}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {sectionTypes
                        .filter(
                          (st) =>
                            activeCategory === "all" ||
                            getCategoryForType(st.type) === activeCategory
                        )
                        .map((st) => (
                          <button
                            key={st.type}
                            onClick={() => handleAddSection(st)}
                            className="group flex flex-col items-start rounded-xl border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-md"
                          >
                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              {SECTION_CATEGORY_LABELS[getCategoryForType(st.type)]}
                            </span>
                            <span className="mt-1 font-medium group-hover:text-primary">
                              {st.label}
                            </span>
                            <span className="mt-1 text-xs text-muted-foreground line-clamp-2">
                              {st.description}
                            </span>
                          </button>
                        ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 px-2 pb-2">
              {sections.length === 0 && (
                <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                  Henüz section yok
                </p>
              )}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section, i) => (
                    <SortableSectionItem
                      key={section.id}
                      section={section}
                      index={i}
                      selected={selectedId === section.id}
                      onSelect={() => setSelectedId(section.id)}
                      onDelete={() => handleDeleteSection(section.id)}
                      onDuplicate={() => handleDuplicateSection(section.id)}
                      label={sectionTypeLabels[section.sectionType] || section.sectionType}
                      preview={getSectionPreview(section.sectionType, section.config)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </div>

        {/* Right: Config Editor */}
        <div>
          {selectedSection ? (
            <LandingSectionConfigEditor
              key={selectedSection.id}
              sectionId={selectedSection.id}
              sectionType={selectedSection.sectionType}
              config={JSON.parse(selectedSection.config)}
              onSave={(config) => handleSaveConfig(selectedSection.id, config)}
              saving={saving}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20">
                <Layers className="mb-4 size-12 text-muted-foreground/30" />
                <p className="text-muted-foreground">
                  {sections.length === 0
                    ? "Section ekleyerek başlayın"
                    : "Düzenlemek için bir section seçin"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Pane */}
        {previewOpen && (
          <div className="sticky top-4 self-start">
            <Card className="overflow-hidden">
              <CardHeader className="flex-row items-center justify-between space-y-0 py-2 pl-4 pr-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-green-500" />
                  /landing/{landing.slug}
                </div>
                <Button variant="ghost" size="icon" className="size-7" onClick={refreshPreview} aria-label="Yenile">
                  <RefreshCw className="size-3.5" />
                </Button>
              </CardHeader>
              <iframe
                key={previewKey}
                src={`/landing/${landing.slug}`}
                className="h-[calc(100vh-180px)] w-full border-0 bg-white"
                title="Önizleme"
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function SortableSectionItem({
  section,
  index,
  selected,
  onSelect,
  onDelete,
  onDuplicate,
  label,
  preview,
}: {
  section: LandingSection
  index: number
  selected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  label: string
  preview: string
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors cursor-pointer ${
        selected ? "bg-primary/10 text-primary" : "hover:bg-muted"
      }`}
      onClick={onSelect}
    >
      <button
        type="button"
        className="cursor-grab touch-none p-0.5 text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        aria-label="Sürükle"
      >
        <GripVertical className="size-3.5" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            #{index + 1}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80 truncate">
            {label}
          </span>
        </div>
        <div className="truncate text-sm font-medium">
          {preview || <span className="text-muted-foreground/60">—</span>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
          className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
          aria-label="Çoğalt"
        >
          <Copy className="size-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-destructive"
          aria-label="Sil"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
