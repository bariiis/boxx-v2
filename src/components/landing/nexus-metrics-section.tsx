"use client";

import { useEffect, useState, useRef } from "react";
import { NexusAsciiWave } from "./nexus-ascii-wave";

function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="font-mono text-4xl lg:text-6xl font-semibold tracking-tight">
      {prefix}
      {count.toLocaleString("tr-TR")}
      {suffix}
    </div>
  );
}

const metrics = [
  { value: 309890, suffix: "", label: "Bugünkü API çağrısı", sublabel: "Düne göre +%12.4" },
  { value: 99, suffix: ".98%", label: "Bu ayki uptime", sublabel: "SLA garantili" },
  { value: 47, suffix: "ms", label: "Ortalama gecikme", sublabel: "Global p99" },
  { value: 184, suffix: "", label: "Hizmet verilen ülke", sublabel: "Edge ağı" },
];

function ActivityLine({
  time,
  event,
  region,
  status,
  latency,
}: {
  time: string;
  event: string;
  region: string;
  status: string;
  latency: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-muted-foreground/50 w-8">{time}</span>
      <span className="text-foreground">{event}</span>
      <span className="text-muted-foreground/50">{region}</span>
      <span className={status.startsWith("2") ? "text-green-500" : "text-yellow-500"}>
        {status}
      </span>
      <span className="text-primary">{latency}</span>
    </div>
  );
}

export function NexusMetricsSection({ demoteHeading = false }: { demoteHeading?: boolean }) {
  // Lazy init guarded for SSR; the rendering span has suppressHydrationWarning
  const [time, setTime] = useState<Date | null>(() =>
    typeof window === "undefined" ? null : new Date(),
  );

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const Heading = demoteHeading ? "h3" : "h2";

  return (
    <section className="relative py-32 overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <NexusAsciiWave className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <p className="text-sm font-mono text-primary mb-3">{"// CANLI METRİKLER"}</p>
            <Heading className="text-3xl lg:text-5xl font-semibold tracking-tight text-balance">
              Gerçek zamanlı altyapı
              <br />
              performansı.
            </Heading>
          </div>
          <div className="flex items-center gap-3 font-mono text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Tüm sistemler çalışıyor</span>
            <span className="text-border">|</span>
            <span suppressHydrationWarning>{time ? time.toLocaleTimeString("tr-TR") : "--:--:--"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden shadow-sm">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-card p-8 flex flex-col gap-4">
              <div className="text-primary">
                <AnimatedCounter end={metric.value} suffix={metric.suffix} />
              </div>
              <div>
                <div className="text-foreground font-medium">{metric.label}</div>
                <div className="text-sm text-muted-foreground">{metric.sublabel}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-sm text-muted-foreground">Canlı aktivite akışı</span>
          </div>
          <div className="font-mono text-xs space-y-2 text-muted-foreground overflow-hidden h-24">
            <ActivityLine
              time="şimdi"
              event="POST /api/v2/inference"
              region="us-east-1"
              status="200"
              latency="23ms"
            />
            <ActivityLine
              time="1sn"
              event="GET /api/v2/models"
              region="eu-west-1"
              status="200"
              latency="18ms"
            />
            <ActivityLine
              time="2sn"
              event="POST /api/v2/inference"
              region="ap-south-1"
              status="200"
              latency="45ms"
            />
            <ActivityLine
              time="3sn"
              event="POST /api/v2/batch"
              region="us-west-2"
              status="202"
              latency="12ms"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
