"use client"

import type { CSSProperties, ReactNode } from "react"
import { resolveFontFamily, DEFAULT_THEME, type LandingTheme } from "@/lib/fonts"
import dynamic from "next/dynamic"
const HeroStatement = dynamic(() => import("./hero-statement").then(m => m.HeroStatement))
const HeroVideo = dynamic(() => import("./hero-video").then(m => m.HeroVideo))
const FeatureStorytelling = dynamic(() => import("./feature-storytelling").then(m => m.FeatureStorytelling))
const FeaturesBlock = dynamic(() => import("./features-block").then(m => m.FeaturesBlock))
const FeatureGrid = dynamic(() => import("./feature-grid").then(m => m.FeatureGrid))
const FullBleedMedia = dynamic(() => import("./full-bleed-media").then(m => m.FullBleedMedia))
const TechSpecs = dynamic(() => import("./tech-specs").then(m => m.TechSpecs))
const PurchaseCta = dynamic(() => import("./purchase-cta").then(m => m.PurchaseCta))
const BentoBox = dynamic(() => import("./bento-box").then(m => m.BentoBox))
const BentoGrid = dynamic(() => import("./bento-grid").then(m => m.BentoGrid))
const CtaIllustration = dynamic(() => import("./cta-illustration").then(m => m.CtaIllustration))
const HeroAudioReactive = dynamic(() => import("./hero-audio-reactive").then(m => m.HeroAudioReactive))
const HeroShade = dynamic(() => import("./hero-shade").then(m => m.HeroShade))
const LogoCloud = dynamic(() => import("./logo-cloud").then(m => m.LogoCloud))
const UrunlerSlide = dynamic(() => import("./urunler-slide").then(m => m.UrunlerSlide))
const TestimonialsV2 = dynamic(() => import("./testimonials-v2").then(m => m.TestimonialsV2))
const MainHero = dynamic(() => import("./main-hero").then(m => m.MainHero))
const StatsCounter = dynamic(() => import("./stats-counter").then(m => m.StatsCounter))
const FaqAccordion = dynamic(() => import("./faq-accordion").then(m => m.FaqAccordion))
const ContactForm = dynamic(() => import("./contact-form").then(m => m.ContactForm))
const PricingTable = dynamic(() => import("./pricing-table").then(m => m.PricingTable))
const ImageTextSplit = dynamic(() => import("./image-text-split").then(m => m.ImageTextSplit))
const CtaBanner = dynamic(() => import("./cta-banner").then(m => m.CtaBanner))
const HookableAiCta3 = dynamic(() => import("@/components/registry/hookable-ai-cta-3"))
const AdvantagesXPremium = dynamic(() => import("@/components/registry/advantages-x-premium"))
const ImwebMeStats6 = dynamic(() => import("@/components/registry/imweb-me-stats-6"))
const HeroGradient = dynamic(() => import("./hero-gradient").then(m => m.HeroGradient))
const HeroTextImage = dynamic(
  () => import("@/components/HeroSection").then((m) => m.HeroSection),
  { ssr: false }
)
const SaaspoFeatureSectionsLinear = dynamic(() => import("@/components/registry/saaspo-feature-sections-linear"))
const SaaspoFeatureSectionsVoiceflow = dynamic(() => import("@/components/registry/saaspo-feature-sections-voiceflow"))
const SpatialProductShowcase = dynamic(() => import("@/components/registry/spatial-product-showcase"))
const VtHeroSection = dynamic(() => import("./vt-hero-section").then(m => m.VtHeroSection))
const VtFeaturesSection = dynamic(() => import("./vt-features-section").then(m => m.VtFeaturesSection))
const VtHowItWorksSection = dynamic(() => import("./vt-how-it-works-section").then(m => m.VtHowItWorksSection))
const VtMetricsSection = dynamic(() => import("./vt-metrics-section").then(m => m.VtMetricsSection))
const VtIntegrationsSection = dynamic(() => import("./vt-integrations-section").then(m => m.VtIntegrationsSection))
const VtInfrastructureSection = dynamic(() => import("./vt-infrastructure-section").then(m => m.VtInfrastructureSection))
const VtSecuritySection = dynamic(() => import("./vt-security-section").then(m => m.VtSecuritySection))
const VtDevelopersSection = dynamic(() => import("./vt-developers-section").then(m => m.VtDevelopersSection))
const VtPricingSection = dynamic(() => import("./vt-pricing-section").then(m => m.VtPricingSection))
const VtTestimonialsSection = dynamic(() => import("./vt-testimonials-section").then(m => m.VtTestimonialsSection))
const VtCtaSection = dynamic(() => import("./vt-cta-section").then(m => m.VtCtaSection))
const ConversionIntegrationsSection = dynamic(() => import("./conversion-integrations-section").then(m => m.ConversionIntegrationsSection))
const StHeroSection = dynamic(() => import("./st-hero-section").then(m => m.StHeroSection))
const StFeaturesSection = dynamic(() => import("./st-features-section").then(m => m.StFeaturesSection))
const StHowItWorksSection = dynamic(() => import("./st-how-it-works-section").then(m => m.StHowItWorksSection))
const StMetricsSection = dynamic(() => import("./st-metrics-section").then(m => m.StMetricsSection))
const StIntegrationsSection = dynamic(() => import("./st-integrations-section").then(m => m.StIntegrationsSection))
const StInfrastructureSection = dynamic(() => import("./st-infrastructure-section").then(m => m.StInfrastructureSection))
const StSecuritySection = dynamic(() => import("./st-security-section").then(m => m.StSecuritySection))
const StDevelopersSection = dynamic(() => import("./st-developers-section").then(m => m.StDevelopersSection))
const StPricingSection = dynamic(() => import("./st-pricing-section").then(m => m.StPricingSection))
const StTestimonialsSection = dynamic(() => import("./st-testimonials-section").then(m => m.StTestimonialsSection))
const StCtaSection = dynamic(() => import("./st-cta-section").then(m => m.StCtaSection))
const NexoHero = dynamic(() => import("./nexo-hero").then(m => m.NexoHero))
const NexoFeatures = dynamic(() => import("./nexo-features").then(m => m.NexoFeatures))
const NexoAISection = dynamic(() => import("./nexo-ai-section").then(m => m.NexoAISection))
const NexoVercelSection = dynamic(() => import("./nexo-vercel-section").then(m => m.NexoVercelSection))
const NexusHeroSection = dynamic(() => import("./nexus-hero-section").then(m => m.NexusHeroSection))
const NexusFeaturesSection = dynamic(() => import("./nexus-features-section").then(m => m.NexusFeaturesSection))
const NexusHowItWorksSection = dynamic(() => import("./nexus-how-it-works-section").then(m => m.NexusHowItWorksSection))
const NexusInfrastructureSection = dynamic(() => import("./nexus-infrastructure-section").then(m => m.NexusInfrastructureSection))
const NexusMetricsSection = dynamic(() => import("./nexus-metrics-section").then(m => m.NexusMetricsSection))
const NexusIntegrationsSection = dynamic(() => import("./nexus-integrations-section").then(m => m.NexusIntegrationsSection))
const NexusSecuritySection = dynamic(() => import("./nexus-security-section").then(m => m.NexusSecuritySection))
const NexusDevelopersSection = dynamic(() => import("./nexus-developers-section").then(m => m.NexusDevelopersSection))
const NexusCtaSection = dynamic(() => import("./nexus-cta-section").then(m => m.NexusCtaSection))
import { type RoadmapMilestone } from "./animated-roadmap-section"
const AnimatedRoadmapSection = dynamic(() => import("./animated-roadmap-section").then(m => m.AnimatedRoadmapSection))
const SplitHero3d = dynamic(() => import("./split-hero-3d").then(m => m.SplitHero3d))
const SplitLogoCloud = dynamic(() => import("./split-logo-cloud").then(m => m.SplitLogoCloud))
const SplitFeatureCards = dynamic(() => import("./split-feature-cards").then(m => m.SplitFeatureCards))
const SplitAiSection = dynamic(() => import("./split-ai-section").then(m => m.SplitAiSection))
const SplitWorkflows = dynamic(() => import("./split-workflows").then(m => m.SplitWorkflows))
const SplitProductDirection = dynamic(() => import("./split-product-direction").then(m => m.SplitProductDirection))
const SplitCta = dynamic(() => import("./split-cta").then(m => m.SplitCta))
import { type ClipHoverItem } from "./clip-hover-grid"
const ClipHoverGrid = dynamic(() => import("./clip-hover-grid").then(m => m.ClipHoverGrid))
import { type Testimonial as SinglePricingTestimonial } from "./single-pricing-card"
const SinglePricingCard = dynamic(() => import("./single-pricing-card").then(m => m.SinglePricingCard))
const SinglePricingCard3Col = dynamic(() => import("./single-pricing-card-3col").then(m => m.SinglePricingCard3Col))
const ImmersiveGallery = dynamic(() => import("./immersive-gallery").then(m => m.ImmersiveGallery))
import { type BenchmarkChartItem } from "./benchmark-charts"
const BenchmarkCharts = dynamic(() => import("./benchmark-charts").then(m => m.BenchmarkCharts))
import { type FeatureSection1Feature } from "./feature-section-1"
const FeatureSection1 = dynamic(() => import("./feature-section-1").then(m => m.FeatureSection1))
const RiottersHero = dynamic(() => import("./riotters-hero").then(m => m.RiottersHero))
const StAeroHero1 = dynamic(() => import("./st-aero-hero-1").then(m => m.StAeroHero1))
const StTabsSection = dynamic(() => import("./st-tabs").then(m => m.StTabsSection))
const StLetsWorkSection = dynamic(() => import("./st-lets-work").then(m => m.StLetsWorkSection))
const StMarqueeSection = dynamic(() => import("./st-marquee").then(m => m.StMarqueeSection))
const AzHero = dynamic(() => import("./az-hero").then(m => m.AzHero))
const AzProjectsStack = dynamic(() => import("./az-projects-stack").then(m => m.AzProjectsStack))
const AzStickyCaption = dynamic(() => import("./az-sticky-caption").then(m => m.AzStickyCaption))
const AzStickyImages = dynamic(() => import("./az-sticky-images").then(m => m.AzStickyImages))
const AzManifestSplit = dynamic(() => import("./az-manifest-split").then(m => m.AzManifestSplit))
const AzParallaxDivider = dynamic(() => import("./az-parallax-divider").then(m => m.AzParallaxDivider))
const AzBlogGrid = dynamic(() => import("./az-blog-grid").then(m => m.AzBlogGrid))
const AzCtaMarquee = dynamic(() => import("./az-cta-marquee").then(m => m.AzCtaMarquee))
const CrowdCanvasSection = dynamic(() => import("./crowd-canvas-section").then(m => m.CrowdCanvasSection))
const HoverBrandLogoSection = dynamic(() => import("./hover-brand-logo-section").then(m => m.HoverBrandLogoSection))
const CodeNestHeroSection = dynamic(() => import("./code-nest-hero-section").then(m => m.CodeNestHeroSection))
const PixelBlastHeroSection = dynamic(() => import("./pixel-blast-hero-section").then(m => m.PixelBlastHeroSection))
const MasonryGallerySection = dynamic(() => import("./masonry-gallery-section").then(m => m.MasonryGallerySection))
import type { MasonryItem } from "@/components/ui/masonry"
const ProductDetailHero = dynamic(() => import("@/components/public/product-detail-hero").then(m => m.ProductDetailHero))
import { type ScrollBlurItem } from "./scroll-blur-typography"
const ScrollBlurTypography = dynamic(() => import("./scroll-blur-typography").then(m => m.ScrollBlurTypography))
const LiveblocksHomeHero = dynamic(() => import("./liveblocks-home-hero").then(m => m.LiveblocksHomeHero))
const CustomersShowcase = dynamic(() => import("@/components/registry/customers-showcase"))
import type { CustomerLogoConfig } from "@/components/registry/customers-showcase"
const PerspectiveHero = dynamic(() => import("@/components/registry/perspective-hero"))
const FeatureCarousel = dynamic(() => import("@/components/registry/feature-carousel"))
import type { FeatureCarouselItem } from "@/components/registry/feature-carousel"

