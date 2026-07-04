"use client"

import { ChevronRight } from "lucide-react"

export function SplitProductDirection({ demoteHeading = false }: { demoteHeading?: boolean }) {
  const Heading = demoteHeading ? "h3" : "h2"

  return (
    <section className="relative py-40 px-6 md:px-12 lg:px-24" style={{ backgroundColor: "#09090B" }}>
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "20%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.05), transparent 100%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-zinc-400 text-sm">Proje ve uzun vadeli planlama</span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>

        <Heading
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-medium text-white mb-8 max-w-3xl"
          style={{
            letterSpacing: "-0.0325em",
            fontVariationSettings: '"opsz" 28',
            fontWeight: 538,
            lineHeight: 1.1,
          }}
        >
          Ürün yönünü belirleyin
        </Heading>

        <p className="text-zinc-400 text-lg max-w-md mb-16">
          <span className="text-white font-medium">
            Ekibinizi ortak bir ürün zaman çizelgesi etrafında hizalayın.
          </span>{" "}
          Sprint'in görsel planlama araçlarıyla tüm ürün girişimlerini planlayın ve takip edin.
        </p>

        {/* 3D Timeline */}
        <div className="relative w-full mb-16" style={{ perspective: "1200px" }}>
          <div
            className="relative"
            style={{
              transform: "rotateX(50deg) rotateZ(-35deg)",
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
            }}
          >
            <div className="relative h-[400px]">
              <div
                className="absolute w-[1px] bg-zinc-600/50"
                style={{
                  height: "600px",
                  left: "55%",
                  top: "-100px",
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent, transparent 4px, rgba(113, 113, 122, 0.5) 4px, rgba(113, 113, 122, 0.5) 8px)",
                }}
              />

              <div className="absolute top-0 left-0 right-0 flex items-end">
                <div className="flex items-end gap-[3px] absolute bottom-0 left-[5%] right-0">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-zinc-600/60"
                      style={{ width: "1px", height: i % 7 === 0 ? "16px" : "8px" }}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute text-zinc-500 text-sm" style={{ left: "8%", top: "80px" }}>30</div>
              <div className="absolute text-zinc-500 text-sm" style={{ left: "18%", top: "55px" }}>AĞU 3</div>
              <div className="absolute text-zinc-500 text-sm" style={{ left: "32%", top: "35px" }}>10</div>
              <div className="absolute text-zinc-500 text-sm" style={{ left: "48%", top: "15px" }}>17</div>
              <div
                className="absolute px-3 py-1 rounded-md bg-zinc-700/80 text-zinc-300 text-sm font-medium"
                style={{ left: "58%", top: "-10px" }}
              >
                AĞU 22
              </div>
              <div className="absolute text-zinc-500 text-sm" style={{ left: "70%", top: "-5px" }}>24</div>
              <div className="absolute text-zinc-500/50 text-sm" style={{ left: "88%", top: "-25px" }}>EYL</div>

              <div
                className="absolute rounded-lg bg-zinc-800/90 border border-zinc-700/50 px-4 py-3 flex items-center gap-3"
                style={{ left: "5%", top: "100px", width: "45%", height: "48px" }}
              >
                <div className="w-4 h-4 rotate-45 bg-zinc-500/60" />
                <span className="text-zinc-300 text-sm font-medium">Gerçek zamanlı inference</span>
              </div>

              <div
                className="absolute rounded-lg bg-zinc-800/70 border border-zinc-700/40 px-4 py-3 flex items-center gap-3"
                style={{ left: "15%", top: "155px", width: "25%", height: "44px" }}
              >
                <div className="w-3 h-3 rotate-45 bg-zinc-600/60" />
                <span className="text-zinc-500 text-sm">Prototip</span>
              </div>

              <div
                className="absolute rounded-lg bg-zinc-800/90 border border-zinc-700/50 px-4 py-3 flex items-center justify-between"
                style={{ left: "45%", top: "155px", width: "45%", height: "48px" }}
              >
                <span className="text-zinc-400 text-sm">Beta</span>
                <div className="flex gap-0.5">
                  <div className="w-2.5 h-2.5 rotate-45 bg-zinc-500/60" />
                  <div className="w-2.5 h-2.5 rotate-45 bg-zinc-500/60" />
                  <div className="w-2.5 h-2.5 rotate-45 bg-zinc-500/60" />
                </div>
              </div>

              <div
                className="absolute rounded-lg bg-zinc-800/70 border border-zinc-700/40 px-4 py-3 flex items-center justify-between"
                style={{ left: "35%", top: "240px", width: "28%", height: "48px" }}
              >
                <span className="text-zinc-400 text-sm">RLHF fine tuning</span>
                <div className="flex gap-0.5">
                  <div className="w-2.5 h-2.5 rotate-45 bg-zinc-500/60" />
                  <div className="w-2.5 h-2.5 rotate-45 bg-zinc-500/60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-t border-r border-b border-zinc-800 pt-10 pr-10 pb-16">
            <h3 className="text-xl font-medium text-zinc-200 mb-3">Projeleri uçtan uca yönetin</h3>
            <p className="text-zinc-500 text-base leading-relaxed mb-8">
              Spesifikasyonları, kilometre taşlarını ve görevleri tek bir merkezde toplayın.
            </p>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h4 className="text-lg font-medium text-zinc-200 mb-5">Proje Genel Görünümü</h4>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-zinc-500 text-sm w-20">Özellikler</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    Devam ediyor
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs">
                    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="2" y="2" width="12" height="12" rx="2" />
                    </svg>
                    ENG
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-zinc-500 text-sm w-20 pt-1">Kilometre taşları</span>
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-zinc-300 text-sm">
                    <span className="w-2.5 h-2.5 rotate-45 bg-purple-500" />
                    Tasarım İncelemesi <span className="text-zinc-500">%100</span>
                  </span>
                  <span className="flex items-center gap-2 text-zinc-300 text-sm">
                    <span className="w-2.5 h-2.5 rotate-45 bg-purple-500" />
                    Dahili Alpha <span className="text-zinc-500">%100 / 10</span>
                  </span>
                  <span className="flex items-center gap-2 text-zinc-400 text-sm">
                    <span className="w-2.5 h-2.5 rotate-45 border border-zinc-500 bg-transparent" />
                    GA <span className="text-zinc-500">%25 / 53</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-b border-zinc-800 pt-10 pl-10 pb-16">
            <h3 className="text-xl font-medium text-zinc-200 mb-3">Proje güncellemeleri</h3>
            <p className="text-zinc-500 text-base leading-relaxed mb-8">
              Yerleşik proje güncellemeleriyle ilerleme ve sağlığı iletişim kurun.
            </p>

            <div className="relative h-48">
              <div
                className="absolute rounded-lg bg-zinc-800/40 border border-zinc-700/30 px-4 py-2"
                style={{ top: 0, left: "10%", width: "80%" }}
              >
                <span className="flex items-center gap-2 text-zinc-500 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  Rota dışı
                </span>
              </div>

              <div
                className="absolute rounded-lg bg-zinc-800/60 border border-zinc-700/40 px-4 py-2"
                style={{ top: "30px", left: "5%", width: "85%" }}
              >
                <span className="flex items-center gap-2 text-zinc-400 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  Risk altında
                </span>
              </div>

              <div
                className="absolute rounded-xl bg-zinc-800/90 border border-zinc-700/50 px-5 py-4"
                style={{ top: "60px", left: 0, width: "95%" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-500" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                    </svg>
                  </span>
                  <span className="text-green-500 font-medium text-sm">Rotada</span>
                </div>
                <p className="text-zinc-300 text-sm mb-3">Gelecek Perşembe lansmana hazırız</p>
                <span className="text-zinc-500 text-xs">8 Eylül</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="8" />
                <circle cx="10" cy="10" r="4" />
                <circle cx="10" cy="10" r="1" fill="currentColor" />
              </svg>
              <span className="text-zinc-200 font-medium">Girişimler</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Stratejik ürün çalışmalarını koordine edin.</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="8" />
                <path d="M2 10h16M10 2a15 15 0 010 16M10 2a15 15 0 000 16" />
              </svg>
              <span className="text-zinc-200 font-medium">Çapraz takım projeleri</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Takımlar ve departmanlar arası işbirliği.</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rotate-45 bg-zinc-400" />
              <span className="text-zinc-200 font-medium">Kilometre taşları</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Projeleri somut fazlara ayırın.</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                <rect x="2" y="10" width="3" height="8" rx="1" />
                <rect x="7" y="6" width="3" height="12" rx="1" />
                <rect x="12" y="8" width="3" height="10" rx="1" />
                <rect x="17" y="4" width="3" height="14" rx="1" />
              </svg>
              <span className="text-zinc-200 font-medium">İlerleme içgörüleri</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Kapsam, hız ve ilerlemeyi zaman içinde takip edin.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
