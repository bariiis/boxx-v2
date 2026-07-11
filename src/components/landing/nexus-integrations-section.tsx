"use client";

import { useEffect, useState, useRef } from "react";
import { NexusAsciiCube } from "./nexus-ascii-cube";

const integrations = [
  {
    name: "Slack",
    category: "İletişim",
    ascii: `  ┌─┐
  │#│
  └─┘`,
  },
  {
    name: "GitHub",
    category: "Geliştirme",
    ascii: `  ╔═╗
  ║<║
  ╚═╝`,
  },
  {
    name: "Stripe",
    category: "Ödeme",
    ascii: `  ┌$┐
  └─┘`,
  },
  {
    name: "PostgreSQL",
    category: "Veritabanı",
    ascii: `  [█]
  [█]`,
  },
  {
    name: "Redis",
    category: "Cache",
    ascii: `  ◈◈
  ◈◈`,
  },
  {
    name: "AWS",
    category: "Bulut",
    ascii: `  ≋≋
  ≋≋`,
  },
  {
    name: "MongoDB",
    category: "Veritabanı",
    ascii: `  {M}
  ---`,
  },
  {
    name: "Vercel",
    category: "Hosting",
    ascii: `  ▲
  ─`,
  },
];

export function NexusIntegrationsSection({
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
      className="relative py-32 overflow-hidden bg-background text-foreground"
    >
      <div className="absolute left-10 top-1/3 opacity-5 pointer-events-none hidden xl:block">
        <NexusAsciiCube className="w-[400px] h-[350px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-mono text-primary mb-4">{"// ENTEGRASYON EKOSİSTEMİ"}</p>
          <Heading className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6 text-balance">
            Her şeyi bağlayın.
            <br />
            Her şeyi kurun.
          </Heading>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Favori araçlarınızla hazır entegrasyonlar. Karmaşık kurulum yok — geniş API
            kütüphanemizle tak ve kullan.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {integrations.map((integration, index) => (
            <div
              key={integration.name}
              className={`group relative bg-card rounded-xl p-6 border border-border shadow-sm hover:border-primary/50 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <pre className="font-mono text-lg text-primary mb-4 leading-tight h-12 flex items-center justify-center">
                {integration.ascii}
              </pre>

              <div className="text-center">
                <h3 className="font-semibold mb-1">{integration.name}</h3>
                <p className="text-xs text-muted-foreground">{integration.category}</p>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-primary font-mono text-xs">→</span>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-muted/50 border border-border shadow-sm transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative z-10 p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl lg:text-3xl font-semibold mb-4">
                  Özel bir entegrasyon mu lazım?
                </h3>
                <p className="text-muted-foreground mb-6">
                  REST ve GraphQL API&apos;lerimizle özel entegrasyonlar kurmak çok kolay. Ayrıca
                  gerçek zamanlı olaylar için webhook erişimi.
                </p>
                <button
                  type="button"
                  className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors"
                >
                  API Dokümanları
                </button>
              </div>

              <div className="font-mono text-xs text-muted-foreground space-y-2 bg-background/50 rounded-lg p-6 border border-border">
                <div className="text-primary mb-2">{"// Örnek: Bildirim gönder"}</div>
                <div>
                  <span className="text-purple-400">const</span> response ={" "}
                  <span className="text-blue-400">await</span> nexus.send({"{"}
                </div>
                <div className="pl-4">
                  <span className="text-green-400">channel</span>:{" "}
                  <span className="text-yellow-400">&quot;#general&quot;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-green-400">message</span>:{" "}
                  <span className="text-yellow-400">&quot;AI inference complete&quot;</span>
                </div>
                <div>{"}"});</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
