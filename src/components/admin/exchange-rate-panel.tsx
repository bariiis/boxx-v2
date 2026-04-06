"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { RefreshCw, TrendingUp, Save } from "lucide-react"
import { fetchAndSaveRates, saveManualRates } from "@/lib/actions/exchange-rate-actions"
import { toast } from "sonner"

interface StoredRate {
  id: string
  currency: string
  buyRate: number
  sellRate: number
  source: string
  date: Date
}

interface ExchangeRatePanelProps {
  storedRates: StoredRate[]
  rateSource: string
}

interface FetchedRate {
  currency: string
  code: string
  buyRate: number
  sellRate: number
  effectiveBuyRate: number
  effectiveSellRate: number
}

const currencies = [
  { code: "USD", flag: "\u{1F1FA}\u{1F1F8}", name: "Amerikan Dolar\u0131" },
  { code: "EUR", flag: "\u{1F1EA}\u{1F1FA}", name: "Euro" },
  { code: "GBP", flag: "\u{1F1EC}\u{1F1E7}", name: "\u0130ngiliz Sterlini" },
]

export function ExchangeRatePanel({ storedRates, rateSource }: ExchangeRatePanelProps) {
  const isManual = rateSource === "MANUAL"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Güncel Döviz Kurları
            </CardTitle>
            <CardDescription>
              {isManual
                ? "Manuel kur girişi — Kurları kendiniz belirleyin"
                : `${rateSource} üzerinden otomatik kur çekme`}
            </CardDescription>
          </div>
          <Badge variant="outline">{isManual ? "Manuel" : rateSource}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isManual ? (
          <ManualRateForm storedRates={storedRates} />
        ) : (
          <AutoRateView storedRates={storedRates} />
        )}
      </CardContent>
    </Card>
  )
}

// ==========================================
// AUTO (TCMB etc.)
// ==========================================

function AutoRateView({ storedRates }: { storedRates: StoredRate[] }) {
  const [loading, setLoading] = useState(false)
  const [liveRates, setLiveRates] = useState<FetchedRate[] | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  async function handleFetch() {
    setLoading(true)
    try {
      const result = await fetchAndSaveRates()
      setLiveRates(result.rates)
      setLastFetched(new Date())
      toast.success(`${result.savedCount} kur güncellendi (TCMB)`)
    } catch (err) {
      toast.error("Kur çekme başarısız. TCMB'ye erişim kontrol edin.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const displayRates = liveRates

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={handleFetch} disabled={loading} variant="outline">
          <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Çekiliyor..." : "TCMB'den Güncelle"}
        </Button>
      </div>

      {displayRates ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Para Birimi</TableHead>
                <TableHead className="text-right">Döviz Alış</TableHead>
                <TableHead className="text-right">Döviz Satış</TableHead>
                <TableHead className="text-right">Efektif Alış</TableHead>
                <TableHead className="text-right">Efektif Satış</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRates.map((rate) => {
                const c = currencies.find((x) => x.code === rate.code)
                return (
                  <TableRow key={rate.code}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c?.flag}</span>
                        <div>
                          <span className="font-medium">{rate.code}</span>
                          <p className="text-xs text-muted-foreground">{c?.name || rate.currency}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">{rate.buyRate.toFixed(4)} ₺</TableCell>
                    <TableCell className="text-right font-mono font-medium">{rate.sellRate.toFixed(4)} ₺</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{rate.effectiveBuyRate.toFixed(4)} ₺</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{rate.effectiveSellRate.toFixed(4)} ₺</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {lastFetched && (
            <p className="mt-3 text-xs text-muted-foreground text-right">
              Son güncelleme: {lastFetched.toLocaleTimeString("tr-TR")}
            </p>
          )}
        </>
      ) : storedRates.length > 0 ? (
        <StoredRatesTable rates={storedRates} />
      ) : (
        <EmptyState />
      )}
    </>
  )
}

// ==========================================
// MANUAL
// ==========================================

function ManualRateForm({ storedRates }: { storedRates: StoredRate[] }) {
  const [loading, setLoading] = useState(false)

  // Prefill from stored rates
  const getStored = (code: string, field: "buyRate" | "sellRate") => {
    const found = storedRates.find((r) => r.currency === code)
    return found ? found[field] : 0
  }

  const [rates, setRates] = useState(
    currencies.map((c) => ({
      code: c.code,
      buyRate: getStored(c.code, "buyRate"),
      sellRate: getStored(c.code, "sellRate"),
    }))
  )

  function updateRate(code: string, field: "buyRate" | "sellRate", value: string) {
    setRates((prev) =>
      prev.map((r) => (r.code === code ? { ...r, [field]: parseFloat(value) || 0 } : r))
    )
  }

  async function handleSave() {
    setLoading(true)
    try {
      await saveManualRates(
        rates.map((r) => ({
          currency: r.code as "USD" | "EUR" | "GBP",
          buyRate: r.buyRate,
          sellRate: r.sellRate,
          source: "MANUAL",
        }))
      )
      toast.success("Kurlar kaydedildi")
    } catch {
      toast.error("Kaydetme başarısız")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Para Birimi</TableHead>
            <TableHead>Alış Kuru (₺)</TableHead>
            <TableHead>Satış Kuru (₺)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencies.map((c) => {
            const r = rates.find((x) => x.code === c.code)!
            return (
              <TableRow key={c.code}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{c.flag}</span>
                    <div>
                      <span className="font-medium">{c.code}</span>
                      <p className="text-xs text-muted-foreground">{c.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.0001"
                    value={r.buyRate || ""}
                    onChange={(e) => updateRate(c.code, "buyRate", e.target.value)}
                    placeholder="0.0000"
                    className="max-w-[160px] font-mono"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.0001"
                    value={r.sellRate || ""}
                    onChange={(e) => updateRate(c.code, "sellRate", e.target.value)}
                    placeholder="0.0000"
                    className="max-w-[160px] font-mono"
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 size-4" />
          {loading ? "Kaydediliyor..." : "Kurları Kaydet"}
        </Button>
      </div>
    </div>
  )
}

// ==========================================
// SHARED
// ==========================================

function StoredRatesTable({ rates }: { rates: StoredRate[] }) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Para Birimi</TableHead>
            <TableHead>Kaynak</TableHead>
            <TableHead className="text-right">Alış</TableHead>
            <TableHead className="text-right">Satış</TableHead>
            <TableHead>Tarih</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rates.map((rate) => {
            const c = currencies.find((x) => x.code === rate.currency)
            return (
              <TableRow key={rate.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{c?.flag}</span>
                    <span className="font-medium">{rate.currency}</span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{rate.source}</Badge></TableCell>
                <TableCell className="text-right font-mono">{rate.buyRate.toFixed(4)} ₺</TableCell>
                <TableCell className="text-right font-mono">{rate.sellRate.toFixed(4)} ₺</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(rate.date).toLocaleDateString("tr-TR")}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <p className="mt-3 text-xs text-muted-foreground">
        Veritabanında kayıtlı son kurlar.
      </p>
    </>
  )
}

function EmptyState() {
  return (
    <div className="py-8 text-center text-muted-foreground">
      <TrendingUp className="mx-auto mb-2 size-8 opacity-50" />
      <p>Henüz kur verisi yok.</p>
    </div>
  )
}