interface Section {
  id: string
  type: string
  config: Record<string, unknown>
}

interface CustomFontLite {
  family: string
}

export function LandingPageRenderer({
  sections,
  theme,
  customFonts = [],
}: {
  sections: Section[]
  theme?: LandingTheme | null
  customFonts?: CustomFontLite[]
}) {
  const t: LandingTheme = theme ?? {}
  const fonts = { ...DEFAULT_THEME.fonts, ...(t.fonts ?? {}) }
  const colors = { ...DEFAULT_THEME.colors, ...(t.colors ?? {}) }
  const sizes = t.sizes ?? {}

  const style: CSSProperties = {
    ["--font-heading" as string]: resolveFontFamily(fonts.heading, customFonts),
    ["--font-body" as string]: resolveFontFamily(fonts.body, customFonts),
    ["--lp-bg" as string]: colors.bg,
    ["--lp-fg" as string]: colors.fg,
    ["--lp-muted" as string]: colors.muted,
    ["--lp-muted-fg" as string]: colors.mutedFg,
    ["--lp-primary" as string]: colors.primary,
    ["--lp-primary-fg" as string]: colors.primaryFg,
    ["--lp-accent" as string]: colors.accent,
    ["--lp-border" as string]: colors.border,
    fontFamily: "var(--font-body)",
    backgroundColor: "var(--lp-bg)",
    color: "var(--lp-fg)",
    ...(sizes.body ? { fontSize: `${sizes.body}px` } : {}),
  }

  // Per-heading size overrides (force, since section components use clamp())
  const sizeRules = (
    [
      ["h1", sizes.h1],
      ["h2", sizes.h2],
      ["h3", sizes.h3],
      ["h4", sizes.h4],
    ] as const
  )
    .filter(([, v]) => typeof v === "number" && v > 0)
    .map(([tag, v]) => `.lp-themed ${tag}, .lp-themed ${tag} *{font-size:${v}px !important;}`)
    .join("")

  // Force theme fonts onto ALL descendants (sections use hardcoded Tailwind fonts otherwise)
  const fontRules = `
    .lp-themed, .lp-themed p, .lp-themed span, .lp-themed a, .lp-themed li, .lp-themed button, .lp-themed input, .lp-themed textarea, .lp-themed label, .lp-themed div {
      font-family: var(--font-body) !important;
    }
    .lp-themed h1, .lp-themed h2, .lp-themed h3, .lp-themed h4, .lp-themed h5, .lp-themed h6,
    .lp-themed h1 *, .lp-themed h2 *, .lp-themed h3 *, .lp-themed h4 *, .lp-themed h5 *, .lp-themed h6 * {
      font-family: var(--font-heading) !important;
    }
  `

  const injectedCss = fontRules + sizeRules

  const rendered: ReactNode[] = []
  let heroCount = 0
  for (const section of sections) {
    const isHero =
      section.type.startsWith("hero-") ||
      section.type === "vt-hero" ||
      section.type === "st-hero" ||
      section.type === "nexo-hero" ||
      section.type === "nexus-hero" ||
      section.type === "split-hero-3d" ||
      section.type === "animated-roadmap" ||
      section.type === "main-hero" ||
      section.type === "st-aero-hero-1" ||
      section.type === "az-hero" ||
      section.type === "liveblocks-home-hero"
    let demoteHeading = false
    if (isHero) {
      const hl = (section.config.headline as string) || ""
      const hasSlides =
        Array.isArray(section.config.slides) &&
        (section.config.slides as unknown[]).length > 0
      // SEO: skip empty-headline heroes that would emit an empty <h1>
      if (
        !hl.trim() &&
        !hasSlides &&
        section.type !== "hero-audio-reactive" &&
        section.type !== "vt-hero" &&
        section.type !== "st-hero" &&
        section.type !== "nexo-hero" &&
        section.type !== "nexus-hero" &&
        section.type !== "split-hero-3d" &&
        section.type !== "animated-roadmap" &&
        section.type !== "st-aero-hero-1" &&
        section.type !== "az-hero" &&
        section.type !== "hero-text-image"
      ) {
        continue
      }
      heroCount += 1
      demoteHeading = heroCount > 1
    }
    rendered.push(
      <SectionSwitch
        key={section.id}
        type={section.type}
        config={section.config}
        demoteHeading={demoteHeading}
      />
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: injectedCss }} />
      <div className="lp-themed" style={style}>
        {rendered}
      </div>
    </>
  )
}

