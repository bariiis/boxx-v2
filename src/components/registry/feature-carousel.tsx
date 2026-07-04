"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface FeatureCarouselItem {
  id: string;
  label: string;
  image: string;
  description: string;
}

export interface FeatureCarouselConfig {
  features?: FeatureCarouselItem[];
  accentColor?: string;
  autoPlayInterval?: number;
}

const DEFAULT_FEATURES: FeatureCarouselItem[] = [
  {
    id: "feature-1",
    label: "Yüksek Performans",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1200",
    description: "Kurumsal iş yükleri için mühendislik odaklı donanım çözümleri.",
  },
  {
    id: "feature-2",
    label: "GPU Sunucuları",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
    description: "Yapay zeka ve derin öğrenme için optimize edilmiş GPU sistemleri.",
  },
  {
    id: "feature-3",
    label: "Depolama Çözümleri",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200",
    description: "Hızlı ve güvenilir NVMe tabanlı depolama altyapısı.",
  },
  {
    id: "feature-4",
    label: "7/24 Destek",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200",
    description: "Uzman teknik ekibimizle kesintisiz destek hizmeti.",
  },
  {
    id: "feature-5",
    label: "Özel Konfigürasyon",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1200",
    description: "İhtiyacınıza özel donanım yapılandırması ve kurulum.",
  },
];

const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function FeatureCarousel({
  features = DEFAULT_FEATURES,
  accentColor = "#62B2FE",
  autoPlayInterval = 3000,
}: FeatureCarouselConfig) {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const items = features.length > 0 ? features : DEFAULT_FEATURES;
  const currentIndex = ((step % items.length) + items.length) % items.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + items.length) % items.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextStep, isPaused, autoPlayInterval]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = items.length;
    let d = diff;
    if (diff > len / 2) d -= len;
    if (diff < -len / 2) d += len;
    if (d === 0) return "active";
    if (d === -1) return "prev";
    if (d === 1) return "next";
    return "hidden";
  };

  return (
    <div className="w-full max-w-7xl mx-auto md:p-8">
      <div
        className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border border-border/40"
      >
        {/* Sol navigasyon paneli */}
        <div
          className="w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16"
          style={{ backgroundColor: accentColor }}
        >
          {/* Üst/alt fade overlay */}
          <div
            className="absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 z-40"
            style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 z-40"
            style={{ background: `linear-gradient(to top, ${accentColor}, transparent)` }}
          />

          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {items.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(-(items.length / 2), items.length / 2, distance);

              return (
                <motion.div
                  key={feature.id}
                  style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{ type: "spring", stiffness: 90, damping: 22, mass: 1 }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-4 px-6 md:px-10 lg:px-8 py-3.5 md:py-5 lg:py-4 rounded-full transition-all duration-700 text-left group border",
                      isActive
                        ? "bg-white border-white z-10"
                        : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white"
                    )}
                    style={isActive ? { color: accentColor } : {}}
                  >
                    <span className="font-medium text-sm md:text-[15px] tracking-tight whitespace-nowrap uppercase">
                      {feature.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sağ görsel paneli */}
        <div className="flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative bg-secondary/30 flex items-center justify-center py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-border/20">
          <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
            {items.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 25, mass: 0.8 }}
                  className="absolute inset-0 rounded-[2rem] md:rounded-[2.8rem] overflow-hidden border-4 md:border-8 border-background bg-background origin-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={feature.image}
                    alt={feature.label}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive ? "grayscale-0 blur-0" : "grayscale blur-[2px] brightness-75"
                    )}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-0 bottom-0 p-10 pt-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div className="bg-background text-foreground px-4 py-1.5 rounded-full text-[11px] font-normal uppercase tracking-[0.2em] w-fit shadow-lg mb-3 border border-border/50">
                          {index + 1} • {feature.label}
                        </div>
                        <p className="text-white font-normal text-xl md:text-2xl leading-tight drop-shadow-md tracking-tight">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "absolute top-8 left-8 flex items-center gap-3 transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                    <span className="text-white/80 text-[10px] font-normal uppercase tracking-[0.3em] font-mono">
                      Live
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
