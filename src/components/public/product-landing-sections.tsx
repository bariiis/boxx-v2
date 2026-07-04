"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ChevronDown, Cpu, Server, Zap, Shield, HardDrive, MemoryStick, Gauge, MonitorSpeaker } from "lucide-react"

const iconMap: Record<string, typeof Cpu> = {
  Cpu, Server, Zap, Shield, HardDrive, MemoryStick, Gauge, MonitorSpeaker,
}

interface Feature {
  icon: string
  title: string
  description: string
}

interface Section {
  id: string
  sectionType: string
  tabKey: string
  tabLabel: string
  content: string | null
}

interface Faq {
  id: string
  question: string
  answer: string
}

interface ProductLandingProps {
  product: {
    name: string
    slug: string
    heroImage: string | null
    heroTitle: string | null
    heroSubtitle: string | null
    heroVideo: string | null
    features: unknown
    description: string | null
  }
  sections: Section[]
  faqs: Faq[]
}

export function ProductLandingSections({ product, sections, faqs }: ProductLandingProps) {
  const features = Array.isArray(product.features) ? (product.features as Feature[]) : []

  return (
    <div>
      {/* Hero — 3-column layout */}
      {product.heroTitle && (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="grid items-center gap-6 lg:grid-cols-[220px_1fr_1fr] lg:gap-8 xl:grid-cols-[260px_1fr_1fr] xl:gap-10">

              {/* Left Column — Feature stat boxes */}
              <div className="flex gap-3 lg:flex-col lg:gap-4">
                {features.slice(0, 3).map((feat, i) => {
                  const Icon = iconMap[feat.icon] || Zap
                  return (
                    <div
                      key={i}
                      className="group relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 lg:aspect-square lg:flex-initial"
                    >
                      <div className="flex h-full flex-col justify-between">
                        <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/20">
                          <Icon className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-bold leading-tight xl:text-xl">{feat.title}</p>
                          <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">{feat.description}</p>
                        </div>
                      </div>
                      {/* Corner accent */}
                      <div className="absolute -right-3 -top-3 size-12 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
                    </div>
                  )
                })}
              </div>

              {/* Center Column — Product image */}
              <div className="relative flex items-center justify-center">
                {product.heroImage ? (
                  <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-2xl">
                    {/* Glow effect behind image */}
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-blue-500/10 blur-2xl" />
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10">
                      <Image
                        src={product.heroImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        priority
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-square w-full max-w-lg items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Server className="size-24 text-white/10" />
                  </div>
                )}
              </div>

              {/* Right Column — Title, subtitle, CTA */}
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
                  {product.heroTitle}
                </h1>
                {product.heroSubtitle && (
                  <p className="mt-4 text-base leading-relaxed text-slate-300 xl:text-lg">
                    {product.heroSubtitle}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" asChild>
                    <Link href={`/iletisim?urun=${product.slug}`}>
                      Teklif İste <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                    <Link href="#specs">Teknik Özellikler</Link>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Hero Video */}
      {product.heroVideo && (
        <section className="bg-slate-900 pb-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="aspect-video overflow-hidden rounded-xl">
              <iframe
                src={product.heroVideo}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      {features.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feat, i) => {
                const Icon = iconMap[feat.icon] || Zap
                return (
                  <Card key={i} className="text-center">
                    <CardContent className="pt-8 pb-6">
                      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="size-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{feat.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{feat.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {sections.map((section, i) => (
        <SectionRenderer key={section.id} section={section} index={i} />
      ))}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-16 bg-muted/30" id="faq">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="mb-8 text-center text-2xl font-bold">Sıkça Sorulan Sorular</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {product.name} hakkında detaylı bilgi alın
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Uzman ekibimiz ihtiyacınıza en uygun konfigürasyonu belirleyecek.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/iletisim?urun=${product.slug}`}>Teklif İste</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function SectionRenderer({ section, index }: { section: Section; index: number }) {
  if (!section.content) return null
  const isAlt = index % 2 === 1

  return (
    <section className={`py-16 ${isAlt ? "bg-muted/30" : ""}`} id={section.tabKey}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold">{section.tabLabel}</h2>
        <div
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </div>
    </section>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg border bg-background">
      <button
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium">{question}</span>
        <ChevronDown className={`size-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t px-4 py-3">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  )
}
