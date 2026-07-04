import Link from "next/link"
import { ExternalLink, HeadphonesIcon, Plus } from "lucide-react"
import { getMyTickets } from "@/lib/actions/portal-actions"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

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
  OPEN: { label: "Açık", tone: "orange" },
  AWAITING_REPLY: { label: "Yanıt Bekleniyor", tone: "amber" },
  RESOLVED: { label: "Çözüldü", tone: "teal" },
  CLOSED: { label: "Kapatıldı", tone: "slate" },
}

const priorityConfig: Record<string, { label: string; tone: Tone }> = {
  LOW: { label: "Düşük", tone: "slate" },
  NORMAL: { label: "Normal", tone: "sky" },
  HIGH: { label: "Yüksek", tone: "orange" },
  URGENT: { label: "Acil", tone: "rose" },
}

export default async function MyTicketsPage() {
  const tickets = await getMyTickets()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
            Destek
          </div>
          <h1 className="mt-1 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Destek Taleplerim
            <span aria-hidden className="text-orange-500">.</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Destek uzmanlarımızla mesajlaş, durumu takip et.
          </p>
        </div>
        <Link
          href="/destek"
          className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 font-['Space_Grotesk'] text-sm font-semibold text-white shadow-sm shadow-orange-500/30 transition hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Yeni Talep
        </Link>
      </header>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-950/60">
          <HeadphonesIcon className="h-8 w-8 text-slate-400" />
          <h4 className="font-['Space_Grotesk'] text-base font-semibold text-slate-900 dark:text-white">
            Henüz destek talebin yok
          </h4>
          <p className="max-w-sm text-sm text-slate-500">
            Yeni bir talep açmak için üstteki butonu kullanabilirsin.
          </p>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          {tickets.map((t, idx) => {
            const st = statusConfig[t.status] || statusConfig.OPEN
            const pr = priorityConfig[t.priority]
            const showPriority = t.priority === "HIGH" || t.priority === "URGENT"
            return (
              <li
                key={t.id}
                className={idx > 0 ? "border-t border-slate-100 dark:border-slate-800" : ""}
              >
                <Link
                  href={`/destek/${t.publicToken}`}
                  className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900/60"
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    <HeadphonesIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-slate-500">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 font-['Space_Grotesk'] text-[10px] font-medium ring-1 ring-inset ${pillClass(st.tone)}`}
                      >
                        {st.label}
                      </span>
                      {showPriority && pr && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-['Space_Grotesk'] text-[10px] font-medium ring-1 ring-inset ${pillClass(pr.tone)}`}
                        >
                          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
                          {pr.label}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 font-['Space_Grotesk'] text-sm font-semibold text-slate-900 dark:text-white">
                      {t.subject}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                      {t.category && <span>{t.category.name}</span>}
                      <span>{format(t.createdAt, "dd MMM yyyy", { locale: tr })}</span>
                      <span className="tabular-nums">{t._count.messages} mesaj</span>
                    </div>
                  </div>
                  <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-orange-500" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
