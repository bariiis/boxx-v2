"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, BarChart3, Palette } from "lucide-react"
import { createBenchmark, updateBenchmark, deleteBenchmark } from "@/lib/actions/solution-actions"
import { toast } from "sonner"
import { BenchmarkPreview } from "@/components/admin/benchmark-preview"

interface Dataset { id: string; name: string; color: string; values: number[]; sortOrder: number }
interface Benchmark { id: string; title: string; chartType: string; unit: string; sectionKey: string | null; labels: string[]; datasets: Dataset[] }
interface Section { tabKey: string; tabLabel: string }

const CHART_TYPES = [
  { value: "bar", label: "Yatay Bar" },
  { value: "vertical-bar", label: "Dikey Bar" },
  { value: "line", label: "Çizgi (Line)" },
  { value: "radar", label: "Radar" },
  { value: "area", label: "Alan (Area)" },
]

const PRESET_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
  "#06b6d4", "#ec4899", "#f97316", "#14b8a6", "#6366f1",
]

export function BenchmarkManager({ solutionId, benchmarks, sections }: { solutionId: string; benchmarks: Benchmark[]; sections: Section[] }) {
  const router = useRouter()
  const [showNew, setShowNew] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Benchmark Chartlar</h2>
        <Button onClick={() => setShowNew(!showNew)}>
          <Plus className="mr-2 size-4" />{showNew ? "Kapat" : "Yeni Chart"}
        </Button>
      </div>

      {showNew && (
        <ChartEditor
          solutionId={solutionId}
          sections={sections}
          onSaved={() => { setShowNew(false); router.refresh() }}
          onCancel={() => setShowNew(false)}
        />
      )}

      {benchmarks.length === 0 && !showNew ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <BarChart3 className="mx-auto mb-2 size-8 opacity-50" />
            <p>Henüz benchmark chart eklenmemiş</p>
          </CardContent>
        </Card>
      ) : (
        benchmarks.map((b) => (
          <ChartEditor
            key={b.id}
            solutionId={solutionId}
            sections={sections}
            benchmark={b}
            onSaved={() => router.refresh()}
            onDeleted={() => router.refresh()}
          />
        ))
      )}
    </div>
  )
}

