import {
  CheckCircle2,
  Clock,
  Factory,
  Package,
  ShoppingCart,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import { getMyOrders } from "@/lib/actions/portal-actions"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const sym: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }

type Tone = "amber" | "teal" | "orange" | "slate" | "rose" | "sky"

function pillClass(tone: Tone) {
  const map: Record<Tone, string> = {
    amber: "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
    teal: "bg-teal-100 text-teal-800 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-500/30",
    orange: "bg-orange-100 text-orange-800 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30",
    slate: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    rose: "bg-rose-100 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30",
    sky: "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30",
  }
  return map[tone]
}

const statusConfig: Record<string, { label: string; tone: Tone }> = {
  PENDING: { label: "Beklemede", tone: "slate" },
  PROCESSING: { label: "Hazırlanıyor", tone: "orange" },
  SHIPPED: { label: "Kargoda", tone: "sky" },
  DELIVERED: { label: "Teslim Edildi", tone: "teal" },
  CANCELLED: { label: "İptal", tone: "rose" },
}

const steps: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "PENDING", label: "Beklemede", icon: Clock },
  { id: "PROCESSING", label: "Hazırlanıyor", icon: Factory },
  { id: "SHIPPED", label: "Kargoda", icon: Truck },
  { id: "DELIVERED", label: "Teslim Edildi", icon: Package },
]

export default async function MyOrdersPage() {
  const orders = await getMyOrders()

  return (
    <div className="flex flex-col gap-6">
      <header>
        <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
          Siparişler
        </div>
        <h1 className="mt-1 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Siparişlerim
          <span aria-hidden className="text-orange-500">.</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Aktif ve tamamlanmış siparişlerin. Üretim, kargo ve teslim durumunu takip et.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-950/60">
          <ShoppingCart className="h-8 w-8 text-slate-400" />
          <h4 className="font-['Space_Grotesk'] text-base font-semibold text-slate-900 dark:text-white">
            Henüz siparişin yok
          </h4>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((o) => {
            const st = statusConfig[o.status] || statusConfig.PENDING
            const s = sym[o.currency] || "$"
            const total = o.totalAmount + o.vatAmount
            const currentStep = steps.findIndex((step) => step.id === o.status)
            const isCancelled = o.status === "CANCELLED"
            const progress =
              currentStep >= 0 ? ((currentStep + 1) / steps.length) * 100 : 0

            return (
              <li key={o.id}>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-slate-500">
                          {o.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 font-['Space_Grotesk'] text-xs font-medium ring-1 ring-inset ${pillClass(st.tone)}`}
                        >
                          {st.label}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-slate-500">
                        <span>
                          Oluşturuldu{" "}
                          <span className="text-slate-700 dark:text-slate-200">
                            {format(o.createdAt, "dd MMM yyyy", { locale: tr })}
                          </span>
                        </span>
                        <span>
                          Kalem{" "}
                          <span className="tabular-nums text-slate-700 dark:text-slate-200">
                            {o._count.items}
                          </span>
                        </span>
                        {o.quote && (
                          <span>
                            Teklif{" "}
                            <span className="text-slate-700 dark:text-slate-200">
                              {o.quote.quoteNumber}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-slate-500">
                        Toplam
                      </div>
                      <div className="font-['Space_Grotesk'] text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
                        {total.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} {s}
                      </div>
                    </div>
                  </div>

                  {/* Stepper */}
                  {!isCancelled && (
                    <div className="mt-6">
                      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {steps.map((step, idx) => {
                          const Icon = step.icon
                          const state =
                            idx < currentStep
                              ? "done"
                              : idx === currentStep
                                ? "active"
                                : "upcoming"
                          return (
                            <li key={step.id}>
                              <div
                                className={`flex items-center gap-2 rounded-xl border p-2.5 transition ${
                                  state === "active"
                                    ? "border-orange-400 bg-orange-50/60 dark:border-orange-500/50 dark:bg-orange-500/5"
                                    : state === "done"
                                      ? "border-teal-200 bg-teal-50/40 dark:border-teal-500/30 dark:bg-teal-500/5"
                                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                                }`}
                              >
                                <span
                                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                                    state === "active"
                                      ? "bg-orange-500 text-white"
                                      : state === "done"
                                        ? "bg-teal-500 text-white"
                                        : "bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500"
                                  }`}
                                >
                                  {state === "done" ? (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  ) : (
                                    <Icon className="h-3.5 w-3.5" />
                                  )}
                                </span>
                                <div className="min-w-0">
                                  <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-slate-500">
                                    {String(idx + 1).padStart(2, "0")}
                                  </div>
                                  <div
                                    className={`font-['Space_Grotesk'] text-[11px] font-semibold ${
                                      state === "upcoming"
                                        ? "text-slate-500 dark:text-slate-500"
                                        : "text-slate-900 dark:text-white"
                                    }`}
                                  >
                                    {step.label}
                                  </div>
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </ol>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-teal-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/5 dark:text-rose-300">
                      <XCircle className="h-3.5 w-3.5" />
                      <span className="font-['Space_Grotesk'] font-semibold">
                        Sipariş iptal edildi
                      </span>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
