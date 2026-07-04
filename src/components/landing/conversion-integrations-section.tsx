"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const ACCENT = "#2dd4bf"

const MainLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
    <rect width="40" height="40" rx="10" fill="currentColor" />
    <path
      d="M12 20C12 16 14 14 20 14C26 14 28 16 28 20C28 20 26 18 20 18C14 18 12 20 12 20Z"
      fill="var(--lp-bg)"
    />
    <path
      d="M12 20C12 24 14 26 20 26C26 26 28 24 28 20C28 20 26 22 20 22C14 22 12 20 12 20Z"
      fill="var(--lp-bg)"
    />
  </svg>
)

// ── Preset SVG logos (kept for backward-compat with old configs) ──────────────

const GoogleAdsLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <path d="M38 34L24 10L16 24L30 48L38 34Z" fill="#FBBC04" />
    <path d="M10 34L24 10L32 24L18 48L10 34Z" fill="#4285F4" />
    <path d="M10 38C14.4183 38 18 34.4183 18 30C18 25.5817 14.4183 22 10 22C5.58172 22 2 25.5817 2 30C2 34.4183 5.58172 38 10 38Z" fill="#34A853" />
  </svg>
)

const SalesforceLogo = () => (
  <svg viewBox="0 0 48 32" fill="none" className="w-12 h-8">
    <path
      d="M20 4C16.5 4 13.5 6 12 9C8.5 8.5 5 11 5 15C5 19.5 8.5 22 12 22C12 25.5 15 29 20 29C23 29 25.5 27.5 27 25C28.5 27 31 28 34 28C39 28 43 24 43 19C43 14.5 40 11 36 10.5C35.5 7 32.5 4 28 4C25 4 22.5 5.5 21 8C20.7 6 20.5 4 20 4Z"
      fill="#00A1E0"
    />
    <text x="11" y="19" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
      salesforce
    </text>
  </svg>
)

const SnowflakeLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <path
      d="M24 4V44M4 24H44M9.86 9.86L38.14 38.14M38.14 9.86L9.86 38.14"
      stroke="#29B5E8"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="24" cy="4" r="3" fill="#29B5E8" />
    <circle cx="24" cy="44" r="3" fill="#29B5E8" />
    <circle cx="4" cy="24" r="3" fill="#29B5E8" />
    <circle cx="44" cy="24" r="3" fill="#29B5E8" />
    <circle cx="9.86" cy="9.86" r="3" fill="#29B5E8" />
    <circle cx="38.14" cy="38.14" r="3" fill="#29B5E8" />
    <circle cx="38.14" cy="9.86" r="3" fill="#29B5E8" />
    <circle cx="9.86" cy="38.14" r="3" fill="#29B5E8" />
  </svg>
)

const SlackLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <path d="M10 30C10 32.2 8.2 34 6 34C3.8 34 2 32.2 2 30C2 27.8 3.8 26 6 26H10V30Z" fill="#E01E5A" />
    <path d="M12 30C12 27.8 13.8 26 16 26C18.2 26 20 27.8 20 30V42C20 44.2 18.2 46 16 46C13.8 46 12 44.2 12 42V30Z" fill="#E01E5A" />
    <path d="M16 10C13.8 10 12 8.2 12 6C12 3.8 13.8 2 16 2C18.2 2 20 3.8 20 6V10H16Z" fill="#36C5F0" />
    <path d="M16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20H4C1.8 20 0 18.2 0 16C0 13.8 1.8 12 4 12H16Z" fill="#36C5F0" />
    <path d="M36 16C36 13.8 37.8 12 40 12C42.2 12 44 13.8 44 16C44 18.2 42.2 20 40 20H36V16Z" fill="#2EB67D" />
    <path d="M34 16C34 18.2 32.2 20 30 20C27.8 20 26 18.2 26 16V4C26 1.8 27.8 0 30 0C32.2 0 34 1.8 34 4V16Z" fill="#2EB67D" />
    <path d="M30 36C32.2 36 34 37.8 34 40C34 42.2 32.2 44 30 44C27.8 44 26 42.2 26 40V36H30Z" fill="#ECB22E" />
    <path d="M30 34C27.8 34 26 32.2 26 30C26 27.8 27.8 26 30 26H42C44.2 26 46 27.8 46 30C46 32.2 44.2 34 42 34H30Z" fill="#ECB22E" />
  </svg>
)

const HubSpotLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <circle cx="24" cy="24" r="6" fill="#FF7A59" />
    <circle cx="24" cy="10" r="4" fill="#FF7A59" />
    <circle cx="36" cy="30" r="4" fill="#FF7A59" />
    <circle cx="12" cy="30" r="4" fill="#FF7A59" />
  </svg>
)

const ZapierLogo = () => (
  <svg viewBox="0 0 80 24" fill="none" className="w-20 h-6">
    <text x="0" y="18" fill="#FF4F00" fontSize="18" fontWeight="bold" fontFamily="sans-serif">
      _zapier
    </text>
  </svg>
)

const PRESET_LOGOS = {
  google: GoogleAdsLogo,
  salesforce: SalesforceLogo,
  snowflake: SnowflakeLogo,
  slack: SlackLogo,
  hubspot: HubSpotLogo,
  zapier: ZapierLogo,
} as const

type PresetLogoKey = keyof typeof PRESET_LOGOS

export interface CustomLogoEntry {
  name: string
  imageUrl: string
}

export type LogoEntry = PresetLogoKey | CustomLogoEntry

