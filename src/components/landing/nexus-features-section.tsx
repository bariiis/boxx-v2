"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { NexusAsciiCube } from "./nexus-ascii-cube";

const asciiAnimations = {
  neural: (frame: number) => {
    const states = ["◉", "◎", "○", "◎"];
    const getChar = (offset: number) => states[(frame + offset) % states.length];
    return `  ┌───────┐
  │ ${getChar(0)} ${getChar(1)} ${getChar(2)} │
  │ ${getChar(3)} ${getChar(4)} ${getChar(5)} │
  │ ${getChar(6)} ${getChar(7)} ${getChar(8)} │
  └───────┘`;
  },
  workflow: (frame: number) => {
    const arrows = ["─", "═", "━", "═"];
    const pulse = ["►", "▸", "▹", "▸"];
    const a = arrows[frame % arrows.length];
    const p = pulse[frame % pulse.length];
    return `  ┌─┐   ┌─┐
  │A├${a}${a}${p}│B│
  └─┘   └┬┘
        ┌▼┐
        │C│
        └─┘`;
  },
  security: (frame: number) => {
    const lock = ["◈", "◇", "◆", "◇"];
    const bars = ["░", "▒", "▓", "▒"];
    const l = lock[frame % lock.length];
    const b = bars[frame % bars.length];
    return `   ╔═══╗
   ║ ${l} ║
  ┌╨───╨┐
  │${b}${b}${b}${b}${b}│
  └─────┘`;
  },
  analytics: (frame: number) => {
    const heights = [
      [1, 2, 3, 2],
      [2, 3, 2, 3],
      [3, 2, 3, 1],
      [2, 1, 2, 2],
    ];
    const h = heights[frame % heights.length];
    const bar = (height: number) => {
      if (height === 3) return "█";
      if (height === 2) return "▄";
      return "▁";
    };
    return `  │${h[0] === 3 ? "▄" : " "}${h[1] === 3 ? "▄" : " "}${h[2] === 3 ? "▄" : " "}${h[3] === 3 ? "▄" : " "}
  │${bar(h[0])} ${bar(h[1])} ${bar(h[2])} ${bar(h[3])}
  │█ █ █ █
  └────────`;
  },
  globe: (frame: number) => {
    const rotations = [
      `    .--.
   /    \\
  | (  ) |
   \\    /
    '--'`,
      `    .--.
   /    \\
  |  () |
   \\    /
    '--'`,
      `    .--.
   /    \\
  |  (  )|
   \\    /
    '--'`,
      `    .--.
   /    \\
  | ()  |
   \\    /
    '--'`,
    ];
    return rotations[frame % rotations.length];
  },
  api: (frame: number) => {
    const methods = ["GET", "POST", "PUT", "GET"];
    const arrows = ["────────►", "═══════►", "━━━━━━━►", "────────►"];
    const m = methods[frame % methods.length];
    const a = arrows[frame % arrows.length];
    return `  ${m} /api
  ${a}
  ◄────────
  { data }`;
  },
};

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    title: "Neural Processing",
    description: "Gelişmiş derin öğrenme modelleri; bağlamı anlar ve işinize uyarlanır.",
    animationKey: "neural",
  },
  {
    title: "Akıllı İş Akışları",
    description: "Sürükle-bırak kolaylığıyla görsel workflow builder. AI aksiyonlarını zincirleyin.",
    animationKey: "workflow",
  },
  {
    title: "Kurumsal Güvenlik",
    description: "SOC 2 Type II sertifikalı, uçtan uca şifreleme. Veriniz kontrolünüzde.",
    animationKey: "security",
  },
  {
    title: "Canlı Analitik",
    description: "Canlı dashboard'lar ve anlık içgörüler. Performansı anında optimize edin.",
    animationKey: "analytics",
  },
  {
    title: "Global Ölçek",
    description: "12 bölgede dağıtık altyapı. Dünyanın her yerinden 100ms altı gecikme.",
    animationKey: "globe",
  },
  {
    title: "API Öncelikli",
    description: "Kapsamlı SDK'larla REST ve GraphQL API'ler. Nexus'u her stack'e entegre edin.",
    animationKey: "api",
  },
]

type FeatureItem = {
  title: string
  description: string
  animationKey: keyof typeof asciiAnimations
};

function AnimatedAscii({ animationKey }: { animationKey: keyof typeof asciiAnimations }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame((f) => f + 1), 400);
    return () => clearInterval(interval);
  }, []);

  const getAscii = useCallback(() => asciiAnimations[animationKey](frame), [animationKey, frame]);

  return (
    <pre className="font-mono text-xs text-primary leading-tight whitespace-pre">
      {getAscii()}
    </pre>
  );
}

function FeatureCard({ feature, index }: { feature: FeatureItem; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-xl p-8 transition-all duration-700 border border-border/60 hover:border-primary/50 bg-transparent ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="mb-6 h-20 flex items-center">
        <AnimatedAscii animationKey={feature.animationKey} />
      </div>

      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
    </div>
  );
}

export function NexusFeaturesSection({
  demoteHeading = false,
  badge,
  headingLine1,
  headingLine2,
  description,
  features,
}: {
  demoteHeading?: boolean
  badge?: string
  headingLine1?: string
  headingLine2?: string
  description?: string
  features?: FeatureItem[]
}) {
  const resolvedFeatures = features && features.length > 0 ? features : DEFAULT_FEATURES
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const Heading = demoteHeading ? "h3" : "h2";

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-background text-foreground"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <p className="text-sm font-mono text-primary mb-3">{badge ?? "// PLATFORM"}</p>
            <Heading
              className={`text-3xl lg:text-5xl font-semibold tracking-tight mb-6 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="text-balance">{headingLine1 ?? "Ölçeklenmek için"}</span>
              {headingLine2 !== undefined ? (
                <>
                  <br />
                  <span className="text-balance">{headingLine2}</span>
                </>
              ) : (
                <>
                  <br />
                  <span className="text-balance">gerek duyduğunuz her şey.</span>
                </>
              )}
            </Heading>
            <p
              className={`text-lg text-muted-foreground leading-relaxed max-w-lg transition-all duration-700 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {description ?? "AI uygulamaları kurmak, dağıtmak ve ölçeklendirmek için eksiksiz bir platform. Prototip'ten üretime aylar değil, dakikalar."}
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <NexusAsciiCube className="w-[480px] h-[640px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resolvedFeatures.map((feature, index) => (
            <FeatureCard key={feature.title + index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
