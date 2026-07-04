"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Check, X, Printer } from "lucide-react"
import { approveQuote, rejectQuote, selectGroupOption } from "@/lib/actions/quote-actions"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const currencySymbols: Record<string, string> = {
  TRY: "₺", USD: "$", EUR: "€", GBP: "£",
}

const statusLabels: Record<string, string> = {
  DRAFT: "Taslak", SENT: "Gönderildi", VIEWED: "Görüntülendi",
  APPROVED: "Onaylandı", REJECTED: "Reddedildi", REVISED: "Revize",
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-500", SENT: "bg-blue-600", VIEWED: "bg-purple-600",
  APPROVED: "bg-green-600", REJECTED: "bg-red-600", REVISED: "bg-orange-500",
}

interface QuoteItem {
  id: string
  customName: string | null
  description: string | null
  quantity: number
  unitPrice: number
  isOptional: boolean
  isConfig: boolean
  product: { name: string; sku: string } | null
  configItems: {
    id: string
    customName: string | null
    category: string | null
    quantity: number
    unitPrice: number
    isGroupOption: boolean
    groupName: string | null
    isSelected: boolean
    product: { name: string; sku: string } | null
  }[]
}

interface QuoteData {
  id: string
  quoteNumber: string
  status: string
  currency: string
  displayMode: string
  projectName: string | null
  projectNumber: string | null
  vatRate: number
  discountPercent: number | null
  discountAmount: number | null
  totalAmount: number
  validUntil: Date | null
  publicNote: string | null
  createdAt: Date
  organization: { name: string; email: string | null; phone: string | null; address: string | null; city: string | null; taxOffice: string | null; taxNumber: string | null } | null
  contact: { firstName: string; lastName: string; email: string | null } | null
  createdBy: { name: string | null; surname: string | null; email: string | null }
  items: QuoteItem[]
}

interface QuotePublicViewProps {
  quote: QuoteData
  token: string
  companyLogo?: string
  companyName?: string
  defaultNotes?: string
}

function fmt(n: number, sym: string) {
  return `${n.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${sym}`
}

