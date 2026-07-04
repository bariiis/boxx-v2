"use client";

import { useEffect, useState, useRef } from "react";
import { NexusAsciiDna } from "./nexus-ascii-dna";

const regions = [
  { name: "Kuzey Amerika", nodes: 5, latency: "< 20ms" },
  { name: "Avrupa", nodes: 4, latency: "< 25ms" },
  { name: "Asya Pasifik", nodes: 3, latency: "< 30ms" },
  { name: "Güney Amerika", nodes: 2, latency: "< 40ms" },
  { name: "Orta Doğu", nodes: 2, latency: "< 35ms" },
  { name: "Afrika", nodes: 1, latency: "< 50ms" },
];

export function NexusInfrastructureSection({
  demoteHeading = false,
}: {
  demoteHeading?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      className="relative py-32 bg-muted/30 overflow-hidden text-foreground"
    >
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <NexusAsciiDna className="w-[600px] h-[500px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <p className="text-sm font-mono text-primary mb-4">// GLOBAL ALTYAPI</p>
            <Heading className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6 text-balance">
              Gezegen ölçeğinde kurgulandı.
            </Heading>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              AI modellerinizi global edge ağımızda dağıtın. Otomatik failover, akıllı yönlendirme
              ve dünyanın her yerinde 100ms altı gecikme.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <pre className="font-mono text-2xl text-primary">⚡</pre>
                <div>
                  <h3 className="font-semibold mb-1">Şimşek Hızında CDN</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimum performans için edge caching ve akıllı yönlendirme
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <pre className="font-mono text-2xl text-primary">🔄</pre>
                <div>
                  <h3 className="font-semibold mb-1">Otomatik Ölçekleme</h3>
                  <p className="text-sm text-muted-foreground">
                    Sıfır yapılandırmayla trafik ataklarını karşılayın
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <pre className="font-mono text-2xl text-primary">🛡️</pre>
                <div>
                  <h3 className="font-semibold mb-1">DDoS Koruması</h3>
                  <p className="text-sm text-muted-foreground">
                    Kötü amaçlı trafiğe karşı dahili koruma
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="grid grid-cols-1 gap-3">
              {regions.map((region, index) => (
                <div
                  key={region.name}
                  className="group relative bg-card rounded-lg p-5 border border-border shadow-sm hover:border-primary/50 transition-all duration-300"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{region.name}</h4>
                    <span className="font-mono text-xs text-primary">{region.latency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {Array.from({ length: region.nodes }).map((_, i) => (
                        <span
                          key={i}
                          className="w-2 h-2 rounded-full bg-primary/70 animate-pulse"
                          style={{ animationDelay: `${i * 200}ms` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {region.nodes} {region.nodes === 1 ? "node" : "node"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-lg bg-foreground/5 border border-border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-mono text-2xl font-semibold text-primary">17</div>
                  <div className="text-xs text-muted-foreground">Veri Merkezi</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-semibold text-primary">%99.99</div>
                  <div className="text-xs text-muted-foreground">Uptime SLA</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-semibold text-primary">1.2B</div>
                  <div className="text-xs text-muted-foreground">İstek/gün</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
