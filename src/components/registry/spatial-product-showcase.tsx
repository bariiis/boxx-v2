"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  Battery, Sliders, ChevronRight, Zap, Bluetooth, Wifi, Music,
  Activity, Cpu, Radio, Volume2, Headphones, type LucideIcon,
} from "lucide-react";

// =========================================
// ICON MAP
// =========================================

const ICON_MAP: Record<string, LucideIcon> = {
  zap: Zap, bluetooth: Bluetooth, wifi: Wifi, music: Music,
  activity: Activity, cpu: Cpu, radio: Radio, volume: Volume2, headphones: Headphones,
};

function getIcon(key: string): LucideIcon {
  return ICON_MAP[key] ?? Zap;
}

// =========================================
// CONFIG TYPES
// =========================================

export interface FeatureMetricConfig {
  label: string;
  value: number; // 0-100, progress bar
  icon: string;
}

export interface SpecItemConfig {
  label: string; // açıklama metni
  icon: string;
}

export interface ProductConfig {
  label: string;
  title: string;
  description: string;
  image: string;
  gradientClass: string;
  glowClass: string;
  ringClass: string;
  connectionStatus: string;
  batteryLevel: number;
  features: FeatureMetricConfig[]; // progress bar'lı metrikler
  specs?: SpecItemConfig[];        // sadece ikon + metin özellikler
}

export interface SpatialProductShowcaseConfig {
  products?: ProductConfig[];
}

// =========================================
// DEFAULTS
// =========================================

export const DEFAULT_PRODUCTS: ProductConfig[] = [
  {
    label: "Left",
    title: "Spatial Anchor",
    description: "The primary node for binaural synchronization. Handles low-latency transmission and anchors the spatial audio soundstage.",
    image: "https://ik.imagekit.io/kqmrslzuq/SOUND/left-earbud.png",
    gradientClass: "from-blue-600 to-indigo-900",
    glowClass: "bg-blue-500",
    ringClass: "border-l-blue-500/50",
    connectionStatus: "Connected",
    batteryLevel: 82,
    features: [
      { label: "Latency", value: 12, icon: "zap" },
      { label: "Sync Rate", value: 98, icon: "wifi" },
    ],
  },
  {
    label: "Right",
    title: "Vocal Clarity",
    description: "Optimized for high-frequency detail and voice pickup. Contains the beamforming microphone array for crystal clear calls.",
    image: "https://ik.imagekit.io/kqmrslzuq/SOUND/right-earbud.png",
    gradientClass: "from-emerald-600 to-teal-900",
    glowClass: "bg-emerald-500",
    ringClass: "border-r-emerald-500/50",
    connectionStatus: "Connected",
    batteryLevel: 74,
    features: [
      { label: "Bitrate", value: 94, icon: "bluetooth" },
      { label: "Clarifier", value: 88, icon: "music" },
    ],
  },
];

// =========================================
// ANIMATION VARIANTS
// =========================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 20 } },
  exit: { opacity: 0, y: -10, filter: "blur(5px)" },
};

const imageVariants = (isLeft: boolean): Variants => ({
  initial: { opacity: 0, scale: 1.5, filter: "blur(15px)", rotate: isLeft ? -30 : 30, x: isLeft ? -80 : 80 },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", rotate: 0, x: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
  exit: { opacity: 0, scale: 0.6, filter: "blur(20px)", transition: { duration: 0.25 } },
});

// =========================================
// SUB-COMPONENTS
// =========================================

