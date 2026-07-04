"use client"

import { motion, type Variants } from "framer-motion"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
}

interface BentoGridItem {
  title: string
  description: string
  stat?: string
  badge?: string
  image?: string
}

interface BentoGridProps {
  headline?: string
  subheadline?: string
  items: BentoGridItem[]
  dark?: boolean
}

export function BentoGrid({
  headline,
  subheadline,
  items = [],
  dark = true,
}: BentoGridProps) {
  // Pad to 6 items
  const slots = [...items]
  while (slots.length < 6) {
    slots.push({ title: "", description: "" })
  }

  const bg = dark ? "bg-[#0a0a0a] text-white" : "bg-white text-[#0a0a0a]"
  const cardBg = dark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"
  const mutedText = dark ? "text-neutral-400" : "text-neutral-500"
  const badgeBg = dark ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-600"
  const dotColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"

  return (
    <section className={`px-4 py-16 md:py-32 ${bg}`}>
      <div className="mx-auto max-w-5xl">
        {(headline || subheadline) && (
          <div className="mb-12 text-center">
            {headline && (
              <h2 className="text-4xl font-bold tracking-tight">{headline}</h2>
            )}
            {subheadline && (
              <p className={`mt-3 text-lg ${mutedText}`}>{subheadline}</p>
            )}
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-3 auto-rows-[minmax(180px,auto)]"
        >
          {/* Slot 0: Tall left card (spans 3 rows) */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-3">
            <div className={`relative flex h-full flex-col overflow-hidden rounded-xl border ${cardBg}`}>
              {slots[0].image && (
                <img
                  src={slots[0].image}
                  alt=""
                  className="absolute bottom-3 right-3 rounded-md object-contain"
                  style={{ height: 50, width: "auto" }}
                />
              )}
              <div className="relative flex h-full flex-col p-6">
                <h3 className="text-xl font-semibold">{slots[0].title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${mutedText}`}>{slots[0].description}</p>
                {slots[0].stat && (
                  <div className="mt-auto pt-8">
                    <span className="text-5xl font-bold">{slots[0].stat}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Slot 1: Top middle */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
            <div className={`relative flex h-full flex-col justify-between overflow-hidden rounded-xl border ${cardBg}`}>
              {slots[1].image && (
                <img
                  src={slots[1].image}
                  alt=""
                  className="absolute bottom-3 right-3 rounded-md object-contain"
                  style={{ height: 50, width: "auto" }}
                />
              )}
              <div className="relative flex h-full flex-col justify-between p-6">
                <div>
                  <h3 className="text-base font-semibold">{slots[1].title}</h3>
                  <p className={`mt-1 text-sm ${mutedText}`}>{slots[1].description}</p>
                </div>
                {slots[1].stat && (
                  <span className="mt-4 text-3xl font-bold">{slots[1].stat}</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Slot 2: Top right - dotted bg with big stat */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
            <div className={`relative flex h-full items-center justify-center overflow-hidden rounded-xl border ${cardBg}`}>
              {slots[2].image ? (
                <img
                  src={slots[2].image}
                  alt=""
                  className="absolute bottom-3 right-3 rounded-md object-contain"
                  style={{ height: 50, width: "auto" }}
                />
              ) : (
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
                    backgroundSize: "16px 16px",
                  }}
                />
              )}
              <div className="relative z-10 p-6 text-center">
                {slots[2].stat ? (
                  <span className="text-7xl font-bold">{slots[2].stat}</span>
                ) : (
                  <>
                    <h3 className="text-base font-semibold">{slots[2].title}</h3>
                    <p className={`mt-1 text-sm ${mutedText}`}>{slots[2].description}</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Slot 3: Middle middle */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
            <div className={`relative flex h-full flex-col justify-between overflow-hidden rounded-xl border ${cardBg}`}>
              {slots[3].image && (
                <img
                  src={slots[3].image}
                  alt=""
                  className="absolute bottom-3 right-3 rounded-md object-contain"
                  style={{ height: 50, width: "auto" }}
                />
              )}
              <div className="relative flex h-full flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold">{slots[3].title}</h3>
                    <p className={`mt-1 text-sm ${mutedText}`}>{slots[3].description}</p>
                  </div>
                  {slots[3].badge && (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeBg}`}>
                      {slots[3].badge}
                    </span>
                  )}
                </div>
                {slots[3].stat && (
                  <span className="mt-4 text-5xl font-bold">{slots[3].stat}</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Slot 4: Middle right */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
            <div className={`relative flex h-full flex-col justify-end overflow-hidden rounded-xl border ${cardBg}`}>
              {slots[4].image && (
                <img
                  src={slots[4].image}
                  alt=""
                  className="absolute bottom-3 right-3 rounded-md object-contain"
                  style={{ height: 50, width: "auto" }}
                />
              )}
              <div className="relative p-6">
                <h3 className="text-base font-semibold">{slots[4].title}</h3>
                <p className={`mt-1 text-sm ${mutedText}`}>{slots[4].description}</p>
              </div>
            </div>
          </motion.div>

          {/* Slot 5: Wide bottom (spans 2 cols) */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1">
            <div className={`relative flex h-full items-center overflow-hidden rounded-xl border ${cardBg}`}>
              {slots[5].image && (
                <img
                  src={slots[5].image}
                  alt=""
                  className="absolute bottom-3 right-3 rounded-md object-contain"
                  style={{ height: 50, width: "auto" }}
                />
              )}
              <div className="relative flex h-full w-full items-center p-6">
                <div>
                  <h3 className="text-base font-semibold">{slots[5].title}</h3>
                  <p className={`mt-1 text-sm ${mutedText}`}>{slots[5].description}</p>
                </div>
                {slots[5].stat && (
                  <span className="ml-auto text-3xl font-bold">{slots[5].stat}</span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
