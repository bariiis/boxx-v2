import Link from "next/link"
import { ExternalLink, FileText } from "lucide-react"
import { getMyQuotes } from "@/lib/actions/portal-actions"
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
  DRAFT: { label: "Taslak", tone: "slate" },
  SENT: { label: "Gönderildi", tone: "amber" },
  VIEWED: { label: "Görüntülendi", tone: "sky" },
  APPROVED: { label: "Onaylandı", tone: "teal" },
  REJECTED: { label: "Reddedildi", tone: "rose" },
  REVISED: { label: "Revize", tone: "orange" },
}

export default async function MyQuotesPage() {
  const quotes = await getMyQuotes()

  return (
    <div className="flex flex-col gap-6">
      <header>
        <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
          Teklifler
        </div>
        <h1 className="mt-1 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Tekliflerim
          <span aria-hidden className="text-orange-500">.</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Satış ekibinden gelen tüm teklifler. Onaylamak veya revizyon istemek için karta tıkla.
        </p>
      </header>

      {quotes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-950/60">
          <FileText className="h-8 w-8 text-slate-400" />
          <h4 className="font-['Space_Grotesk'] text-base font-semibold text-slate-900 dark:text-white">
            Henüz teklifin yok
          </h4>
          <p className="max-w-sm text-sm text-slate-500">
            Sana uygun bir yapılandırma için satış ekibimizle iletişime geç.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {quotes.map((q) => {
            const st = statusConfig[q.status] || statusConfig.DRAFT
            const s = sym[q.currency] || "$"
            const canAct = q.status === "SENT" || q.status === "VIEWED" || q.status === "REVISED"
            return (
              <li key={q.id}>
                <div className="flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/5 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-orange-500/70">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        {q.quoteNumber}
                      </div>
                      <h3 className="mt-1 line-clamp-2 font-['Space_Grotesk'] text-base font-semibold text-slate-900 dark:text-white">
                        {q.projectName || "Teklif"}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 font-['Space_Grotesk'] text-xs font-medium ring-1 ring-inset ${pillClass(st.tone)}`}
                    >
                      {st.label}
                    </span>
                  </div>

                  <dl className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                    <div>
                      <dt className="font-['JetBrains_Mono'] uppercase tracking-wider text-slate-500">
                        Verildi
                      </dt>
                      <dd className="mt-0.5 font-['Space_Grotesk'] font-semibold text-slate-700 dark:text-slate-200">
                        {format(q.createdAt, "dd MMM yyyy", { locale: tr })}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-['JetBrains_Mono'] uppercase tracking-wider text-slate-500">
                        Kalem
                      </dt>
                      <dd className="mt-0.5 font-['Space_Grotesk'] font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                        {q.items.length}
                      </dd>
                    </div>
                    {q.validUntil && (
                      <div>
                        <dt className="font-['JetBrains_Mono'] uppercase tracking-wider text-slate-500">
                          Geçerlilik
                        </dt>
                        <dd className="mt-0.5 font-['Space_Grotesk'] font-semibold text-slate-700 dark:text-slate-200">
                          {format(q.validUntil, "dd.MM.yyyy")}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-auto flex items-end justify-between gap-3">
                    <div>
                      <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-slate-500">
                        Toplam
                      </div>
                      <div className="font-['Space_Grotesk'] text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
                        {q.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} {s}
                      </div>
                    </div>
                    <Link
                      href={`/quote/${q.publicToken}`}
                      target="_blank"
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-['Space_Grotesk'] text-xs font-semibold transition ${
                        canAct
                          ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30 hover:bg-orange-600"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-orange-400 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                      }`}
                    >
                      <ExternalLink className="h-3 w-3" />
                      {canAct ? "İncele & Onayla" : "Görüntüle"}
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