// ── Corner accent dots on each integration card ───────────────────────────────

const IntegrationNode = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="relative flex items-center justify-center w-20 h-20 rounded-lg border"
    style={{ borderColor: "var(--lp-border)", backgroundColor: "var(--lp-muted)" }}
  >
    {children}
    <div className="absolute -top-1 -left-1 w-2 h-2 rounded-sm" style={{ backgroundColor: ACCENT }} />
    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-sm" style={{ backgroundColor: ACCENT }} />
    <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-sm" style={{ backgroundColor: ACCENT }} />
    <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-sm" style={{ backgroundColor: ACCENT }} />
  </motion.div>
)

// ── Default logos shown when no config is set ─────────────────────────────────

const DEFAULT_LOGOS: LogoEntry[] = ["google", "salesforce", "snowflake", "slack", "hubspot", "zapier"]

export interface ConversionIntegrationsSectionProps {
  label?: string
  title?: string
  description?: string
  ctaText?: string
  ctaHref?: string
  logos?: LogoEntry[]
  demoteHeading?: boolean
}

export function ConversionIntegrationsSection({
  label = "ENTEGRASYONLAR",
  title = "Tek Tıkla Entegrasyon.\nSınırsız Potansiyel.",
  description = "STUUX; CRM, veri ambarı, analitik ve reklam araçlarınızla sorunsuz çalışır. Silolanmış verinizi AI destekli koordineli kampanyalara dönüştürür.",
  ctaText = "Demo İste",
  ctaHref = "/iletisim",
  logos = DEFAULT_LOGOS,
  demoteHeading = false,
}: ConversionIntegrationsSectionProps) {
  const Heading = demoteHeading ? "h3" : "h2"
  const lines = title.split("\n")
  const visibleLogos = logos.slice(0, 6)

  const X_POSITIONS = [80, 200, 320, 480, 600, 720]

  return (
    <section
      className="relative w-full py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: "var(--lp-bg)", color: "var(--lp-fg)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <span
              className="text-xs font-medium tracking-widest uppercase mb-4 block"
              style={{ color: "var(--lp-muted-fg)" }}
            >
              {label}
            </span>
            <Heading className="text-4xl md:text-5xl lg:text-6xl leading-tight">
              {lines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < lines.length - 1 && <br />}
                </span>
              ))}
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1 max-w-md"
          >
            <div
              className="text-base md:text-lg leading-relaxed mb-6 [&_strong]:font-bold [&_strong]:text-[color:var(--lp-fg)] [&_em]:italic [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              style={{ color: "var(--lp-muted-fg)" }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
            {ctaText && ctaHref && (
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 hover:bg-white/5"
                style={{ borderColor: "var(--lp-border)", color: "var(--lp-fg)" }}
              >
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        </div>

        {/* Hub + connector tree + logo boxes */}
        <div className="relative flex flex-col items-center">
          {/* Central hub card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative z-10 flex items-center justify-center w-24 h-24 rounded-lg border-2 border-dashed"
            style={{ borderColor: ACCENT, backgroundColor: "var(--lp-muted)", color: "var(--lp-fg)" }}
          >
            <MainLogo />
          </motion.div>

          {/*
            Single relative container: SVG draws the wires, logo boxes are
            absolutely positioned using the same viewBox percentages so they
            align exactly with line endpoints regardless of container width.
          */}
          <div className="relative w-full max-w-5xl" style={{ height: 300 }}>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 300"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Stem from hub */}
              <motion.path
                d="M400 0 L400 40"
                stroke={ACCENT}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              />
              {/* Horizontal bus */}
              <motion.path
                d="M80 40 L720 40"
                stroke={ACCENT}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              />
              {/* Branches — even → y=200, odd → y=160, staggered for depth */}
              {X_POSITIONS.slice(0, visibleLogos.length).map((x, i) => (
                <motion.path
                  key={i}
                  d={`M${x} 40 L${x} ${i % 2 === 0 ? 200 : 160}`}
                  stroke={ACCENT}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                  viewport={{ once: true }}
                />
              ))}
              {/* Junction dots on the bus */}
              {[...X_POSITIONS.slice(0, visibleLogos.length), 400].map((x, i) => (
                <motion.rect
                  key={i}
                  x={x - 4}
                  y={36}
                  width="8"
                  height="8"
                  fill={ACCENT}
                  rx="1"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                  viewport={{ once: true }}
                />
              ))}
            </svg>

            {/* Logo boxes — left % matches SVG x/800, top % matches SVG y/300 */}
            {visibleLogos.map((entry, i) => {
              const xPct = X_POSITIONS[i] / 800 * 100
              const topPct = (i % 2 === 0 ? 200 : 160) / 300 * 100

              let logoContent: React.ReactNode
              if (typeof entry === "string") {
                const Logo = PRESET_LOGOS[entry as PresetLogoKey]
                logoContent = Logo ? <Logo /> : null
              } else {
                logoContent = entry.imageUrl ? (
                  <div className="relative w-12 h-12">
                    <Image
                      src={entry.imageUrl}
                      alt={entry.name || "logo"}
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <span className="text-[10px] text-center leading-tight px-1 opacity-60">
                    {entry.name}
                  </span>
                )
              }

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: `${xPct}%`, top: `${topPct}%`, transform: "translateX(-50%)" }}
                >
                  <IntegrationNode delay={0.9 + i * 0.1}>
                    {logoContent}
                  </IntegrationNode>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
