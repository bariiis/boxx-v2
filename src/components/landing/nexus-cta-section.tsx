"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { NexusAsciiCube } from "./nexus-ascii-cube";
import { NexusAsciiSphere } from "./nexus-ascii-sphere";

export function NexusCtaSection({ demoteHeading = false }: { demoteHeading?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const Heading = demoteHeading ? "h3" : "h2";

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`relative rounded-2xl overflow-hidden transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="absolute inset-0 bg-foreground" />
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.7 0.18 170 / 0.2) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.18 170 / 0.2) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden opacity-25 pointer-events-none">
            <NexusAsciiCube className="w-[600px] h-[500px]" />
          </div>

          <div className="relative z-10 px-8 lg:px-16 py-16">
            <div className="flex items-center justify-between gap-8">
              <div className="max-w-2xl">
                <Heading className="text-3xl lg:text-5xl font-semibold tracking-tight mb-6 text-background text-balance">
                  Geleceği bugün kurmaya başlayın.
                </Heading>

                <p className="text-lg text-background/70 mb-8 leading-relaxed max-w-lg">
                  Nexus ile daha hızlı teslim eden binlerce ekibe katılın. Başlangıç ücretsiz,
                  sizinle ölçeklenir.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button
                    size="lg"
                    className="bg-background hover:bg-background/90 text-foreground px-6 h-12 text-sm font-medium group"
                  >
                    Ücretsiz başlayın
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-6 text-sm font-medium border-background/30 text-background hover:bg-background/10 bg-transparent"
                  >
                    Satış ile konuş
                  </Button>
                </div>

                <p className="text-sm text-background/50 mt-6 font-mono">Kredi kartı gerekmez</p>
              </div>

              <div className="hidden lg:block opacity-40">
                <NexusAsciiSphere className="w-[500px] h-[500px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
