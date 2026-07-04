"use client"

import { useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Check, Minus, Plus, AlertTriangle, Sparkles, Edit2, Lock } from "lucide-react"
import { useConfigurator } from "@/lib/stores/configurator-store"
import {
  buildDefaultSelection,
  type Category,
  type OptionLite,
  type ProductLite,
} from "@/lib/configurator/engine"

// ============================================================
// CATEGORY ORDER & LABELS
// ============================================================
const STEPS: { id: Category; label: string; eyebrow: string; helper: string; mode: "single" | "multi" }[] = [
  { id: "cpu",            eyebrow: "01", label: "İşlemci",     helper: "Konfigürasyonun beyni — çekirdek sayısı parallel iş yükünü belirler.", mode: "single" },
  { id: "gpu",            eyebrow: "02", label: "Ekran Kartı", helper: "Render, AI ve görselleştirme için. Birden fazla seçilebilir.",         mode: "multi" },
  { id: "ram",            eyebrow: "03", label: "Bellek",      helper: "Her modülü ayrı ayrı ekleyin. Slot kapasitesi otomatik kontrol edilir.", mode: "multi" },
  { id: "nvme_os",        eyebrow: "04", label: "OS Disk",     helper: "İşletim sisteminin yükleneceği M.2 NVMe disk (tek adet).",               mode: "single" },
  { id: "nvme",           eyebrow: "05", label: "NVMe Disk",   helper: "Ek M.2 NVMe depolama. Aynı havuzdan slot tüketir.",                      mode: "multi" },
  { id: "ssd",            eyebrow: "05", label: "2.5\" SSD",   helper: "SATA SSD — yüksek kapasite + iyi hız.",                                  mode: "multi" },
  { id: "hdd",            eyebrow: "06", label: "HDD",         helper: "3.5\" sabit disk — arşiv ve toplu depolama.",                            mode: "multi" },
  { id: "psu",            eyebrow: "07", label: "Güç Kaynağı", helper: "Yapılandırmaya göre önerilen güç otomatik hesaplanır.",                  mode: "multi" },
  { id: "cooling",        eyebrow: "08", label: "Soğutma",     helper: "CPU TDP'sine uygun seçim.",                                              mode: "single" },
  { id: "expansion_card", eyebrow: "09", label: "Genişleme Kartları", helper: "Capture, ses, USB, HBA — PCIe slot havuzunu paylaşır.",          mode: "multi" },
  { id: "network_card",   eyebrow: "10", label: "Ağ Kartı",    helper: "10G / 25G NIC veya Wi-Fi modülü.",                                       mode: "multi" },
  { id: "os",             eyebrow: "11", label: "İşletim Sistemi", helper: "Önyüklü gelir.",                                                     mode: "single" },
  { id: "raid_config",    eyebrow: "12", label: "RAID",        helper: "Disk dizilimi.",                                                          mode: "single" },
  { id: "warranty",       eyebrow: "13", label: "Garanti",     helper: "Standart 3 yıl. Uzatabilirsiniz.",                                       mode: "single" },
  { id: "service",        eyebrow: "14", label: "Servisler",   helper: "Kurulum, white-glove teslim, eğitim.",                                   mode: "multi" },
  { id: "software_license", eyebrow: "15", label: "Yazılım",   helper: "Adobe, Autodesk, DaVinci lisansları.",                                   mode: "multi" },
  { id: "peripheral",     eyebrow: "16", label: "Çevre Birimi", helper: "Monitor, tablet, kalibratör.",                                          mode: "multi" },
  { id: "power_cable",    eyebrow: "17", label: "Güç Kablosu", helper: "Türkiye için Type F (220V).",                                             mode: "single" },
  { id: "rack_kit",       eyebrow: "18", label: "Rack Kiti",   helper: "Tower → Rack montaj.",                                                    mode: "single" },
]

interface Props {
  basekit: ProductLite & { heroImage?: string | null; description?: string | null; images?: { url: string }[] }
  options: OptionLite[]
  singleSelectCategories?: string[]
}

