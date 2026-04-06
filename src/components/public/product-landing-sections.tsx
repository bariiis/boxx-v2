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
      {/* Hero */}
      {product.heroTitle && (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl leading-tight">
                  {product.heroTitle}
                </h1>
                {product.heroSubtitle && (
                  <p className="mt-6 text-lg text-slate-300 leading-relaxed">
                    {product.heroSubtitle}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap gap-4">
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
              {product.heroImage && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={product.heroImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              )}
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
