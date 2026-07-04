import Link from "next/link"
import {
  ArrowRight,
  FileText,
  HeadphonesIcon,
  ShoppingCart,
} from "lucide-react"
import { getPortalDashboard } from "@/lib/actions/portal-actions"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const sym: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }

type PillTone = "amber" | "teal" | "orange" | "slate" | "rose" | "sky"

function pillClass(tone: PillTone) {
  const map: Record<PillTone, string> = {
    amber:
      "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
    teal:
      "bg-teal-100 text-teal-800 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-500/30",
    orange:
      "bg-orange-100 text-orange-800 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30",
    slate:
      "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    rose:
      "bg-rose-100 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30",
    sky:
      "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30",
  }
  return map[tone]
}

const qStatus: Record<string, { label: string; tone: PillTone }> = {
  DRAFT: { label: "Taslak", tone: "slate" },
  SENT: { label: "Gönderildi", tone: "amber" },
  VIEWED: { label: "Görüntülendi", tone: "sky" },
  APPROVED: { label: "Onaylandı", tone: "teal" },
  REJECTED: { label: "Reddedildi", tone: "rose" },
  REVISED: { label: "Revize", tone: "orange" },
}

const oStatus: Record<string, { label: string; tone: PillTone }> = {
  PENDING: { label: "Beklemede", tone: "amber" },
  PROCESSING: { label: "Hazırlanıyor", tone: "orange" },
  SHIPPED: { label: "Kargoda", tone: "sky" },
  DELIVERED: { label: "Teslim Edildi", tone: "teal" },
  CANCELLED: { label: "İptal", tone: "rose" },
}

export default async function PortalDashboard() {
  const data = await getPortalDashboard()
  if (!data) return null

  return (
    <div className="flex flex-col gap-8">
      {/* Hero welcome */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-orange-50/40 to-teal-50/40 p-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-orange-400/30 to-teal-400/20 blur-3xl"
        />
        <div className="relative">
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
            Hoş geldin
          </div>
          <h1 className="mt-1 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Müşteri Portalı
            <span aria-hidden className="text-orange-500">.</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Teklifler, siparişler ve destek taleplerin için özet ekran.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SummaryCard
              href="/portal/teklifler"
              label="Tekliflerim"
              value={data.quotes}
              icon={FileText}
              accent="orange"
            />
            <SummaryCard
              href="/portal/siparisler"
              label="Siparişlerim"
              value={data.orders}
              icon={ShoppingCart}
              accent="sky"
            />
            <SummaryCard
              href="/portal/destek"
              label="Açık Talepler"
              value={data.openTickets}
              icon={HeadphonesIcon}
              accent="amber"
              highlight={data.openTickets > 0}
            />
          </div>
        </div>
      </section>

      {/* Lists */}
      <section className="grid gap-6 lg:grid-cols-2">
        <ListCard
          title="Son Teklifler"
          eyebrow="Teklifler"
          href="/portal/teklifler"
          empty="Henüz teklif yok"
        >
          {data.recentQuotes.length === 0 ? null : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.recentQuotes.map((q) => {
                const st = qStatus[q.status] || qStatus.DRAFT
                return (
                  <li key={q.id}>
                    <Link
                      href={`/quote/${q.publicToken}`}
                      target="_blank"
                      className="group flex items-center justify-between gap-3 px-1 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-slate-500">
                            {q.quoteNumber}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 font-['Space_Grotesk'] text-[10px] font-medium ring-1 ring-inset ${pillClass(st.tone)}`}
                          >
                            {st.label}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate font-['Space_Grotesk'] text-sm font-medium text-slate-700 dark:text-slate-200">
                          {q.projectName || format(q.createdAt, "dd MMM yyyy", { locale: tr })}
                        </p>
                      </div>
                      <span className="font-['Space_Grotesk'] text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                        {q.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 0 })}{" "}
                        {sym[q.currency] || "$"}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </ListCard>

        <ListCard
          title="Son Siparişler"
          eyebrow="Siparişler"
          href="/portal/siparisler"
          empty="Henüz sipariş yok"
        >
          {data.recentOrders.length === 0 ? null : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.recentOrders.map((o) => {
                const st = oStatus[o.status] || oStatus.PENDING
                const total = o.totalAmount + o.vatAmount
                return (
                  <li
                    key={o.id}
                    className="flex items-center justify-between gap-3 px-1 py-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-slate-500">
                          {o.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 font-['Space_Grotesk'] text-[10px] font-medium ring-1 ring-inset ${pillClass(st.tone)}`}
                        >
                          {st.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {format(o.createdAt, "dd MMM yyyy", { locale: tr })}
                      </p>
                    </div>
                    <span className="font-['Space_Grotesk'] text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                      {total.toLocaleString("tr-TR", { minimumFractionDigits: 0 })}{" "}
                      {sym[o.currency] || "$"}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </ListCard>
      </section>
    </div>
  )
}

type Accent = "orange" | "sky" | "amber" | "teal"

function SummaryCard({
  href,
  label,
  value,
  icon: Icon,
  accent,
  highlight,
}: {
  href: string
  label: string
  value: number
  icon: typeof FileText
  accent: Accent
  highlight?: boolean
}) {
  const accentRing: Record<Accent, string> = {
    orange: "text-orange-600 dark:text-orange-400 ring-orange-200/70 dark:ring-orange-500/30",
    sky: "text-sky-600 dark:text-sky-400 ring-sky-200/70 dark:ring-sky-500/30",
    amber: "text-amber-600 dark:text-amber-400 ring-amber-200/70 dark:ring-amber-500/30",
    teal: "text-teal-600 dark:text-teal-400 ring-teal-200/70 dark:ring-teal-500/30",
  }
  return (
    <Link
      href={href}
      className={`group relative flex flex-col gap-3 rounded-xl border bg-white/80 p-4 text-left backdrop-blur transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/5 dark:bg-slate-900/80 dark:hover:border-orange-500/70 ${
        highlight
          ? "border-orange-300 dark:border-orange-500/40"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {label}
        </span>
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-inset ${accentRing[accent]}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="font-['Space_Grotesk'] text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">
        {value}
      </div>
      <div className="absolute bottom-3 right-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white opacity-0 transition group-hover:opacity-100 dark:bg-white dark:text-slate-900">
        <ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  )
}

function ListCard({
  title,
  eyebrow,
  href,
  empty,
  children,
}: {
  title: string
  eyebrow: string
  href: string
  empty: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-800">
        <div>
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.18em] text-orange-600 dark:text-orange-400">
            {eyebrow}
          </div>
          <h3 className="font-['Space_Grotesk'] text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 font-['Space_Grotesk'] text-[11px] font-semibold text-slate-600 transition hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-300"
        >
          Tümü
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="px-5 py-2">
        {children ?? (
          <p className="py-8 text-center text-sm text-slate-500">{empty}</p>
        )}
      </div>
    </div>
  )
}
