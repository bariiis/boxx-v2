"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { NexusAsciiWave } from "./nexus-ascii-wave";

export function NexusHeroSection({
  demoteHeading = false,
  config = {},
}: {
  demoteHeading?: boolean
  config?: Record<string, unknown>
}) {
  const isDark = (config.theme as string) === "dark";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const Heading = demoteHeading ? "h2" : "h1";

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"
      style={isDark ? { backgroundColor: "#0a0a0a", color: "#fafafa" } : {}}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.7 0.18 170 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.18 170 / 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ASCII Wave background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        <NexusAsciiWave className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-24">
        {/* Headline */}
        <div className="text-center max-w-5xl mx-auto mb-10">
          <Heading
            className={`text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] mb-8 transition-all duration-700 delay-100 lg:text-7xl ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="text-balance">The complete platform to</span>
            <br />
            <span className="text-balance">build the</span>{" "}
            <span className="text-primary">future.</span>
          </Heading>

          <p
            className={`text-lg max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ color: isDark ? "rgba(250,250,250,0.55)" : undefined }}
          >
            Your toolkit to stop configuring and start innovating.
            Securely build, deploy, and scale AI-powered applications.
          </p>
        </div>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-20 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            size="lg"
            className="px-6 h-11 text-sm font-medium group"
            style={isDark
              ? { backgroundColor: "#fafafa", color: "#0a0a0a" }
              : { backgroundColor: "#0a0a0a", color: "#fafafa" }
            }
          >
            Demo al
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 px-6 text-sm font-medium bg-transparent"
            style={isDark
              ? { borderColor: "rgba(250,250,250,0.2)", color: "#fafafa" }
              : undefined
            }
          >
            Ürünü Keşfet
          </Button>
        </div>

        {/* Stats grid */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-px rounded-xl overflow-hidden shadow-sm transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ backgroundColor: isDark ? "rgba(250,250,250,0.08)" : undefined }}
        >
          {[
            { value: "20 gün", label: "günlük build süresinden kazanç.", company: "STRIPE" },
            { value: "%98", label: "daha hızlı pazara çıkış.", company: "VERCEL" },
            { value: "%300", label: "throughput artışı.", company: "LINEAR" },
            { value: "6x", label: "daha hızlı build + deploy.", company: "NOTION" },
          ].map((stat) => (
            <div
              key={stat.company}
              className="p-6 lg:p-8 flex justify-between min-h-[140px] flex-col"
              style={{ backgroundColor: isDark ? "#111111" : undefined }}
            >
              <div>
                <span className="text-xl lg:text-2xl font-semibold">{stat.value}</span>
                <span className="text-sm lg:text-base" style={{ color: isDark ? "rgba(250,250,250,0.5)" : undefined }}> {stat.label}</span>
              </div>
              <div className="font-mono text-xs tracking-widest mt-4" style={{ color: isDark ? "rgba(250,250,250,0.25)" : undefined }}>
                {stat.company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
