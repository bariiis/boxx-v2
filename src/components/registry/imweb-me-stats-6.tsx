"use client";

import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

const COLORS = {
  light: {
    accent: "#00b9ff",
    accentLight: "#2dc5ff",
    text: "#15181e",
    textSecondary: "#424549",
    textMuted: "#8e9093",
    background: "#ffffff",
  },
  dark: {
    accent: "#00b9ff",
    accentLight: "#2dc5ff",
    text: "#ffffff",
    textSecondary: "#e5e5e5",
    textMuted: "#a0a0a0",
    background: "#0f0f0f",
  },
} as const;

export interface BarData {
  year: string;
  value: number | null;
  unit?: string;
}

export interface StatData {
  label: string;
  value: string;
  unit: string;
  hasGradient?: boolean;
}

export interface ImwebMeStats6Config {
  mode?: "light" | "dark";
  title?: string;
  videoUrl?: string;
  mainStatLabel?: string;
  mainStatValue?: number;
  mainStatUnit?: string;
  bars?: BarData[];
  bottomStats?: StatData[];
}

function AnimatedNumber({ value, delay = 0, duration = 1.5 }: { value: number; delay?: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / (duration * 1000), 1);
        setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [inView, value, delay, duration]);
  return <span ref={ref}>{display}</span>;
}

function AnimatedNumberString({ value, delay = 0, duration = 1.5 }: { value: string; delay?: number; duration?: number }) {
  const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / (duration * 1000), 1);
        setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * num));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [inView, num, delay, duration]);
  return <span ref={ref}>{value.includes(",") ? display.toLocaleString() : display}</span>;
}

function GradientNumber({ value, delay = 0, duration = 1.5, baseColor }: { value: string; delay?: number; duration?: number; baseColor: string }) {
  const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / (duration * 1000), 1);
        setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * num));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [inView, num, delay, duration]);
  const opacities = [1, 0.7, 0.35];
  return (
    <span ref={ref} className="inline-flex">
      {display.toString().split("").map((d, i) => (
        <span key={i} style={{ color: baseColor, opacity: opacities[i] ?? 0.35 }}>{d}</span>
      ))}
    </span>
  );
}

const DEFAULT_BARS: BarData[] = [
  { year: "2021", value: null },
  { year: "2022", value: null },
  { year: "2023", value: 60, unit: "만 개" },
  { year: "2024", value: 80, unit: "만 개" },
];

const DEFAULT_BOTTOM_STATS: StatData[] = [
  { label: "연평균 거래액 성장률", value: "342", unit: "%", hasGradient: true },
  { label: "고객사 거래액", value: "6", unit: "조 원", hasGradient: false },
  { label: "전국 디자이너 · 전문가 수", value: "4000", unit: "명", hasGradient: false },
];

export default function ImwebMeStats6({
  mode = "light",
  title = "지금 가장\n빠르게 성장하는\n브랜드 빌더",
  videoUrl = "https://static-v2.imweb.me/io/home/growth-graph-video.mp4",
  mainStatLabel = "2025 누적 사이트 개설 수",
  mainStatValue = 100,
  mainStatUnit = "만 개",
  bars = DEFAULT_BARS,
  bottomStats = DEFAULT_BOTTOM_STATS,
}: ImwebMeStats6Config) {
  const colors = COLORS[mode ?? "light"];
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const barHeights = [48, 80, 140, 200];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-16 md:py-24"
      style={{ backgroundColor: colors.background }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 flex flex-col items-center text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 whitespace-pre-line text-2xl font-bold leading-[1.35] md:mb-16 md:text-3xl lg:text-[34px]"
          style={{ color: colors.text }}
        >
          {title}
        </motion.h2>

        {/* Bar Chart + Video */}
        <div className="flex items-end justify-center gap-1.5 md:gap-2 lg:gap-3 w-full">
          {bars.map((bar, index) => (
            <motion.div
              key={bar.year}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={inView ? { opacity: 1, scaleY: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
              className="relative flex origin-bottom flex-col rounded-t"
              style={{
                backgroundColor: colors.accent,
                height: barHeights[index] ?? 80,
                width: index < 2 ? 64 : 110,
              }}
            >
              <span className="absolute left-2.5 top-2 text-[11px] font-medium text-white md:left-3 md:top-2.5 md:text-xs">
                {bar.year}
              </span>
              {bar.value !== null && (
                <div className="absolute bottom-3 left-2.5 flex items-baseline gap-0.5 md:bottom-4 md:left-3">
                  <span className="text-[28px] font-bold leading-none text-white md:text-4xl lg:text-[42px]">
                    <AnimatedNumber value={bar.value} delay={0.3 + index * 0.12} />
                  </span>
                  <span className="text-[10px] font-medium text-white md:text-xs">{bar.unit}</span>
                </div>
              )}
            </motion.div>
          ))}

          {/* Video Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative h-[280px] w-[280px] overflow-hidden rounded-t md:h-[360px] md:w-[360px] lg:h-[420px] lg:w-[420px]"
          >
            <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
              <source src={videoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex h-full flex-col justify-center items-center px-5 py-4 md:px-6 md:py-5">
              <span className="mb-1 text-[10px] font-medium text-white/80 md:mb-2 md:text-xs">{mainStatLabel}</span>
              <div className="flex items-baseline">
                <span className="text-[56px] font-bold leading-none md:text-7xl lg:text-[90px]" style={{ color: colors.accentLight }}>
                  <AnimatedNumber value={mainStatValue ?? 100} delay={0.7} duration={1.8} />
                </span>
                <span className="ml-1 text-lg font-medium md:text-xl lg:text-2xl" style={{ color: colors.accentLight }}>
                  {mainStatUnit}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 flex flex-col items-center gap-8 md:mt-14 md:flex-row md:justify-center md:gap-12 lg:gap-16"
        >
          {bottomStats.map((stat, index) => (
            <div key={stat.label} className="flex-shrink-0 text-center">
              <span className="mb-1.5 block text-[11px] font-medium md:mb-2 md:text-xs" style={{ color: colors.textMuted }}>
                {stat.label}
              </span>
              <div className="flex items-baseline justify-center">
                <span className="text-[42px] font-bold leading-none md:text-5xl lg:text-[56px]">
                  {stat.hasGradient ? (
                    <GradientNumber value={stat.value} delay={1.0 + index * 0.15} duration={1.4} baseColor={colors.textSecondary} />
                  ) : (
                    <span style={{ color: colors.textSecondary }}>
                      <AnimatedNumberString value={stat.value} delay={1.0 + index * 0.15} duration={1.4} />
                    </span>
                  )}
                </span>
                <span className="ml-0.5 text-base font-medium md:text-lg lg:text-xl" style={{ color: index === 0 ? colors.accent : colors.textMuted }}>
                  {stat.unit}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