export function QuotePublicView({ quote, token, companyLogo, companyName, defaultNotes }: QuotePublicViewProps) {
  const [status, setStatus] = useState(quote.status)
  const [items, setItems] = useState(quote.items)
  const [loading, setLoading] = useState("")
  const sym = currencySymbols[quote.currency] || "$"

  // Calculate totals
  const rawSubtotal = items.reduce((sum, item) => {
    let itemTotal = item.unitPrice * item.quantity
    if (item.isConfig) {
      itemTotal += item.configItems
        .filter((ci) => ci.isSelected)
        .reduce((s, ci) => s + ci.unitPrice * ci.quantity, 0)
    }
    return sum + (item.isOptional ? 0 : itemTotal)
  }, 0)
  const discountAmt = quote.discountPercent
    ? rawSubtotal * (quote.discountPercent / 100)
    : (quote.discountAmount || 0)
  const subtotal = rawSubtotal - discountAmt
  const vatAmount = subtotal * (quote.vatRate / 100)
  const grandTotal = subtotal + vatAmount

  async function handleGroupSelect(quoteItemId: string, groupName: string, selectedId: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== quoteItemId) return item
        return {
          ...item,
          configItems: item.configItems.map((ci) => {
            if (ci.groupName !== groupName || !ci.isGroupOption) return ci
            return { ...ci, isSelected: ci.id === selectedId }
          }),
        }
      })
    )
    await selectGroupOption(token, selectedId)
  }

  async function handleApprove() {
    setLoading("approve")
    try {
      await approveQuote(token)
      setStatus("APPROVED")
      toast.success("Teklif onaylandı!")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hata oluştu"
      toast.error(msg)
    }
    finally { setLoading("") }
  }

  async function handleReject() {
    setLoading("reject")
    try {
      await rejectQuote(token)
      setStatus("REJECTED")
      toast.success("Teklif reddedildi")
    } catch { toast.error("Hata oluştu") }
    finally { setLoading("") }
  }

  const canAct = status === "SENT" || status === "VIEWED" || status === "REVISED"
  const canSelectOptions = status !== "APPROVED" && status !== "REJECTED"
  const isRecipe = quote.displayMode === "RECIPE"

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <Toaster />

      {/* A4 Container */}
      <div className="mx-auto w-[210mm] min-h-[297mm] bg-white shadow-xl print:shadow-none print:w-full">

        {/* ===== DARK HEADER ===== */}
        <div className="bg-slate-900 px-10 py-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              {companyLogo ? (
                <img src={companyLogo} alt={companyName || "Logo"} className="mb-1 h-10 w-auto object-contain brightness-0 invert" />
              ) : (
                <h1 className="text-2xl font-black tracking-tight">{companyName || "STUUX"}</h1>
              )}
              <p className="mt-1 text-sm text-slate-400">High Performance Computing</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold font-mono">{quote.quoteNumber}</p>
              <p className="text-sm text-slate-400">
                Tarih: {format(quote.createdAt, "dd/MM/yyyy", { locale: tr })}
              </p>
              <span className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold text-white ${statusColors[status] || "bg-gray-500"}`}>
                {statusLabels[status]}
              </span>
            </div>
          </div>
        </div>

        {/* ===== CUSTOMER + PROJECT INFO ===== */}
        <div className="grid grid-cols-2 gap-8 border-b px-10 py-6">
          {/* Customer */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">MÜŞTERİ</p>
            {quote.contact && (
              <p className="font-semibold">{quote.contact.firstName} {quote.contact.lastName}</p>
            )}
            {quote.organization && (
              <p className={quote.contact ? "text-sm text-muted-foreground" : "font-semibold"}>{quote.organization.name}</p>
            )}
            {quote.contact?.email && <p className="text-sm text-muted-foreground">{quote.contact.email}</p>}
            {quote.organization?.email && !quote.contact?.email && <p className="text-sm text-muted-foreground">{quote.organization.email}</p>}
            {quote.organization?.phone && <p className="text-sm text-muted-foreground">{quote.organization.phone}</p>}
            {quote.organization?.address && (
              <p className="text-sm text-muted-foreground">
                {quote.organization.address}
                {quote.organization.city && `, ${quote.organization.city}`}
              </p>
            )}
            {quote.organization?.taxNumber && (
              <p className="text-sm text-muted-foreground">
                VKN: {quote.organization.taxNumber}
              </p>
            )}
          </div>

          {/* Project Info */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">PROJE BİLGİLERİ</p>
            {quote.projectName && (
              <p className="text-sm"><span className="font-semibold">Proje:</span> {quote.projectName}</p>
            )}
            {quote.projectNumber && (
              <p className="text-sm"><span className="font-semibold">Proje No:</span> {quote.projectNumber}</p>
            )}
            <p className="text-sm"><span className="font-semibold">Sorumlu:</span> {quote.createdBy.name} {quote.createdBy.surname}</p>
            {quote.createdBy.email && <p className="text-sm text-muted-foreground">{quote.createdBy.email}</p>}
          </div>
        </div>

        {/* ===== ITEMS TABLE ===== */}
        <div className="px-10 py-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="pb-3 text-left font-semibold w-[40px]">#</th>
                <th className="pb-3 text-left font-semibold">Ürün / Hizmet</th>
                <th className="pb-3 text-center font-semibold w-[60px]">Adet</th>
                <th className="pb-3 text-right font-semibold w-[140px]">Birim Fiyat</th>
                <th className="pb-3 text-right font-semibold w-[140px]">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <ConfigItemRows
                  key={item.id}
                  item={item}
                  idx={idx}
                  sym={sym}
                  canSelect={canSelectOptions}
                  isRecipe={isRecipe}
                  onGroupSelect={(groupName, selectedId) =>
                    handleGroupSelect(item.id, groupName, selectedId)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== TOTALS ===== */}
        <div className="px-10 pb-6">
          <div className="ml-auto w-72">
            <div className="flex justify-between border-b py-2 text-sm">
              <span className="text-muted-foreground">Ara Toplam:</span>
              <span className="font-medium">{fmt(rawSubtotal, sym)}</span>
            </div>
            {discountAmt > 0 && (
              <div className="flex justify-between border-b py-2 text-sm">
                <span className="text-muted-foreground">
                  {quote.discountPercent ? `İndirim (%${quote.discountPercent}):` : "İndirim:"}
                </span>
                <span className="font-medium text-green-600">-{fmt(discountAmt, sym)}</span>
              </div>
            )}
            <div className="flex justify-between border-b-2 border-slate-300 py-2 text-sm">
              <span className="text-muted-foreground">KDV (%{quote.vatRate}):</span>
              <span className="font-medium">{fmt(vatAmount, sym)}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-base font-bold">GENEL TOPLAM:</span>
              <span className="text-lg font-bold">{fmt(grandTotal, sym)}</span>
            </div>
          </div>
        </div>

        {/* ===== NOTES ===== */}
        {(quote.publicNote || defaultNotes) && (
          <div className="border-t px-10 py-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">Not:</p>
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">{quote.publicNote || defaultNotes}</p>
          </div>
        )}

        {/* ===== ACTION BUTTONS (not printed) ===== */}
        <div className="flex justify-center gap-4 border-t px-10 py-6 print:hidden">
          {canAct && (
            <>
              <button
                onClick={handleApprove}
                disabled={loading === "approve"}
                className="rounded-lg bg-emerald-600 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                <Check className="mr-2 inline size-4" />
                {loading === "approve" ? "Onaylanıyor..." : "Teklifi Onayla"}
              </button>
              <button
                onClick={handleReject}
                disabled={loading === "reject"}
                className="rounded-lg bg-red-500 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                <X className="mr-2 inline size-4" />
                {loading === "reject" ? "Reddediliyor..." : "Teklifi Reddet"}
              </button>
            </>
          )}
          {status === "APPROVED" && (
            <span className="rounded-lg bg-emerald-100 px-8 py-3 text-sm font-bold text-emerald-700">Teklif Onaylandı</span>
          )}
          {status === "REJECTED" && (
            <span className="rounded-lg bg-red-100 px-8 py-3 text-sm font-bold text-red-700">Teklif Reddedildi</span>
          )}
          <a
            href={`/api/pdf/quote/${token}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-slate-800 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-900 inline-flex items-center"
          >
            <Printer className="mr-2 size-4" />
            PDF İndir
          </a>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="bg-slate-50 px-10 py-4 text-center text-xs text-slate-400">
          {quote.validUntil && (
            <p>Bu teklif <span className="font-semibold text-slate-500">{format(quote.validUntil, "dd/MM/yyyy")}</span> tarihine kadar geçerlidir.</p>
          )}
          <p className="mt-1">{companyName || "STUUX"} - High Performance Computing Solutions</p>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// Config Item Rows