// ============================================================
// SHELL
// ============================================================
export function ConfiguratorShell({ basekit, options, singleSelectCategories = [] }: Props) {
  const singleSet = useMemo(() => new Set(singleSelectCategories), [singleSelectCategories])
  const { init, selection, result } = useConfigurator()

  // Initialize once
  useEffect(() => {
    const initial = buildDefaultSelection(basekit.id, options)
    init(basekit, options, initial)
  }, [basekit, options, init])

  const optionsByCategory = useMemo(() => {
    const m: Record<string, OptionLite[]> = {}
    for (const o of options) {
      if (!m[o.category]) m[o.category] = []
      m[o.category].push(o)
    }
    return m
  }, [options])

  // Only show steps that have at least one option; override mode if category
  // is marked single-select on the basekit.
  const visibleSteps = STEPS.filter((s) => (optionsByCategory[s.id]?.length ?? 0) > 0).map(
    (s) => (singleSet.has(s.id) ? { ...s, mode: "single" as const } : s)
  )

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-neutral-500">
        Yükleniyor...
      </div>
    )
  }

  const heroImg = basekit.images?.[0]?.url || basekit.heroImage || null

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">STUUX</span>
            <span className="text-neutral-300">/</span>
            <span className="text-sm font-medium">{basekit.name}</span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs text-neutral-500">Yapılandır</span>
          </div>
          <button className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
            Yapılandırmayı Kaydet
          </button>
        </div>
      </header>

      {/* Main grid */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-8 py-12 lg:grid-cols-[1fr_400px]">
        {/* LEFT — STEPS */}
        <main className="space-y-20">
          {visibleSteps.map((step) => (
            <StepSection
              key={step.id}
              step={step}
              opts={optionsByCategory[step.id] ?? []}
            />
          ))}
        </main>

        {/* RIGHT — SUMMARY */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SummaryCard heroImg={heroImg} />
        </aside>
      </div>
    </div>
  )
}

