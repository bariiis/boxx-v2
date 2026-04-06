"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Cpu, Pencil, GripVertical } from "lucide-react"
import { addQuoteItem, removeQuoteItem, updateQuoteItem, addQuoteConfigItem, removeQuoteConfigItem, updateQuoteConfigItem, reorderQuoteItems, reorderQuoteConfigItems } from "@/lib/actions/quote-actions"
import { searchProducts } from "@/lib/actions/product-actions"
import { toast } from "sonner"

interface QuoteItemProduct {
  id: string
  name: string
  sku: string
  price: number
  stock?: number
}

interface ConfigItem {
  id: string
  productId: string | null
  customName: string | null
  category: string | null
  quantity: number
  unitPrice: number
  isGroupOption: boolean
  groupName: string | null
  isSelected: boolean
  sortOrder: number
  product: { id: string; name: string; sku: string; price: number; stock: number } | null
}

interface QuoteItemData {
  id: string
  productId: string | null
  customName: string | null
  description: string | null
  quantity: number
  unitPrice: number
  isOptional: boolean
  isConfig: boolean
  sortOrder: number
  product: QuoteItemProduct | null
  configItems: ConfigItem[]
}

interface QuoteData {
  id: string
  currency: string
  discountPercent: number | null
  discountAmount: number | null
  items: QuoteItemData[]
}

const currencySymbols: Record<string, string> = {
  TRY: "₺", USD: "$", EUR: "€", GBP: "£",
}

export function QuoteItems({ quote }: { quote: QuoteData }) {
  const router = useRouter()
  const sym = currencySymbols[quote.currency] || "₺"
  const [dragItems, setDragItems] = useState<QuoteItemData[] | null>(null)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  // Use drag state while dragging, otherwise use server data
  const items = dragItems ?? quote.items

  function handleDragStart(e: React.DragEvent, index: number) {
    e.dataTransfer.setData("drag-level", "quote-item")
    setDragItems([...quote.items])
    setDraggedIdx(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === index || !dragItems) return
    const copy = [...dragItems]
    const [moved] = copy.splice(draggedIdx, 1)
    copy.splice(index, 0, moved)
    setDragItems(copy)
    setDraggedIdx(index)
  }

  async function handleDragEnd() {
    if (draggedIdx === null || !dragItems) return
    setDraggedIdx(null)
    await reorderQuoteItems(quote.id, dragItems.map((i) => i.id))
    setDragItems(null)
    router.refresh()
  }

  function handleChanged() {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <AddProductDialog quoteId={quote.id} onAdded={handleChanged} />
        <AddConfigDialog quoteId={quote.id} onAdded={handleChanged} />
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Henüz kalem eklenmemiş. Yukarıdan ürün veya konfigürasyon ekleyin.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              onDragOver={(e) => handleDragOver(e, idx)}
              className={draggedIdx === idx ? "opacity-50" : ""}
            >
              <QuoteItemCard
                item={item}
                idx={idx}
                quoteId={quote.id}
                sym={sym}
                onChanged={handleChanged}
                onDragStart={(e: React.DragEvent) => handleDragStart(e, idx)}
                onDragEnd={handleDragEnd}
              />
            </div>
          ))}
        </div>
      )}

      {/* Discount + Summary */}
      {items.length > 0 && (
        <DiscountSummary quoteId={quote.id} quote={quote} sym={sym} items={items} onChanged={handleChanged} />
      )}
    </div>
  )
}

