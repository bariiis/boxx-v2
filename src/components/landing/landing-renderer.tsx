"use client"

import { HeroStatement } from "./hero-statement"
import { HeroVideo } from "./hero-video"
import { FeatureStorytelling } from "./feature-storytelling"
import { FeaturesBlock } from "./features-block"
import { FeatureGrid } from "./feature-grid"
import { FullBleedMedia } from "./full-bleed-media"
import { TechSpecs } from "./tech-specs"
import { PurchaseCta } from "./purchase-cta"
import { BentoBox } from "./bento-box"
import { BentoGrid } from "./bento-grid"
import { CtaIllustration } from "./cta-illustration"
import { HeroAudioReactive } from "./hero-audio-reactive"
import { HeroShade } from "./hero-shade"
import { LogoCloud } from "./logo-cloud"
import { UrunlerSlide } from "./urunler-slide"
import { TestimonialsV2 } from "./testimonials-v2"
import { MainHero } from "./main-hero"
import { StatsCounter } from "./stats-counter"
import { FaqAccordion } from "./faq-accordion"
import { ContactForm } from "./contact-form"
import { PricingTable } from "./pricing-table"
import { ImageTextSplit } from "./image-text-split"
import { CtaBanner } from "./cta-banner"
import { HeroGradient } from "./hero-gradient"
import SaaspoFeatureSectionsLinear from "@/components/registry/saaspo-feature-sections-linear"

interface Section {
  id: string
  type: string
  config: Record<string, unknown>
}

export function LandingPageRenderer({ sections }: { sections: Section[] }) {
  return (
    <div>
      {sections.map((section) => (
        <SectionSwitch key={section.id} type={section.type} config={section.config} />
      ))}
    </div>
  )
}

