"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Bağlan",
    description: "200+ veri kaynağıyla entegre olun. Veritabanları, API'ler ve bulut servisleri için tek tıkla kurulum.",
    code: `nexus.connect({
  source: 'postgresql',
  config: process.env.DB_URL
})`,
  },
  {
    number: "02",
    title: "Yapılandır",
    description: "Görsel builder veya kod öncelikli yaklaşımla AI iş akışlarınızı tanımlayın.",
    code: `nexus.workflow('process-orders', {
  trigger: 'new_order',
  steps: ['validate', 'enrich', 'notify']
})`,
  },
  {
    number: "03",
    title: "Deploy Et",
    description: "Anında üretime gönderin. Auto-scaling, izleme ve %99.9 uptime dahil.",
    code: `nexus.deploy({
  env: 'production',
  region: 'auto'
}) // < 30sn'de canlı`,
  },
];

function highlightCode(line: string): string {
  return line
    .replace(/(nexus|process|env)/g, '<span class="text-foreground">$1</span>')
    .replace(/(\.\w+)/g, '<span class="text-primary">$1</span>')
    .replace(/('.*?'|".*?")/g, '<span class="text-green-400">$1</span>')
    .replace(/(\/\/.*$)/g, '<span class="text-muted-foreground/50">$1</span>')
    .replace(/(\{|\}|\(|\)|\[|\]|:)/g, '<span class="text-muted-foreground/70">$1</span>');
}

export function NexusHowItWorksSection({ demoteHeading = false }: { demoteHeading?: boolean }) {
  const [activeStep, setActiveStep] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const Heading = demoteHeading ? "h3" : "h2";

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-secondary/30 text-foreground"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20">
          <p className="text-sm font-mono text-primary mb-3">// TEKNOLOJİ</p>
          <Heading
            className={`text-3xl lg:text-5xl font-semibold tracking-tight mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="text-balance">Üretime giden</span>
            <br />
            <span className="text-balance">üç adım.</span>
          </Heading>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-2">
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-6 rounded-xl border transition-all duration-300 ${
                  activeStep === index
                    ? "bg-card border-primary/50 shadow-sm"
                    : "bg-transparent border-transparent hover:bg-card/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`font-mono text-sm transition-colors ${
                      activeStep === index ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p
                      className={`text-sm leading-relaxed transition-colors ${
                        activeStep === index ? "text-muted-foreground" : "text-muted-foreground/60"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                {activeStep === index && (
                  <div className="mt-4 ml-8">
                    <div className="h-0.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full nexus-progress"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="lg:sticky lg:top-32">
            <div className="rounded-xl overflow-hidden bg-card border border-border shadow-sm">
              <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-secondary/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">workflow.ts</span>
              </div>

              <div className="p-6 font-mono text-sm min-h-[200px]">
                <pre className="text-muted-foreground">
                  {steps[activeStep].code.split("\n").map((line, i) => (
                    <div
                      key={`${activeStep}-${i}`}
                      className="leading-relaxed"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <span className="text-muted-foreground/40 select-none w-6 inline-block">
                        {i + 1}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightCode(line),
                        }}
                      />
                    </div>
                  ))}
                </pre>
              </div>

              <div className="border-t border-border p-4 bg-secondary/20 font-mono text-xs">
                <div className="flex items-center gap-2 text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Hazır
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes nexusProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .nexus-progress {
          animation: nexusProgress 4s linear;
        }
      `}</style>
    </section>
  );
}