// ============================================================
// STEP SECTION
// ============================================================
function StepSection({
  step,
  opts,
}: {
  step: (typeof STEPS)[number]
  opts: OptionLite[]
}) {
  const { selection, result, selectSingle } = useConfigurator()
  const recommendedW = result?.usage.recommendedPsuW ?? 0

  // PSU: filter to only show options >= recommended wattage
  const visibleOpts = useMemo(() => {
    if (step.id !== "psu" || recommendedW <= 0) return opts
    const eligible = opts.filter((o) => {
      const w = o.component.componentSpecs?.psuWatts
      return w != null && w >= recommendedW
    })
    // If nothing qualifies (specs not filled), show all
    return eligible.length > 0 ? eligible : opts
  }, [opts, step.id, recommendedW])

  // PSU: auto-select cheapest eligible PSU whenever recommended wattage changes
  useEffect(() => {
    if (step.id !== "psu" || recommendedW <= 0) return
    // Pick cheapest eligible PSU that meets recommended wattage
    const eligible = opts
      .filter((o) => {
        const w = o.component.componentSpecs?.psuWatts
        return w != null && w >= recommendedW
      })
      .sort((a, b) => a.priceDelta - b.priceDelta)
    if (eligible.length > 0) {
      selectSingle("psu", eligible[0].componentId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedW])

  return (
    <section id={`step-${step.id}`}>
      <div className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
          {step.eyebrow} — {step.label}
        </p>
        <h2 className="mt-2 text-3xl font-medium tracking-tight text-neutral-900">{step.label} seçin</h2>
        <p className="mt-2 max-w-xl text-sm text-neutral-600">{step.helper}</p>
        {step.id === "psu" && recommendedW > 0 && (
          <p className="mt-1 text-xs text-blue-600">
            Minimum önerilen güç: {recommendedW}W — sadece uygun modeller gösteriliyor.
          </p>
        )}
      </div>

      <div className="space-y-3">
        {visibleOpts.map((opt) => (
          <OptionCard
            key={opt.id}
            opt={opt}
            mode={step.mode}
            currentQty={
              selection.lines.find(
                (l) => l.category === opt.category && l.componentId === opt.componentId
              )?.qty ?? 0
            }
          />
        ))}
      </div>
    </section>
  )
}

// ============================================================
// OPTION CARD
// ============================================================
function OptionCard({
  opt,
  mode,
  currentQty,
}: {
  opt: OptionLite
  mode: "single" | "multi"
  currentQty: number
}) {
  const { selectSingle, incLine, decLine, result } = useConfigurator()
  const selected = currentQty > 0
  const dynMax = result?.maxQty[`${opt.category}:${opt.componentId}`] ?? 99

  // Is the category-level resource exhausted?
  const locked = mode === "multi" && !selected && dynMax === 0
  const exhaustionMsg = locked ? categoryExhaustionMessage(opt.category, result) : null

  const canAdd = currentQty < dynMax

  const spec = opt.component.componentSpecs
  const badges: string[] = []
  if (spec?.tdpWatts) badges.push(`${spec.tdpWatts}W`)
  if (spec?.pcieSlotWidth) badges.push(`${spec.pcieSlotWidth} slot`)
  if (spec?.ramCapacityGb) badges.push(`${spec.ramCapacityGb}GB`)
  if (spec?.storageGb) badges.push(formatStorage(spec.storageGb))
  if (spec?.psuWatts) badges.push(`${spec.psuWatts}W`)

  function handleClick() {
    if (locked) {
      toast.error(exhaustionMsg ?? "Bu kategoride kapasite dolu", {
        description: "Başka bir seçim kaldırın veya azaltın.",
      })
      return
    }
    if (mode === "single") {
      selectSingle(opt.category, opt.componentId)
    } else {
      if (currentQty === 0) incLine(opt.category, opt.componentId)
    }
  }

  return (
    <motion.div
      whileHover={locked ? undefined : { scale: 1.005 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
        selected
          ? "border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.4),0_8px_30px_-12px_rgba(59,130,246,0.25)]"
          : locked
          ? "border-neutral-200 opacity-50"
          : "border-neutral-200 hover:border-neutral-300 hover:shadow-md"
      }`}
    >
      {opt.isRecommended && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
          <Sparkles className="size-2.5" /> Önerilen
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        className={`flex w-full items-center gap-4 p-5 text-left ${
          locked ? "cursor-not-allowed" : ""
        }`}
      >
        {/* Radio dot */}
        <div
          className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected
              ? "border-blue-500 bg-blue-500"
              : locked
              ? "border-neutral-200 bg-neutral-100"
              : "border-neutral-300 group-hover:border-neutral-500"
          }`}
        >
          {locked && <Lock className="size-2.5 text-neutral-400" />}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Check className="size-3 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-neutral-900">{opt.component.name}</div>
          {badges.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {badges.map((b, i) => (
                <span
                  key={i}
                  className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

      </button>

      {/* Quantity stepper — shown when selected (both single and multi modes).
          In single mode only one TYPE can be picked, but quantity can grow
          up to slot/resource limits. */}
      {selected && opt.category !== "cpu" && opt.category !== "cooling" && opt.category !== "os" && opt.category !== "warranty" && opt.category !== "raid_config" && opt.category !== "power_cable" && opt.category !== "rack_kit" && opt.category !== "nvme_os" && (
        <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-2 bg-neutral-50/60">
          <span className="text-[11px] text-neutral-500">
            {currentQty} adet seçildi · Maks {dynMax}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => decLine(opt.category, opt.componentId)}
              className="flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-6 text-center font-mono text-sm tabular-nums">{currentQty}</span>
            <button
              onClick={() => incLine(opt.category, opt.componentId)}
              disabled={!canAdd}
              className="flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="size-3" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ============================================================
// SUMMARY CARD
// ============================================================
function SummaryCard({ heroImg }: { heroImg: string | null }) {
  const { basekit, selection, result, options } = useConfigurator()
  if (!basekit || !result) return null

  const grouped = useMemo(() => {
    const m: Record<string, { name: string; qty: number }[]> = {}
    for (const line of selection.lines) {
      const opt = options.find(
        (o) => o.componentId === line.componentId && o.category === line.category
      )
      if (!opt) continue
      if (!m[line.category]) m[line.category] = []
      m[line.category].push({ name: opt.component.name, qty: line.qty })
    }
    return m
  }, [selection, options])

  const total = result.totalPriceCents

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
      {heroImg && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImg} alt={basekit.name} className="size-full object-contain p-4" />
        </div>
      )}

      <div>
        <p className="text-[10px] uppercase tracking-widest text-neutral-500">Konfigürasyon</p>
        <h3 className="mt-1 text-lg font-medium text-neutral-900">{basekit.name}</h3>
      </div>

      {/* Selected lines */}
      <div className="space-y-2 border-t border-neutral-100 pt-4">
        {Object.entries(grouped).map(([cat, items]) => (
          <a
            key={cat}
            href={`#step-${cat}`}
            className="group flex items-start justify-between gap-3 text-xs"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                {STEPS.find((s) => s.id === cat)?.label ?? cat}
              </div>
              {items.map((it, i) => (
                <div key={i} className="text-neutral-700 truncate">
                  {it.qty > 1 ? `${it.qty}× ` : ""}
                  {it.name}
                </div>
              ))}
            </div>
            <Edit2 className="mt-0.5 size-3 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
          </a>
        ))}
      </div>

      {/* Power summary */}
      <div className="border-t border-neutral-100 pt-4 space-y-1.5">
        {result.usage.pcieConnectors.total > 0 && (
          <div className="flex justify-between text-[11px] text-neutral-500">
            <span>PCIe Konnektör</span>
            <span className="font-mono tabular-nums text-neutral-700">
              {result.usage.pcieConnectors.used} / {result.usage.pcieConnectors.total}
            </span>
          </div>
        )}
        <div className="flex justify-between text-[11px] text-neutral-500">
          <span>PCIe Slot Height</span>
          <span className="font-mono tabular-nums text-neutral-700">
            {result.usage.pcieSlots.used} / {result.usage.pcieSlots.total}
          </span>
        </div>

        {/* Visual slot map (layout-aware mode) */}
        {result.usage.pcieLayoutState && result.usage.pcieLayoutState.length > 0 && (
          <SlotMap state={result.usage.pcieLayoutState} options={options} />
        )}
        <div className="flex justify-between text-[11px] text-neutral-500">
          <span>RAM Slot</span>
          <span className="font-mono tabular-nums text-neutral-700">
            {result.usage.ramSlots.used} / {result.usage.ramSlots.total}
          </span>
        </div>
        <div className="flex justify-between text-[11px] text-neutral-500">
          <span>NVMe Bay</span>
          <span className="font-mono tabular-nums text-neutral-700">
            {result.usage.nvmeBays.used} / {result.usage.nvmeBays.total}
          </span>
        </div>
        <div className="flex justify-between text-[11px] text-neutral-500">
          <span>Tahmini Güç Tüketimi</span>
          <span className="font-mono tabular-nums text-neutral-700">
            {result.usage.powerDrawW}W
          </span>
        </div>
        <div className="flex justify-between text-[11px] text-neutral-500">
          <span>Önerilen PSU</span>
          <span className="font-mono tabular-nums text-neutral-700">
            {result.usage.recommendedPsuW}W
          </span>
        </div>
      </div>

      {/* Issues */}
      {result.issues.length > 0 && (
        <div className="space-y-1.5 rounded-lg border border-amber-300 bg-amber-50 p-3">
          {result.issues.map((iss, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-amber-800">
              <AlertTriangle className="mt-0.5 size-3 shrink-0" />
              <span>{iss.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="border-t border-neutral-100 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">Toplam</span>
          <motion.span
            key={total}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-3xl font-medium tabular-nums text-neutral-900"
          >
            {formatPrice(total)}
          </motion.span>
        </div>
      </div>

      <button
        disabled={!result.ok}
        className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 py-4 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {result.ok ? "Sepete Ekle" : "Uyarıları Düzelt"}
      </button>
    </div>
  )
}

// ============================================================
// SLOT MAP — visual rendering of PCIe layout state
// ============================================================
import type { SlotState } from "@/lib/configurator/pcie-packing"

function SlotMap({ state, options }: { state: SlotState[]; options: OptionLite[] }) {
  function nameForKey(key: string): string {
    // key format: "category:componentId:index"
    const [category, componentId] = key.split(":")
    const opt = options.find((o) => o.category === category && o.componentId === componentId)
    return opt?.component.name ?? "Kart"
  }

  // Group consecutive cells into "card runs" so a single 3.5-slot GPU appears
  // as ONE bar spanning multiple positions (instead of N adjacent bars).
  const runs: { startIdx: number; length: number; cell: SlotState["cell"]; occupiedBy: string | null }[] = []
  let i = 0
  while (i < state.length) {
    const cur = state[i]
    if (cur.occupiedBy) {
      let j = i + 1
      while (j < state.length && state[j].occupiedBy === cur.occupiedBy) j++
      runs.push({ startIdx: i, length: j - i, cell: cur.cell, occupiedBy: cur.occupiedBy })
      i = j
    } else {
      runs.push({ startIdx: i, length: 1, cell: cur.cell, occupiedBy: null })
      i++
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-neutral-500">
          Slot Haritası
        </span>
        <span className="text-[10px] text-neutral-400">üst → alt</span>
      </div>
      <div className="flex flex-col gap-1">
        {runs.map((run, idx) => {
          const total = state.length
          const heightPct = (run.length / total) * 100
          if (run.cell.kind === "gap" && !run.occupiedBy) {
            return (
              <div
                key={idx}
                className="rounded-sm border border-dashed border-neutral-200 bg-white"
                style={{ minHeight: `${Math.max(8, heightPct * 2)}px` }}
              />
            )
          }
          if (run.occupiedBy) {
            const name = nameForKey(run.occupiedBy)
            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 rounded-md border border-blue-400 bg-gradient-to-r from-blue-100 to-violet-100 px-2 py-1.5 text-[10px] font-medium text-blue-800"
                style={{ minHeight: `${Math.max(20, heightPct * 4)}px` }}
              >
                <span className="truncate">{name}</span>
                <span className="shrink-0 opacity-70">{run.length}s</span>
              </div>
            )
          }
          // empty connector
          const slot = run.cell as Extract<SlotState["cell"], { kind: "slot" }>
          return (
            <div
              key={idx}
              className="flex items-center justify-between rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-[10px] text-neutral-600"
              style={{ minHeight: "22px" }}
            >
              <span className="font-mono">×{slot.lanes}</span>
              {slot.open && (
                <span className="text-[9px] uppercase tracking-wider text-violet-600">
                  open
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// HELPERS
// ============================================================
function categoryExhaustionMessage(
  category: Category,
  result: ReturnType<typeof useConfigurator.getState>["result"]
): string {
  if (!result) return "Bu kategoride kapasite dolu"
  const u = result.usage
  switch (category) {
    case "gpu":
    case "expansion_card":
    case "network_card":
      return `Tüm PCIe slotları dolu (${u.pcieSlots.used}/${u.pcieSlots.total})`
    case "ram":
      if (u.ramSlots.used >= u.ramSlots.total)
        return `Tüm RAM slotları dolu (${u.ramSlots.used}/${u.ramSlots.total})`
      if (u.ramCapacityGb.total > 0 && u.ramCapacityGb.used >= u.ramCapacityGb.total)
        return `Max RAM kapasitesi doldu (${u.ramCapacityGb.used}/${u.ramCapacityGb.total} GB)`
      return "RAM kapasitesi dolu"
    case "nvme":
    case "nvme_os":
      return `Tüm NVMe M.2 yuvaları dolu (${u.nvmeBays.used}/${u.nvmeBays.total})`
    case "ssd":
      return `Tüm 2.5" yuvaları dolu (${u.ssdBays.used}/${u.ssdBays.total})`
    case "hdd":
      return `Tüm 3.5" yuvaları dolu (${u.hddBays.used}/${u.hddBays.total})`
    case "psu":
      return "Maks PSU sayısına ulaşıldı"
    case "cpu":
      return "CPU zaten seçili"
    case "cooling":
      return "Soğutma zaten seçili"
    default:
      return "Bu kategoride kapasite dolu"
  }
}

function formatPrice(cents: number): string {
  const dollars = cents / 100
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(dollars)
}

function formatStorage(gb: number): string {
  if (gb >= 1000) return `${(gb / 1000).toFixed(gb % 1000 === 0 ? 0 : 1)}TB`
  return `${gb}GB`
}