function QuoteItemCard({
  item, idx, quoteId, sym, onChanged, onDragStart, onDragEnd,
}: {
  item: QuoteItemData; idx: number; quoteId: string; sym: string; onChanged: () => void
  onDragStart: (e: React.DragEvent) => void; onDragEnd: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [customName, setCustomName] = useState(item.customName || "")
  const [quantity, setQuantity] = useState(item.quantity)
  const [unitPrice, setUnitPrice] = useState(item.unitPrice)
  const [isOptional, setIsOptional] = useState(item.isOptional)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateQuoteItem(item.id, quoteId, {
        customName: customName || undefined,
        quantity,
        unitPrice,
        isOptional,
      })
      toast.success("Güncellendi")
      setEditing(false)
      onChanged()
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className={item.isConfig ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-emerald-500"}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div
            draggable
            onDragStart={(e) => {
              e.stopPropagation()
              onDragStart(e)
            }}
            onDragEnd={(e) => {
              e.stopPropagation()
              onDragEnd()
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="size-4 text-muted-foreground/50" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">#{idx + 1}</span>
          <CardTitle className="text-base">
            {item.customName || item.product?.name || "Ürün"}
          </CardTitle>
          {item.isConfig ? (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100"><Cpu className="mr-1 size-3" />Konfigürasyon</Badge>
          ) : (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Tek Ürün</Badge>
          )}
          {item.isOptional && <Badge variant="secondary">Opsiyonel</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <InlineQuantity itemId={item.id} quoteId={quoteId} value={item.quantity} onChanged={onChanged} />
          <span className="text-xs text-muted-foreground">×</span>
          <span className="text-sm text-muted-foreground w-20 text-right">
            {item.unitPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
          </span>
          <span className="text-xs text-muted-foreground">=</span>
          <span className="text-lg font-bold w-28 text-right">
            {(item.unitPrice * item.quantity).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)} title="Düzenle">
            <Pencil className="size-4" />
          </Button>
          <RemoveItemButton itemId={item.id} quoteId={quoteId} onRemoved={onChanged} />
        </div>
      </CardHeader>

      {/* Inline edit */}
      {editing ? (
        <CardContent className="pt-0">
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Özel Ad</Label>
                <Input value={customName} onChange={(e) => setCustomName(e.target.value)}
                  placeholder={item.product?.name || "Ürün adı"} className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Adet</Label>
                <Input type="number" min={1} value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Birim Fiyat</Label>
                <Input type="number" step="0.01" value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)} className="h-8 text-sm" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox checked={isOptional} onCheckedChange={(v) => setIsOptional(v === true)} />
                <Label className="text-xs">Opsiyonel</Label>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>İptal</Button>
              </div>
            </div>
          </div>
        </CardContent>
      ) : item.product && (
        <CardContent className="pt-0">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>SKU: {item.product.sku}</span>
            <span>Adet: {item.quantity}</span>
            <span>Birim: {item.unitPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}</span>
            {item.product.stock !== undefined && <span>Stok: {item.product.stock}</span>}
          </div>
        </CardContent>
      )}
      {item.isConfig && (
        <CardContent className="pt-0 space-y-3">
          <DraggableConfigItems
            quoteItemId={item.id}
            configItems={item.configItems}
            sym={sym}
            onChanged={onChanged}
          />
          <AddConfigItemInline quoteItemId={item.id} onAdded={onChanged} />
        </CardContent>
      )}
    </Card>
  )
}

// ==========================================
// DRAGGABLE CONFIG ITEMS
// ==========================================

function DraggableConfigItems({
  quoteItemId, configItems: serverItems, sym, onChanged,
}: {
  quoteItemId: string; configItems: ConfigItem[]; sym: string; onChanged: () => void
}) {
  const [dragItems, setDragItems] = useState<ConfigItem[] | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  const items = dragItems ?? serverItems

  function handleDragStart(e: React.DragEvent, i: number) {
    e.stopPropagation()
    e.dataTransfer.setData("drag-level", "config-item")
    setDragItems([...serverItems])
    setDragIdx(i)
  }

  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    e.stopPropagation()
    if (dragIdx === null || dragIdx === i || !dragItems) return
    const copy = [...dragItems]
    const [moved] = copy.splice(dragIdx, 1)
    copy.splice(i, 0, moved)
    setDragItems(copy)
    setDragIdx(i)
  }

  async function handleDragEnd(e: React.DragEvent) {
    e.stopPropagation()
    if (dragIdx === null || !dragItems) return
    setDragIdx(null)
    try {
      await reorderQuoteConfigItems(quoteItemId, dragItems.map((i) => i.id))
      setDragItems(null)
      onChanged()
    } catch {
      toast.error("Sıralama kaydedilemedi")
    }
  }

  if (items.length === 0) return null

  return (
    <div className="space-y-1">
      {items.map((ci, i) => (
        <div
          key={ci.id}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDragEnd={handleDragEnd}
          className={dragIdx === i ? "opacity-50" : ""}
        >
          <ConfigItemRow ci={ci} sym={sym} onChanged={onChanged} />
        </div>
      ))}
    </div>
  )
}

// ==========================================
// CONFIG ITEM ROW (with inline edit)
// ==========================================

function ConfigItemRow({ ci, sym, onChanged }: { ci: ConfigItem; sym: string; onChanged: () => void }) {
  const [editing, setEditing] = useState(false)
  const [customName, setCustomName] = useState(ci.customName || "")
  const [category, setCategory] = useState(ci.category || "")
  const [unitPrice, setUnitPrice] = useState(ci.unitPrice)
  const [quantity, setQuantity] = useState(ci.quantity)
  const [isGroupOption, setIsGroupOption] = useState(ci.isGroupOption)
  const [groupName, setGroupName] = useState(ci.groupName || "")
  const [isSelected, setIsSelected] = useState(ci.isSelected)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateQuoteConfigItem(ci.id, {
        customName: customName || undefined,
        category: category || undefined,
        quantity,
        unitPrice,
        isGroupOption,
        groupName: isGroupOption ? groupName || undefined : undefined,
        isSelected,
      })
      toast.success("Güncellendi")
      setEditing(false)
      onChanged()
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="rounded-md border bg-muted/30 p-3 space-y-2">
        <div className="grid gap-2 sm:grid-cols-4">
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">Ad</Label>
            <Input value={customName} onChange={(e) => setCustomName(e.target.value)}
              placeholder={ci.product?.name || "Bileşen adı"} className="h-7 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Kategori</Label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="flex h-7 w-full rounded-md border border-input bg-background px-2 text-xs">
              <option value="">—</option>
              {componentCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Adet</Label>
              <Input type="number" min={1} value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="h-7 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Fiyat</Label>
              <Input type="number" step="0.01" value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)} className="h-7 text-xs" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Checkbox checked={isGroupOption} onCheckedChange={(v) => setIsGroupOption(v === true)} id={`grp-${ci.id}`} />
            <Label htmlFor={`grp-${ci.id}`} className="text-xs">Grup Seçeneği</Label>
          </div>
          {isGroupOption && (
            <Input value={groupName} onChange={(e) => setGroupName(e.target.value)}
              placeholder="Grup adı (ör: GPU, RAM)" className="h-7 w-36 text-xs" />
          )}
          <div className="flex items-center gap-2">
            <Checkbox checked={isSelected} onCheckedChange={(v) => setIsSelected(v === true)} id={`sel-${ci.id}`} />
            <Label htmlFor={`sel-${ci.id}`} className="text-xs">Seçili</Label>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" className="h-6 text-xs" onClick={handleSave} disabled={saving}>
              {saving ? "..." : "Kaydet"}
            </Button>
            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setEditing(false)}>İptal</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between rounded-md px-3 py-1.5 hover:bg-muted/50 ${!ci.isSelected ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="cursor-grab active:cursor-grabbing shrink-0">
          <GripVertical className="size-3.5 text-muted-foreground/40" />
        </div>
        <span className="text-sm truncate">{ci.customName || ci.product?.name}</span>
        {ci.category && <Badge variant="outline" className="text-[10px] shrink-0">{ci.category}</Badge>}
        {ci.isGroupOption && ci.groupName && <Badge variant="secondary" className="text-[10px] shrink-0">{ci.groupName}</Badge>}
        {ci.product && (
          <span className={`text-[10px] shrink-0 ${ci.product.stock <= 0 ? "text-destructive" : "text-muted-foreground"}`}>
            Stok: {ci.product.stock}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <InlineConfigQuantity configItemId={ci.id} value={ci.quantity} onChanged={onChanged} />
        <span className="text-xs text-muted-foreground">×</span>
        <span className="text-sm font-medium w-20 text-right">
          {ci.unitPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
        </span>
        <Button variant="ghost" size="icon" className="size-6" onClick={() => setEditing(true)} title="Düzenle">
          <Pencil className="size-3" />
        </Button>
        <RemoveConfigButton configId={ci.id} onRemoved={onChanged} />
      </div>
    </div>
  )
}

// ==========================================
// ADD PRODUCT FORM (inline, always re-mountable)
// ==========================================

function AddProductDialog({ quoteId, onAdded }: { quoteId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<QuoteItemProduct[]>([])
  const [selected, setSelected] = useState<QuoteItemProduct | null>(null)
  const [customName, setCustomName] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState(0)
  const [isOptional, setIsOptional] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length >= 2) {
      const res = await searchProducts(q)
      setResults(res)
    } else {
      setResults([])
    }
  }

  function handleSelectProduct(p: QuoteItemProduct) {
    setSelected(p)
    setUnitPrice(p.price)
    setCustomName("")
    setResults([])
    setQuery(p.name)
  }

  function reset() {
    setQuery(""); setResults([]); setSelected(null)
    setCustomName(""); setQuantity(1); setUnitPrice(0); setIsOptional(false)
  }

  async function handleAdd() {
    setLoading(true)
    try {
      await addQuoteItem({
        quoteId,
        productId: selected?.id,
        customName: customName || undefined,
        quantity,
        unitPrice,
        isOptional,
      })
      toast.success("Ürün eklendi")
      onAdded()
      reset()
      setOpen(false)
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
      <DialogTrigger render={
        <Button>
          <Plus className="mr-2 size-4" />
          Tek Ürün Ekle
        </Button>
      } />
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tek Ürün Ekle</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label>Ürün Ara</Label>
            <Input value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Ürün adı veya SKU..." />
            {results.length > 0 && (
              <div className="max-h-60 overflow-y-auto rounded-md border">
                {results.map((p) => (
                  <button key={p.id} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => handleSelectProduct(p)}>
                    <span>{p.name} <span className="text-muted-foreground">({p.sku})</span></span>
                    <span className="flex items-center gap-3">
                      <span className={`text-xs ${(p.stock ?? 0) <= 0 ? "text-destructive" : "text-muted-foreground"}`}>Stok: {p.stock ?? 0}</span>
                      <span className="font-medium">${p.price.toLocaleString("tr-TR")}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {selected && (
              <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                Seçilen: <strong>{selected.name}</strong> ({selected.sku})
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Özel Müşteri Ürün Adı (opsiyonel)</Label>
            <Input value={customName} onChange={(e) => setCustomName(e.target.value)}
              placeholder="Boşsa varsayılan ürün adı kullanılır" />
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label>Adet</Label>
              <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} />
            </div>
            <div className="space-y-2">
              <Label>Birim Fiyat ($)</Label>
              <Input type="number" step="0.01" value={unitPrice} onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={isOptional} onCheckedChange={(v) => setIsOptional(v === true)} id="optional" />
            <Label htmlFor="optional">Opsiyonel Kalem</Label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={handleAdd} disabled={loading || (!selected && !customName)}>
              {loading ? "Ekleniyor..." : "Ekle"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ==========================================
// ADD CONFIG FORM (Dialog)
// ==========================================

function AddConfigDialog({ quoteId, onAdded }: { quoteId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<QuoteItemProduct[]>([])
  const [selected, setSelected] = useState<QuoteItemProduct | null>(null)
  const [loading, setLoading] = useState(false)

  function reset() {
    setQuery(""); setResults([]); setSelected(null)
  }

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length >= 2) {
      const res = await searchProducts(q)
      setResults(res.filter((p) => p.type === "CONFIGURABLE"))
    }
  }

  async function handleAdd() {
    if (!selected) return
    setLoading(true)
    try {
      await addQuoteItem({
        quoteId,
        productId: selected.id,
        unitPrice: selected.price,
        isConfig: true,
      })
      toast.success("Konfigürasyon eklendi")
      onAdded()
      reset()
      setOpen(false)
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
      <DialogTrigger render={
        <Button variant="outline">
          <Cpu className="mr-2 size-4" />
          Konfig Ekle
        </Button>
      } />
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Konfigürasyon Ekle</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label>İş İstasyonu / Sunucu Ara</Label>
            <Input value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Model adı veya SKU..." />
            {results.length > 0 && (
              <div className="max-h-60 overflow-y-auto rounded-md border">
                {results.map((p) => (
                  <button key={p.id} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => { setSelected(p); setQuery(p.name); setResults([]) }}>
                    <span>{p.name} <span className="text-muted-foreground">({p.sku})</span></span>
                    <span className="flex items-center gap-3">
                      <span className={`text-xs ${(p.stock ?? 0) <= 0 ? "text-destructive" : "text-muted-foreground"}`}>Stok: {p.stock ?? 0}</span>
                      <span className="font-medium">${p.price.toLocaleString("tr-TR")}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {selected && (
              <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                Seçilen: <strong>{selected.name}</strong> ({selected.sku})
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Konfigüre edilebilir bir ürün seçin. Eklendikten sonra bileşenlerini (İşlemci, GPU, RAM vb.) tek tek ekleyebilirsiniz.
          </p>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={handleAdd} disabled={loading || !selected}>
              {loading ? "Ekleniyor..." : "Ekle"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ==========================================
// ADD CONFIG ITEM (Bileşen) INLINE
// ==========================================

const componentCategories = [
  "İşlemci", "Anakart", "Bellek (RAM)", "Ekran Kartı (GPU)",
  "NVMe SSD", "SATA SSD", "HDD", "Güç Kaynağı", "Kasa",
  "Soğutma", "Ağ", "İşletim Sistemi", "Diğer",
]

function AddConfigItemInline({ quoteItemId, onAdded }: { quoteItemId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<QuoteItemProduct[]>([])
  const [selected, setSelected] = useState<QuoteItemProduct | null>(null)
  const [customName, setCustomName] = useState("")
  const [category, setCategory] = useState("")
  const [unitPrice, setUnitPrice] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [groupName, setGroupName] = useState("")
  const [isGroupOption, setIsGroupOption] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length >= 2) {
      const res = await searchProducts(q)
      setResults(res)
    } else {
      setResults([])
    }
  }

  function handleSelectProduct(p: QuoteItemProduct) {
    setSelected(p)
    setUnitPrice(p.price)
    setCustomName("")
    setResults([])
    setQuery(p.name)
  }

  function reset() {
    setQuery(""); setResults([]); setSelected(null)
    setCustomName(""); setCategory(""); setUnitPrice(0)
    setQuantity(1); setGroupName(""); setIsGroupOption(false)
  }

  async function handleAdd() {
    if (!selected && !customName) return
    setLoading(true)
    try {
      await addQuoteConfigItem({
        quoteItemId,
        productId: selected?.id,
        customName: customName || undefined,
        category: category || undefined,
        quantity,
        unitPrice,
        isGroupOption,
        groupName: isGroupOption ? groupName || undefined : undefined,
      })
      toast.success("Bileşen eklendi")
      onAdded()
      reset()
      setOpen(false)
    } catch {
      toast.error("Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
      <DialogTrigger render={
        <Button variant="outline" size="sm">
          <Plus className="mr-1 size-3" />
          Bileşen Ekle
        </Button>
      } />
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bileşen Ekle</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          {/* Product search */}
          <div className="space-y-2">
            <Label>Ürün Ara (opsiyonel)</Label>
            <Input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Bileşen adı veya SKU..."
            />
            {results.length > 0 && (
              <div className="max-h-48 overflow-y-auto rounded-md border">
                {results.map((p) => (
                  <button
                    key={p.id}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => handleSelectProduct(p)}
                  >
                    <span>{p.name} <span className="text-muted-foreground">({p.sku})</span></span>
                    <span className="flex items-center gap-3">
                      <span className={`text-xs ${(p.stock ?? 0) <= 0 ? "text-destructive" : "text-muted-foreground"}`}>Stok: {p.stock ?? 0}</span>
                      <span className="font-medium">${p.price.toLocaleString("tr-TR")}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {selected && (
              <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                Seçilen: <strong>{selected.name}</strong> ({selected.sku})
              </div>
            )}
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label>Özel Ad (opsiyonel)</Label>
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Müşteriye gösterilecek ad"
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Seçin...</option>
                {componentCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label>Adet</Label>
              <Input
                type="number" min={1} value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label>Birim Fiyat ($)</Label>
              <Input
                type="number" step="0.01" value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={isGroupOption}
              onCheckedChange={(v) => setIsGroupOption(v === true)}
              id={`group-${quoteItemId}`}
            />
            <Label htmlFor={`group-${quoteItemId}`}>Grup Seçeneği</Label>
            {isGroupOption && (
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Grup adı (ör: GPU, Bellek)"
                className="flex-1"
              />
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={handleAdd} disabled={loading || (!selected && !customName)}>
              {loading ? "Ekleniyor..." : "Ekle"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ==========================================
// INLINE QUANTITY
// ==========================================

function InlineQuantity({ itemId, quoteId, value, onChanged }: {
  itemId: string; quoteId: string; value: number; onChanged: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function change(delta: number) {
    const newVal = Math.max(1, value + delta)
    if (newVal === value) return
    setLoading(true)
    try {
      await updateQuoteItem(itemId, quoteId, { quantity: newVal })
      onChanged()
    } catch { toast.error("Hata") }
    finally { setLoading(false) }
  }

  return (
    <div className="flex items-center gap-1">
      <Button type="button" variant="outline" size="icon" className="size-7"
        onClick={() => change(-1)} disabled={loading || value <= 1}>
        <span className="text-sm">−</span>
      </Button>
      <span className="w-8 text-center text-sm font-semibold">{value}</span>
      <Button type="button" variant="outline" size="icon" className="size-7"
        onClick={() => change(1)} disabled={loading}>
        <span className="text-sm">+</span>
      </Button>
    </div>
  )
}

function InlineConfigQuantity({ configItemId, value, onChanged }: {
  configItemId: string; value: number; onChanged: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function change(delta: number) {
    const newVal = Math.max(1, value + delta)
    if (newVal === value) return
    setLoading(true)
    try {
      await updateQuoteConfigItem(configItemId, { quantity: newVal })
      onChanged()
    } catch { toast.error("Hata") }
    finally { setLoading(false) }
  }

  return (
    <div className="flex items-center gap-0.5">
      <Button type="button" variant="outline" size="icon" className="size-5 text-[10px]"
        onClick={() => change(-1)} disabled={loading || value <= 1}>−</Button>
      <span className="w-6 text-center text-xs font-semibold">{value}</span>
      <Button type="button" variant="outline" size="icon" className="size-5 text-[10px]"
        onClick={() => change(1)} disabled={loading}>+</Button>
    </div>
  )
}

// ==========================================
// DISCOUNT + SUMMARY
// ==========================================

function DiscountSummary({ quoteId, quote, sym, items, onChanged }: {
  quoteId: string; quote: QuoteData; sym: string; items: QuoteItemData[]; onChanged: () => void
}) {
  const [discountPercent, setDiscountPercent] = useState(quote.discountPercent ?? 0)
  const [discountAmount, setDiscountAmount] = useState(quote.discountAmount ?? 0)
  const [discountType, setDiscountType] = useState<"percent" | "amount">(
    quote.discountAmount ? "amount" : "percent"
  )
  const [saving, setSaving] = useState(false)

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    if (item.isOptional) return sum
    if (item.isConfig) {
      const configTotal = item.configItems
        .filter((ci) => ci.isSelected)
        .reduce((s, ci) => s + ci.unitPrice * ci.quantity, 0)
      return sum + (item.unitPrice + configTotal) * item.quantity
    }
    return sum + item.unitPrice * item.quantity
  }, 0)

  const discountValue = discountType === "percent"
    ? subtotal * (discountPercent / 100)
    : discountAmount

  async function handleSave() {
    setSaving(true)
    try {
      const { updateQuote } = await import("@/lib/actions/quote-actions")
      await updateQuote(quoteId, {
        discountPercent: discountType === "percent" ? discountPercent || null : null,
        discountAmount: discountType === "amount" ? discountAmount || null : null,
      })
      toast.success("İndirim güncellendi")
      onChanged()
    } catch { toast.error("Hata") }
    finally { setSaving(false) }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-end gap-3">
          {/* Subtotal */}
          <div className="flex items-center gap-6 text-sm">
            <span className="text-muted-foreground">Ara Toplam:</span>
            <span className="font-medium w-32 text-right">{subtotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}</span>
          </div>

          {/* Discount */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">İndirim:</span>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as "percent" | "amount")}
              className="h-8 rounded-md border bg-background px-2 text-sm"
            >
              <option value="percent">% Oran</option>
              <option value="amount">{sym} Tutar</option>
            </select>
            {discountType === "percent" ? (
              <Input
                type="number" step="0.1" min={0} max={100}
                value={discountPercent || ""}
                onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                className="h-8 w-20 text-sm"
                placeholder="%"
              />
            ) : (
              <Input
                type="number" step="0.01" min={0}
                value={discountAmount || ""}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                className="h-8 w-28 text-sm"
                placeholder="0.00"
              />
            )}
            <Button size="sm" className="h-8" onClick={handleSave} disabled={saving}>
              {saving ? "..." : "Uygula"}
            </Button>
            {discountValue > 0 && (
              <span className="text-sm font-medium text-green-600 w-32 text-right">
                -{discountValue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
              </span>
            )}
          </div>

          {/* Net total */}
          {discountValue > 0 && (
            <div className="flex items-center gap-6 text-sm border-t pt-2">
              <span className="font-semibold">İndirimli Toplam:</span>
              <span className="font-bold w-32 text-right">
                {(subtotal - discountValue).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {sym}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ==========================================
// REMOVE BUTTONS
// ==========================================

function RemoveItemButton({ itemId, quoteId, onRemoved }: { itemId: string; quoteId: string; onRemoved: () => void }) {
  const [loading, setLoading] = useState(false)
  return (
    <Button variant="ghost" size="sm" className="text-destructive" disabled={loading}
      onClick={async () => {
        setLoading(true)
        await removeQuoteItem(itemId, quoteId)
        toast.success("Kalem silindi")
        onRemoved()
      }}>
      <Trash2 className="size-4" />
    </Button>
  )
}

function RemoveConfigButton({ configId, onRemoved }: { configId: string; onRemoved: () => void }) {
  const [loading, setLoading] = useState(false)
  return (
    <Button variant="ghost" size="icon" className="text-destructive" disabled={loading}
      onClick={async () => {
        setLoading(true)
        await removeQuoteConfigItem(configId)
        toast.success("Bileşen silindi")
        onRemoved()
      }}>
      <Trash2 className="size-3" />
    </Button>
  )
}