// ==========================================

function ConfigItemRows({
  item, idx, sym, canSelect, isRecipe = false, onGroupSelect,
}: {
  item: QuoteItem; idx: number; sym: string; canSelect: boolean; isRecipe?: boolean
  onGroupSelect: (groupName: string, selectedId: string) => void
}) {
  const groupMap = new Map<string, typeof item.configItems>()
  for (const ci of item.configItems) {
    if (ci.isGroupOption && ci.groupName) {
      const arr = groupMap.get(ci.groupName) || []
      arr.push(ci)
      groupMap.set(ci.groupName, arr)
    }
  }

  const renderedGroups = new Set<string>()
  const renderItems: ({ type: "regular"; ci: typeof item.configItems[0] } | { type: "group"; groupName: string; options: typeof item.configItems })[] = []
  for (const ci of item.configItems) {
    if (ci.isGroupOption && ci.groupName) {
      if (!renderedGroups.has(ci.groupName)) {
        renderedGroups.add(ci.groupName)
        renderItems.push({ type: "group", groupName: ci.groupName, options: groupMap.get(ci.groupName)! })
      }
    } else {
      renderItems.push({ type: "regular", ci })
    }
  }

  const configTotal = item.isConfig
    ? item.configItems.filter((ci) => ci.isSelected).reduce((s, ci) => s + ci.unitPrice * ci.quantity, 0)
    : 0
  const lineTotal = (item.unitPrice + configTotal) * item.quantity

  return (
    <tr className="border-b align-top">
      <td className="py-4 pr-2 font-medium">{idx + 1}</td>
      <td className="py-4">
        {/* Product name */}
        <p className="font-semibold">{item.customName || item.product?.name || "Ürün"}</p>
        {item.isOptional && (
          <p className="mt-0.5 text-xs font-medium text-orange-500">&#9889; Opsiyonel</p>
        )}
        {item.description && (
          <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
        )}

        {/* Config items */}
        {item.isConfig && renderItems.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {renderItems.map((entry) => {
              if (entry.type === "regular") {
                const ci = entry.ci
                if (!ci.isSelected) return null
                return (
                  <div key={ci.id} className="flex items-baseline justify-between gap-4 pl-6 text-sm">
                    <span>
                      {ci.category && <span className="text-muted-foreground">{ci.category}: </span>}
                      {ci.customName || ci.product?.name}
                      {ci.quantity > 1 && <span className="text-muted-foreground"> x{ci.quantity}</span>}
                    </span>
                    {!isRecipe && (
                      <span className="shrink-0 tabular-nums text-muted-foreground">
                        {fmt(ci.unitPrice * ci.quantity, sym)}
                      </span>
                    )}
                  </div>
                )
              }

              const { groupName, options } = entry
              const selected = options.find((o) => o.isSelected) || options[0]
              return (
                <div key={groupName} className="ml-6 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    {options[0]?.category || groupName}
                  </p>
                  <div className="space-y-1">
                    {options.map((opt) => {
                      const isActive = opt.id === selected.id
                      return (
                        <label
                          key={opt.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? "bg-white font-medium ring-1 ring-slate-300 shadow-sm"
                              : "text-muted-foreground hover:bg-white/60"
                          } ${!canSelect ? "pointer-events-none" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`group-${item.id}-${groupName}`}
                            checked={isActive}
                            onChange={() => onGroupSelect(groupName, opt.id)}
                            disabled={!canSelect}
                            className="size-4 accent-slate-800"
                          />
                          <span className="flex-1">
                            {opt.customName || opt.product?.name}
                            {opt.quantity > 1 && <span className="text-muted-foreground"> x{opt.quantity}</span>}
                          </span>
                          {!isRecipe && (
                            <span className={`tabular-nums ${isActive ? "font-semibold" : ""}`}>
                              {fmt(opt.unitPrice * opt.quantity, sym)}
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </td>
      <td className="py-4 text-center">{item.quantity}</td>
      <td className="py-4 text-right tabular-nums">
        {item.isConfig
          ? fmt(item.unitPrice + configTotal, sym)
          : fmt(item.unitPrice, sym)
        }
      </td>
      <td className="py-4 text-right tabular-nums font-semibold">
        {fmt(lineTotal, sym)}
      </td>
    </tr>
  )
}