function SectionSwitch({ type, config }: { type: string; config: Record<string, unknown> }) {
  switch (type) {
    case "hero-statement":
      return (
        <HeroStatement
          headline={(config.headline as string) || ""}
          subheadline={config.subheadline as string}
          description={config.description as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          secondaryCtaText={config.secondaryCtaText as string}
          secondaryCtaHref={config.secondaryCtaHref as string}
          image={config.image as string}
          imageAlt={config.imageAlt as string}
          dark={config.dark as boolean}
        />
      )

    case "hero-audio-reactive":
      return (
        <HeroAudioReactive
          tagline={config.tagline as string}
          headline={(config.headline as string) || ""}
          headlineSecondLine={config.headlineSecondLine as string}
          subtitle={config.subtitle as string}
          creditText={config.creditText as string}
          audioSrc={config.audioSrc as string}
          dark={config.dark as boolean}
        />
      )

    case "hero-shade":
      return (
        <HeroShade
          headline={(config.headline as string) || ""}
          description={config.description as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          secondaryCtaText={config.secondaryCtaText as string}
          secondaryCtaHref={config.secondaryCtaHref as string}
          image={config.image as string}
          imageAlt={config.imageAlt as string}
          beamColorFrom={config.beamColorFrom as string}
          beamColorTo={config.beamColorTo as string}
          dark={config.dark as boolean}
        />
      )

    case "hero-video":
      return (
        <HeroVideo
          headline={(config.headline as string) || ""}
          description={config.description as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          secondaryCtaText={config.secondaryCtaText as string}
          secondaryCtaHref={config.secondaryCtaHref as string}
          videoSrc={config.videoSrc as string}
          height={(config.height as "small" | "medium" | "large" | "full") || "large"}
          showLogoBanner={config.showLogoBanner as boolean}
          logoBannerText={config.logoBannerText as string}
          logos={config.logos as { src: string; alt: string; height?: number }[]}
          dark={config.dark as boolean}
        />
      )

    case "feature-storytelling":
      return (
        <FeatureStorytelling
          label={config.label as string}
          headline={(config.headline as string) || ""}
          description={config.description as string}
          image={(config.image as string) || ""}
          imageAlt={config.imageAlt as string}
          reverse={config.reverse as boolean}
          dark={config.dark as boolean}
        />
      )

    case "features-block":
      return (
        <FeaturesBlock
          headline={(config.headline as string) || ""}
          description={config.description as string}
          marqueeItems={config.marqueeItems as string[]}
          features={config.features as { title: string; description: string; icon?: string }[]}
          dark={config.dark as boolean}
        />
      )

    case "feature-grid":
      return (
        <FeatureGrid
          headline={config.headline as string}
          items={
            (config.items as { title: string; description: string; icon?: string }[]) || []
          }
          columns={(config.columns as 2 | 3) || 2}
          dark={config.dark as boolean}
        />
      )

    case "full-bleed-media":
      return (
        <FullBleedMedia
          image={config.image as string}
          video={config.video as string}
          alt={config.alt as string}
          caption={config.caption as string}
          aspectRatio={(config.aspectRatio as "video" | "wide" | "square") || "video"}
          parallax={config.parallax as boolean}
          dark={config.dark as boolean}
        />
      )

    case "tech-specs":
      return (
        <TechSpecs
          headline={config.headline as string}
          description={config.description as string}
          groups={
            (config.groups as {
              title: string
              specs: { label: string; value: string }[]
            }[]) || []
          }
          dark={config.dark as boolean}
        />
      )

    case "purchase-cta":
      return (
        <PurchaseCta
          headline={(config.headline as string) || ""}
          description={config.description as string}
          price={config.price as string}
          priceNote={config.priceNote as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          secondaryCtaText={config.secondaryCtaText as string}
          secondaryCtaHref={config.secondaryCtaHref as string}
          dark={config.dark as boolean}
        />
      )

    case "bento-grid":
      return (
        <BentoGrid
          headline={config.headline as string}
          subheadline={config.subheadline as string}
          items={config.items as { title: string; description: string; stat?: string; badge?: string; image?: string }[]}
          dark={config.dark as boolean}
        />
      )

    case "bento-box":
      return (
        <BentoBox
          topLeftLabel={config.topLeftLabel as string}
          topLeftDescription={config.topLeftDescription as string}
          topLeftMapBadge={config.topLeftMapBadge as string}
          topRightLabel={config.topRightLabel as string}
          topRightDescription={config.topRightDescription as string}
          centerStat={config.centerStat as string}
          bottomLabel={config.bottomLabel as string}
          bottomDescription={config.bottomDescription as string}
          dark={config.dark as boolean}
        />
      )

    case "logo-cloud":
      return (
        <LogoCloud
          headline={config.headline as string}
          subheadline={config.subheadline as string}
          logos={config.logos as { src: string; alt: string }[]}
          speed={config.speed as number}
          reverse={config.reverse as boolean}
          dark={config.dark as boolean}
        />
      )

    case "saaspo-feature-linear":
      return (
        <SaaspoFeatureSectionsLinear
          badge={config.badge as string}
          title={config.title as string}
          description={config.description as string}
        />
      )

    case "stats-counter":
      return (
        <StatsCounter
          headline={config.headline as string}
          description={config.description as string}
          stats={config.stats as { value: string; label: string }[]}
          dark={config.dark as boolean}
        />
      )

    case "faq-accordion":
      return (
        <FaqAccordion
          headline={config.headline as string}
          description={config.description as string}
          items={config.items as { question: string; answer: string }[]}
          dark={config.dark as boolean}
        />
      )

    case "contact-form":
      return (
        <ContactForm
          headline={config.headline as string}
          description={config.description as string}
          email={config.email as string}
          phone={config.phone as string}
          address={config.address as string}
          categories={config.categories as string[]}
          dark={config.dark as boolean}
        />
      )

    case "pricing-table":
      return (
        <PricingTable
          headline={config.headline as string}
          description={config.description as string}
          plans={
            config.plans as {
              name: string
              price: string
              priceNote?: string
              description?: string
              features: string[]
              ctaText?: string
              ctaHref?: string
              highlighted?: boolean
            }[]
          }
          dark={config.dark as boolean}
        />
      )

    case "image-text-split":
      return (
        <ImageTextSplit
          label={config.label as string}
          headline={config.headline as string}
          description={config.description as string}
          bullets={config.bullets as string[]}
          image={config.image as string}
          imageAlt={config.imageAlt as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          reverse={config.reverse as boolean}
          dark={config.dark as boolean}
        />
      )

    case "cta-banner":
      return (
        <CtaBanner
          headline={config.headline as string}
          description={config.description as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          secondaryCtaText={config.secondaryCtaText as string}
          secondaryCtaHref={config.secondaryCtaHref as string}
          variant={(config.variant as "gradient" | "solid" | "minimal") || "gradient"}
        />
      )

    case "hero-gradient":
      return (
        <HeroGradient
          badge={config.badge as string}
          headline={config.headline as string}
          highlight={config.highlight as string}
          description={config.description as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          secondaryCtaText={config.secondaryCtaText as string}
          secondaryCtaHref={config.secondaryCtaHref as string}
          image={config.image as string}
        />
      )

    case "main-hero":
      return (
        <MainHero
          slides={config.slides as { img: string; line1: string; line2?: string }[]}
        />
      )

    case "testimonials-v2":
      return (
        <TestimonialsV2
          badge={config.badge as string}
          headline={config.headline as string}
          description={config.description as string}
          testimonials={
            config.testimonials as { text: string; image: string; name: string; role: string }[]
          }
          dark={config.dark as boolean}
        />
      )

    case "urunler-slide":
      return (
        <UrunlerSlide
          headline={config.headline as string}
          description={config.description as string}
          members={config.members as { image: string; name: string; role: string }[]}
          testimonial={config.testimonial as string}
          testimonialName={config.testimonialName as string}
          testimonialRole={config.testimonialRole as string}
          testimonialImage={config.testimonialImage as string}
          dark={config.dark as boolean}
        />
      )

    case "cta-illustration":
      return (
        <CtaIllustration
          headline={(config.headline as string) || ""}
          description={config.description as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          image={config.image as string}
          imageAlt={config.imageAlt as string}
          dark={config.dark as boolean}
        />
      )

    default:
      return null
  }
}
