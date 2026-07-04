"use client"

import { motion } from "motion/react"
import { ArrowRight, MessageSquare, Bell, Type, Zap, Server, Monitor, Database, Network } from "lucide-react"

const ICON_MAP: Record<string, React.ReactNode> = {
  "message-square": <MessageSquare className="w-4 h-4" />,
  bell: <Bell className="w-4 h-4" />,
  type: <Type className="w-4 h-4" />,
  zap: <Zap className="w-4 h-4" />,
  server: <Server className="w-4 h-4" />,
  monitor: <Monitor className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  network: <Network className="w-4 h-4" />,
}

export interface LiveblocksFeatureChip {
  label: string
  icon: string
  color: string
}

export interface LiveblocksHomeHeroProps {
  badgeText?: string
  badgeLinkText?: string
  headline?: string
  descriptionPrefix?: string
  descriptionSuffix?: string
  features?: LiveblocksFeatureChip[]
  primaryCtaText?: string
  primaryCtaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  bottomImage?: string
  demoteHeading?: boolean
}

export function LiveblocksHomeHero({
  badgeText = "Yeni",
  badgeLinkText = "Liveblocks 2.0",
  headline = "Ürününüzde\niş birliğini keşfedin",
  descriptionPrefix = "Ship features like",
  descriptionSuffix = "in days, not months. Engage users, fuel creativity, and drive growth. Finally.",
  features = [
    { label: "GPU Server", icon: "server", color: "#F5A623" },
    { label: "Workstation", icon: "monitor", color: "#7ED321" },
    { label: "Storage", icon: "database", color: "#BD10E0" },
    { label: "Networking", icon: "network", color: "#E74C3C" },
  ],
  primaryCtaText = "Ücretsiz Başla",
  primaryCtaHref = "#",
  secondaryCtaText = "Belgeleri Oku",
  secondaryCtaHref = "#",
  bottomImage,
  demoteHeading = false,
}: LiveblocksHomeHeroProps) {
  const HeadingTag = demoteHeading ? "h2" : "h1"

  return (
    <section className="relative min-h-screen w-full bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-neutral-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,30,30,0.3)_0%,_transparent_70%)]" />

      {/* Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-neutral-800/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-32">
        {/* Badge */}
        <motion.a
          href={primaryCtaHref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors mb-8"
        >
          <span className="text-neutral-400 text-sm">{badgeText}</span>
          <span className="text-white text-sm font-medium">{badgeLinkText}</span>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
        </motion.a>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <HeadingTag
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-[1.1] tracking-tight mb-6"
            style={{ whiteSpace: "pre-line" }}
          >
            {headline}
          </HeadingTag>
        </motion.div>

        {/* Description with feature chips */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-400 text-center max-w-3xl leading-relaxed mb-10"
        >
          {descriptionPrefix && <span>{descriptionPrefix} </span>}
          {features.map((f, i) => (
            <span key={f.label}>
              <span className="inline-flex items-center gap-1.5 text-white font-medium">
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded"
                  style={{ backgroundColor: f.color }}
                >
                  {ICON_MAP[f.icon] ?? <Zap className="w-4 h-4" />}
                </span>
                {f.label}
              </span>
              {i < features.length - 1 && <span>, </span>}
            </span>
          ))}
          {descriptionSuffix && <span> {descriptionSuffix}</span>}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {primaryCtaText && (
            <a
              href={primaryCtaHref}
              className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-colors"
            >
              {primaryCtaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
          {secondaryCtaText && (
            <a
              href={secondaryCtaHref}
              className="group flex items-center gap-2 px-6 py-3 text-white font-medium hover:text-neutral-300 transition-colors"
            >
              {secondaryCtaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
        </motion.div>
      </div>

      {/* Bottom image */}
      {bottomImage && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
        >
          <div className="relative w-full h-full">
            <img
              src={bottomImage}
              alt=""
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-auto object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
        </motion.div>
      )}
    </section>
  )
}
