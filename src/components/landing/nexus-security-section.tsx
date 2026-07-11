"use client";

import { useEffect, useState, useRef } from "react";
import { NexusAsciiTorus } from "./nexus-ascii-torus";

const securityFeatures = [
  {
    title: "Uçtan Uca Şifreleme",
    description: "Durağan ve aktarımdaki veri için AES-256 şifreleme",
    ascii: `  ╔═══╗
  ║ ◈ ║
  ╚═══╝`,
  },
  {
    title: "Zero Trust Mimari",
    description: "Her istek kimlik doğrulanır ve yetkilendirilir",
    ascii: `  ┌───┐
  │ ✓ │
  └───┘`,
  },
  {
    title: "SOC 2 Type II",
    description: "Bağımsız denetlenmiş güvenlik kontrolleri",
    ascii: `  ╭───╮
  │ ★ │
  ╰───╯`,
  },
  {
    title: "GDPR Uyumlu",
    description: "Veri koruma yönetmelikleriyle tam uyum",
    ascii: `  [===]
  [===]`,
  },
  {
    title: "Rol Bazlı Erişim",
    description: "Takım üyeleri için ince ayarlı izinler",
    ascii: `  ◉─◉─◉
  │ │ │`,
  },
  {
    title: "Denetim Kayıtları",
    description: "Tüm sistem aktivitelerine tam görünürlük",
    ascii: `  ▪ ▪ ▪
  ▪ ▪ ▪`,
  },
];

const certifications = [
  { name: "SOC 2", status: "Type II" },
  { name: "ISO 27001", status: "Sertifikalı" },
  { name: "HIPAA", status: "Uyumlu" },
  { name: "GDPR", status: "Uyumlu" },
];

export function NexusSecuritySection({ demoteHeading = false }: { demoteHeading?: boolean }) {
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
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
        <NexusAsciiTorus className="w-[500px] h-[450px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-mono text-primary mb-4">{"// KURUMSAL GÜVENLİK"}</p>
          <Heading className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6 text-balance">
            Güvenebileceğiniz güvenlik.
          </Heading>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Banka seviyesi güvenlik ve kurumsal uyumluluk. Verileriniz sektör lideri şifreleme ve
            erişim kontrolleriyle korunuyor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {securityFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-card rounded-xl p-6 border border-border shadow-sm transition-all duration-500 hover:border-primary/50 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <pre className="font-mono text-sm text-primary mb-4 leading-tight h-12 flex items-center">
                {feature.ascii}
              </pre>

              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div
          className={`rounded-xl bg-card border border-border shadow-sm p-8 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Sertifikalı ve Uyumlu</h3>
              <p className="text-sm text-muted-foreground">
                Bağımsız doğrulanmış güvenlik ve uyumluluk standartları
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg bg-muted/50 border border-border"
                >
                  <span className="font-mono text-xs text-primary">{cert.name}</span>
                  <span className="text-xs text-muted-foreground">{cert.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