function ProductVisual({ data, isLeft }: { data: ProductConfig; isLeft: boolean }) {
  return (
    <motion.div layout="position" className="relative group shrink-0">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-[-20%] rounded-full border border-dashed border-white/10 ${data.ringClass}`}
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${data.gradientClass} blur-2xl opacity-40`}
      />
      <div className="relative h-80 w-80 md:h-[450px] md:w-[450px] rounded-full border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-sm">
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative z-10 w-full h-full flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={data.title}
              src={data.image}
              alt={data.title}
              variants={imageVariants(isLeft)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4"
              draggable={false}
            />
          </AnimatePresence>
        </motion.div>
      </div>
      <motion.div layout="position" className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 bg-zinc-950/80 px-4 py-2 rounded-full border border-white/5 backdrop-blur">
          <span className={`h-1.5 w-1.5 rounded-full ${data.glowClass} animate-pulse`} />
          {data.connectionStatus}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductDetails({ data, isLeft }: { data: ProductConfig; isLeft: boolean }) {
  const alignClass = isLeft ? "items-start text-left" : "items-end text-right";
  const flexDirClass = isLeft ? "flex-row" : "flex-row-reverse";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${alignClass}`}
    >
      <motion.h2 variants={itemVariants} className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
        {data.label}
      </motion.h2>
      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500"
      >
        {data.title}
      </motion.h1>
      <motion.p variants={itemVariants} className={`text-zinc-400 mb-8 max-w-sm leading-relaxed ${isLeft ? "mr-auto" : "ml-auto"}`}>
        {data.description}
      </motion.p>

      <motion.div variants={itemVariants} className="w-full space-y-6 bg-zinc-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
        {/* Progress bar metrics */}
        {(data.features ?? []).map((feature, idx) => {
          const Icon = getIcon(feature.icon);
          return (
            <div key={idx} className="group">
              <div className={`flex items-center justify-between mb-3 text-sm ${flexDirClass}`}>
                <div className={`flex items-center gap-2 ${feature.value > 50 ? "text-zinc-200" : "text-zinc-400"}`}>
                  <Icon size={16} /> <span>{feature.label}</span>
                </div>
                <span className="font-mono text-xs text-zinc-500">{feature.value}%</span>
              </div>
              <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${feature.value}%` }}
                  transition={{ duration: 1, delay: 0.4 + idx * 0.15 }}
                  className={`absolute top-0 bottom-0 left-0 ${data.glowClass} opacity-80`}
                />
              </div>
            </div>
          );
        })}

        {/* Text-only specs */}
        {(data.specs ?? []).length > 0 && (
          <div className={`space-y-3 ${(data.features ?? []).length > 0 ? "pt-4 border-t border-white/5" : ""}`}>
            {(data.specs ?? []).map((spec, idx) => {
              const Icon = getIcon(spec.icon);
              return (
                <div key={idx} className={`flex items-center gap-3 text-sm text-zinc-300 ${flexDirClass}`}>
                  <Icon size={15} className="shrink-0 text-zinc-500" />
                  <span>{spec.label}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className={`pt-4 flex ${isLeft ? "justify-start" : "justify-end"}`}>
          <button type="button" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors group">
            <Sliders size={14} /> View Specs
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className={`mt-6 flex items-center gap-3 text-zinc-500 ${flexDirClass}`}>
        <Battery size={16} />
        <span className="text-sm font-medium">{data.batteryLevel}% Charge</span>
      </motion.div>
    </motion.div>
  );
}

function Switcher({
  activeIndex,
  products,
  onSelect,
}: {
  activeIndex: number;
  products: ProductConfig[];
  onSelect: (i: number) => void;
}) {
  return (
    <div className="absolute bottom-12 inset-x-0 flex justify-center z-50 pointer-events-none">
      <motion.div
        layout
        className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/5"
      >
        {products.map((p, i) => (
          <motion.button
            key={i}
            onClick={() => onSelect(i)}
            whileTap={{ scale: 0.96 }}
            className="relative min-w-[6rem] h-12 px-4 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none"
          >
            {activeIndex === i && (
              <motion.div
                layoutId="island-surface"
                className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-white/5 shadow-inner"
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
              />
            )}
            <span className={`relative z-10 transition-colors duration-300 ${activeIndex === i ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
              {p.label}
            </span>
            {activeIndex === i && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-1 h-1 w-6 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

// =========================================
// MAIN COMPONENT
// =========================================

export default function SpatialProductShowcase({
  products = DEFAULT_PRODUCTS,
}: SpatialProductShowcaseConfig) {
  const safeProducts = products.length > 0 ? products : DEFAULT_PRODUCTS;
  const [activeIndex, setActiveIndex] = useState(0);
  const currentData = safeProducts[activeIndex] ?? safeProducts[0];
  const isLeft = activeIndex % 2 === 0;

  return (
    <div className="relative w-full min-h-screen bg-black text-zinc-100 overflow-hidden selection:bg-zinc-800 flex flex-col items-center justify-center">
      {/* Subtle radial glow — original approach */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            background: isLeft
              ? "radial-gradient(circle at 0% 50%, rgba(59, 130, 246, 0.15), transparent 50%)"
              : "radial-gradient(circle at 100% 50%, rgba(16, 185, 129, 0.15), transparent 50%)",
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        />
      </div>

      <main className="relative z-10 w-full px-6 py-8 flex flex-col justify-center max-w-7xl mx-auto pb-32">
        <motion.div
          layout
          transition={{ type: "spring", bounce: 0, duration: 0.9 }}
          className={`flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 lg:gap-48 w-full ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
        >
          <ProductVisual data={currentData} isLeft={isLeft} />

          <motion.div layout="position" className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <ProductDetails key={activeIndex} data={currentData} isLeft={isLeft} />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      <Switcher activeIndex={activeIndex} products={safeProducts} onSelect={setActiveIndex} />
    </div>
  );
}
