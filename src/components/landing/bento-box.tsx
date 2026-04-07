"use client"

import { Activity, Map as MapIcon, MessageCircle } from "lucide-react"
import DottedMap from "dotted-map"
import { Area, AreaChart, CartesianGrid } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BentoBoxItem {
  icon?: string
  label: string
  description: string
}

interface BentoBoxProps {
  topLeftLabel?: string
  topLeftDescription?: string
  topLeftMapBadge?: string
  topRightLabel?: string
  topRightDescription?: string
  centerStat?: string
  bottomLabel?: string
  bottomDescription?: string
  dark?: boolean
}

export function BentoBox({
  topLeftLabel = "Gerçek zamanlı konum takibi",
  topLeftDescription = "Gelişmiş takip sistemi ile tüm varlıklarınızı anında bulun.",
  topLeftMapBadge = "Son bağlantı: Türkiye",
  topRightLabel = "E-posta ve web destek",
  topRightDescription = "İhtiyacınız olan yardım için e-posta veya web üzerinden bize ulaşın.",
  centerStat = "%99.99 Çalışma Süresi",
  bottomLabel = "Aktivite akışı",
  bottomDescription = "Uygulamanızın aktivitesini gerçek zamanlı izleyin.",
  dark = true,
}: BentoBoxProps) {
  return (
    <section className={`px-4 py-16 md:py-32 ${dark ? "bg-[#0a0a0a] text-white" : "bg-white text-[#0a0a0a]"}`}>
      <div className={`mx-auto grid max-w-5xl border md:grid-cols-2 ${dark ? "border-neutral-800" : "border-neutral-200"}`}>
        {/* Top Left - Map */}
        <div>
          <div className="p-6 sm:p-12">
            <span className={`flex items-center gap-2 text-sm ${dark ? "text-neutral-400" : "text-neutral-500"}`}>
              <MapIcon className="size-4" />
              {topLeftLabel}
            </span>
            <p className="mt-8 text-2xl font-semibold">{topLeftDescription}</p>
          </div>
          <div aria-hidden className="relative">
            <div className="absolute inset-0 z-10 m-auto size-fit">
              <div className={`relative z-[1] flex w-fit items-center gap-2 rounded-md border px-3 py-1 text-xs font-medium shadow-md ${
                dark ? "border-neutral-700 bg-neutral-900 shadow-black/20" : "border-neutral-200 bg-white shadow-black/5"
              }`}>
                <span className="text-lg">🇹🇷</span> {topLeftMapBadge}
              </div>
              <div className={`absolute inset-2 -bottom-2 mx-auto rounded-md border px-3 py-4 text-xs font-medium shadow-md ${
                dark ? "border-neutral-700 bg-neutral-900 shadow-black/20" : "border-neutral-200 bg-white shadow-black/5"
              }`} />
            </div>
            <div className="relative overflow-hidden">
              <div className={`absolute inset-0 z-[1] bg-gradient-radial ${
                dark ? "from-transparent to-[#0a0a0a]/75" : "from-transparent to-white/75"
              }`} style={{ background: `radial-gradient(circle, transparent 0%, ${dark ? "#0a0a0a" : "#ffffff"} 75%)` }} />
              <DottedMapSvg dark={dark} />
            </div>
          </div>
        </div>

        {/* Top Right - Chat */}
        <div className={`overflow-hidden border-t p-6 sm:p-12 md:border-0 md:border-l ${
          dark ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-zinc-50"
        }`}>
          <div className="relative z-10">
            <span className={`flex items-center gap-2 text-sm ${dark ? "text-neutral-400" : "text-neutral-500"}`}>
              <MessageCircle className="size-4" />
              {topRightLabel}
            </span>
            <p className="my-8 text-2xl font-semibold">{topRightDescription}</p>
          </div>
          <div aria-hidden className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2">
                <span className={`flex size-5 items-center justify-center rounded-full border ${dark ? "border-neutral-700" : "border-neutral-300"}`}>
                  <span className="size-3 rounded-full bg-blue-500" />
                </span>
                <span className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>Bugün 14:30</span>
              </div>
              <div className={`mt-1.5 w-3/5 rounded-md border p-3 text-xs ${
                dark ? "border-neutral-700 bg-neutral-900" : "border-neutral-200 bg-white"
              }`}>
                Merhaba, hesabımla ilgili bir sorun yaşıyorum.
              </div>
            </div>
            <div>
              <div className="mb-1 ml-auto w-3/5 rounded-md bg-blue-600 p-3 text-xs text-white">
                Tabii, hemen yardımcı olayım. Hesabınızla ilgili detayları paylaşır mısınız?
              </div>
              <span className={`block text-right text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>Şimdi</span>
            </div>
          </div>
        </div>

        {/* Center - Stat */}
        <div className={`col-span-full border-y p-12 ${dark ? "border-neutral-800" : "border-neutral-200"}`}>
          <p className="text-center text-4xl font-semibold lg:text-7xl">{centerStat}</p>
        </div>

        {/* Bottom - Chart */}
        <div className="relative col-span-full">
          <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
            <span className={`flex items-center gap-2 text-sm ${dark ? "text-neutral-400" : "text-neutral-500"}`}>
              <Activity className="size-4" />
              {bottomLabel}
            </span>
            <p className="my-8 text-2xl font-semibold">
              {bottomDescription}
            </p>
          </div>
          <MonitoringChart />
        </div>
      </div>
    </section>
  )
}

// Dotted Map
const map = new DottedMap({ height: 55, grid: "diagonal" })
const points = map.getPoints()

function DottedMapSvg({ dark }: { dark: boolean }) {
  return (
    <svg viewBox="0 0 120 60" style={{ background: dark ? "#0a0a0a" : "#ffffff" }}>
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={0.15}
          fill={dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}
        />
      ))}
    </svg>
  )
}

// Chart
const chartConfig = {
  desktop: { label: "Desktop", color: "#2563eb" },
  mobile: { label: "Mobile", color: "#60a5fa" },
} satisfies ChartConfig

const chartData = [
  { month: "Oca", desktop: 126, mobile: 252 },
  { month: "Şub", desktop: 205, mobile: 410 },
  { month: "Mar", desktop: 200, mobile: 126 },
  { month: "Nis", desktop: 400, mobile: 800 },
  { month: "May", desktop: 56, mobile: 224 },
  { month: "Haz", desktop: 56, mobile: 224 },
]

function MonitoringChart() {
  return (
    <ChartContainer className="aspect-auto h-80 md:h-96" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 0, right: 0 }}
      >
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <ChartTooltip active cursor={false} content={<ChartTooltipContent />} />
        <Area strokeWidth={2} dataKey="mobile" type="stepBefore" fill="url(#fillMobile)" fillOpacity={0.1} stroke="var(--color-mobile)" stackId="a" />
        <Area strokeWidth={2} dataKey="desktop" type="stepBefore" fill="url(#fillDesktop)" fillOpacity={0.1} stroke="var(--color-desktop)" stackId="a" />
      </AreaChart>
    </ChartContainer>
  )
}
