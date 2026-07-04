"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Plus } from "lucide-react"

function GridStackIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
      <svg width="100%" height="100%" viewBox="0 0 791 669" fill="none" className="max-w-full max-h-full">
        {[0, 120, 240, 360].map((x, i) => (
          <path
            key={i}
            opacity="0.25"
            d={`M${377.449 + x} 24.2664L${22.1248 + x} 192.099C9.24419 198.183 1.16249 211.29 1.51081 225.531L10.925 610.428C11.5763 637.054 39.9132 653.778 63.5378 641.48L${409.448 + x} 461.403C421.355 455.204 428.824 442.895 428.824 429.471V56.8179C428.824 30.407 401.33 12.9865 ${377.449 + x} 24.2664Z`}
            fill="#2C2C2C"
            fillOpacity="0.8"
            stroke="#424242"
            strokeWidth="3"
          />
        ))}
      </svg>
    </div>
  )
}

function PlaceholderIllustration({ label }: { label: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-zinc-900/40">
      <span className="text-zinc-700 font-mono text-[10px] uppercase tracking-widest">{label}</span>
    </div>
  )
}

const featureCards: { title: string; illustration: ReactNode }[] = [
  { title: "Scrum için proje planlama", illustration: <GridStackIllustration /> },
  { title: "Ölçeklenen iterasyon yönetimi", illustration: <PlaceholderIllustration label="Speed" /> },
  { title: "Hassasiyet önemli olduğunda", illustration: <PlaceholderIllustration label="Precision" /> },
]

export function SplitFeatureCards({ demoteHeading = false }: { demoteHeading?: boolean }) {
  const Heading = demoteHeading ? "h3" : "h2"

  return (
    <section className="relative z-20 py-40" style={{ backgroundColor: "#09090B" }}>
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "20%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)",
        }}
      />
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Heading
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-white max-w-md"
                style={{
                  letterSpacing: "-0.0325em",
                  fontVariationSettings: '"opsz" 28',
                  fontWeight: 538,
                  lineHeight: 1.1,
                }}
              >
                Modern ürün ekipleri için tasarlandı
              </Heading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-md"
            >
              <p className="text-zinc-400 leading-relaxed">
                Dünya standartlarındaki ürün ekiplerini diğerlerinden ayıran prensipler: odaklanma,
                hızlı icra ve zanaat kalitesine bağlılık.{" "}
                <a href="#" className="text-white inline-flex items-center gap-1 hover:underline">
                  Geçişi yapın <ChevronRight className="w-4 h-4" />
                </a>
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group overflow-hidden relative flex flex-col justify-end"
                style={{
                  aspectRatio: "336 / 360",
                  borderRadius: "30px",
                  height: "360px",
                  isolation: "isolate",
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full flex"
                  style={{
                    maskImage: "linear-gradient(#000 70%, transparent 90%)",
                    WebkitMaskImage: "linear-gradient(#000 70%, transparent 90%)",
                  }}
                >
                  {card.illustration}
                </div>
                <div
                  className="relative z-10 flex items-center justify-between w-full"
                  style={{ padding: "0 24px 40px", gap: "16px" }}
                >
                  <h3 className="text-white font-medium text-lg leading-tight">{card.title}</h3>
                  <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:border-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