function SectionSwitch({
  type,
  config,
  demoteHeading = false,
}: {
  type: string
  config: Record<string, unknown>
  demoteHeading?: boolean
}) {
  switch (type) {
    case "product-hero": {
      const p = config.product as
        | {
            id: string
            name: string
            nameEn?: string | null
            slug: string
            sku: string
            type: "STANDALONE" | "CONFIGURABLE" | "COMPONENT"
            description: string | null
            price: number
            currency: string
            showPrice: boolean
            heroImage: string | null
            sortOrder: number
            createdAt: string | Date
            images: { id: string; url: string; alt: string | null }[]
            category: {
              id: string
              name: string
              slug: string
              parent: { id: string; name: string; slug: string } | null
            } | null
            specs: unknown
          }
        | undefined
      if (!p) {
        return (
          <div className="mx-auto max-w-7xl px-4 py-12 text-center text-sm text-slate-500">
            Ürün seçilmemiş.
          </div>
        )
      }
      const isDark = config.dark !== false
      return (
        <div className={isDark ? "dark bg-slate-950" : "bg-white"}>
          <ProductDetailHero
            product={{ ...p, createdAt: new Date(p.createdAt) }}
            useCases={
              (config.useCases as { id: string; name: string; slug: string; icon?: string | null }[]) ?? []
            }
            tags={(config.tags as string[]) ?? []}
          />
        </div>
      )
    }

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
          imageAspect={config.imageAspect as "16/9" | "4/3" | "1/1" | "21/9" | "3/2" | "9/16" | "auto"}
          imageFit={config.imageFit as "cover" | "contain"}
          imageMaxWidth={config.imageMaxWidth as number}
          imageBg={config.imageBg as string}
          dark={config.dark as boolean}
          demoteHeading={demoteHeading}
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
          demoteHeading={demoteHeading}
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
          demoteHeading={demoteHeading}
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
          image={config.image as string}
          imageAlt={config.imageAlt as string}
          demoteHeading={demoteHeading}
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

    case "spatial-product-showcase": {
      // Support both old {leftProduct, rightProduct} and new {products} format
      const spProducts = Array.isArray(config.products) && config.products.length > 0
        ? config.products
        : [config.leftProduct, config.rightProduct].filter(Boolean)
      return (
        <SpatialProductShowcase
          products={spProducts as import("@/components/registry/spatial-product-showcase").ProductConfig[]}
        />
      )
    }

    case "saaspo-feature-sections-voiceflow":
      return (
        <SaaspoFeatureSectionsVoiceflow
          badge={config.badge as string}
          title={config.title as string}
          description={config.description as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          features={config.features as import("@/components/registry/saaspo-feature-sections-voiceflow").SaaspoFeatureItem[]}
          trustedByText={config.trustedByText as string}
          logos={config.logos as import("@/components/registry/saaspo-feature-sections-voiceflow").SaaspoLogoItem[]}
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

    case "imweb-me-stats-6":
      return (
        <ImwebMeStats6
          mode={(config.mode as "light" | "dark") || "light"}
          title={config.title as string}
          videoUrl={config.videoUrl as string}
          mainStatLabel={config.mainStatLabel as string}
          mainStatValue={config.mainStatValue as number}
          mainStatUnit={config.mainStatUnit as string}
          bars={config.bars as import("@/components/registry/imweb-me-stats-6").BarData[]}
          bottomStats={config.bottomStats as import("@/components/registry/imweb-me-stats-6").StatData[]}
        />
      )

    case "advantages-x-premium":
      return (
        <AdvantagesXPremium
          heading={config.heading as string}
          advantages={config.advantages as import("@/components/registry/advantages-x-premium").AdvantageItem[]}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
        />
      )

    case "hookable-ai-cta-3":
      return (
        <HookableAiCta3
          mode={(config.mode as "light" | "dark") || "light"}
          heading={config.heading as string}
          painPoints={config.painPoints as string[]}
          animationDuration={(config.animationDuration as number) || 2000}
        />
      )

    case "hero-text-image":
      return <HeroTextImage config={config as import("@/components/HeroSection").HeroSectionConfig} />

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
          demoteHeading={demoteHeading}
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

    // VT template sections (Vercel import, fixed content for now)
    case "vt-hero":
      return <VtHeroSection demoteHeading={demoteHeading} />
    case "vt-features":
      return <VtFeaturesSection />
    case "vt-how-it-works":
      return <VtHowItWorksSection />
    case "vt-metrics":
      return <VtMetricsSection />
    case "vt-integrations":
      return <VtIntegrationsSection />
    case "vt-infrastructure":
      return <VtInfrastructureSection />
    case "vt-security":
      return <VtSecuritySection />
    case "vt-developers":
      return <VtDevelopersSection />
    case "vt-pricing":
      return <VtPricingSection />
    case "vt-testimonials":
      return <VtTestimonialsSection />
    case "vt-cta":
      return <VtCtaSection />

    case "st-hero":
      return <StHeroSection config={config} />
    case "st-features":
      return <StFeaturesSection />
    case "st-how-it-works":
      return <StHowItWorksSection />
    case "st-metrics":
      return <StMetricsSection />
    case "st-integrations":
      return <StIntegrationsSection />
    case "st-infrastructure":
      return <StInfrastructureSection />
    case "st-security":
      return <StSecuritySection />
    case "st-developers":
      return <StDevelopersSection />
    case "st-pricing":
      return <StPricingSection />
    case "st-testimonials":
      return <StTestimonialsSection />
    case "st-cta":
      return <StCtaSection />

    // NEXO template sections
    case "nexo-hero":
      return (
        <NexoHero
          brandNameLight={config.brandNameLight as string}
          brandNameBold={config.brandNameBold as string}
          brandSuperscript={config.brandSuperscript as string}
          subtitleLine1={config.subtitleLine1 as string}
          subtitleLine2={config.subtitleLine2 as string}
          statusItems={config.statusItems as { label: string }[]}
          stats={config.stats as { value: string; label: string }[]}
          heroImage={config.heroImage as string}
          theme={config.theme as string}
        />
      )
    case "nexo-features":
      return <NexoFeatures />
    case "nexo-ai-section":
      return <NexoAISection />
    case "nexo-vercel-section":
      return <NexoVercelSection />

    // NEXUS template sections
    case "nexus-hero":
      return <NexusHeroSection demoteHeading={demoteHeading} config={config} />
    case "nexus-features":
      return (
        <NexusFeaturesSection
          demoteHeading={demoteHeading}
          badge={config.badge as string}
          headingLine1={config.headingLine1 as string}
          headingLine2={config.headingLine2 as string}
          description={config.description as string}
          features={config.features as { title: string; description: string; animationKey: "neural" | "workflow" | "security" | "analytics" | "globe" | "api" }[]}
        />
      )
    case "nexus-how-it-works":
      return <NexusHowItWorksSection demoteHeading={demoteHeading} />
    case "nexus-infrastructure":
      return <NexusInfrastructureSection demoteHeading={demoteHeading} />
    case "nexus-metrics":
      return <NexusMetricsSection demoteHeading={demoteHeading} />
    case "nexus-integrations":
      return <NexusIntegrationsSection demoteHeading={demoteHeading} />
    case "nexus-security":
      return <NexusSecuritySection demoteHeading={demoteHeading} />
    case "nexus-developers":
      return <NexusDevelopersSection demoteHeading={demoteHeading} />
    case "nexus-cta":
      return <NexusCtaSection demoteHeading={demoteHeading} />

    case "animated-roadmap":
      return (
        <AnimatedRoadmapSection
          headline={config.headline as string}
          highlightedWord={config.highlightedWord as string}
          headlineSuffix={config.headlineSuffix as string}
          description={config.description as string}
          primaryCtaText={config.primaryCtaText as string}
          primaryCtaHref={config.primaryCtaHref as string}
          secondaryCtaText={config.secondaryCtaText as string}
          secondaryCtaHref={config.secondaryCtaHref as string}
          mapImageSrc={config.mapImageSrc as string}
          milestones={(config.milestones as RoadmapMilestone[]) || []}
          demoteHeading={demoteHeading}
        />
      )

    // SPLIT template sections
    case "split-hero-3d":
      return (
        <SplitHero3d
          headline={config.headline as string}
          description={config.description as string}
          primaryCtaText={config.primaryCtaText as string}
          primaryCtaHref={config.primaryCtaHref as string}
          secondaryCtaLabel={config.secondaryCtaLabel as string}
          secondaryCtaText={config.secondaryCtaText as string}
          secondaryCtaHref={config.secondaryCtaHref as string}
          backgroundImage={config.backgroundImage as string}
          demoteHeading={demoteHeading}
        />
      )
    case "split-logo-cloud":
      return <SplitLogoCloud />
    case "split-feature-cards":
      return <SplitFeatureCards demoteHeading={demoteHeading} />
    case "split-ai-section":
      return <SplitAiSection demoteHeading={demoteHeading} />
    case "split-workflows":
      return <SplitWorkflows demoteHeading={demoteHeading} />
    case "split-product-direction":
      return <SplitProductDirection demoteHeading={demoteHeading} />
    case "split-cta":
      return <SplitCta demoteHeading={demoteHeading} />

    case "single-pricing-card":
      return (
        <SinglePricingCard
          sectionHeadline={config.sectionHeadline as string}
          sectionDescription={config.sectionDescription as string}
          sectionBadgeText={config.sectionBadgeText as string}
          sectionBadgeIcon={config.sectionBadgeIcon as string}
          badgeText={config.badgeText as string}
          badgeIcon={config.badgeIcon as string}
          title={(config.title as string) || "Paket"}
          subtitle={(config.subtitle as string) || ""}
          priceCurrent={(config.priceCurrent as string) || ""}
          priceOriginal={config.priceOriginal as string}
          priceDiscount={config.priceDiscount as string}
          benefits={config.benefits as { text: string; icon?: string }[]}
          features={config.features as { text: string }[]}
          featuresIcon={config.featuresIcon as string}
          featuresTitle={config.featuresTitle as string}
          featuresImage={config.featuresImage as string}
          featuresImageAlt={config.featuresImageAlt as string}
          primaryButtonText={config.primaryButtonText as string}
          primaryButtonIcon={config.primaryButtonIcon as string}
          primaryButtonHref={config.primaryButtonHref as string}
          secondaryButtonText={config.secondaryButtonText as string}
          secondaryButtonIcon={config.secondaryButtonIcon as string}
          secondaryButtonHref={config.secondaryButtonHref as string}
          testimonials={config.testimonials as SinglePricingTestimonial[]}
          testimonialRotationSpeed={config.testimonialRotationSpeed as number}
          light={config.light as boolean}
          demoteHeading={demoteHeading}
        />
      )

    case "single-pricing-card-3col":
      return (
        <SinglePricingCard3Col
          sectionHeadline={config.sectionHeadline as string}
          sectionDescription={config.sectionDescription as string}
          sectionBadgeText={config.sectionBadgeText as string}
          sectionBadgeIcon={config.sectionBadgeIcon as string}
          badgeText={config.badgeText as string}
          badgeIcon={config.badgeIcon as string}
          title={(config.title as string) || "Paket"}
          subtitle={(config.subtitle as string) || ""}
          priceCurrent={(config.priceCurrent as string) || ""}
          priceOriginal={config.priceOriginal as string}
          priceDiscount={config.priceDiscount as string}
          benefits={config.benefits as { text: string; icon?: string }[]}
          features={config.features as { text: string }[]}
          featuresIcon={config.featuresIcon as string}
          featuresTitle={config.featuresTitle as string}
          featuresImage={config.featuresImage as string}
          featuresImageAlt={config.featuresImageAlt as string}
          richTitle={config.richTitle as string}
          richContent={config.richContent as string}
          primaryButtonText={config.primaryButtonText as string}
          primaryButtonIcon={config.primaryButtonIcon as string}
          primaryButtonHref={config.primaryButtonHref as string}
          secondaryButtonText={config.secondaryButtonText as string}
          secondaryButtonIcon={config.secondaryButtonIcon as string}
          secondaryButtonHref={config.secondaryButtonHref as string}
          light={config.light as boolean}
          demoteHeading={demoteHeading}
        />
      )

    case "riotters-hero":
      return (
        <RiottersHero
          headlineLine1={config.headlineLine1 as string}
          headlineLine2={config.headlineLine2 as string}
          highlightedWord={config.highlightedWord as string}
          authorName={config.authorName as string}
          authorTitle={config.authorTitle as string}
          authorAvatar={config.authorAvatar as string}
          quote={config.quote as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          image1={config.image1 as string}
          image2={config.image2 as string}
          image3={config.image3 as string}
          image4={config.image4 as string}
          light={config.light as boolean}
          demoteHeading={demoteHeading}
        />
      )

    case "feature-section-1":
      return (
        <FeatureSection1
          mainIcon={config.mainIcon as string}
          title={(config.title as string) || "Özellikler"}
          subtitle={config.subtitle as string}
          features={config.features as FeatureSection1Feature[]}
          ctaTitle={config.ctaTitle as string}
          ctaDescription={config.ctaDescription as string}
          primaryButtonText={config.primaryButtonText as string}
          primaryButtonIcon={config.primaryButtonIcon as string}
          primaryButtonHref={config.primaryButtonHref as string}
          secondaryButtonText={config.secondaryButtonText as string}
          secondaryButtonIcon={config.secondaryButtonIcon as string}
          secondaryButtonHref={config.secondaryButtonHref as string}
          demoteHeading={demoteHeading}
        />
      )

    case "benchmark-charts":
      return (
        <BenchmarkCharts
          headline={config.headline as string}
          description={config.description as string}
          charts={config.charts as BenchmarkChartItem[]}
          columns={config.columns as 1 | 2 | 3}
          light={config.light as boolean}
          demoteHeading={demoteHeading}
        />
      )

    case "immersive-gallery":
      return (
        <ImmersiveGallery
          headline={config.headline as string}
          images={config.images as { src: string }[]}
          light={config.light as boolean}
          demoteHeading={demoteHeading}
        />
      )

    case "clip-hover-grid":
      return (
        <ClipHoverGrid
          headline={config.headline as string}
          description={config.description as string}
          items={config.items as ClipHoverItem[]}
          orientation={config.orientation as "vertical" | "horizontal"}
          slicesTotal={config.slicesTotal as number}
          columns={config.columns as 1 | 2 | 3}
          demoteHeading={demoteHeading}
        />
      )

    case "conversion-integrations-section":
      return (
        <ConversionIntegrationsSection
          label={config.label as string}
          title={config.title as string}
          description={config.description as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          logos={config.logos as import("./conversion-integrations-section").LogoEntry[]}
          demoteHeading={demoteHeading}
        />
      )

    case "st-aero-hero-1":
      return (
        <StAeroHero1
          headline={config.headline as string}
          description={config.description as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          image={config.image as string}
          imageAlt={config.imageAlt as string}
          avatarCount={config.avatarCount as string}
          avatarLabel={config.avatarLabel as string}
          avatarImages={config.avatarImages as string[]}
          logos={config.logos as string[]}
          demoteHeading={demoteHeading}
        />
      )

    case "st-tabs":
      return (
        <StTabsSection
          headline={config.headline as string}
          subtitle={config.subtitle as string}
          items={config.items as { id: string; title: string; description: string; image: string }[]}
          autoPlayDuration={config.autoPlayDuration as number}
          demoteHeading={demoteHeading}
        />
      )

    case "st-lets-work":
      return (
        <StLetsWorkSection
          statusText={config.statusText as string}
          headlineLine1={config.headlineLine1 as string}
          headlineLine2={config.headlineLine2 as string}
          description={config.description as string}
          email={config.email as string}
          successTitle={config.successTitle as string}
          successSubtitle={config.successSubtitle as string}
          bookCallText={config.bookCallText as string}
          bookCallUrl={config.bookCallUrl as string}
          bookCallNote={config.bookCallNote as string}
          demoteHeading={demoteHeading}
        />
      )

    case "st-marquee":
      return (
        <StMarqueeSection
          items={config.items as string[]}
          fontSize={config.fontSize as number}
          fontWeight={config.fontWeight as number}
          pixelsPerFrame={config.pixelsPerFrame as number}
          rotateY={config.rotateY as number}
          rotateX={config.rotateX as number}
          perspective={config.perspective as number}
          speed={config.speed as number}
          dark={config.dark as boolean}
          height={config.height as string}
          durationInFrames={config.durationInFrames as number}
          fps={config.fps as number}
          demoteHeading={demoteHeading}
        />
      )

    // Azurio Branding Studio sections
    case "az-hero":
      return (
        <AzHero
          headline={config.headline as string}
          subtext={config.subtext as string}
          brandText={config.brandText as string}
          tags={config.tags as string[]}
          tags2={config.tags2 as string[]}
          contactItems={config.contactItems as { label: string; href: string }[]}
          videoSrc={config.videoSrc as string}
          videoPoster={config.videoPoster as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
        />
      )

    case "az-projects-stack":
      return (
        <AzProjectsStack
          cards={config.cards as { title: string; tags?: string[]; image: string; ctaText?: string; ctaHref?: string }[]}
          marqueeItems={config.marqueeItems as string[]}
        />
      )

    case "az-sticky-caption":
      return (
        <AzStickyCaption
          headline={config.headline as string}
          highlightedWords={config.highlightedWords as string[]}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          images={config.images as { src: string; tag: string }[]}
        />
      )

    case "az-sticky-images":
      return (
        <AzStickyImages
          slides={config.slides as { title: string; image: string }[]}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
        />
      )

    case "az-manifest-split":
      return (
        <AzManifestSplit
          manifestText={config.manifestText as string}
          manifestHighlight={config.manifestHighlight as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          image={config.image as string}
          imageAlt={config.imageAlt as string}
          description={config.description as string}
          tags={config.tags as string[]}
        />
      )

    case "az-parallax-divider":
      return (
        <AzParallaxDivider
          image={config.image as string}
          imageAlt={config.imageAlt as string}
          headline={config.headline as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          overlayOpacity={config.overlayOpacity as number}
        />
      )

    case "az-blog-grid":
      return (
        <AzBlogGrid
          headline={config.headline as string}
          description={config.description as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          items={config.items as { title: string; date: string; image: string; href?: string }[]}
        />
      )

    case "az-cta-marquee":
      return (
        <AzCtaMarquee
          headline={config.headline as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          images={config.images as { src: string; tag: string }[]}
          dark={config.dark as boolean}
        />
      )

    case "crowd-canvas":
      return (
        <CrowdCanvasSection
          label={config.label as string}
          headline={config.headline as string}
          description={config.description as string}
          primaryCtaText={config.primaryCtaText as string}
          primaryCtaHref={config.primaryCtaHref as string}
          secondaryCtaText={config.secondaryCtaText as string}
          secondaryCtaHref={config.secondaryCtaHref as string}
          imageSrc={config.imageSrc as string}
          rows={config.rows as number}
          cols={config.cols as number}
          height={config.height as string}
          dark={config.dark as boolean}
        />
      )

    case "hover-brand-logo":
      return (
        <HoverBrandLogoSection
          label={config.label as string}
          defaultText={config.defaultText as string}
          brands={config.brands as { id: string; name: string; icon?: string }[]}
          dark={config.dark as boolean}
        />
      )

    case "masonry-gallery":
      return (
        <MasonryGallerySection
          label={config.label as string}
          headline={config.headline as string}
          description={config.description as string}
          items={config.items as MasonryItem[]}
          ease={config.ease as string}
          duration={config.duration as number}
          stagger={config.stagger as number}
          animateFrom={
            config.animateFrom as
              | "top"
              | "bottom"
              | "left"
              | "right"
              | "center"
              | "random"
          }
          scaleOnHover={config.scaleOnHover as boolean}
          hoverScale={config.hoverScale as number}
          blurToFocus={config.blurToFocus as boolean}
          colorShiftOnHover={config.colorShiftOnHover as boolean}
          dark={config.dark as boolean}
        />
      )

    case "pixel-blast-hero":
      return (
        <PixelBlastHeroSection
          eyebrow={config.eyebrow as string}
          headline={config.headline as string}
          description={config.description as string}
          primaryCtaText={config.primaryCtaText as string}
          primaryCtaHref={config.primaryCtaHref as string}
          secondaryCtaText={config.secondaryCtaText as string}
          secondaryCtaHref={config.secondaryCtaHref as string}
          variant={config.variant as "square" | "circle" | "triangle" | "diamond"}
          pixelSize={config.pixelSize as number}
          color={config.color as string}
          patternScale={config.patternScale as number}
          patternDensity={config.patternDensity as number}
          pixelSizeJitter={config.pixelSizeJitter as number}
          enableRipples={config.enableRipples as boolean}
          rippleSpeed={config.rippleSpeed as number}
          rippleThickness={config.rippleThickness as number}
          rippleIntensityScale={config.rippleIntensityScale as number}
          liquid={config.liquid as boolean}
          liquidStrength={config.liquidStrength as number}
          liquidRadius={config.liquidRadius as number}
          liquidWobbleSpeed={config.liquidWobbleSpeed as number}
          speed={config.speed as number}
          edgeFade={config.edgeFade as number}
          transparent={config.transparent as boolean}
          bgColor={config.bgColor as string}
          textColor={config.textColor as string}
          height={config.height as string}
          heroImage={config.heroImage as string}
          heroImageAlt={config.heroImageAlt as string}
        />
      )

    case "code-nest-hero":
      return (
        <CodeNestHeroSection
          videoSrc={config.videoSrc as string}
          eyebrow={config.eyebrow as string}
          headline={config.headline as string}
          description={config.description as string}
          ctaLabel={config.ctaLabel as string}
          ctaHref={config.ctaHref as string}
          cardTag={config.cardTag as string}
          cardHeadline={config.cardHeadline as string}
          cardItalicWord={config.cardItalicWord as string}
          cardDescription={config.cardDescription as string}
          brandName={config.brandName as string}
          showInternalNav={config.showInternalNav as boolean}
          accent={config.accent as string}
          bgColor={config.bgColor as string}
        />
      )

    case "scroll-blur-typography":
      return (
        <ScrollBlurTypography
          items={config.items as ScrollBlurItem[]}
          fontSize={config.fontSize as "sm" | "md" | "lg" | "xl"}
          align={config.align as "left" | "center" | "right"}
          demoteHeading={demoteHeading}
        />
      )

    case "liveblocks-home-hero":
      return (
        <LiveblocksHomeHero
          badgeText={config.badgeText as string}
          badgeLinkText={config.badgeLinkText as string}
          headline={config.headline as string}
          descriptionPrefix={config.descriptionPrefix as string}
          descriptionSuffix={config.descriptionSuffix as string}
          features={config.features as import("./liveblocks-home-hero").LiveblocksFeatureChip[]}
          primaryCtaText={config.primaryCtaText as string}
          primaryCtaHref={config.primaryCtaHref as string}
          secondaryCtaText={config.secondaryCtaText as string}
          secondaryCtaHref={config.secondaryCtaHref as string}
          bottomImage={config.bottomImage as string}
          demoteHeading={demoteHeading}
        />
      )

    case "perspective-hero":
      return (
        <PerspectiveHero
          line1={config.line1 as string}
          line2={config.line2 as string}
          line3={config.line3 as string}
          line4={config.line4 as string}
          line5={config.line5 as string}
          line6={config.line6 as string}
          cardTitle={config.cardTitle as string}
          cardDescription={config.cardDescription as string}
          cardFooter={config.cardFooter as string}
          scrollLabel={config.scrollLabel as string}
          modelUrl={config.modelUrl as string}
          sceneBackground={config.sceneBackground as string}
          dark={config.dark as boolean}
        />
      )

    case "customers-showcase":
      return (
        <CustomersShowcase
          headlinePart1={config.headlinePart1 as string}
          inlineImage1={config.inlineImage1 as string}
          headlinePart2={config.headlinePart2 as string}
          inlineImage2={config.inlineImage2 as string}
          headlinePart3={config.headlinePart3 as string}
          logoBarLabel={config.logoBarLabel as string}
          logos={config.logos as CustomerLogoConfig[]}
          description={config.description as string}
          descriptionMuted={config.descriptionMuted as string}
          ctaText={config.ctaText as string}
          ctaHref={config.ctaHref as string}
          finePrint={config.finePrint as string}
          finePrintHighlight={config.finePrintHighlight as string}
          dark={config.dark as boolean}
        />
      )

    case "feature-carousel":
      return (
        <FeatureCarousel
          features={config.features as FeatureCarouselItem[]}
          accentColor={config.accentColor as string}
          autoPlayInterval={config.autoPlayInterval as number}
        />
      )

    default:
      return null
  }
}
