"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const codeExamples = [
  {
    label: "Başlat",
    code: `import { Nexus } from '@nexus/sdk'

const nexus = new Nexus({
  apiKey: process.env.NEXUS_API_KEY
})`,
  },
  {
    label: "Inference",
    code: `const response = await nexus.inference({
  model: 'nexus-3-turbo',
  input: userMessage,
  stream: true
})

for await (const chunk of response) {
  process.stdout.write(chunk.text)
}`,
  },
  {
    label: "Batch",
    code: `const batch = await nexus.batch.create({
  model: 'nexus-3',
  inputs: documents,
  webhook: 'https://api.yourapp.com/webhook'
})

// Sonuçlar webhook ile ulaşır
console.log('Batch ID:', batch.id)`,
  },
];

const features = [
  {
    title: "TypeScript öncelikli",
    description: "Tüm API yanıtları için otomatik üretilen tam tip güvenliği.",
  },
  {
    title: "Yerleşik streaming",
    description: "Async iterator'larla stream yanıtlar için yerel destek.",
  },
  {
    title: "Edge hazır",
    description: "Node.js, Deno, Bun ve edge runtime'larda çalışır.",
  },
  {
    title: "Sıfır bağımlılık",
    description: "Harici bağımlılık yok. Sadece 12KB gzipped.",
  },
];

function highlightSyntax(line: string): string {
  return line
    .replace(/(import|from|const|await|for|process)/g, '<span class="text-primary">$1</span>')
    .replace(/('.*?'|".*?")/g, '<span class="text-green-400">$1</span>')
    .replace(/(\/\/.*$)/g, '<span class="text-muted-foreground/50">$1</span>')
    .replace(/(\{|\}|\(|\)|\[|\])/g, '<span class="text-muted-foreground">$1</span>');
}

export function NexusDevelopersSection({ demoteHeading = false }: { demoteHeading?: boolean }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Heading = demoteHeading ? "h3" : "h2";

  return (
    <section className="relative py-32 overflow-hidden bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-sm font-mono text-primary mb-3">// GELİŞTİRİCİLER İÇİN</p>
            <Heading className="text-3xl lg:text-5xl font-semibold tracking-tight mb-6 text-balance">
              Geliştiriciler için,
              <br />
              geliştiriciler tarafından.
            </Heading>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Yolunuzdan çekilen düşünceli tasarlanmış bir SDK. Sezgisel API'ler ve kapsamlı
              dokümantasyonla daha hızlı teslim edin.
            </p>

            <div className="grid gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-1 bg-primary/30 rounded-full shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-32">
            <div className="rounded-xl overflow-hidden bg-card border border-border shadow-sm">
              <div className="flex items-center gap-1 p-2 border-b border-border bg-secondary/30">
                {codeExamples.map((example, idx) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                      activeTab === idx
                        ? "bg-card text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {example.label}
                  </button>
                ))}
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Kodu kopyala"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
                  <code>
                    {codeExamples[activeTab].code.split("\n").map((line, i) => (
                      <div key={i} className="leading-relaxed">
                        <span className="text-muted-foreground/40 select-none w-8 inline-block">
                          {i + 1}
                        </span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightSyntax(line),
                          }}
                        />
                      </div>
                    ))}
                  </code>
                </pre>
              </div>

              <div className="border-t border-border p-4 bg-secondary/20">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
                  <span className="text-green-500">$</span>
                  <span>npm install @nexus/sdk</span>
                </div>
                <div className="text-xs font-mono text-muted-foreground/60">
                  1 paket eklendi, 0.4s
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm">
              <a href="#" className="text-primary hover:underline font-mono">
                Dokümanları oku
              </a>
              <span className="text-border">|</span>
              <a href="#" className="text-muted-foreground hover:text-foreground font-mono">
                GitHub'da görüntüle
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