function ChartEditor({
  solutionId,
  sections,
  benchmark,
  onSaved,
  onCancel,
  onDeleted,
}: {
  solutionId: string
  sections: Section[]
  benchmark?: Benchmark
  onSaved: () => void
  onCancel?: () => void
  onDeleted?: () => void
}) {
  const [title, setTitle] = useState(benchmark?.title || "")
  const [chartType, setChartType] = useState(benchmark?.chartType || "bar")
  const [unit, setUnit] = useState(benchmark?.unit || "points")
  const [sectionKey, setSectionKey] = useState(benchmark?.sectionKey || "_general")
  const [labels, setLabels] = useState<string[]>(benchmark?.labels || ["", ""])
  const [datasets, setDatasets] = useState<{ name: string; color: string; values: number[] }[]>(
    benchmark?.datasets.map((d) => ({ name: d.name, color: d.color, values: d.values })) || [
      { name: "Veri Seti 1", color: PRESET_COLORS[0], values: [0, 0] },
    ]
  )
  const [saving, setSaving] = useState(false)

  // Sync values array length with labels
  function syncValues(newLabels: string[]) {
    setDatasets((prev) =>
      prev.map((d) => ({
        ...d,
        values: newLabels.map((_, i) => d.values[i] ?? 0),
      }))
    )
  }

  function addLabel() {
    const newLabels = [...labels, ""]
    setLabels(newLabels)
    syncValues(newLabels)
  }

  function removeLabel(index: number) {
    const newLabels = labels.filter((_, i) => i !== index)
    setLabels(newLabels)
    setDatasets((prev) =>
      prev.map((d) => ({ ...d, values: d.values.filter((_, i) => i !== index) }))
    )
  }

  function updateLabel(index: number, value: string) {
    const newLabels = [...labels]
    newLabels[index] = value
    setLabels(newLabels)
  }

  function addDataset() {
    setDatasets((prev) => [
      ...prev,
      { name: `Veri Seti ${prev.length + 1}`, color: PRESET_COLORS[prev.length % PRESET_COLORS.length], values: labels.map(() => 0) },
    ])
  }

  function removeDataset(index: number) {
    setDatasets((prev) => prev.filter((_, i) => i !== index))
  }

  function updateDatasetValue(dsIndex: number, valIndex: number, value: number) {
    setDatasets((prev) => {
      const copy = [...prev]
      copy[dsIndex] = { ...copy[dsIndex], values: [...copy[dsIndex].values] }
      copy[dsIndex].values[valIndex] = value
      return copy
    })
  }

  async function handleSave() {
    if (!title) return toast.error("Başlık gerekli")
    const validLabels = labels.filter((l) => l.trim())
    if (validLabels.length < 2) return toast.error("En az 2 etiket girin")
    if (datasets.length === 0) return toast.error("En az 1 veri seti ekleyin")

    setSaving(true)
    try {
      const payload = {
        title,
        chartType,
        unit,
        sectionKey: sectionKey === "_general" ? undefined : sectionKey,
        labels,
        datasets,
      }

      if (benchmark) {
        await updateBenchmark(benchmark.id, solutionId, payload)
        toast.success("Chart güncellendi")
      } else {
        await createBenchmark({ solutionId, ...payload })
        toast.success("Chart oluşturuldu")
      }
      onSaved()
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!benchmark || !confirm("Chart silinecek, emin misiniz?")) return
    await deleteBenchmark(benchmark.id, solutionId)
    toast.success("Chart silindi")
    onDeleted?.()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{benchmark ? benchmark.title : "Yeni Chart"}</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 size-3" />{saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
          {benchmark && (
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash2 className="size-3" />
            </Button>
          )}
          {onCancel && (
            <Button size="sm" variant="outline" onClick={onCancel}>İptal</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings row */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label>Başlık *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="İşlemci Performansı" />
          </div>
          <div className="space-y-2">
            <Label>Chart Tipi</Label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Birim</Label>
            <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="points, fps, sec" />
          </div>
          <div className="space-y-2">
            <Label>Sekme</Label>
            <Select value={sectionKey} onValueChange={setSectionKey}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_general">Genel</SelectItem>
                {sections.map((s) => (
                  <SelectItem key={s.tabKey} value={s.tabKey}>{s.tabLabel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Labels (X-axis items) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Etiketler (satırlar)</Label>
            <Button variant="outline" size="sm" onClick={addLabel}>
              <Plus className="mr-1 size-3" />Etiket Ekle
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {labels.map((label, i) => (
              <div key={i} className="flex items-center gap-1">
                <Input
                  className="w-44"
                  value={label}
                  onChange={(e) => updateLabel(i, e.target.value)}
                  placeholder={`Etiket ${i + 1}`}
                />
                {labels.length > 2 && (
                  <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => removeLabel(i)}>
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Datasets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Veri Setleri</Label>
            <Button variant="outline" size="sm" onClick={addDataset}>
              <Plus className="mr-1 size-3" />Veri Seti Ekle
            </Button>
          </div>

          {datasets.map((ds, dsIndex) => (
            <Card key={dsIndex} className="border-dashed">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="color"
                      value={ds.color}
                      onChange={(e) => {
                        const copy = [...datasets]
                        copy[dsIndex] = { ...copy[dsIndex], color: e.target.value }
                        setDatasets(copy)
                      }}
                      className="size-8 cursor-pointer rounded border p-0.5"
                    />
                    <Input
                      value={ds.name}
                      onChange={(e) => {
                        const copy = [...datasets]
                        copy[dsIndex] = { ...copy[dsIndex], name: e.target.value }
                        setDatasets(copy)
                      }}
                      placeholder="Veri seti adı"
                      className="flex-1"
                    />
                  </div>
                  {datasets.length > 1 && (
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeDataset(dsIndex)}>
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {labels.map((label, valIndex) => (
                    <div key={valIndex} className="space-y-1">
                      <p className="text-[10px] text-muted-foreground truncate">{label || `#${valIndex + 1}`}</p>
                      <Input
                        type="number"
                        step="0.1"
                        value={ds.values[valIndex] || ""}
                        onChange={(e) => updateDatasetValue(dsIndex, valIndex, parseFloat(e.target.value) || 0)}
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview */}
        {labels.some((l) => l) && datasets.length > 0 && (
          <div>
            <Label className="mb-2 block">Ön İzleme</Label>
            <BenchmarkPreview chartType={chartType} unit={unit} labels={labels} datasets={datasets} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
