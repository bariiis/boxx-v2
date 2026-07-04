"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save, Upload, X, ImageIcon } from "lucide-react"
import { TiptapEditor } from "@/components/admin/tiptap-editor"
import { useEffect } from "react"
import { searchProducts } from "@/lib/actions/product-actions"

interface Props {
  sectionId: string
  sectionType: string
  config: Record<string, unknown>
  onSave: (config: Record<string, unknown>) => void
  saving: boolean
}

export function LandingSectionConfigEditor({ sectionId, sectionType, config: initialConfig, onSave, saving }: Props) {
  const [config, setConfig] = useState<Record<string, unknown>>(initialConfig)

  function update(key: string, value: unknown) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base">
          {sectionTypeLabels[sectionType] || sectionType}
        </CardTitle>
        <Button size="sm" onClick={() => onSave(config)} disabled={saving}>
          <Save className="mr-2 size-4" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </CardHeader>
      <CardContent>
        {sectionType === "hero-statement" && (
          <HeroStatementConfig config={config} update={update} />
        )}
        {sectionType === "hero-shade" && (
          <HeroShadeConfig config={config} update={update} />
        )}
        {sectionType === "hero-audio-reactive" && (
          <HeroAudioReactiveConfig config={config} update={update} />
        )}
        {sectionType === "hero-video" && (
          <HeroVideoConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "feature-storytelling" && (
          <FeatureStorytellingConfig config={config} update={update} />
        )}
        {sectionType === "features-block" && (
          <FeaturesBlockConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "feature-grid" && (
          <FeatureGridConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "full-bleed-media" && (
          <FullBleedMediaConfig config={config} update={update} />
        )}
        {sectionType === "tech-specs" && (
          <TechSpecsConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "bento-grid" && (
          <BentoGridConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "bento-box" && (
          <BentoBoxConfig config={config} update={update} />
        )}
        {sectionType === "logo-cloud" && (
          <LogoCloudConfig config={config} update={update} />
        )}
        {sectionType === "cta-illustration" && (
          <CtaIllustrationConfig config={config} update={update} />
        )}
        {sectionType === "purchase-cta" && (
          <PurchaseCtaConfig config={config} update={update} />
        )}
        {sectionType === "saaspo-feature-linear" && (
          <SaaspoFeatureLinearConfig config={config} update={update} />
        )}
        {sectionType === "urunler-slide" && (
          <UrunlerSlideConfig config={config} update={update} />
        )}
        {sectionType === "testimonials-v2" && (
          <TestimonialsV2Config config={config} update={update} />
        )}
        {sectionType === "main-hero" && (
          <MainHeroConfig config={config} update={update} />
        )}
        {sectionType === "stats-counter" && (
          <StatsCounterConfig config={config} update={update} />
        )}
        {sectionType === "faq-accordion" && (
          <FaqAccordionConfig config={config} update={update} />
        )}
        {sectionType === "contact-form" && (
          <ContactFormConfig config={config} update={update} />
        )}
        {sectionType === "pricing-table" && (
          <PricingTableConfig config={config} update={update} />
        )}
        {sectionType === "image-text-split" && (
          <ImageTextSplitConfig config={config} update={update} />
        )}
        {sectionType === "cta-banner" && (
          <CtaBannerConfig config={config} update={update} />
        )}
        {sectionType === "hero-gradient" && (
          <HeroGradientConfig config={config} update={update} />
        )}
        {sectionType === "clip-hover-grid" && (
          <ClipHoverGridConfig config={config} update={update} />
        )}
        {sectionType === "single-pricing-card" && (
          <SinglePricingCardConfig config={config} update={update} />
        )}
        {sectionType === "single-pricing-card-3col" && (
          <SinglePricingCard3ColConfig config={config} update={update} />
        )}
        {sectionType === "immersive-gallery" && (
          <ImmersiveGalleryConfig config={config} update={update} />
        )}
        {sectionType === "benchmark-charts" && (
          <BenchmarkChartsConfig config={config} update={update} />
        )}
        {sectionType === "feature-section-1" && (
          <FeatureSection1Config config={config} update={update} />
        )}
        {sectionType === "riotters-hero" && (
          <RiottersHeroConfig config={config} update={update} />
        )}
        {sectionType === "split-hero-3d" && (
          <SplitHero3dConfig config={config} update={update} />
        )}
        {sectionType === "animated-roadmap" && (
          <AnimatedRoadmapConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "st-aero-hero-1" && (
          <StAeroHero1Config config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "st-tabs" && (
          <StTabsConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "st-lets-work" && (
          <StLetsWorkConfig config={config} update={update} />
        )}
        {sectionType === "st-marquee" && (
          <StMarqueeConfig config={config} update={update} />
        )}
        {sectionType === "az-hero" && (
          <AzHeroConfig config={config} update={update} />
        )}
        {sectionType === "az-projects-stack" && (
          <AzProjectsStackConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "az-sticky-caption" && (
          <AzStickyCaptionConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "az-sticky-images" && (
          <AzStickyImagesConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "az-manifest-split" && (
          <AzManifestSplitConfig config={config} update={update} />
        )}
        {sectionType === "az-parallax-divider" && (
          <AzParallaxDividerConfig config={config} update={update} />
        )}
        {sectionType === "az-blog-grid" && (
          <AzBlogGridConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "az-cta-marquee" && (
          <AzCtaMarqueeConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "product-hero" && (
          <ProductHeroConfig config={config} update={update} />
        )}
        {sectionType === "hover-brand-logo" && (
          <HoverBrandLogoConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "code-nest-hero" && (
          <CodeNestHeroConfig config={config} update={update} />
        )}
        {sectionType === "pixel-blast-hero" && (
          <PixelBlastHeroConfig config={config} update={update} />
        )}
        {sectionType === "masonry-gallery" && (
          <MasonryGalleryConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "nexus-features" && (
          <NexusFeaturesConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "nexo-hero" && (
          <NexoHeroConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "scroll-blur-typography" && (
          <ScrollBlurTypographyConfig config={config} update={update} />
        )}
        {sectionType === "conversion-integrations-section" && (
          <ConversionIntegrationsSectionConfig config={config} update={update} />
        )}
        {sectionType === "liveblocks-home-hero" && (
          <LiveblocksHomeHeroConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "st-hero" && (
          <StHeroConfig config={config} update={update} />
        )}
        {sectionType === "nexus-hero" && (
          <NexusHeroConfig config={config} update={update} />
        )}
        {sectionType === "hookable-ai-cta-3" && (
          <HookableAiCta3Config config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "hero-text-image" && (
          <HeroTextImageConfig config={config} update={update} />
        )}
        {sectionType === "advantages-x-premium" && (
          <AdvantagesXPremiumConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "imweb-me-stats-6" && (
          <ImwebMeStats6Config config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "saaspo-feature-sections-voiceflow" && (
          <SaaspoFeatureVoiceflowConfig config={config} update={update} setConfig={setConfig} />
        )}
        {sectionType === "spatial-product-showcase" && (
          <SpatialProductShowcaseConfig config={config} update={update} />
        )}
        {sectionType === "perspective-hero" && (
          <PerspectiveHeroConfig config={config} update={update} />
        )}
        {sectionType === "customers-showcase" && (
          <CustomersShowcaseConfig config={config} update={update} />
        )}
        {sectionType === "feature-carousel" && (
          <FeatureCarouselConfig config={config} update={update} setConfig={setConfig} />
        )}
      </CardContent>
    </Card>
  )
}

const sectionTypeLabels: Record<string, string> = {
  "product-hero": "Ürün Hero",
  "hero-statement": "Hero Statement",
  "hero-shade": "Hero Shade",
  "hero-audio-reactive": "Hero Audio Reactive",
  "hero-video": "Hero Video",
  "feature-storytelling": "Feature Storytelling",
  "features-block": "Features Block",
  "feature-grid": "Feature Grid",
  "full-bleed-media": "Full-Bleed Media",
  "tech-specs": "Tech Specs",
  "purchase-cta": "Purchase CTA",
  "bento-grid": "Bento Grid (Animated)",
  "bento-box": "Bento Box",
  "logo-cloud": "Logo Cloud",
  "cta-illustration": "CTA Illustration",
  "saaspo-feature-linear": "Saaspo Feature (Linear)",
  "urunler-slide": "Ürünler Slide",
  "testimonials-v2": "Testimonials V2",
  "main-hero": "Main Hero",
  "stats-counter": "Stats Counter",
  "faq-accordion": "FAQ Accordion",
  "contact-form": "İletişim Formu",
  "pricing-table": "Pricing Table",
  "image-text-split": "Image + Text Split",
  "cta-banner": "CTA Banner",
  "hero-gradient": "Hero Gradient",
  "clip-hover-grid": "Clip Hover Grid",
  "single-pricing-card": "Tekli Fiyat Kartı",
  "single-pricing-card-3col": "Tekli Fiyat Kartı (3 Kolon)",
  "immersive-gallery": "Galeri",
  "benchmark-charts": "Benchmark Kartları",
  "feature-section-1": "Özellikler",
  "riotters-hero": "Ürün-Detay",
  "split-hero-3d": "SPLIT · 3D Hero",
  "animated-roadmap": "Animasyonlu Yol Haritası",
  "st-aero-hero-1": "ST Aero Hero",
  "st-tabs": "ST Vertical Tabs",
  "st-lets-work": "ST Let's Work Together",
  "st-marquee": "ST Perspective Marquee",
  "az-hero": "AZ Hero",
  "az-projects-stack": "AZ Projects Stack",
  "az-sticky-caption": "AZ Sticky Caption",
  "az-sticky-images": "AZ Sticky Images",
  "az-manifest-split": "AZ Manifest Split",
  "az-parallax-divider": "AZ Parallax Divider",
  "az-blog-grid": "AZ Blog Grid",
  "az-cta-marquee": "AZ CTA Marquee",
  "hover-brand-logo": "Hover Brand Logo",
  "code-nest-hero": "CodeNest Hero (HLS Video)",
  "pixel-blast-hero": "Pixel Blast Hero",
  "masonry-gallery": "Masonry Galeri",
  "nexus-features": "NEXUS · Features",
  "nexo-hero": "NEXO · Hero",
  "scroll-blur-typography": "Scroll Blur Typography",
  "liveblocks-home-hero": "Liveblocks Hero",
  "conversion-integrations-section": "Entegrasyonlar (Conversion)",
  "saaspo-feature-sections-voiceflow": "Saaspo Feature (Voiceflow)",
  "spatial-product-showcase": "Ürün Showcase (Sol/Sağ)",
  "customers-showcase": "Müşteriler",
  "perspective-hero": "Perspektif Hero (3D)",
  "feature-carousel": "Features Carousel",
}

function SaaspoFeatureLinearConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field label="Badge" value={config.badge as string} onChange={(v) => update("badge", v)} placeholder="Project and long-term planning" />
      <Field label="Başlık" value={config.title as string} onChange={(v) => update("title", v)} placeholder="Set the product direction" />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
    </div>
  )
}

// ==========================================
// HERO STATEMENT CONFIG
// ==========================================

function HeroStatementConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field label="Üst Etiket" value={config.subheadline as string} onChange={(v) => update("subheadline", v)} placeholder="Örn: STUUX Workstation Serisi" />
      <Field label="Ana Başlık *" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="Sınırsız Güç." />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="İkinci CTA Metin" value={config.secondaryCtaText as string} onChange={(v) => update("secondaryCtaText", v)} />
        <Field label="İkinci CTA Link" value={config.secondaryCtaHref as string} onChange={(v) => update("secondaryCtaHref", v)} />
      </div>
      <ImageUploadField label="Görsel" value={config.image as string} onChange={(v) => update("image", v)} />
      {config.image ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Görsel En/Boy Oranı</Label>
            <Select
              value={(config.imageAspect as string) || "16/9"}
              onValueChange={(v) => update("imageAspect", v)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16/9">16:9 (yatay)</SelectItem>
                <SelectItem value="21/9">21:9 (ultra-wide)</SelectItem>
                <SelectItem value="3/2">3:2 (fotoğraf)</SelectItem>
                <SelectItem value="4/3">4:3 (klasik)</SelectItem>
                <SelectItem value="1/1">1:1 (kare)</SelectItem>
                <SelectItem value="9/16">9:16 (dikey)</SelectItem>
                <SelectItem value="auto">Otomatik (orijinal)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Görsel Doldurma</Label>
            <Select
              value={(config.imageFit as string) || "cover"}
              onValueChange={(v) => update("imageFit", v)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover (kırp, alanı doldur)</SelectItem>
                <SelectItem value="contain">Contain (sığdır, tamamını göster)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Maks. Genişlik (px)</Label>
            <Input
              type="number"
              value={(config.imageMaxWidth as number) ?? 1000}
              onChange={(e) => update("imageMaxWidth", parseInt(e.target.value) || 1000)}
              className="h-9 text-sm"
            />
          </div>
          <Field
            label="Görsel Arka Plan (contain için)"
            value={config.imageBg as string}
            onChange={(v) => update("imageBg", v)}
            placeholder="#0a0a0a veya transparent"
          />
          <div className="sm:col-span-2">
            <Field label="Görsel Alt Metin" value={config.imageAlt as string} onChange={(v) => update("imageAlt", v)} />
          </div>
        </div>
      ) : null}
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// HERO SHADE CONFIG
// ==========================================

function HeroShadeConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field label="Ana Başlık *" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="Sınırsız Güç." />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="İkinci CTA Metin" value={config.secondaryCtaText as string} onChange={(v) => update("secondaryCtaText", v)} />
        <Field label="İkinci CTA Link" value={config.secondaryCtaHref as string} onChange={(v) => update("secondaryCtaHref", v)} />
      </div>
      <ImageUploadField label="Görsel" value={config.image as string} onChange={(v) => update("image", v)} />
      <Field label="Görsel Alt Metin" value={config.imageAlt as string} onChange={(v) => update("imageAlt", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Beam Renk 1" value={config.beamColorFrom as string} onChange={(v) => update("beamColorFrom", v)} placeholder="#ffaa40" />
        <Field label="Beam Renk 2" value={config.beamColorTo as string} onChange={(v) => update("beamColorTo", v)} placeholder="#9c40ff" />
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// HERO AUDIO REACTIVE CONFIG
// ==========================================

function HeroAudioReactiveConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field label="Üst Etiket" value={config.tagline as string} onChange={(v) => update("tagline", v)} placeholder="Küçük üst yazı" />
      <Field label="Ana Başlık *" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="THE BEAUTY OF" />
      <Field label="İkinci Satır" value={config.headlineSecondLine as string} onChange={(v) => update("headlineSecondLine", v)} placeholder="NOISE" />
      <TextareaField label="Alt Yazı" value={config.subtitle as string} onChange={(v) => update("subtitle", v)} />
      <Field label="Kredi Metni" value={config.creditText as string} onChange={(v) => update("creditText", v)} placeholder="Music by ..." />
      <Field label="Ses Dosyası URL" value={config.audioSrc as string} onChange={(v) => update("audioSrc", v)} placeholder="/uploads/audio.mp3 (opsiyonel)" />
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// HERO VIDEO CONFIG
// ==========================================

function HeroVideoConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const logos = (config.logos as { src: string; alt: string; height?: number }[]) || []

  function updateLogo(index: number, key: string, value: string | number) {
    const newLogos = [...logos]
    newLogos[index] = { ...newLogos[index], [key]: value }
    update("logos", newLogos)
  }

  function addLogo() {
    update("logos", [...logos, { src: "", alt: "Logo", height: 20 }])
  }

  function removeLogo(index: number) {
    update("logos", logos.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Field label="Ana Baslik *" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="Sinrsiz Guc." />
      <div className="space-y-2">
        <Label>Açıklama</Label>
        <TiptapEditor
          content={(config.description as string) || ""}
          onChange={(v) => update("description", v)}
          placeholder="Açıklama yazın..."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ikinci CTA Metin" value={config.secondaryCtaText as string} onChange={(v) => update("secondaryCtaText", v)} />
        <Field label="Ikinci CTA Link" value={config.secondaryCtaHref as string} onChange={(v) => update("secondaryCtaHref", v)} />
      </div>
      <Field label="Video URL" value={config.videoSrc as string} onChange={(v) => update("videoSrc", v)} placeholder="Video dosya yolu veya URL" />
      <ImageUploadField label="Sağ Görsel" value={config.image as string} onChange={(v) => update("image", v)} />
      <Field label="Görsel Alt" value={config.imageAlt as string} onChange={(v) => update("imageAlt", v)} />
      <div className="space-y-2">
        <Label>Yükseklik</Label>
        <Select value={(config.height as string) || "large"} onValueChange={(v) => update("height", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Küçük</SelectItem>
            <SelectItem value="medium">Orta</SelectItem>
            <SelectItem value="large">Büyük</SelectItem>
            <SelectItem value="full">Tam Ekran</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Switch checked={config.showLogoBanner as boolean} onCheckedChange={(v) => update("showLogoBanner", v)} />
        <Label>Logo Banner Goster</Label>
      </div>

      {config.showLogoBanner === true && (
        <>
          <Field label="Banner Metni" value={config.logoBannerText as string} onChange={(v) => update("logoBannerText", v)} placeholder="En iyi ekiplerin tercihi" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Logolar</Label>
              <Button variant="outline" size="sm" onClick={addLogo}>
                <Plus className="mr-1 size-3.5" /> Logo Ekle
              </Button>
            </div>
            {logos.map((logo, i) => (
              <div key={i} className="space-y-2 rounded-lg border p-3">
                <LogoRow
                  logo={{ src: logo.src, alt: logo.alt }}
                  onChange={(key, value) => updateLogo(i, key, value)}
                  onRemove={() => removeLogo(i)}
                />
                <Input
                  type="number"
                  value={logo.height || 20}
                  onChange={(e) => updateLogo(i, "height", Number(e.target.value))}
                  placeholder="Yükseklik (px)"
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </>
      )}

      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// FEATURES BLOCK CONFIG
// ==========================================

function FeaturesBlockConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const features = (config.features as { title: string; description: string; icon?: string }[]) || []
  const marqueeItems = (config.marqueeItems as string[]) || []

  function updateFeature(index: number, key: string, value: string) {
    const newFeatures = [...features]
    newFeatures[index] = { ...newFeatures[index], [key]: value }
    update("features", newFeatures)
  }

  function addFeature() {
    update("features", [...features, { title: "Yeni Özellik", description: "", icon: "zap" }])
  }

  function removeFeature(index: number) {
    update("features", features.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık *" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />

      {/* Marquee items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Marquee Etiketleri</Label>
          <Button variant="outline" size="sm" onClick={() => update("marqueeItems", [...marqueeItems, "Yeni etiket"])}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {marqueeItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const newItems = [...marqueeItems]
                newItems[i] = e.target.value
                update("marqueeItems", newItems)
              }}
              placeholder="Etiket metni"
            />
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => update("marqueeItems", marqueeItems.filter((_, idx) => idx !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Özellikler</Label>
          <Button variant="outline" size="sm" onClick={addFeature}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {features.map((feature, i) => (
          <div key={i} className="flex gap-2 rounded-lg border p-3">
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input value={feature.title} onChange={(e) => updateFeature(i, "title", e.target.value)} placeholder="Başlık" className="flex-1" />
                <Select value={feature.icon || "zap"} onValueChange={(v) => updateFeature(i, "icon", v)}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zap">Zap</SelectItem>
                    <SelectItem value="target">Target</SelectItem>
                    <SelectItem value="shield">Shield</SelectItem>
                    <SelectItem value="heart">Heart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea value={feature.description} onChange={(e) => updateFeature(i, "description", e.target.value)} placeholder="Açıklama" rows={2} />
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeFeature(i)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// FEATURE STORYTELLING CONFIG
// ==========================================

function FeatureStorytellingConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field label="Etiket" value={config.label as string} onChange={(v) => update("label", v)} placeholder="Örn: Performans" />
      <Field label="Başlık *" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <ImageUploadField label="Görsel *" value={config.image as string} onChange={(v) => update("image", v)} />
      <div className="flex items-center gap-3">
        <Switch checked={config.reverse as boolean} onCheckedChange={(v) => update("reverse", v)} />
        <Label>Ters Yön (görsel solda)</Label>
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// FEATURE GRID CONFIG
// ==========================================

function FeatureGridConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const items = (config.items as { title: string; description: string; icon: string }[]) || []

  function updateItem(index: number, key: string, value: string) {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [key]: value }
    update("items", newItems)
  }

  function addItem() {
    update("items", [...items, { title: "Yeni Özellik", description: "", icon: "" }])
  }

  function removeItem(index: number) {
    update("items", items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <div className="space-y-2">
        <Label>Kolon Sayısı</Label>
        <Select value={String(config.columns || 2)} onValueChange={(v) => update("columns", Number(v))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Kolon</SelectItem>
            <SelectItem value="3">3 Kolon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Özellikler</Label>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 rounded-lg border p-3">
            <div className="flex-1 space-y-2">
              <Input
                value={item.icon}
                onChange={(e) => updateItem(i, "icon", e.target.value)}
                placeholder="Emoji (opsiyonel)"
                className="w-20"
              />
              <Input
                value={item.title}
                onChange={(e) => updateItem(i, "title", e.target.value)}
                placeholder="Başlık"
              />
              <Textarea
                value={item.description}
                onChange={(e) => updateItem(i, "description", e.target.value)}
                placeholder="Açıklama"
                rows={2}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(i)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// FULL BLEED MEDIA CONFIG
// ==========================================

function FullBleedMediaConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <ImageUploadField label="Görsel" value={config.image as string} onChange={(v) => update("image", v)} />
      <Field label="Video URL" value={config.video as string} onChange={(v) => update("video", v)} placeholder="Video dosya yolu (opsiyonel)" />
      <Field label="Alt Metin" value={config.alt as string} onChange={(v) => update("alt", v)} />
      <Field label="Altyazı" value={config.caption as string} onChange={(v) => update("caption", v)} />
      <div className="space-y-2">
        <Label>En-Boy Oranı</Label>
        <Select value={(config.aspectRatio as string) || "video"} onValueChange={(v) => update("aspectRatio", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="video">16:9 (Video)</SelectItem>
            <SelectItem value="wide">21:9 (Ultra Wide)</SelectItem>
            <SelectItem value="square">1:1 (Kare)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={config.parallax as boolean} onCheckedChange={(v) => update("parallax", v)} />
        <Label>Parallax Efekti</Label>
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// TECH SPECS CONFIG
// ==========================================

function TechSpecsConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const groups = (config.groups as { title: string; specs: { label: string; value: string }[] }[]) || []

  function updateGroup(gi: number, key: string, value: unknown) {
    const newGroups = [...groups]
    newGroups[gi] = { ...newGroups[gi], [key]: value }
    update("groups", newGroups)
  }

  function addGroup() {
    update("groups", [...groups, { title: "Yeni Grup", specs: [{ label: "", value: "" }] }])
  }

  function removeGroup(gi: number) {
    update("groups", groups.filter((_, i) => i !== gi))
  }

  function addSpec(gi: number) {
    const newGroups = [...groups]
    newGroups[gi].specs = [...newGroups[gi].specs, { label: "", value: "" }]
    update("groups", newGroups)
  }

  function updateSpec(gi: number, si: number, key: string, value: string) {
    const newGroups = [...groups]
    newGroups[gi].specs = [...newGroups[gi].specs]
    newGroups[gi].specs[si] = { ...newGroups[gi].specs[si], [key]: value }
    update("groups", newGroups)
  }

  function removeSpec(gi: number, si: number) {
    const newGroups = [...groups]
    newGroups[gi].specs = newGroups[gi].specs.filter((_, i) => i !== si)
    update("groups", newGroups)
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Spec Grupları</Label>
          <Button variant="outline" size="sm" onClick={addGroup}>
            <Plus className="mr-1 size-3.5" /> Grup Ekle
          </Button>
        </div>
        {groups.map((group, gi) => (
          <div key={gi} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={group.title}
                onChange={(e) => updateGroup(gi, "title", e.target.value)}
                placeholder="Grup adı"
                className="font-medium"
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeGroup(gi)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {group.specs.map((spec, si) => (
                <div key={si} className="flex items-center gap-2">
                  <Input
                    value={spec.label}
                    onChange={(e) => updateSpec(gi, si, "label", e.target.value)}
                    placeholder="Özellik adı"
                    className="flex-1"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => updateSpec(gi, si, "value", e.target.value)}
                    placeholder="Değer"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeSpec(gi, si)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => addSpec(gi)}>
              <Plus className="mr-1 size-3.5" /> Spec Ekle
            </Button>
          </div>
        ))}
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// BENTO GRID (ANIMATED) CONFIG
// ==========================================

function BentoGridConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const items = (config.items as { title: string; description: string; stat?: string; badge?: string; image?: string }[]) || []

  const slotLabels = [
    "Sol Uzun Kart (3 satır)",
    "Üst Orta",
    "Üst Sağ (İstatistik)",
    "Orta Orta",
    "Orta Sağ",
    "Alt Geniş Kart (2 kolon)",
  ]

  function updateItem(index: number, key: string, value: string) {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [key]: value }
    update("items", newItems)
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <Field label="Alt Başlık" value={config.subheadline as string} onChange={(v) => update("subheadline", v)} />

      <div className="space-y-4">
        <Label className="text-base font-semibold">Kartlar (6 Slot)</Label>
        {items.slice(0, 6).map((item, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{slotLabels[i] || `Slot ${i + 1}`}</p>
            <Input
              value={item.title || ""}
              onChange={(e) => updateItem(i, "title", e.target.value)}
              placeholder="Başlık"
            />
            <Textarea
              value={item.description || ""}
              onChange={(e) => updateItem(i, "description", e.target.value)}
              placeholder="Açıklama"
              rows={2}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                value={item.stat || ""}
                onChange={(e) => updateItem(i, "stat", e.target.value)}
                placeholder="İstatistik (ör: 10X)"
              />
              <Input
                value={item.badge || ""}
                onChange={(e) => updateItem(i, "badge", e.target.value)}
                placeholder="Badge (ör: Yeni)"
              />
            </div>
            <BentoImageUpload
              value={item.image || ""}
              onChange={(v) => updateItem(i, "image", v)}
            />
          </div>
        ))}
      </div>

      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// BENTO BOX CONFIG
// ==========================================

function BentoBoxConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-muted-foreground">Sol Üst - Harita</p>
      <Field label="Etiket" value={config.topLeftLabel as string} onChange={(v) => update("topLeftLabel", v)} />
      <TextareaField label="Açıklama" value={config.topLeftDescription as string} onChange={(v) => update("topLeftDescription", v)} />
      <Field label="Harita Badge" value={config.topLeftMapBadge as string} onChange={(v) => update("topLeftMapBadge", v)} placeholder="Son bağlantı: Türkiye" />

      <hr />
      <p className="text-sm font-medium text-muted-foreground">Sağ Üst - Mesajlaşma</p>
      <Field label="Etiket" value={config.topRightLabel as string} onChange={(v) => update("topRightLabel", v)} />
      <TextareaField label="Açıklama" value={config.topRightDescription as string} onChange={(v) => update("topRightDescription", v)} />

      <hr />
      <p className="text-sm font-medium text-muted-foreground">Orta - İstatistik</p>
      <Field label="Merkez İstatistik" value={config.centerStat as string} onChange={(v) => update("centerStat", v)} placeholder="%99.99 Çalışma Süresi" />

      <hr />
      <p className="text-sm font-medium text-muted-foreground">Alt - Grafik</p>
      <Field label="Etiket" value={config.bottomLabel as string} onChange={(v) => update("bottomLabel", v)} />
      <TextareaField label="Açıklama" value={config.bottomDescription as string} onChange={(v) => update("bottomDescription", v)} />

      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// LOGO CLOUD CONFIG
// ==========================================

function LogoCloudConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const logos = (config.logos as { src: string; alt: string }[]) || []

  function updateLogo(index: number, key: string, value: string) {
    const newLogos = [...logos]
    newLogos[index] = { ...newLogos[index], [key]: value }
    update("logos", newLogos)
  }

  function addLogo() {
    update("logos", [...logos, { src: "", alt: "Logo" }])
  }

  function removeLogo(index: number) {
    update("logos", logos.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="Liderler tarafından kullanılıyor" />
      <Field label="Alt Başlık" value={config.subheadline as string} onChange={(v) => update("subheadline", v)} placeholder="Uzmanlar tarafından güveniliyor" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Logolar</Label>
          <Button variant="outline" size="sm" onClick={addLogo}>
            <Plus className="mr-1 size-3.5" /> Logo Ekle
          </Button>
        </div>
        {logos.map((logo, i) => (
          <LogoRow
            key={i}
            logo={logo}
            onChange={(key, value) => updateLogo(i, key, value)}
            onRemove={() => removeLogo(i)}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Switch checked={config.reverse as boolean} onCheckedChange={(v) => update("reverse", v)} />
        <Label>Ters Yön</Label>
      </div>

      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

function LogoRow({
  logo,
  onChange,
  onRemove,
}: {
  logo: { src: string; alt: string }
  onChange: (key: string, value: string) => void
  onRemove: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.url) onChange("src", data.url)
    } catch {
      // upload failed
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border p-2">
      <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-md border bg-muted/30 overflow-hidden">
        {logo.src ? (
          <img src={logo.src} alt={logo.alt || ""} className="max-h-10 max-w-full object-contain" />
        ) : (
          <ImageIcon className="size-5 text-muted-foreground" />
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="shrink-0"
      >
        <Upload className="mr-1 size-3.5" />
        {uploading ? "Yükleniyor..." : logo.src ? "Değiştir" : "Gözat / Yükle"}
      </Button>
      <Input
        value={logo.alt}
        onChange={(e) => onChange("alt", e.target.value)}
        placeholder="Alt metin"
        className="flex-1"
      />
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}

function BentoImageUpload({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.url) onChange(data.url)
    } catch {
      // upload failed
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md border bg-muted/30 overflow-hidden">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="size-5 text-muted-foreground" />
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        <Upload className="mr-1 size-3.5" />
        {uploading ? "Yükleniyor..." : value ? "Değiştir" : "Gözat / Yükle"}
      </Button>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onChange("")}
        >
          <X className="size-4" />
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}

// ==========================================
// CTA ILLUSTRATION CONFIG
// ==========================================

function CtaIllustrationConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field label="Başlık *" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="Hemen Başlayın" />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <ImageUploadField label="Görsel" value={config.image as string} onChange={(v) => update("image", v)} />
      <Field label="Görsel Alt Metin" value={config.imageAlt as string} onChange={(v) => update("imageAlt", v)} />
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// PURCHASE CTA CONFIG
// ==========================================

function PurchaseCtaConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field label="Başlık *" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fiyat" value={config.price as string} onChange={(v) => update("price", v)} placeholder="Örn: $4,999" />
        <Field label="Fiyat Notu" value={config.priceNote as string} onChange={(v) => update("priceNote", v)} placeholder="Örn: KDV hariç" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="İkinci CTA Metin" value={config.secondaryCtaText as string} onChange={(v) => update("secondaryCtaText", v)} />
        <Field label="İkinci CTA Link" value={config.secondaryCtaHref as string} onChange={(v) => update("secondaryCtaHref", v)} />
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ==========================================
// SHARED FIELD COMPONENTS
// ==========================================

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} />
    </div>
  )
}

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.url) {
        onChange(data.url)
      } else {
        setError(data.error ?? "Yükleme başarısız")
      }
    } catch {
      setError("Sunucuya bağlanılamadı")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <div className="relative rounded-lg border overflow-hidden">
          <img src={value} alt="" className="w-full max-h-48 object-cover" />
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-black/60 p-1.5 text-white hover:bg-black/80"
            >
              <Upload className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-md bg-black/60 p-1.5 text-white hover:bg-red-600/80"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          <ImageIcon className="size-8" />
          <span className="text-sm">{uploading ? "Yükleniyor..." : "Görsel seç veya sürükle"}</span>
          <span className="text-xs">PNG, JPG, WebP, SVG (max 10MB)</span>
        </button>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}

function UrunlerSlideConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const members = (config.members as { image: string; name: string; role: string }[]) || []

  function updateMember(index: number, key: string, value: string) {
    const next = [...members]
    next[index] = { ...next[index], [key]: value }
    update("members", next)
  }

  function addMember() {
    update("members", [...members, { image: "", name: "Yeni", role: "" }])
  }

  function removeMember(index: number) {
    update("members", members.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="Ürünlerimiz" />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Kartlar</Label>
          <Button variant="outline" size="sm" onClick={addMember}>
            <Plus className="mr-1 size-3.5" /> Kart Ekle
          </Button>
        </div>
        {members.map((m, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">#{i + 1}</Label>
              <Button variant="ghost" size="sm" onClick={() => removeMember(i)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <ImageUploadField label="Görsel" value={m.image} onChange={(v) => updateMember(i, "image", v)} />
            <Field label="İsim / Başlık" value={m.name} onChange={(v) => updateMember(i, "name", v)} />
            <Field label="Rol / Alt Metin" value={m.role} onChange={(v) => updateMember(i, "role", v)} />
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <Label>Testimonial (opsiyonel)</Label>
        <TextareaField label="Alıntı" value={config.testimonial as string} onChange={(v) => update("testimonial", v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="İsim" value={config.testimonialName as string} onChange={(v) => update("testimonialName", v)} />
          <Field label="Rol" value={config.testimonialRole as string} onChange={(v) => update("testimonialRole", v)} />
        </div>
        <ImageUploadField label="Görsel" value={config.testimonialImage as string} onChange={(v) => update("testimonialImage", v)} />
      </div>

      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

function TestimonialsV2Config({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const items =
    (config.testimonials as { text: string; image: string; name: string; role: string }[]) || []

  function updateItem(index: number, key: string, value: string) {
    const next = [...items]
    next[index] = { ...next[index], [key]: value }
    update("testimonials", next)
  }

  function addItem() {
    update("testimonials", [...items, { text: "", image: "", name: "", role: "" }])
  }

  function removeItem(index: number) {
    update("testimonials", items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Field label="Badge" value={config.badge as string} onChange={(v) => update("badge", v)} placeholder="Yorumlar" />
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="Kullanıcılarımız ne diyor?" />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Yorumlar</Label>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-1 size-3.5" /> Yorum Ekle
          </Button>
        </div>
        {items.map((it, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">#{i + 1}</Label>
              <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <TextareaField label="Yorum Metni" value={it.text} onChange={(v) => updateItem(i, "text", v)} />
            <ImageUploadField label="Avatar" value={it.image} onChange={(v) => updateItem(i, "image", v)} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="İsim" value={it.name} onChange={(v) => updateItem(i, "name", v)} />
              <Field label="Rol" value={it.role} onChange={(v) => updateItem(i, "role", v)} />
            </div>
          </div>
        ))}
      </div>

      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

function MainHeroConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const slides =
    (config.slides as { img: string; line1: string; line2?: string }[]) || []

  function updateSlide(index: number, key: string, value: string) {
    const next = [...slides]
    next[index] = { ...next[index], [key]: value }
    update("slides", next)
  }

  function addSlide() {
    update("slides", [...slides, { img: "", line1: "", line2: "" }])
  }

  function removeSlide(index: number) {
    update("slides", slides.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Slaytlar</Label>
          <Button variant="outline" size="sm" onClick={addSlide}>
            <Plus className="mr-1 size-3.5" /> Slayt Ekle
          </Button>
        </div>
        {slides.map((s, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">#{i + 1}</Label>
              <Button variant="ghost" size="sm" onClick={() => removeSlide(i)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <ImageUploadField label="Arka Plan Görseli" value={s.img} onChange={(v) => updateSlide(i, "img", v)} />
            <Field label="Başlık - 1. Satır" value={s.line1} onChange={(v) => updateSlide(i, "line1", v)} />
            <Field label="Başlık - 2. Satır" value={s.line2 || ""} onChange={(v) => updateSlide(i, "line2", v)} />
          </div>
        ))}
      </div>
    </div>
  )
}

function StatsCounterConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const stats = (config.stats as { value: string; label: string }[]) || []

  function updateStat(i: number, key: string, value: string) {
    const next = [...stats]
    next[i] = { ...next[i], [key]: value }
    update("stats", next)
  }

  function addStat() {
    update("stats", [...stats, { value: "", label: "" }])
  }

  function removeStat(i: number) {
    update("stats", stats.filter((_, x) => x !== i))
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>İstatistikler</Label>
          <Button variant="outline" size="sm" onClick={addStat}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {stats.map((s, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">#{i + 1}</Label>
              <Button variant="ghost" size="sm" onClick={() => removeStat(i)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Değer" value={s.value} onChange={(v) => updateStat(i, "value", v)} placeholder="500+" />
              <Field label="Etiket" value={s.label} onChange={(v) => updateStat(i, "label", v)} placeholder="Müşteri" />
            </div>
          </div>
        ))}
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

function FaqAccordionConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const items = (config.items as { question: string; answer: string }[]) || []

  function updateItem(i: number, key: string, value: string) {
    const next = [...items]
    next[i] = { ...next[i], [key]: value }
    update("items", next)
  }

  function addItem() {
    update("items", [...items, { question: "", answer: "" }])
  }

  function removeItem(i: number) {
    update("items", items.filter((_, x) => x !== i))
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Sorular</Label>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-1 size-3.5" /> Soru Ekle
          </Button>
        </div>
        {items.map((it, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">#{i + 1}</Label>
              <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <Field label="Soru" value={it.question} onChange={(v) => updateItem(i, "question", v)} />
            <TextareaField label="Cevap" value={it.answer} onChange={(v) => updateItem(i, "answer", v)} />
          </div>
        ))}
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

function ContactFormConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const categories = (config.categories as string[]) || []
  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="E-posta" value={config.email as string} onChange={(v) => update("email", v)} />
        <Field label="Telefon" value={config.phone as string} onChange={(v) => update("phone", v)} />
      </div>
      <Field label="Adres" value={config.address as string} onChange={(v) => update("address", v)} />
      <div className="space-y-2">
        <Label>Kategoriler (her satıra bir tane)</Label>
        <Textarea
          value={categories.join("\n")}
          onChange={(e) => update("categories", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          rows={5}
        />
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

interface PricingPlan {
  name: string
  price: string
  priceNote?: string
  description?: string
  features: string[]
  ctaText?: string
  ctaHref?: string
  highlighted?: boolean
}

function PricingTableConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const plans = (config.plans as PricingPlan[]) || []

  function updatePlan(i: number, key: string, value: unknown) {
    const next = [...plans]
    next[i] = { ...next[i], [key]: value }
    update("plans", next)
  }

  function addPlan() {
    update("plans", [...plans, { name: "Yeni Plan", price: "", features: [] }])
  }

  function removePlan(i: number) {
    update("plans", plans.filter((_, x) => x !== i))
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Planlar</Label>
          <Button variant="outline" size="sm" onClick={addPlan}>
            <Plus className="mr-1 size-3.5" /> Plan Ekle
          </Button>
        </div>
        {plans.map((p, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">#{i + 1}</Label>
              <Button variant="ghost" size="sm" onClick={() => removePlan(i)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Plan Adı" value={p.name} onChange={(v) => updatePlan(i, "name", v)} />
              <Field label="Fiyat" value={p.price} onChange={(v) => updatePlan(i, "price", v)} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Fiyat Notu" value={p.priceNote || ""} onChange={(v) => updatePlan(i, "priceNote", v)} placeholder="/aylık" />
              <Field label="Kısa Açıklama" value={p.description || ""} onChange={(v) => updatePlan(i, "description", v)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Özellikler (her satıra bir tane)</Label>
              <Textarea
                rows={4}
                value={(p.features || []).join("\n")}
                onChange={(e) =>
                  updatePlan(
                    i,
                    "features",
                    e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="CTA Metin" value={p.ctaText || ""} onChange={(v) => updatePlan(i, "ctaText", v)} />
              <Field label="CTA Link" value={p.ctaHref || ""} onChange={(v) => updatePlan(i, "ctaHref", v)} />
            </div>
            <div className="flex items-center gap-2 rounded-md border p-2">
              <Switch
                checked={p.highlighted || false}
                onCheckedChange={(v) => updatePlan(i, "highlighted", v)}
              />
              <Label className="text-sm">Vurgulu Plan (En Popüler)</Label>
            </div>
          </div>
        ))}
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

function ImageTextSplitConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const bullets = (config.bullets as string[]) || []
  return (
    <div className="space-y-4">
      <Field label="Üst Etiket" value={config.label as string} onChange={(v) => update("label", v)} placeholder="Yeni Özellik" />
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="space-y-2">
        <Label>Bullet Listesi (her satıra bir tane)</Label>
        <Textarea
          rows={5}
          value={bullets.join("\n")}
          onChange={(e) =>
            update(
              "bullets",
              e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
            )
          }
        />
      </div>
      <ImageUploadField label="Görsel" value={config.image as string} onChange={(v) => update("image", v)} />
      <Field label="Görsel Alt Metin" value={config.imageAlt as string} onChange={(v) => update("imageAlt", v)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Switch checked={config.reverse as boolean} onCheckedChange={(v) => update("reverse", v)} />
        <Label>Görseli Sola Al (ters dizilim)</Label>
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

function CtaBannerConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="İkinci CTA Metin" value={config.secondaryCtaText as string} onChange={(v) => update("secondaryCtaText", v)} />
        <Field label="İkinci CTA Link" value={config.secondaryCtaHref as string} onChange={(v) => update("secondaryCtaHref", v)} />
      </div>
      <div className="space-y-2">
        <Label>Stil Varyantı</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          value={(config.variant as string) || "gradient"}
          onChange={(e) => update("variant", e.target.value)}
        >
          <option value="gradient">Gradient (Mavi)</option>
          <option value="solid">Solid (Siyah)</option>
          <option value="minimal">Minimal (Açık)</option>
        </select>
      </div>
    </div>
  )
}

function HeroGradientConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field label="Üst Badge" value={config.badge as string} onChange={(v) => update("badge", v)} placeholder="Yeni: Sürüm 2.0" />
      <Field label="Ana Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="Profesyoneller İçin" />
      <Field label="Vurgulu Kelimeler (gradient renkli)" value={config.highlight as string} onChange={(v) => update("highlight", v)} placeholder="Yüksek Performans" />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="İkinci CTA Metin" value={config.secondaryCtaText as string} onChange={(v) => update("secondaryCtaText", v)} />
        <Field label="İkinci CTA Link" value={config.secondaryCtaHref as string} onChange={(v) => update("secondaryCtaHref", v)} />
      </div>
      <ImageUploadField label="Hero Görseli (opsiyonel)" value={config.image as string} onChange={(v) => update("image", v)} />
    </div>
  )
}

// ==========================================
// CLIP HOVER GRID CONFIG
// ==========================================

type ClipHoverItem = {
  image: string
  date?: string
  title: string
  linkText?: string
  linkHref?: string
}

function ClipHoverGridConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const items = (config.items as ClipHoverItem[]) || []

  function updateItem(index: number, key: keyof ClipHoverItem, value: string) {
    const next = [...items]
    next[index] = { ...next[index], [key]: value }
    update("items", next)
  }

  function addItem() {
    update("items", [
      ...items,
      { image: "", date: "", title: "Yeni Kart", linkText: "İncele", linkHref: "#" },
    ])
  }

  function removeItem(index: number) {
    update("items", items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Yön</Label>
          <Select value={(config.orientation as string) || "vertical"} onValueChange={(v) => update("orientation", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="vertical">Dikey dilimler</SelectItem>
              <SelectItem value="horizontal">Yatay dilimler</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Dilim Sayısı</Label>
          <Input
            type="number"
            min={2}
            max={12}
            value={(config.slicesTotal as number) || 5}
            onChange={(e) => update("slicesTotal", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Kolon</Label>
          <Select value={String((config.columns as number) || 3)} onValueChange={(v) => update("columns", Number(v))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Kartlar</Label>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-1 size-3.5" /> Kart Ekle
          </Button>
        </div>
        {items.map((item, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs text-muted-foreground">#{i + 1}</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(i)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <ImageUploadField
              label="Görsel"
              value={item.image}
              onChange={(v) => updateItem(i, "image", v)}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Tarih / Etiket" value={item.date || ""} onChange={(v) => updateItem(i, "date", v)} />
              <Field label="Başlık *" value={item.title} onChange={(v) => updateItem(i, "title", v)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Link Metni" value={item.linkText || ""} onChange={(v) => updateItem(i, "linkText", v)} />
              <Field label="Link URL" value={item.linkHref || ""} onChange={(v) => updateItem(i, "linkHref", v)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// SINGLE PRICING CARD CONFIG
// ==========================================

type SpcBenefit = { text: string; icon?: string }
type SpcFeature = { text: string }
type SpcTestimonial = {
  id: number
  name: string
  role: string
  company?: string
  content: string
  rating: number
  avatar: string
}

const SPC_ICONS = [
  "check",
  "crown",
  "shield",
  "heart",
  "shopping-cart",
  "chevron-right",
  "external-link",
  "stars",
  "credit-card",
  "sparkles",
  "zap",
  "package",
]

function IconSelect({ value, onChange, label }: { value?: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value || "check"} onValueChange={onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {SPC_ICONS.map((i) => (
            <SelectItem key={i} value={i}>{i}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function SinglePricingCardConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const benefits = (config.benefits as SpcBenefit[]) || []
  const features = (config.features as SpcFeature[]) || []
  const testimonials = (config.testimonials as SpcTestimonial[]) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Switch checked={config.light as boolean} onCheckedChange={(v) => update("light", v)} />
        <Label>Açık Tema (Light)</Label>
      </div>

      {/* Section header */}
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Bölüm Başlığı</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Rozet Metni" value={config.sectionBadgeText as string} onChange={(v) => update("sectionBadgeText", v)} />
          <IconSelect label="Rozet İkonu" value={config.sectionBadgeIcon as string} onChange={(v) => update("sectionBadgeIcon", v)} />
        </div>
        <Field label="Başlık" value={config.sectionHeadline as string} onChange={(v) => update("sectionHeadline", v)} />
        <TextareaField label="Açıklama" value={config.sectionDescription as string} onChange={(v) => update("sectionDescription", v)} />
      </div>

      {/* Card header */}
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Kart Üst Kısmı</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Kart Rozet Metni" value={config.badgeText as string} onChange={(v) => update("badgeText", v)} />
          <IconSelect label="Kart Rozet İkonu" value={config.badgeIcon as string} onChange={(v) => update("badgeIcon", v)} />
        </div>
        <Field label="Başlık *" value={config.title as string} onChange={(v) => update("title", v)} />
        <Field label="Alt Başlık" value={config.subtitle as string} onChange={(v) => update("subtitle", v)} />
      </div>

      {/* Price */}
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Fiyat</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Güncel Fiyat *" value={config.priceCurrent as string} onChange={(v) => update("priceCurrent", v)} />
          <Field label="Eski Fiyat" value={config.priceOriginal as string} onChange={(v) => update("priceOriginal", v)} />
          <Field label="İndirim Rozeti" value={config.priceDiscount as string} onChange={(v) => update("priceDiscount", v)} />
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-3 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Faydalar (Sol Kolon)</Label>
          <Button variant="outline" size="sm" onClick={() => update("benefits", [...benefits, { text: "", icon: "check" }])}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {benefits.map((b, i) => (
          <div key={i} className="flex items-center gap-2 rounded-md border p-2">
            <div className="flex-1 grid gap-2 sm:grid-cols-[1fr_150px]">
              <Input value={b.text} onChange={(e) => {
                const next = [...benefits]; next[i] = { ...next[i], text: e.target.value }; update("benefits", next)
              }} placeholder="Metin" />
              <Select value={b.icon || "check"} onValueChange={(v) => {
                const next = [...benefits]; next[i] = { ...next[i], icon: v }; update("benefits", next)
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SPC_ICONS.map((icn) => <SelectItem key={icn} value={icn}>{icn}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => update("benefits", benefits.filter((_, j) => j !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-3 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Özellikler (Sağ Kolon)</Label>
          <Button variant="outline" size="sm" onClick={() => update("features", [...features, { text: "" }])}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        <ImageUploadField
          label="Ürün Görseli (başlık üstünde)"
          value={config.featuresImage as string}
          onChange={(v) => update("featuresImage", v)}
        />
        <Field label="Görsel Alt Metni" value={config.featuresImageAlt as string} onChange={(v) => update("featuresImageAlt", v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Özellikler Başlığı" value={config.featuresTitle as string} onChange={(v) => update("featuresTitle", v)} />
          <IconSelect label="Özellik İkonu" value={config.featuresIcon as string} onChange={(v) => update("featuresIcon", v)} />
        </div>
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input value={f.text} onChange={(e) => {
              const next = [...features]; next[i] = { text: e.target.value }; update("features", next)
            }} placeholder="Özellik metni" />
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => update("features", features.filter((_, j) => j !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Butonlar</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Birincil Metin" value={config.primaryButtonText as string} onChange={(v) => update("primaryButtonText", v)} />
          <IconSelect label="Birincil İkon" value={config.primaryButtonIcon as string} onChange={(v) => update("primaryButtonIcon", v)} />
        </div>
        <Field label="Birincil Link" value={config.primaryButtonHref as string} onChange={(v) => update("primaryButtonHref", v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="İkincil Metin" value={config.secondaryButtonText as string} onChange={(v) => update("secondaryButtonText", v)} />
          <IconSelect label="İkincil İkon" value={config.secondaryButtonIcon as string} onChange={(v) => update("secondaryButtonIcon", v)} />
        </div>
        <Field label="İkincil Link" value={config.secondaryButtonHref as string} onChange={(v) => update("secondaryButtonHref", v)} />
      </div>

      {/* Testimonials */}
      <div className="space-y-3 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Referanslar</Label>
          <Button variant="outline" size="sm" onClick={() => update("testimonials", [
            ...testimonials,
            { id: Date.now(), name: "", role: "", company: "", content: "", rating: 5, avatar: "" },
          ])}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        <Field
          label="Döngü Hızı (ms)"
          value={String((config.testimonialRotationSpeed as number) || 5000)}
          onChange={(v) => update("testimonialRotationSpeed", Number(v) || 5000)}
        />
        {testimonials.map((t, i) => (
          <div key={i} className="space-y-2 rounded-md border p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">#{i + 1}</span>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"
                onClick={() => update("testimonials", testimonials.filter((_, j) => j !== i))}>
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input value={t.name} onChange={(e) => {
                const next = [...testimonials]; next[i] = { ...next[i], name: e.target.value }; update("testimonials", next)
              }} placeholder="İsim" />
              <Input value={t.role} onChange={(e) => {
                const next = [...testimonials]; next[i] = { ...next[i], role: e.target.value }; update("testimonials", next)
              }} placeholder="Rol" />
              <Input value={t.company || ""} onChange={(e) => {
                const next = [...testimonials]; next[i] = { ...next[i], company: e.target.value }; update("testimonials", next)
              }} placeholder="Şirket" />
              <Input type="number" min={1} max={5} value={t.rating} onChange={(e) => {
                const next = [...testimonials]; next[i] = { ...next[i], rating: Number(e.target.value) }; update("testimonials", next)
              }} placeholder="Puan (1-5)" />
            </div>
            <Textarea value={t.content} onChange={(e) => {
              const next = [...testimonials]; next[i] = { ...next[i], content: e.target.value }; update("testimonials", next)
            }} placeholder="Yorum" rows={2} />
            <ImageUploadField label="Avatar" value={t.avatar} onChange={(v) => {
              const next = [...testimonials]; next[i] = { ...next[i], avatar: v }; update("testimonials", next)
            }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// SINGLE PRICING CARD 3-COL CONFIG
// ==========================================

function SinglePricingCard3ColConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const benefits = (config.benefits as SpcBenefit[]) || []
  const features = (config.features as SpcFeature[]) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Switch checked={config.light as boolean} onCheckedChange={(v) => update("light", v)} />
        <Label>Açık Tema (Light)</Label>
      </div>

      {/* Section header */}
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Bölüm Başlığı</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Rozet Metni" value={config.sectionBadgeText as string} onChange={(v) => update("sectionBadgeText", v)} />
          <IconSelect label="Rozet İkonu" value={config.sectionBadgeIcon as string} onChange={(v) => update("sectionBadgeIcon", v)} />
        </div>
        <Field label="Başlık" value={config.sectionHeadline as string} onChange={(v) => update("sectionHeadline", v)} />
        <TextareaField label="Açıklama" value={config.sectionDescription as string} onChange={(v) => update("sectionDescription", v)} />
      </div>

      {/* Card header */}
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Kart Üst Kısmı</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Kart Rozet Metni" value={config.badgeText as string} onChange={(v) => update("badgeText", v)} />
          <IconSelect label="Kart Rozet İkonu" value={config.badgeIcon as string} onChange={(v) => update("badgeIcon", v)} />
        </div>
        <Field label="Başlık *" value={config.title as string} onChange={(v) => update("title", v)} />
        <Field label="Alt Başlık" value={config.subtitle as string} onChange={(v) => update("subtitle", v)} />
      </div>

      {/* Price */}
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Fiyat</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Güncel Fiyat *" value={config.priceCurrent as string} onChange={(v) => update("priceCurrent", v)} />
          <Field label="Eski Fiyat" value={config.priceOriginal as string} onChange={(v) => update("priceOriginal", v)} />
          <Field label="İndirim Rozeti" value={config.priceDiscount as string} onChange={(v) => update("priceDiscount", v)} />
        </div>
      </div>

      {/* Benefits (left col) */}
      <div className="space-y-3 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Faydalar (1. Kolon)</Label>
          <Button variant="outline" size="sm" onClick={() => update("benefits", [...benefits, { text: "", icon: "check" }])}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {benefits.map((b, i) => (
          <div key={i} className="flex items-center gap-2 rounded-md border p-2">
            <div className="flex-1 grid gap-2 sm:grid-cols-[1fr_150px]">
              <Input value={b.text} onChange={(e) => {
                const next = [...benefits]; next[i] = { ...next[i], text: e.target.value }; update("benefits", next)
              }} placeholder="Metin" />
              <Select value={b.icon || "check"} onValueChange={(v) => {
                const next = [...benefits]; next[i] = { ...next[i], icon: v }; update("benefits", next)
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SPC_ICONS.map((icn) => <SelectItem key={icn} value={icn}>{icn}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => update("benefits", benefits.filter((_, j) => j !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Features (middle col) */}
      <div className="space-y-3 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Özellikler (2. Kolon)</Label>
          <Button variant="outline" size="sm" onClick={() => update("features", [...features, { text: "" }])}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        <ImageUploadField
          label="Ürün Görseli (başlık üstünde)"
          value={config.featuresImage as string}
          onChange={(v) => update("featuresImage", v)}
        />
        <Field label="Görsel Alt Metni" value={config.featuresImageAlt as string} onChange={(v) => update("featuresImageAlt", v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Özellikler Başlığı" value={config.featuresTitle as string} onChange={(v) => update("featuresTitle", v)} />
          <IconSelect label="Özellik İkonu" value={config.featuresIcon as string} onChange={(v) => update("featuresIcon", v)} />
        </div>
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input value={f.text} onChange={(e) => {
              const next = [...features]; next[i] = { text: e.target.value }; update("features", next)
            }} placeholder="Özellik metni" />
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => update("features", features.filter((_, j) => j !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Rich content (3rd col) */}
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Zengin İçerik (3. Kolon)</Label>
        <Field label="Başlık" value={config.richTitle as string} onChange={(v) => update("richTitle", v)} />
        <div className="space-y-2">
          <Label>İçerik (Editör)</Label>
          <TiptapEditor
            content={(config.richContent as string) || ""}
            onChange={(v) => update("richContent", v)}
            placeholder="Bu kolona istediğiniz içeriği yazın..."
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Butonlar</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Birincil Metin" value={config.primaryButtonText as string} onChange={(v) => update("primaryButtonText", v)} />
          <IconSelect label="Birincil İkon" value={config.primaryButtonIcon as string} onChange={(v) => update("primaryButtonIcon", v)} />
        </div>
        <Field label="Birincil Link" value={config.primaryButtonHref as string} onChange={(v) => update("primaryButtonHref", v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="İkincil Metin" value={config.secondaryButtonText as string} onChange={(v) => update("secondaryButtonText", v)} />
          <IconSelect label="İkincil İkon" value={config.secondaryButtonIcon as string} onChange={(v) => update("secondaryButtonIcon", v)} />
        </div>
        <Field label="İkincil Link" value={config.secondaryButtonHref as string} onChange={(v) => update("secondaryButtonHref", v)} />
      </div>
    </div>
  )
}

// ==========================================
// IMMERSIVE GALLERY CONFIG
// ==========================================

function ImmersiveGalleryConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const images = ((config.images as { src: string }[]) || []).slice()
  while (images.length < 7) images.push({ src: "" })

  function updateImage(i: number, src: string) {
    const next = [...images]
    next[i] = { src }
    update("images", next.slice(0, 7))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Switch checked={config.light as boolean} onCheckedChange={(v) => update("light", v)} />
        <Label>Açık Tema (Light)</Label>
      </div>
      <Field
        label="Başlık (scroll sonunda görünür)"
        value={config.headline as string}
        onChange={(v) => update("headline", v)}
        placeholder="Opsiyonel — boş bırakılırsa gösterilmez"
      />
      <div className="space-y-2">
        <Label className="text-sm font-semibold">7 Görsel Slotu</Label>
        <p className="text-xs text-muted-foreground">
          Galeri 7 görsel slotu kullanır. Boş bırakılan slotlar render edilmez.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {images.slice(0, 7).map((img, i) => (
          <ImageUploadField
            key={i}
            label={`Görsel ${i + 1}`}
            value={img.src}
            onChange={(v) => updateImage(i, v)}
          />
        ))}
      </div>
    </div>
  )
}

// ==========================================
// BENCHMARK CHARTS CONFIG — çözümlerdeki benchmark manager UI ile aynı
// ==========================================

type BcDataset = { name: string; color: string; values: number[] }
type BcChart = {
  title: string
  chartType: string
  unit: string
  labels: string[]
  datasets: BcDataset[]
}

const BC_CHART_TYPES = [
  { value: "bar", label: "Yatay Bar" },
  { value: "vertical-bar", label: "Dikey Bar" },
  { value: "line", label: "Çizgi (Line)" },
  { value: "radar", label: "Radar" },
  { value: "area", label: "Alan (Area)" },
]

const BC_PRESET_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
  "#06b6d4", "#ec4899", "#f97316", "#14b8a6", "#6366f1",
]

function BenchmarkChartsConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const charts = (config.charts as BcChart[]) || []
  const [showNew, setShowNew] = useState(false)

  function saveChart(index: number | null, chart: BcChart) {
    const next = index === null ? [...charts, chart] : charts.map((c, i) => (i === index ? chart : c))
    update("charts", next)
  }

  function deleteChart(index: number) {
    update("charts", charts.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Switch checked={config.light as boolean} onCheckedChange={(v) => update("light", v)} />
        <Label>Açık Tema (Light)</Label>
      </div>
      <Field label="Bölüm Başlığı" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Bölüm Açıklaması" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="space-y-2">
        <Label>Kolon Sayısı</Label>
        <Select value={String((config.columns as number) || 2)} onValueChange={(v) => update("columns", Number(v))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Benchmark Chartlar</h3>
          <Button onClick={() => setShowNew(!showNew)} type="button">
            <Plus className="mr-2 size-4" />{showNew ? "Kapat" : "Yeni Chart"}
          </Button>
        </div>

        {showNew && (
          <BcChartEditor
            onSaved={(chart) => {
              saveChart(null, chart)
              setShowNew(false)
            }}
            onCancel={() => setShowNew(false)}
          />
        )}

        {charts.length === 0 && !showNew ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>Henüz benchmark chart eklenmemiş</p>
            </CardContent>
          </Card>
        ) : (
          charts.map((chart, i) => (
            <BcChartEditor
              key={i}
              chart={chart}
              onSaved={(c) => saveChart(i, c)}
              onDeleted={() => deleteChart(i)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function BcChartEditor({
  chart,
  onSaved,
  onCancel,
  onDeleted,
}: {
  chart?: BcChart
  onSaved: (chart: BcChart) => void
  onCancel?: () => void
  onDeleted?: () => void
}) {
  const [title, setTitle] = useState(chart?.title || "")
  const [chartType, setChartType] = useState(chart?.chartType || "bar")
  const [unit, setUnit] = useState(chart?.unit || "points")
  const [labels, setLabels] = useState<string[]>(chart?.labels || ["", ""])
  const [datasets, setDatasets] = useState<BcDataset[]>(
    chart?.datasets || [{ name: "Veri Seti 1", color: BC_PRESET_COLORS[0], values: [0, 0] }],
  )

  function syncValues(newLabels: string[]) {
    setDatasets((prev) =>
      prev.map((d) => ({ ...d, values: newLabels.map((_, i) => d.values[i] ?? 0) })),
    )
  }
  function addLabel() {
    const newLabels = [...labels, ""]
    setLabels(newLabels)
    syncValues(newLabels)
  }
  function removeLabel(index: number) {
    const newLabels = labels.filter((_, i) => i !== index)
    setLabels(newLabels)
    setDatasets((prev) => prev.map((d) => ({ ...d, values: d.values.filter((_, i) => i !== index) })))
  }
  function updateLabel(index: number, value: string) {
    const newLabels = [...labels]
    newLabels[index] = value
    setLabels(newLabels)
  }
  function addDataset() {
    setDatasets((prev) => [
      ...prev,
      {
        name: `Veri Seti ${prev.length + 1}`,
        color: BC_PRESET_COLORS[prev.length % BC_PRESET_COLORS.length],
        values: labels.map(() => 0),
      },
    ])
  }
  function removeDataset(index: number) {
    setDatasets((prev) => prev.filter((_, i) => i !== index))
  }
  function updateDatasetValue(dsIndex: number, valIndex: number, value: number) {
    setDatasets((prev) => {
      const copy = [...prev]
      copy[dsIndex] = { ...copy[dsIndex], values: [...copy[dsIndex].values] }
      copy[dsIndex].values[valIndex] = value
      return copy
    })
  }

  function handleSave() {
    if (!title) return alert("Başlık gerekli")
    const validLabels = labels.filter((l) => l.trim())
    if (validLabels.length < 2) return alert("En az 2 etiket girin")
    if (datasets.length === 0) return alert("En az 1 veri seti ekleyin")
    onSaved({ title, chartType, unit, labels, datasets })
  }

  function handleDelete() {
    if (!confirm("Chart silinecek, emin misiniz?")) return
    onDeleted?.()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{chart ? chart.title || "Chart" : "Yeni Chart"}</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} type="button">
            <Save className="mr-2 size-3" />Kaydet
          </Button>
          {chart && onDeleted && (
            <Button size="sm" variant="destructive" onClick={handleDelete} type="button">
              <Trash2 className="size-3" />
            </Button>
          )}
          {onCancel && (
            <Button size="sm" variant="outline" onClick={onCancel} type="button">İptal</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Başlık *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="İşlemci Performansı" />
          </div>
          <div className="space-y-2">
            <Label>Chart Tipi</Label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {BC_CHART_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Birim</Label>
            <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="points, fps, sec" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Etiketler (satırlar)</Label>
            <Button variant="outline" size="sm" onClick={addLabel} type="button">
              <Plus className="mr-1 size-3" />Etiket Ekle
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {labels.map((label, i) => (
              <div key={i} className="flex items-center gap-1">
                <Input
                  className="w-44"
                  value={label}
                  onChange={(e) => updateLabel(i, e.target.value)}
                  placeholder={`Etiket ${i + 1}`}
                />
                {labels.length > 2 && (
                  <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => removeLabel(i)} type="button">
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Veri Setleri</Label>
            <Button variant="outline" size="sm" onClick={addDataset} type="button">
              <Plus className="mr-1 size-3" />Veri Seti Ekle
            </Button>
          </div>
          {datasets.map((ds, dsIndex) => (
            <Card key={dsIndex} className="border-dashed">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="color"
                      value={ds.color}
                      onChange={(e) => {
                        const copy = [...datasets]
                        copy[dsIndex] = { ...copy[dsIndex], color: e.target.value }
                        setDatasets(copy)
                      }}
                      className="size-8 cursor-pointer rounded border p-0.5"
                    />
                    <Input
                      value={ds.name}
                      onChange={(e) => {
                        const copy = [...datasets]
                        copy[dsIndex] = { ...copy[dsIndex], name: e.target.value }
                        setDatasets(copy)
                      }}
                      placeholder="Veri seti adı"
                      className="flex-1"
                    />
                  </div>
                  {datasets.length > 1 && (
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeDataset(dsIndex)} type="button">
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {labels.map((label, valIndex) => (
                    <div key={valIndex} className="space-y-1">
                      <p className="text-[10px] text-muted-foreground truncate">{label || `#${valIndex + 1}`}</p>
                      <Input
                        type="number"
                        step="0.1"
                        value={ds.values[valIndex] || ""}
                        onChange={(e) => updateDatasetValue(dsIndex, valIndex, parseFloat(e.target.value) || 0)}
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ==========================================
// FEATURE SECTION 1 CONFIG
// ==========================================

type Fs1Feature = { icon?: string; title: string; description: string }

const FS1_ICONS = [
  "heart", "wifi-off", "shield-check", "battery-charging", "network",
  "check", "crown", "shield", "shopping-cart", "chevron-right", "external-link",
  "stars", "credit-card", "sparkles", "zap", "package", "cpu", "box", "rocket", "award", "download",
]

function Fs1IconSelect({ value, onChange, label }: { value?: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value || "heart"} onValueChange={onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {FS1_ICONS.map((i) => (
            <SelectItem key={i} value={i}>{i}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function FeatureSection1Config({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const features = (config.features as Fs1Feature[]) || []

  function updateFeature(i: number, patch: Partial<Fs1Feature>) {
    const next = [...features]
    next[i] = { ...next[i], ...patch }
    update("features", next)
  }

  function addFeature() {
    update("features", [...features, { icon: "check", title: "", description: "" }])
  }

  function removeFeature(i: number) {
    update("features", features.filter((_, j) => j !== i))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Başlık Alanı</Label>
        <Fs1IconSelect label="Ana İkon" value={config.mainIcon as string} onChange={(v) => update("mainIcon", v)} />
        <Field label="Başlık *" value={config.title as string} onChange={(v) => update("title", v)} />
        <TextareaField label="Alt Başlık" value={config.subtitle as string} onChange={(v) => update("subtitle", v)} />
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Özellikler</Label>
          <Button variant="outline" size="sm" onClick={addFeature}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {features.map((f, i) => (
          <div key={i} className="space-y-2 rounded-md border p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">#{i + 1}</span>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFeature(i)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
              <Fs1IconSelect label="İkon" value={f.icon} onChange={(v) => updateFeature(i, { icon: v })} />
              <Field label="Başlık" value={f.title} onChange={(v) => updateFeature(i, { title: v })} />
            </div>
            <TextareaField label="Açıklama" value={f.description} onChange={(v) => updateFeature(i, { description: v })} />
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Alt CTA (opsiyonel)</Label>
        <Field label="Başlık" value={config.ctaTitle as string} onChange={(v) => update("ctaTitle", v)} />
        <TextareaField label="Açıklama" value={config.ctaDescription as string} onChange={(v) => update("ctaDescription", v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Birincil Buton Metni" value={config.primaryButtonText as string} onChange={(v) => update("primaryButtonText", v)} />
          <Fs1IconSelect label="Birincil İkon" value={config.primaryButtonIcon as string} onChange={(v) => update("primaryButtonIcon", v)} />
        </div>
        <Field label="Birincil Buton Link" value={config.primaryButtonHref as string} onChange={(v) => update("primaryButtonHref", v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="İkincil Buton Metni" value={config.secondaryButtonText as string} onChange={(v) => update("secondaryButtonText", v)} />
          <Fs1IconSelect label="İkincil İkon" value={config.secondaryButtonIcon as string} onChange={(v) => update("secondaryButtonIcon", v)} />
        </div>
        <Field label="İkincil Buton Link" value={config.secondaryButtonHref as string} onChange={(v) => update("secondaryButtonHref", v)} />
      </div>
    </div>
  )
}

// ==========================================
// RIOTTERS HERO (Ürün-Detay) CONFIG
// ==========================================

function RiottersHeroConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Switch checked={config.light as boolean} onCheckedChange={(v) => update("light", v)} />
        <Label>Açık Tema (Light)</Label>
      </div>
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Başlık</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="1. Satır" value={config.headlineLine1 as string} onChange={(v) => update("headlineLine1", v)} />
          <Field label="2. Satır" value={config.headlineLine2 as string} onChange={(v) => update("headlineLine2", v)} />
        </div>
        <Field
          label="Vurgulanmış Kelime"
          value={config.highlightedWord as string}
          onChange={(v) => update("highlightedWord", v)}
          placeholder="Altı çizili ve renkli arka planla gösterilir"
        />
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Alıntı / Yazar</Label>
        <div className="space-y-2">
          <Label>Alıntı</Label>
          <TiptapEditor
            content={(config.quote as string) || ""}
            onChange={(v) => update("quote", v)}
            placeholder="Alıntıyı buraya yazın..."
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Yazar Adı" value={config.authorName as string} onChange={(v) => update("authorName", v)} />
          <Field label="Yazar Ünvanı" value={config.authorTitle as string} onChange={(v) => update("authorTitle", v)} />
        </div>
        <ImageUploadField label="Yazar Avatarı" value={config.authorAvatar as string} onChange={(v) => update("authorAvatar", v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="CTA Metni" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
          <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Görsel Kolajı (4 slot)</Label>
        <p className="text-xs text-muted-foreground">
          Sol üst büyük (4:3), sağ üst orta (4:3), sol alt dikey (3:4), sağ alt geniş (16:9)
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ImageUploadField label="Görsel 1 (büyük, sol üst)" value={config.image1 as string} onChange={(v) => update("image1", v)} />
          <ImageUploadField label="Görsel 2 (sağ üst)" value={config.image2 as string} onChange={(v) => update("image2", v)} />
          <ImageUploadField label="Görsel 3 (dikey, sol alt)" value={config.image3 as string} onChange={(v) => update("image3", v)} />
          <ImageUploadField label="Görsel 4 (geniş, sağ alt)" value={config.image4 as string} onChange={(v) => update("image4", v)} />
        </div>
      </div>
    </div>
  )
}

function SplitHero3dConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Başlık & Açıklama</Label>
        <Field
          label="Ana Başlık *"
          value={config.headline as string}
          onChange={(v) => update("headline", v)}
          placeholder="Ürün planlama ve geliştirme için..."
        />
        <TextareaField
          label="Açıklama"
          value={config.description as string}
          onChange={(v) => update("description", v)}
          placeholder="Satır kırmak için Enter kullanın"
        />
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Ana CTA Butonu</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Metin"
            value={config.primaryCtaText as string}
            onChange={(v) => update("primaryCtaText", v)}
            placeholder="Kurmaya başla"
          />
          <Field
            label="Link"
            value={config.primaryCtaHref as string}
            onChange={(v) => update("primaryCtaHref", v)}
            placeholder="/iletisim"
          />
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">İkincil CTA Linki</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Etiket (ör: Yeni:)"
            value={config.secondaryCtaLabel as string}
            onChange={(v) => update("secondaryCtaLabel", v)}
            placeholder="Yeni:"
          />
          <Field
            label="Metin"
            value={config.secondaryCtaText as string}
            onChange={(v) => update("secondaryCtaText", v)}
            placeholder="Slack için Sprint agent"
          />
        </div>
        <Field
          label="Link"
          value={config.secondaryCtaHref as string}
          onChange={(v) => update("secondaryCtaHref", v)}
          placeholder="#"
        />
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">3D Sahne Görseli (opsiyonel)</Label>
        <p className="text-xs text-muted-foreground">
          Boş bırakılırsa varsayılan Sprint dashboard mockup'ı gösterilir. Kendi ekran görüntünüzü
          yüklerseniz onu 3D perspektifte gösterilir.
        </p>
        <ImageUploadField
          label="Dashboard Görseli"
          value={config.backgroundImage as string}
          onChange={(v) => update("backgroundImage", v)}
        />
      </div>
    </div>
  )
}

interface RoadmapMilestoneItem {
  id: number | string
  name: string
  status: "complete" | "in-progress" | "pending"
  top?: string
  left?: string
  right?: string
  bottom?: string
}

function AnimatedRoadmapConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const milestones = (config.milestones as RoadmapMilestoneItem[]) || []

  function updateMilestone(index: number, key: keyof RoadmapMilestoneItem, value: string) {
    const next = [...milestones]
    next[index] = { ...next[index], [key]: value }
    setConfig((prev) => ({ ...prev, milestones: next }))
  }

  function addMilestone() {
    const next: RoadmapMilestoneItem[] = [
      ...milestones,
      {
        id: Date.now(),
        name: "Yeni Kilometre Taşı",
        status: "pending",
        top: "50%",
        left: "50%",
      },
    ]
    setConfig((prev) => ({ ...prev, milestones: next }))
  }

  function removeMilestone(index: number) {
    const next = milestones.filter((_, i) => i !== index)
    setConfig((prev) => ({ ...prev, milestones: next }))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Başlık</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field
            label="Başlangıç"
            value={config.headline as string}
            onChange={(v) => update("headline", v)}
            placeholder="Net bir ürün planıyla"
          />
          <Field
            label="Vurgulu Kelime"
            value={config.highlightedWord as string}
            onChange={(v) => update("highlightedWord", v)}
            placeholder="öne"
          />
          <Field
            label="Bitiş"
            value={config.headlineSuffix as string}
            onChange={(v) => update("headlineSuffix", v)}
            placeholder="geçin"
          />
        </div>
        <TextareaField
          label="Açıklama"
          value={config.description as string}
          onChange={(v) => update("description", v)}
          placeholder="Alt metin..."
        />
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Ana CTA</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Metin"
            value={config.primaryCtaText as string}
            onChange={(v) => update("primaryCtaText", v)}
          />
          <Field
            label="Link"
            value={config.primaryCtaHref as string}
            onChange={(v) => update("primaryCtaHref", v)}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">İkincil CTA</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Metin"
            value={config.secondaryCtaText as string}
            onChange={(v) => update("secondaryCtaText", v)}
          />
          <Field
            label="Link"
            value={config.secondaryCtaHref as string}
            onChange={(v) => update("secondaryCtaHref", v)}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <Label className="text-sm font-semibold">Harita Arka Plan Görseli</Label>
        <p className="text-xs text-muted-foreground">
          Opsiyonel. Boş bırakılırsa sadece SVG patika ve milestone'lar gösterilir.
        </p>
        <ImageUploadField
          label="Harita Görseli"
          value={config.mapImageSrc as string}
          onChange={(v) => update("mapImageSrc", v)}
        />
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Kilometre Taşları ({milestones.length})</Label>
          <Button size="sm" variant="outline" onClick={addMilestone}>
            <Plus className="mr-1 size-4" />
            Ekle
          </Button>
        </div>
        {milestones.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Henüz milestone yok. &quot;Ekle&quot; ile ilk kilometre taşını oluşturun.
          </p>
        )}
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="space-y-3 rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Milestone #{index + 1}</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeMilestone(index)}
                className="h-7 px-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Ad"
                value={milestone.name}
                onChange={(v) => updateMilestone(index, "name", v)}
                placeholder="Başlangıç"
              />
              <div className="space-y-1.5">
                <Label className="text-xs">Durum</Label>
                <Select
                  value={milestone.status}
                  onValueChange={(v) => updateMilestone(index, "status", v)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Tamamlandı (yeşil)</SelectItem>
                    <SelectItem value="in-progress">Devam ediyor (mavi, nabız)</SelectItem>
                    <SelectItem value="pending">Bekliyor (gri)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <Field
                label="Top"
                value={milestone.top || ""}
                onChange={(v) => updateMilestone(index, "top", v)}
                placeholder="50%"
              />
              <Field
                label="Left"
                value={milestone.left || ""}
                onChange={(v) => updateMilestone(index, "left", v)}
                placeholder="20%"
              />
              <Field
                label="Right"
                value={milestone.right || ""}
                onChange={(v) => updateMilestone(index, "right", v)}
                placeholder="10%"
              />
              <Field
                label="Bottom"
                value={milestone.bottom || ""}
                onChange={(v) => updateMilestone(index, "bottom", v)}
                placeholder=""
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Konum için %-bazlı değerler kullanın. Top+Left veya Top+Right yeterli — diğerlerini
              boş bırakabilirsiniz.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DarkToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Switch checked={value !== false} onCheckedChange={onChange} />
      <Label>Koyu Tema</Label>
    </div>
  )
}

// ==========================================
// ST AERO HERO 1 CONFIG
// ==========================================

function StAeroHero1Config({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const avatarImages = (config.avatarImages as string[]) || []
  const logos = (config.logos as string[]) || []

  return (
    <div className="space-y-4">
      <Field label="Ana Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="Sustainable Solutions for a Better Future" />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <ImageUploadField label="Sol Görsel" value={config.image as string} onChange={(v) => update("image", v)} />
      <Field label="Görsel Alt Text" value={config.imageAlt as string} onChange={(v) => update("imageAlt", v)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Avatar Sayı" value={config.avatarCount as string} onChange={(v) => update("avatarCount", v)} placeholder="15,000+" />
        <Field label="Avatar Etiket" value={config.avatarLabel as string} onChange={(v) => update("avatarLabel", v)} placeholder="Teams Connected" />
      </div>

      {/* Avatar images */}
      <div className="space-y-2">
        <Label>Avatar Görselleri</Label>
        {avatarImages.map((src, i) => (
          <div key={i} className="flex gap-2">
            <ImageUploadField label={`Avatar ${i + 1}`} value={src} onChange={(v) => {
              const updated = [...avatarImages]
              updated[i] = v
              update("avatarImages", updated)
            }} />
            <Button variant="ghost" size="icon" onClick={() => {
              update("avatarImages", avatarImages.filter((_, idx) => idx !== i))
            }}><Trash2 className="size-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => update("avatarImages", [...avatarImages, ""])}>
          <Plus className="mr-2 size-4" /> Avatar Ekle
        </Button>
      </div>

      {/* Logos */}
      <div className="space-y-2">
        <Label>Logo Görselleri</Label>
        {logos.map((src, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1">
              <ImageUploadField label={`Logo ${i + 1}`} value={src} onChange={(v) => {
                const updated = [...logos]
                updated[i] = v
                update("logos", updated)
              }} />
            </div>
            <Button variant="ghost" size="icon" onClick={() => {
              update("logos", logos.filter((_, idx) => idx !== i))
            }}><Trash2 className="size-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => update("logos", [...logos, ""])}>
          <Plus className="mr-2 size-4" /> Logo Ekle
        </Button>
      </div>
    </div>
  )
}

// ==========================================
// AZ HERO CONFIG
// ==========================================

function AzHeroConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field label="Brand Yazısı" value={config.brandText as string} onChange={(v) => update("brandText", v)} placeholder="STUUX" />
      <Field label="Alt Metin" value={config.subtext as string} onChange={(v) => update("subtext", v)} />
      <Field label="Video URL" value={config.videoSrc as string} onChange={(v) => update("videoSrc", v)} />
      <Field label="Video Poster" value={config.videoPoster as string} onChange={(v) => update("videoPoster", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <TextareaField label="Etiketler (virgülle)" value={((config.tags as string[]) || []).join(", ")} onChange={(v) => update("tags", v.split(",").map((s: string) => s.trim()).filter(Boolean))} />
      <TextareaField label="Etiketler 2 (virgülle)" value={((config.tags2 as string[]) || []).join(", ")} onChange={(v) => update("tags2", v.split(",").map((s: string) => s.trim()).filter(Boolean))} />
    </div>
  )
}

// ==========================================
// AZ PROJECTS STACK CONFIG
// ==========================================

function AzProjectsStackConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const cards = (config.cards as { title: string; tags?: string[]; image: string; ctaText?: string; ctaHref?: string }[]) || []

  function updateCard(i: number, field: string, value: unknown) {
    const updated = [...cards]
    updated[i] = { ...updated[i], [field]: value }
    update("cards", updated)
  }

  return (
    <div className="space-y-4">
      <TextareaField label="Marquee Kelimeleri (virgülle)" value={((config.marqueeItems as string[]) || []).join(", ")} onChange={(v) => update("marqueeItems", v.split(",").map((s: string) => s.trim()).filter(Boolean))} />

      <Label className="text-sm font-semibold">Kartlar</Label>
      {cards.map((card, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Kart {i + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => update("cards", cards.filter((_, idx) => idx !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
          <Field label="Başlık" value={card.title} onChange={(v) => updateCard(i, "title", v)} />
          <ImageUploadField label="Görsel" value={card.image} onChange={(v) => updateCard(i, "image", v)} />
          <Field label="Etiketler (virgülle)" value={(card.tags || []).join(", ")} onChange={(v) => updateCard(i, "tags", v.split(",").map((s: string) => s.trim()).filter(Boolean))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="CTA Metin" value={card.ctaText || ""} onChange={(v) => updateCard(i, "ctaText", v)} />
            <Field label="CTA Link" value={card.ctaHref || ""} onChange={(v) => updateCard(i, "ctaHref", v)} />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => update("cards", [...cards, { title: "Yeni Proje", tags: [], image: "", ctaText: "Detay", ctaHref: "#" }])}>
        <Plus className="mr-2 size-4" /> Kart Ekle
      </Button>
    </div>
  )
}

// ==========================================
// AZ STICKY CAPTION CONFIG
// ==========================================

function AzStickyCaptionConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const images = (config.images as { src: string; tag: string }[]) || []

  function updateImage(i: number, field: string, value: string) {
    const updated = [...images]
    updated[i] = { ...updated[i], [field]: value }
    update("images", updated)
  }

  return (
    <div className="space-y-4">
      <TextareaField label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <Field label="Vurgulanan Kelimeler (virgülle)" value={((config.highlightedWords as string[]) || []).join(", ")} onChange={(v) => update("highlightedWords", v.split(",").map((s: string) => s.trim()).filter(Boolean))} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>

      <Label className="text-sm font-semibold">Görseller</Label>
      {images.map((img, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Görsel {i + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => update("images", images.filter((_, idx) => idx !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
          <ImageUploadField label="Görsel" value={img.src} onChange={(v) => updateImage(i, "src", v)} />
          <Field label="Etiket" value={img.tag} onChange={(v) => updateImage(i, "tag", v)} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => update("images", [...images, { src: "", tag: "" }])}>
        <Plus className="mr-2 size-4" /> Görsel Ekle
      </Button>
    </div>
  )
}

// ==========================================
// AZ STICKY IMAGES CONFIG
// ==========================================

function AzStickyImagesConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const slides = (config.slides as { title: string; image: string }[]) || []

  function updateSlide(i: number, field: string, value: string) {
    const updated = [...slides]
    updated[i] = { ...updated[i], [field]: value }
    update("slides", updated)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>

      <Label className="text-sm font-semibold">Slide&apos;lar</Label>
      {slides.map((slide, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Slide {i + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => update("slides", slides.filter((_, idx) => idx !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
          <Field label="Başlık" value={slide.title} onChange={(v) => updateSlide(i, "title", v)} />
          <ImageUploadField label="Görsel" value={slide.image} onChange={(v) => updateSlide(i, "image", v)} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => update("slides", [...slides, { title: "", image: "" }])}>
        <Plus className="mr-2 size-4" /> Slide Ekle
      </Button>
    </div>
  )
}

// ==========================================
// AZ MANIFEST SPLIT CONFIG
// ==========================================

function AzManifestSplitConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <TextareaField label="Manifesto Metni" value={config.manifestText as string} onChange={(v) => update("manifestText", v)} />
      <TextareaField label="Vurgulanan Metin (soluk renk)" value={config.manifestHighlight as string} onChange={(v) => update("manifestHighlight", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <ImageUploadField label="Görsel" value={config.image as string} onChange={(v) => update("image", v)} />
      <Field label="Görsel Alt Text" value={config.imageAlt as string} onChange={(v) => update("imageAlt", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <TextareaField label="Etiketler (virgülle)" value={((config.tags as string[]) || []).join(", ")} onChange={(v) => update("tags", v.split(",").map((s: string) => s.trim()).filter(Boolean))} />
    </div>
  )
}

// ==========================================
// AZ PARALLAX DIVIDER CONFIG
// ==========================================

function AzParallaxDividerConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <ImageUploadField label="Arka Plan Görsel" value={config.image as string} onChange={(v) => update("image", v)} />
      <Field label="Görsel Alt Text" value={config.imageAlt as string} onChange={(v) => update("imageAlt", v)} />
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <Field label="Overlay Opaklık (0-100)" value={String(config.overlayOpacity ?? 40)} onChange={(v) => update("overlayOpacity", Number(v))} />
    </div>
  )
}

// ==========================================
// AZ BLOG GRID CONFIG
// ==========================================

function AzBlogGridConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const items = (config.items as { title: string; date: string; image: string; href?: string }[]) || []

  function updateItem(i: number, field: string, value: string) {
    const updated = [...items]
    updated[i] = { ...updated[i], [field]: value }
    update("items", updated)
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>

      <Label className="text-sm font-semibold">Blog Kartları</Label>
      {items.map((item, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Kart {i + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => update("items", items.filter((_, idx) => idx !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
          <Field label="Başlık" value={item.title} onChange={(v) => updateItem(i, "title", v)} />
          <Field label="Tarih" value={item.date} onChange={(v) => updateItem(i, "date", v)} />
          <ImageUploadField label="Görsel" value={item.image} onChange={(v) => updateItem(i, "image", v)} />
          <Field label="Link" value={item.href || ""} onChange={(v) => updateItem(i, "href", v)} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => update("items", [...items, { title: "", date: "", image: "", href: "#" }])}>
        <Plus className="mr-2 size-4" /> Kart Ekle
      </Button>
    </div>
  )
}

// ==========================================
// AZ CTA MARQUEE CONFIG
// ==========================================

function AzCtaMarqueeConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const images = (config.images as { src: string; tag: string }[]) || []

  function updateImage(i: number, field: string, value: string) {
    const updated = [...images]
    updated[i] = { ...updated[i], [field]: value }
    update("images", updated)
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />

      <Label className="text-sm font-semibold">Marquee Görseller</Label>
      {images.map((img, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Görsel {i + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => update("images", images.filter((_, idx) => idx !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
          <ImageUploadField label="Görsel" value={img.src} onChange={(v) => updateImage(i, "src", v)} />
          <Field label="Etiket" value={img.tag} onChange={(v) => updateImage(i, "tag", v)} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => update("images", [...images, { src: "", tag: "" }])}>
        <Plus className="mr-2 size-4" /> Görsel Ekle
      </Button>
    </div>
  )
}

// ==========================================
// ST VERTICAL TABS CONFIG
// ==========================================

function StTabsConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const items = (config.items as { id: string; title: string; description: string; image: string }[]) || []

  function updateItem(i: number, field: string, value: string) {
    const updated = [...items]
    updated[i] = { ...updated[i], [field]: value }
    update("items", updated)
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="Neler Yapıyoruz" />
      <Field label="Alt Başlık" value={config.subtitle as string} onChange={(v) => update("subtitle", v)} placeholder="(HİZMETLER)" />
      <Field label="Otomatik Geçiş Süresi (ms)" value={String(config.autoPlayDuration ?? 5000)} onChange={(v) => update("autoPlayDuration", Number(v))} />

      <Label className="text-sm font-semibold">Tab&apos;lar</Label>
      {items.map((item, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tab {i + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => update("items", items.filter((_, idx) => idx !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ID" value={item.id} onChange={(v) => updateItem(i, "id", v)} placeholder="01" />
            <Field label="Başlık" value={item.title} onChange={(v) => updateItem(i, "title", v)} />
          </div>
          <TextareaField label="Açıklama" value={item.description} onChange={(v) => updateItem(i, "description", v)} />
          <ImageUploadField label="Görsel" value={item.image} onChange={(v) => updateItem(i, "image", v)} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => {
        const nextId = String(items.length + 1).padStart(2, "0")
        update("items", [...items, { id: nextId, title: "", description: "", image: "" }])
      }}>
        <Plus className="mr-2 size-4" /> Tab Ekle
      </Button>
    </div>
  )
}

// ==========================================
// ST LET'S WORK TOGETHER CONFIG
// ==========================================

function StLetsWorkConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field label="Durum Metni" value={config.statusText as string} onChange={(v) => update("statusText", v)} placeholder="Projeler için müsait" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Başlık Satır 1" value={config.headlineLine1 as string} onChange={(v) => update("headlineLine1", v)} placeholder="Birlikte" />
        <Field label="Başlık Satır 2" value={config.headlineLine2 as string} onChange={(v) => update("headlineLine2", v)} placeholder="çalışalım" />
      </div>
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <Field label="E-posta" value={config.email as string} onChange={(v) => update("email", v)} placeholder="info@stuux.com" />

      <div className="rounded-lg border p-4 space-y-4">
        <Label className="text-sm font-semibold">Başarı Durumu (Tıklama Sonrası)</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Üst Etiket" value={config.successSubtitle as string} onChange={(v) => update("successSubtitle", v)} placeholder="Harika" />
          <Field label="Başlık" value={config.successTitle as string} onChange={(v) => update("successTitle", v)} placeholder="Konuşalım" />
        </div>
        <Field label="Buton Metni" value={config.bookCallText as string} onChange={(v) => update("bookCallText", v)} placeholder="Görüşme Planla" />
        <Field label="Buton URL" value={config.bookCallUrl as string} onChange={(v) => update("bookCallUrl", v)} placeholder="https://cal.com/..." />
        <Field label="Alt Not" value={config.bookCallNote as string} onChange={(v) => update("bookCallNote", v)} placeholder="15 dk tanışma görüşmesi" />
      </div>
    </div>
  )
}

// ==========================================
// ST PERSPECTIVE MARQUEE CONFIG
// ==========================================

function StMarqueeConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <TextareaField
        label="Kelimeler (virgülle)"
        value={((config.items as string[]) || []).join(", ")}
        onChange={(v) => update("items", v.split(",").map((s: string) => s.trim()).filter(Boolean))}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Font Boyutu (px)" value={String(config.fontSize ?? 84)} onChange={(v) => update("fontSize", Number(v))} />
        <Field label="Font Ağırlığı" value={String(config.fontWeight ?? 700)} onChange={(v) => update("fontWeight", Number(v))} />
        <Field label="Hız" value={String(config.speed ?? 1)} onChange={(v) => update("speed", Number(v))} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Pixels/Frame" value={String(config.pixelsPerFrame ?? 2)} onChange={(v) => update("pixelsPerFrame", Number(v))} />
        <Field label="Perspective (px)" value={String(config.perspective ?? 1200)} onChange={(v) => update("perspective", Number(v))} />
        <Field label="Yükseklik" value={config.height as string ?? "60vh"} onChange={(v) => update("height", v)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Rotate Y (derece)" value={String(config.rotateY ?? -28)} onChange={(v) => update("rotateY", Number(v))} />
        <Field label="Rotate X (derece)" value={String(config.rotateX ?? 8)} onChange={(v) => update("rotateX", Number(v))} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Süre (frame)" value={String(config.durationInFrames ?? 240)} onChange={(v) => update("durationInFrames", Number(v))} />
        <Field label="FPS" value={String(config.fps ?? 30)} onChange={(v) => update("fps", Number(v))} />
      </div>

      <DarkToggle value={config.dark as boolean} onChange={(v) => update("dark", v)} />
    </div>
  )
}

// ============================================================================
// Product Hero
// ============================================================================

type ProductPick = {
  id: string
  name: string
  sku: string
}

function ProductHeroConfig({ config, update }: {
  config: Record<string, unknown>
  update: (key: string, value: unknown) => void
}) {
  const productId = (config.productId as string) || ""
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ProductPick[]>([])
  const [current, setCurrent] = useState<ProductPick | null>(null)
  const [loading, setLoading] = useState(false)

  // Load current selection label
  useEffect(() => {
    if (!productId) {
      setCurrent(null)
      return
    }
    searchProducts(productId).then((list) => {
      const found = list.find((p) => p.id === productId)
      if (found) setCurrent({ id: found.id, name: found.name, sku: found.sku })
    })
  }, [productId])

  // Debounced search
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    const t = setTimeout(async () => {
      const list = await searchProducts(q)
      setResults(list.map((p) => ({ id: p.id, name: p.name, sku: p.sku })))
      setLoading(false)
    }, 250)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Seçili ürün</Label>
        {current ? (
          <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{current.name}</div>
              <div className="font-mono text-xs text-muted-foreground">{current.sku}</div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                update("productId", "")
                setCurrent(null)
              }}
            >
              <X className="size-4" />
              Kaldır
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Henüz ürün seçilmedi.</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ph-product-search">Ürün ara</Label>
        <Input
          id="ph-product-search"
          placeholder="Ürün adı veya SKU ile ara (en az 2 harf)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query.trim().length >= 2 && (
          <div className="max-h-64 overflow-y-auto rounded-md border bg-background">
            {loading && (
              <div className="px-3 py-3 text-sm text-muted-foreground">Aranıyor…</div>
            )}
            {!loading && results.length === 0 && (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                Sonuç yok
              </div>
            )}
            {!loading &&
              results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    update("productId", p.id)
                    setCurrent(p)
                    setQuery("")
                    setResults([])
                  }}
                  className="flex w-full items-center justify-between gap-3 border-b px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted"
                >
                  <span>{p.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{p.sku}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <DarkToggle
          value={config.dark !== false}
          onChange={(v) => update("dark", v)}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Hero içeriği (başlık, görsel, specs, çözümler, etiketler) ürünün verisinden canlı
        çekilir. Ürünü düzenleyince landing da otomatik güncellenir.
      </p>
    </div>
  )
}

type HoverBrandItem = { id: string; name: string; icon?: string; image?: string }

function HoverBrandLogoConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const brands = (config.brands as HoverBrandItem[] | undefined) || []

  function updateBrand(index: number, patch: Partial<HoverBrandItem>) {
    setConfig((prev) => {
      const list = [...((prev.brands as HoverBrandItem[] | undefined) || [])]
      list[index] = { ...list[index], ...patch }
      return { ...prev, brands: list }
    })
  }

  function addBrand() {
    setConfig((prev) => {
      const list = [...((prev.brands as HoverBrandItem[] | undefined) || [])]
      list.push({ id: `brand-${list.length + 1}`, name: "Yeni Marka", image: "" })
      return { ...prev, brands: list }
    })
  }

  function removeBrand(index: number) {
    setConfig((prev) => {
      const list = [...((prev.brands as HoverBrandItem[] | undefined) || [])]
      list.splice(index, 1)
      return { ...prev, brands: list }
    })
  }

  function moveBrand(index: number, dir: -1 | 1) {
    setConfig((prev) => {
      const list = [...((prev.brands as HoverBrandItem[] | undefined) || [])]
      const target = index + dir
      if (target < 0 || target >= list.length) return prev
      const [item] = list.splice(index, 1)
      list.splice(target, 0, item)
      return { ...prev, brands: list }
    })
  }

  return (
    <div className="space-y-4">
      <Field
        label="Üst Etiket (label)"
        value={config.label as string}
        onChange={(v) => update("label", v)}
        placeholder="Kullananlar"
      />
      <Field
        label="Varsayılan Metin"
        value={config.defaultText as string}
        onChange={(v) => update("defaultText", v)}
        placeholder="öncü şirketler"
      />

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <Label>Koyu Tema</Label>
          <p className="text-xs text-muted-foreground">Siyah arka plan + beyaz metin</p>
        </div>
        <Switch
          checked={!!config.dark}
          onCheckedChange={(v) => update("dark", v)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Markalar</Label>
          <Button type="button" size="sm" variant="outline" onClick={addBrand}>
            <Plus className="mr-2 size-4" /> Marka Ekle
          </Button>
        </div>

        {brands.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Henüz marka eklenmedi. &quot;Marka Ekle&quot; ile başlayın.
          </p>
        )}

        <div className="space-y-3">
          {brands.map((brand, idx) => (
            <div key={idx} className="rounded-lg border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Marka #{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => moveBrand(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Yukarı"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => moveBrand(idx, 1)}
                    disabled={idx === brands.length - 1}
                    aria-label="Aşağı"
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeBrand(idx)}
                    aria-label="Sil"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  label="Kimlik (id)"
                  value={brand.id}
                  onChange={(v) => updateBrand(idx, { id: v })}
                  placeholder="marka-1"
                />
                <Field
                  label="Görünen Ad"
                  value={brand.name}
                  onChange={(v) => updateBrand(idx, { name: v })}
                  placeholder="Marka Adı"
                />
              </div>

              <ImageUploadField
                label="Logo / İkon (göz at)"
                value={brand.image || ""}
                onChange={(v) => updateBrand(idx, { image: v })}
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Her marka için kendi logo görselinizi yükleyin (tercihen şeffaf PNG/SVG).
          Görsel yoksa, <code>id</code> alanı hazır ikon (google, amazon, facebook,
          apple, netflix, airbnb, twitch) ile eşleşirse otomatik kullanılır.
        </p>
      </div>
    </div>
  )
}

function CodeNestHeroConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <Field
        label="HLS Video URL (.m3u8)"
        value={config.videoSrc as string}
        onChange={(v) => update("videoSrc", v)}
        placeholder="https://stream.mux.com/...m3u8"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="Accent Rengi"
          value={config.accent as string}
          onChange={(v) => update("accent", v)}
          placeholder="#5ed29c"
        />
        <Field
          label="Arka Plan Rengi"
          value={config.bgColor as string}
          onChange={(v) => update("bgColor", v)}
          placeholder="#070b0a"
        />
      </div>

      <Field
        label="Eyebrow"
        value={config.eyebrow as string}
        onChange={(v) => update("eyebrow", v)}
        placeholder="Career-Ready Curriculum"
      />
      <Field
        label="Ana Başlık (sonunda `.` varsa yeşil olur)"
        value={config.headline as string}
        onChange={(v) => update("headline", v)}
        placeholder="LAUNCH YOUR CODING CAREER."
      />
      <TextareaField
        label="Açıklama"
        value={config.description as string}
        onChange={(v) => update("description", v)}
        placeholder="Master in-demand coding skills..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="CTA Etiketi"
          value={config.ctaLabel as string}
          onChange={(v) => update("ctaLabel", v)}
          placeholder="Get Started"
        />
        <Field
          label="CTA Link"
          value={config.ctaHref as string}
          onChange={(v) => update("ctaHref", v)}
          placeholder="#"
        />
      </div>

      <div className="rounded-lg border p-3 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Liquid Glass Kartı
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Etiket (14px)"
            value={config.cardTag as string}
            onChange={(v) => update("cardTag", v)}
            placeholder="[ 2025 ]"
          />
          <Field
            label="İtalik Yapılacak Kelime"
            value={config.cardItalicWord as string}
            onChange={(v) => update("cardItalicWord", v)}
            placeholder="Industry"
          />
        </div>
        <Field
          label="Başlık (18px)"
          value={config.cardHeadline as string}
          onChange={(v) => update("cardHeadline", v)}
          placeholder="Taught by Industry Professionals"
        />
        <TextareaField
          label="Açıklama (11px)"
          value={config.cardDescription as string}
          onChange={(v) => update("cardDescription", v)}
          placeholder="Learn from engineers shipping code at scale today."
        />
      </div>

      <div className="rounded-lg border p-3 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Global Navigation (opsiyonel)
        </Label>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Section içinde kendi nav'ını göster</Label>
            <p className="text-xs text-muted-foreground">
              Kapalı tutun — sitenin üst header'ı ile çakışır. Standalone kullanım için açın.
            </p>
          </div>
          <Switch
            checked={!!config.showInternalNav}
            onCheckedChange={(v) => update("showInternalNav", v)}
          />
        </div>
        <Field
          label="Marka Adı"
          value={config.brandName as string}
          onChange={(v) => update("brandName", v)}
          placeholder="CodeNest"
        />
      </div>
    </div>
  )
}

function PixelBlastHeroConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  function num(k: string, v: string) {
    const n = parseFloat(v)
    update(k, isNaN(n) ? 0 : n)
  }
  return (
    <div className="space-y-4">
      <Field
        label="Eyebrow"
        value={config.eyebrow as string}
        onChange={(v) => update("eyebrow", v)}
        placeholder="INTERACTIVE BACKGROUND"
      />
      <Field
        label="Başlık"
        value={config.headline as string}
        onChange={(v) => update("headline", v)}
        placeholder="Pixel Blast"
      />
      <TextareaField
        label="Açıklama"
        value={config.description as string}
        onChange={(v) => update("description", v)}
        placeholder="WebGL ile sürüklenen, tıklanan, dalgalanan piksel desenli arka plan."
      />

      <ImageUploadField
        label="Hero Görseli (opsiyonel)"
        value={config.heroImage as string ?? ""}
        onChange={(v) => update("heroImage", v)}
      />
      <Field
        label="Görsel Alt Metni"
        value={config.heroImageAlt as string ?? ""}
        onChange={(v) => update("heroImageAlt", v)}
        placeholder=""
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="Birincil CTA"
          value={config.primaryCtaText as string}
          onChange={(v) => update("primaryCtaText", v)}
          placeholder="Keşfet"
        />
        <Field
          label="Birincil CTA Link"
          value={config.primaryCtaHref as string}
          onChange={(v) => update("primaryCtaHref", v)}
          placeholder="#"
        />
        <Field
          label="İkincil CTA"
          value={config.secondaryCtaText as string}
          onChange={(v) => update("secondaryCtaText", v)}
          placeholder=""
        />
        <Field
          label="İkincil CTA Link"
          value={config.secondaryCtaHref as string}
          onChange={(v) => update("secondaryCtaHref", v)}
          placeholder=""
        />
      </div>

      <div className="rounded-lg border p-3 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Renk & Tema
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field
            label="Pixel Rengi"
            value={config.color as string}
            onChange={(v) => update("color", v)}
            placeholder="#B497CF"
          />
          <Field
            label="Arka Plan"
            value={config.bgColor as string}
            onChange={(v) => update("bgColor", v)}
            placeholder="#070b0a"
          />
          <Field
            label="Yazı Rengi"
            value={config.textColor as string}
            onChange={(v) => update("textColor", v)}
            placeholder="#FFFFFF"
          />
        </div>
        <Field
          label="Yükseklik"
          value={config.height as string}
          onChange={(v) => update("height", v)}
          placeholder="100vh"
        />
      </div>

      <div className="rounded-lg border p-3 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Pixel Pattern
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Şekil</Label>
            <Select
              value={(config.variant as string) || "circle"}
              onValueChange={(v) => update("variant", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Şekil seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="triangle">Triangle</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Field
            label="Pixel Boyutu"
            value={String(config.pixelSize ?? 6)}
            onChange={(v) => num("pixelSize", v)}
            placeholder="6"
          />
          <Field
            label="Pattern Scale"
            value={String(config.patternScale ?? 3)}
            onChange={(v) => num("patternScale", v)}
            placeholder="3"
          />
          <Field
            label="Pattern Density"
            value={String(config.patternDensity ?? 1.2)}
            onChange={(v) => num("patternDensity", v)}
            placeholder="1.2"
          />
          <Field
            label="Pixel Jitter"
            value={String(config.pixelSizeJitter ?? 0.5)}
            onChange={(v) => num("pixelSizeJitter", v)}
            placeholder="0.5"
          />
          <Field
            label="Edge Fade (0-1)"
            value={String(config.edgeFade ?? 0.25)}
            onChange={(v) => num("edgeFade", v)}
            placeholder="0.25"
          />
          <Field
            label="Animation Speed"
            value={String(config.speed ?? 0.6)}
            onChange={(v) => num("speed", v)}
            placeholder="0.6"
          />
        </div>
      </div>

      <div className="rounded-lg border p-3 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Ripple (Tıklama Dalgaları)
        </Label>
        <div className="flex items-center justify-between">
          <Label>Aktif</Label>
          <Switch
            checked={!!config.enableRipples}
            onCheckedChange={(v) => update("enableRipples", v)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field
            label="Hız"
            value={String(config.rippleSpeed ?? 0.4)}
            onChange={(v) => num("rippleSpeed", v)}
            placeholder="0.4"
          />
          <Field
            label="Kalınlık"
            value={String(config.rippleThickness ?? 0.12)}
            onChange={(v) => num("rippleThickness", v)}
            placeholder="0.12"
          />
          <Field
            label="Yoğunluk"
            value={String(config.rippleIntensityScale ?? 1.5)}
            onChange={(v) => num("rippleIntensityScale", v)}
            placeholder="1.5"
          />
        </div>
      </div>

      <div className="rounded-lg border p-3 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Liquid Distortion
        </Label>
        <div className="flex items-center justify-between">
          <Label>Aktif</Label>
          <Switch
            checked={!!config.liquid}
            onCheckedChange={(v) => update("liquid", v)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field
            label="Strength"
            value={String(config.liquidStrength ?? 0.12)}
            onChange={(v) => num("liquidStrength", v)}
            placeholder="0.12"
          />
          <Field
            label="Radius"
            value={String(config.liquidRadius ?? 1.2)}
            onChange={(v) => num("liquidRadius", v)}
            placeholder="1.2"
          />
          <Field
            label="Wobble Speed"
            value={String(config.liquidWobbleSpeed ?? 5)}
            onChange={(v) => num("liquidWobbleSpeed", v)}
            placeholder="5"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <Label>Şeffaf Arka Plan</Label>
          <p className="text-xs text-muted-foreground">
            Kapalıysa Three.js siyah temizleme rengi kullanır.
          </p>
        </div>
        <Switch
          checked={config.transparent !== false}
          onCheckedChange={(v) => update("transparent", v)}
        />
      </div>
    </div>
  )
}

type MasonryConfigItem = { id: string; img: string; url?: string; height: number }

function MasonryGalleryConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const items = (config.items as MasonryConfigItem[] | undefined) || []

  function num(k: string, v: string) {
    const n = parseFloat(v)
    update(k, isNaN(n) ? 0 : n)
  }

  function updateItem(index: number, patch: Partial<MasonryConfigItem>) {
    setConfig((prev) => {
      const list = [...((prev.items as MasonryConfigItem[] | undefined) || [])]
      list[index] = { ...list[index], ...patch }
      return { ...prev, items: list }
    })
  }

  function addItem() {
    setConfig((prev) => {
      const list = [...((prev.items as MasonryConfigItem[] | undefined) || [])]
      list.push({
        id: String(Date.now()),
        img: "",
        url: "",
        height: 400,
      })
      return { ...prev, items: list }
    })
  }

  function removeItem(index: number) {
    setConfig((prev) => {
      const list = [...((prev.items as MasonryConfigItem[] | undefined) || [])]
      list.splice(index, 1)
      return { ...prev, items: list }
    })
  }

  function moveItem(index: number, dir: -1 | 1) {
    setConfig((prev) => {
      const list = [...((prev.items as MasonryConfigItem[] | undefined) || [])]
      const target = index + dir
      if (target < 0 || target >= list.length) return prev
      const [item] = list.splice(index, 1)
      list.splice(target, 0, item)
      return { ...prev, items: list }
    })
  }

  return (
    <div className="space-y-4">
      <Field
        label="Üst Etiket"
        value={config.label as string}
        onChange={(v) => update("label", v)}
        placeholder=""
      />
      <Field
        label="Başlık"
        value={config.headline as string}
        onChange={(v) => update("headline", v)}
        placeholder="Galeri"
      />
      <TextareaField
        label="Açıklama"
        value={config.description as string}
        onChange={(v) => update("description", v)}
        placeholder=""
      />

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <Label>Koyu Tema</Label>
          <p className="text-xs text-muted-foreground">Siyah arka plan + beyaz metin</p>
        </div>
        <Switch
          checked={!!config.dark}
          onCheckedChange={(v) => update("dark", v)}
        />
      </div>

      <div className="rounded-lg border p-3 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Animasyon
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Animasyon Yönü</Label>
            <Select
              value={(config.animateFrom as string) || "bottom"}
              onValueChange={(v) => update("animateFrom", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Yön seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Üstten</SelectItem>
                <SelectItem value="bottom">Alttan</SelectItem>
                <SelectItem value="left">Soldan</SelectItem>
                <SelectItem value="right">Sağdan</SelectItem>
                <SelectItem value="center">Merkez</SelectItem>
                <SelectItem value="random">Rastgele</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Field
            label="GSAP Ease"
            value={config.ease as string}
            onChange={(v) => update("ease", v)}
            placeholder="power3.out"
          />
          <Field
            label="Duration (sn)"
            value={String(config.duration ?? 0.6)}
            onChange={(v) => num("duration", v)}
            placeholder="0.6"
          />
          <Field
            label="Stagger (sn)"
            value={String(config.stagger ?? 0.05)}
            onChange={(v) => num("stagger", v)}
            placeholder="0.05"
          />
        </div>
      </div>

      <div className="rounded-lg border p-3 space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Hover Davranışı
        </Label>
        <div className="flex items-center justify-between">
          <Label>Hover'da Ölçeklendir</Label>
          <Switch
            checked={config.scaleOnHover !== false}
            onCheckedChange={(v) => update("scaleOnHover", v)}
          />
        </div>
        <Field
          label="Hover Scale"
          value={String(config.hoverScale ?? 0.95)}
          onChange={(v) => num("hoverScale", v)}
          placeholder="0.95"
        />
        <div className="flex items-center justify-between">
          <Label>Blur → Focus Animasyonu</Label>
          <Switch
            checked={config.blurToFocus !== false}
            onCheckedChange={(v) => update("blurToFocus", v)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Hover'da Renk Overlay</Label>
          <Switch
            checked={!!config.colorShiftOnHover}
            onCheckedChange={(v) => update("colorShiftOnHover", v)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Görseller ({items.length})</Label>
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            <Plus className="mr-2 size-4" /> Görsel Ekle
          </Button>
        </div>

        {items.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Henüz görsel eklenmedi. &quot;Görsel Ekle&quot; ile başlayın.
          </p>
        )}

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-lg border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Görsel #{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Yukarı"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === items.length - 1}
                    aria-label="Aşağı"
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(idx)}
                    aria-label="Sil"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <ImageUploadField
                label="Görsel"
                value={item.img}
                onChange={(v) => updateItem(idx, { img: v })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  label="Tıklama URL'si (opsiyonel)"
                  value={item.url || ""}
                  onChange={(v) => updateItem(idx, { url: v })}
                  placeholder="https://..."
                />
                <Field
                  label="Yükseklik (orijinal px)"
                  value={String(item.height ?? 400)}
                  onChange={(v) => {
                    const n = parseFloat(v)
                    updateItem(idx, { height: isNaN(n) ? 400 : n })
                  }}
                  placeholder="400"
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Yükseklik değeri görsel yerleşim oranını belirler — orijinal görselin pixel
          yüksekliğini girin (oran korunarak yarısı render edilir).
        </p>
      </div>
    </div>
  )
}

// ==========================================
// NEXO HERO CONFIG
// ==========================================

function NexoHeroConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const statusItems = (config.statusItems as { label: string; icon?: string }[]) || []
  const stats = (config.stats as { value: string; label: string }[]) || []

  function updateStatus(i: number, key: "label" | "icon", value: string) {
    const next = [...statusItems]
    next[i] = { ...next[i], [key]: value }
    update("statusItems", next)
  }

  function addStatus() {
    update("statusItems", [...statusItems, { label: "YENİ DURUM", icon: "" }])
  }

  function removeStatus(i: number) {
    update("statusItems", statusItems.filter((_, idx) => idx !== i))
  }

  function updateStat(i: number, key: "value" | "label", value: string) {
    const next = [...stats]
    next[i] = { ...next[i], [key]: value }
    update("stats", next)
  }

  function addStat() {
    update("stats", [...stats, { value: "—", label: "LABEL" }])
  }

  function removeStat(i: number) {
    update("stats", stats.filter((_, idx) => idx !== i))
  }

  const isDark = (config.theme as string) === "dark"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch
          checked={isDark}
          onCheckedChange={(v) => update("theme", v ? "dark" : "light")}
        />
        <Label>Koyu Tema (Dark)</Label>
      </div>
      <ImageUploadField
        label="Hero Görsel"
        value={config.heroImage as string}
        onChange={(v) => update("heroImage", v)}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Marka Adı (light)"
          value={config.brandNameLight as string}
          onChange={(v) => update("brandNameLight", v)}
          placeholder="NEXORA"
        />
        <Field
          label="Marka Adı (bold)"
          value={config.brandNameBold as string}
          onChange={(v) => update("brandNameBold", v)}
          placeholder="SIM"
        />
        <Field
          label="Superscript"
          value={config.brandSuperscript as string}
          onChange={(v) => update("brandSuperscript", v)}
          placeholder="™"
        />
      </div>
      <Field
        label="Alt Başlık – 1. Satır"
        value={config.subtitleLine1 as string}
        onChange={(v) => update("subtitleLine1", v)}
        placeholder="MYANMAR'S NEXT-GEN ESIM INFRASTRUCTURE"
      />
      <Field
        label="Alt Başlık – 2. Satır (mono)"
        value={config.subtitleLine2 as string}
        onChange={(v) => update("subtitleLine2", v)}
        placeholder="AI-DRIVEN • GSMA-COMPLIANT • VERCEL-POWERED"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Durum Etiketleri</Label>
          <Button variant="outline" size="sm" onClick={addStatus}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {statusItems.map((item, i) => (
          <div key={i} className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                value={item.label}
                onChange={(e) => updateStatus(i, "label", e.target.value)}
                placeholder="SYSTEM ACTIVE"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeStatus(i)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <Textarea
              value={item.icon ?? ""}
              onChange={(e) => updateStatus(i, "icon", e.target.value)}
              placeholder={`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" ...>...</svg>`}
              rows={2}
              className="font-mono text-xs"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>İstatistikler</Label>
          <Button variant="outline" size="sm" onClick={addStat}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={stat.value}
              onChange={(e) => updateStat(i, "value", e.target.value)}
              placeholder="99.9%"
              className="w-28"
            />
            <Input
              value={stat.label}
              onChange={(e) => updateStat(i, "label", e.target.value)}
              placeholder="UPTIME"
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeStat(i)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// NEXUS FEATURES CONFIG
// ==========================================

const NEXUS_ANIMATION_KEYS = [
  { value: "neural", label: "Neural (beyin ağı)" },
  { value: "workflow", label: "Workflow (akış)" },
  { value: "security", label: "Security (kilit)" },
  { value: "analytics", label: "Analytics (grafik)" },
  { value: "globe", label: "Globe (küre)" },
  { value: "api", label: "API (istek)" },
]

function NexusFeaturesConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const features = (config.features as { title: string; description: string; animationKey: string }[]) || []

  function updateFeature(index: number, key: string, value: string) {
    const next = [...features]
    next[index] = { ...next[index], [key]: value }
    update("features", next)
  }

  function addFeature() {
    update("features", [
      ...features,
      { title: "Yeni Özellik", description: "", animationKey: "neural" },
    ])
  }

  function removeFeature(index: number) {
    update("features", features.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Field
        label="Badge / Etiket"
        value={config.badge as string}
        onChange={(v) => update("badge", v)}
        placeholder="// PLATFORM"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Başlık – 1. Satır"
          value={config.headingLine1 as string}
          onChange={(v) => update("headingLine1", v)}
          placeholder="Ölçeklenmek için"
        />
        <Field
          label="Başlık – 2. Satır"
          value={config.headingLine2 as string}
          onChange={(v) => update("headingLine2", v)}
          placeholder="gerek duyduğunuz her şey."
        />
      </div>
      <TextareaField
        label="Açıklama"
        value={config.description as string}
        onChange={(v) => update("description", v)}
        placeholder="AI uygulamaları kurmak, dağıtmak ve ölçeklendirmek için eksiksiz bir platform."
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Özellik Kartları</Label>
          <Button variant="outline" size="sm" onClick={addFeature}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {features.map((feature, i) => (
          <div key={i} className="rounded-lg border p-3 space-y-2">
            <div className="flex gap-2">
              <Input
                value={feature.title}
                onChange={(e) => updateFeature(i, "title", e.target.value)}
                placeholder="Başlık"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeFeature(i)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <Textarea
              value={feature.description}
              onChange={(e) => updateFeature(i, "description", e.target.value)}
              placeholder="Açıklama"
              rows={2}
            />
            <Select
              value={feature.animationKey || "neural"}
              onValueChange={(v) => updateFeature(i, "animationKey", v)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="ASCII animasyon seç" />
              </SelectTrigger>
              <SelectContent>
                {NEXUS_ANIMATION_KEYS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        {features.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Özellik eklenmemiş — boş bırakırsanız varsayılan 6 kart görünür.
          </p>
        )}
      </div>
    </div>
  )
}

// ==========================================
// SCROLL BLUR TYPOGRAPHY CONFIG
// ==========================================

type ScrollBlurItem = { label?: string; text: string; imageUrl?: string }

function ScrollBlurTypographyConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const items = (config.items as ScrollBlurItem[]) || []

  function updateItem(index: number, key: keyof ScrollBlurItem, value: string) {
    const next = [...items]
    next[index] = { ...next[index], [key]: value }
    update("items", next)
  }

  function addItem() {
    update("items", [...items, { label: "", text: "Yeni metin bloğu" }])
  }

  function removeItem(index: number) {
    update("items", items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Yazı Boyutu</Label>
          <Select value={(config.fontSize as string) || "lg"} onValueChange={(v) => update("fontSize", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Küçük</SelectItem>
              <SelectItem value="md">Orta</SelectItem>
              <SelectItem value="lg">Büyük</SelectItem>
              <SelectItem value="xl">Çok Büyük</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Hizalama</Label>
          <Select value={(config.align as string) || "left"} onValueChange={(v) => update("align", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Sol</SelectItem>
              <SelectItem value="center">Orta</SelectItem>
              <SelectItem value="right">Sağ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Metin Blokları</Label>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-1 size-3.5" /> Blok Ekle
          </Button>
        </div>
        {items.map((item, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">#{i + 1}</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(i)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <Field
              label="Etiket (opsiyonel)"
              value={item.label || ""}
              onChange={(v) => updateItem(i, "label", v)}
              placeholder="Örn: 01 — Misyon"
            />
            <div className="space-y-2">
              <Label>Metin</Label>
              <TiptapEditor
                content={item.text || ""}
                onChange={(v) => updateItem(i, "text", v)}
                placeholder="Metin yazın..."
              />
            </div>
            <ImageUploadField
              label="Sağ Görsel (opsiyonel)"
              value={item.imageUrl || ""}
              onChange={(v) => updateItem(i, "imageUrl", v)}
            />
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Henüz blok eklenmemiş.
          </p>
        )}
      </div>
    </div>
  )
}

// ==========================================
// CONVERSION INTEGRATIONS SECTION CONFIG
// ==========================================

interface CiLogoSlot {
  name: string
  imageUrl: string
}

function ConversionIntegrationsSectionConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const rawLogos = Array.isArray(config.logos) ? config.logos : []

  // Normalize: preset strings → {name, imageUrl: ""}, objects kept as-is
  const slots: CiLogoSlot[] = Array.from({ length: 6 }, (_, i) => {
    const entry = rawLogos[i]
    if (!entry) return { name: "", imageUrl: "" }
    if (typeof entry === "string") return { name: entry, imageUrl: "" }
    const obj = entry as Record<string, unknown>
    return { name: String(obj.name ?? ""), imageUrl: String(obj.imageUrl ?? "") }
  })

  function updateSlot(i: number, key: keyof CiLogoSlot, value: string) {
    const next = slots.map((s, idx) => idx === i ? { ...s, [key]: value } : s)
    // trim trailing empty slots
    let last = next.length - 1
    while (last >= 0 && !next[last].name && !next[last].imageUrl) last--
    update("logos", next.slice(0, last + 1))
  }

  return (
    <div className="space-y-4">
      <Field label="Etiket" value={config.label as string} onChange={(v) => update("label", v)} placeholder="ENTEGRASYONLAR" />
      <TextareaField label="Başlık (satır sonu için \\n kullan)" value={config.title as string} onChange={(v) => update("title", v)} placeholder="Tek Tıkla Entegrasyon.\nSınırsız Potansiyel." />
      <div className="space-y-2">
        <Label>Açıklama</Label>
        <TiptapEditor
          content={(config.description as string) || ""}
          onChange={(v) => update("description", v)}
          placeholder="Açıklama yazın..."
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="CTA Butonu Metni" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} placeholder="Demo İste" />
        <Field label="CTA Linki" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} placeholder="/iletisim" />
      </div>

      <div className="space-y-3">
        <Label>Logo Slotları (maks. 6)</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          {slots.map((slot, i) => (
            <CiLogoSlotEditor
              key={i}
              index={i}
              slot={slot}
              onChange={(key, val) => updateSlot(i, key, val)}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Her slot için logo görseli yükleyin ve kısa bir isim girin. Boş bırakılan slotlar gösterilmez.
        </p>
      </div>
    </div>
  )
}

function CiLogoSlotEditor({
  index,
  slot,
  onChange,
}: {
  index: number
  slot: CiLogoSlot
  onChange: (key: keyof CiLogoSlot, val: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.url) {
        onChange("imageUrl", data.url)
      } else {
        setError(data.error ?? "Yükleme başarısız")
      }
    } catch {
      setError("Sunucuya bağlanılamadı")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-lg border p-3 space-y-2">
      <span className="text-xs font-medium text-muted-foreground">Slot {index + 1}</span>

      {/* Image upload area */}
      {slot.imageUrl ? (
        <div className="relative rounded-md border overflow-hidden bg-muted flex items-center justify-center h-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slot.imageUrl} alt={slot.name || "logo"} className="max-h-12 max-w-full object-contain" />
          <div className="absolute top-1 right-1 flex gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <Upload className="size-3" />
            </button>
            <button
              type="button"
              onClick={() => onChange("imageUrl", "")}
              className="rounded bg-black/60 p-1 text-white hover:bg-red-600/80"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center gap-1 rounded-md border-2 border-dashed py-3 text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50 transition-colors"
        >
          <ImageIcon className="size-5" />
          <span className="text-xs">{uploading ? "Yükleniyor..." : "Logo yükle"}</span>
        </button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />

      <Input
        value={slot.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Uygulama adı (ör: Slack)"
        className="h-7 text-xs"
      />
    </div>
  )
}

function LiveblocksHomeHeroConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const features = Array.isArray(config.features)
    ? (config.features as { label: string; icon: string; color: string }[])
    : []

  function updateFeature(i: number, key: string, val: string) {
    const next = features.map((f, idx) => idx === i ? { ...f, [key]: val } : f)
    update("features", next)
  }

  function addFeature() {
    update("features", [...features, { label: "Yeni Özellik", icon: "zap", color: "#7ED321" }])
  }

  function removeFeature(i: number) {
    update("features", features.filter((_, idx) => idx !== i))
  }

  const ICON_OPTIONS = ["server", "monitor", "database", "network", "message-square", "bell", "type", "zap"]

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Badge Metni" value={config.badgeText as string} onChange={(v) => update("badgeText", v)} placeholder="Yeni" />
        <Field label="Badge Link Metni" value={config.badgeLinkText as string} onChange={(v) => update("badgeLinkText", v)} placeholder="v2.0" />
      </div>
      <TextareaField label="Başlık (satır sonu için \\n)" value={config.headline as string} onChange={(v) => update("headline", v)} placeholder="Ürününüzde\niş birliğini keşfedin" />
      <Field label="Açıklama Önek" value={config.descriptionPrefix as string} onChange={(v) => update("descriptionPrefix", v)} placeholder="Ship features like" />
      <Field label="Açıklama Sonek" value={config.descriptionSuffix as string} onChange={(v) => update("descriptionSuffix", v)} placeholder="in days, not months..." />

      <div className="space-y-2">
        <Label>Özellik Chip'leri</Label>
        {features.map((f, i) => (
          <div key={i} className="grid gap-2 grid-cols-[1fr_1fr_80px_32px] items-center">
            <Input value={f.label} onChange={(e) => updateFeature(i, "label", e.target.value)} placeholder="GPU Server" className="h-8 text-xs" />
            <Select value={f.icon} onValueChange={(v) => updateFeature(i, "icon", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((ic) => (
                  <SelectItem key={ic} value={ic} className="text-xs">{ic}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="color" value={f.color} onChange={(e) => updateFeature(i, "color", e.target.value)} className="h-8 p-1" />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(i)} className="h-8 w-8">
              <Trash2 className="size-3" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
          <Plus className="mr-2 size-3" /> Chip Ekle
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Birincil CTA Metni" value={config.primaryCtaText as string} onChange={(v) => update("primaryCtaText", v)} placeholder="Ücretsiz Başla" />
        <Field label="Birincil CTA Linki" value={config.primaryCtaHref as string} onChange={(v) => update("primaryCtaHref", v)} placeholder="/iletisim" />
        <Field label="İkincil CTA Metni" value={config.secondaryCtaText as string} onChange={(v) => update("secondaryCtaText", v)} placeholder="Belgeleri Oku" />
        <Field label="İkincil CTA Linki" value={config.secondaryCtaHref as string} onChange={(v) => update("secondaryCtaHref", v)} placeholder="#" />
      </div>
      <Field label="Alt Görsel URL (isteğe bağlı)" value={config.bottomImage as string} onChange={(v) => update("bottomImage", v)} placeholder="https://..." />
    </div>
  )
}

function StHeroConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (key: string, value: unknown) => void
}) {
  const isLight = (config.theme as string) === "light"
  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={isLight}
        onCheckedChange={(v) => update("theme", v ? "light" : "dark")}
      />
      <Label>Açık Tema (Light)</Label>
    </div>
  )
}

function NexusHeroConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (key: string, value: unknown) => void
}) {
  const isDark = (config.theme as string) === "dark"
  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={isDark}
        onCheckedChange={(v) => update("theme", v ? "dark" : "light")}
      />
      <Label>Koyu Tema (Dark)</Label>
    </div>
  )
}

function HookableAiCta3Config({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (key: string, value: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const isDark = (config.mode as string) === "dark"
  const painPoints = (config.painPoints as string[]) || []

  function updatePainPoint(i: number, value: string) {
    const next = [...painPoints]
    next[i] = value
    update("painPoints", next)
  }

  function addPainPoint() {
    update("painPoints", [...painPoints, "Yeni madde"])
  }

  function removePainPoint(i: number) {
    update("painPoints", painPoints.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch
          checked={isDark}
          onCheckedChange={(v) => update("mode", v ? "dark" : "light")}
        />
        <Label>Koyu Tema (Dark)</Label>
      </div>
      <Field
        label="Başlık"
        value={config.heading as string}
        onChange={(v) => update("heading", v)}
        placeholder="Say Goodbye to"
      />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Pain Points (dönen liste)</Label>
          <Button variant="outline" size="sm" onClick={addPainPoint}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {painPoints.map((point, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={point}
              onChange={(e) => updatePainPoint(i, e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removePainPoint(i)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Label>Animasyon Hızı (ms)</Label>
        <Input
          type="number"
          value={(config.animationDuration as number) || 2000}
          onChange={(e) => update("animationDuration", Number(e.target.value))}
          min={500}
          max={10000}
          step={100}
        />
      </div>
    </div>
  )
}


function HeroTextImageConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (key: string, value: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Başlık 1. Satır" value={config.headingLine1 as string} onChange={(v) => update("headingLine1", v)} placeholder="The vision" />
        <Field label="Başlık 2. Satır" value={config.headingLine2 as string} onChange={(v) => update("headingLine2", v)} placeholder="of engineering" />
        <Field label="İnline Kelime 1 (human)" value={config.inlineWord1 as string} onChange={(v) => update("inlineWord1", v)} placeholder="human" />
        <Field label="İnline Kelime 2 (AI)" value={config.inlineWord2 as string} onChange={(v) => update("inlineWord2", v)} placeholder="AI" />
      </div>
      <div className="space-y-2">
        <Label>Alt Başlık</Label>
        <Textarea
          value={(config.subheading as string) ?? ""}
          onChange={(e) => update("subheading", e.target.value)}
          placeholder="We help you map the talent you need..."
          rows={3}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Buton Metni" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} placeholder="Join The Movement!" />
        <Field label="Buton Linki" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} placeholder="#" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>İkon Boyutu (px)</Label>
          <Input type="number" value={(config.iconSize as number) ?? 110} onChange={(e) => update("iconSize", Number(e.target.value))} min={40} max={200} step={10} />
        </div>
        <div className="space-y-2">
          <Label>İçerik Üst Boşluğu (px)</Label>
          <Input type="number" value={(config.contentMarginTop as number) ?? 380} onChange={(e) => update("contentMarginTop", Number(e.target.value))} min={0} max={800} step={10} />
        </div>
      </div>
      <ImageUploadField
        label="Ürün Görseli"
        value={config.productImage as string}
        onChange={(v) => update("productImage", v)}
      />
      <Field label="Arka Plan Video URL (.mp4 veya HLS .m3u8)" value={config.hlsUrl as string} onChange={(v) => update("hlsUrl", v)} placeholder="https://.../video.mp4 veya https://stream.mux.com/....m3u8" />
      <Field label="Human Video URL (.mp4)" value={config.humanVideoUrl as string} onChange={(v) => update("humanVideoUrl", v)} placeholder="https://..." />
      <Field label="AI Video URL (.mp4)" value={config.aiVideoUrl as string} onChange={(v) => update("aiVideoUrl", v)} placeholder="https://..." />
    </div>
  )
}

const ICON_OPTIONS = [
  { value: "trending-up", label: "Trend (grafik)" },
  { value: "x-grok", label: "X + Grok" },
  { value: "profile-shield", label: "Profil Kalkanı" },
  { value: "zap", label: "Zap (şimşek)" },
  { value: "shield", label: "Kalkan" },
  { value: "star", label: "Yıldız" },
  { value: "bar-chart", label: "Bar Chart" },
  { value: "globe", label: "Globe" },
  { value: "lock", label: "Kilit" },
  { value: "users", label: "Kullanıcılar" },
  { value: "cpu", label: "CPU" },
]

function AdvantagesXPremiumConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (key: string, value: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const advantages = (config.advantages as { icon: string; title: string; description: string }[]) || []

  function updateAdv(i: number, key: string, value: string) {
    const next = [...advantages]
    next[i] = { ...next[i], [key]: value }
    update("advantages", next)
  }

  function addAdv() {
    update("advantages", [...advantages, { icon: "star", title: "Yeni Özellik", description: "Açıklama" }])
  }

  function removeAdv(i: number) {
    update("advantages", advantages.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-4">
      <Field label="Başlık" value={config.heading as string} onChange={(v) => update("heading", v)} placeholder="Temel Özellikler" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Özellik Kartları</Label>
          <Button variant="outline" size="sm" onClick={addAdv}>
            <Plus className="mr-1 size-3.5" /> Ekle
          </Button>
        </div>
        {advantages.map((adv, i) => (
          <div key={i} className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">#{i + 1}</span>
              <Button variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-destructive" onClick={() => removeAdv(i)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">İkon</Label>
              <Select value={adv.icon} onValueChange={(v) => updateAdv(i, "icon", v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input value={adv.title} onChange={(e) => updateAdv(i, "title", e.target.value)} placeholder="Başlık" className="text-xs h-8" />
            <Textarea value={adv.description} onChange={(e) => updateAdv(i, "description", e.target.value)} placeholder="Açıklama" rows={2} className="text-xs" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metni" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} placeholder="Destek ekibimize ulaşın" />
        <Field label="CTA Linki" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} placeholder="#" />
      </div>
    </div>
  )
}

function ImwebMeStats6Config({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (key: string, value: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const isDark = (config.mode as string) === "dark"
  const bars = (config.bars as { year: string; value: number | null; unit?: string }[]) || []
  const bottomStats = (config.bottomStats as { label: string; value: string; unit: string; hasGradient?: boolean }[]) || []

  function updateBar(i: number, key: string, value: unknown) {
    const next = [...bars]
    next[i] = { ...next[i], [key]: value }
    update("bars", next)
  }

  function updateStat(i: number, key: string, value: unknown) {
    const next = [...bottomStats]
    next[i] = { ...next[i], [key]: value }
    update("bottomStats", next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch checked={isDark} onCheckedChange={(v) => update("mode", v ? "dark" : "light")} />
        <Label>Koyu Tema (Dark)</Label>
      </div>
      <div className="space-y-2">
        <Label>Başlık</Label>
        <Textarea value={(config.title as string) ?? ""} onChange={(e) => update("title", e.target.value)} rows={3} placeholder="Büyüyen&#10;En Hızlı Platform" />
      </div>
      <Field label="Video URL" value={config.videoUrl as string} onChange={(v) => update("videoUrl", v)} placeholder="https://..." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Ana Stat Etiketi" value={config.mainStatLabel as string} onChange={(v) => update("mainStatLabel", v)} placeholder="2025 Kümülatif" />
        <div className="space-y-2">
          <Label>Ana Stat Değeri</Label>
          <Input type="number" value={(config.mainStatValue as number) ?? 100} onChange={(e) => update("mainStatValue", Number(e.target.value))} />
        </div>
        <Field label="Ana Stat Birimi" value={config.mainStatUnit as string} onChange={(v) => update("mainStatUnit", v)} placeholder="万" />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">Bar Grafik ({bars.length} bar)</Label>
        {bars.map((bar, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 rounded-lg border p-2">
            <Input value={bar.year} onChange={(e) => updateBar(i, "year", e.target.value)} placeholder="2024" className="h-7 text-xs" />
            <Input type="number" value={bar.value ?? ""} onChange={(e) => updateBar(i, "value", e.target.value === "" ? null : Number(e.target.value))} placeholder="boş" className="h-7 text-xs" />
            <Input value={bar.unit ?? ""} onChange={(e) => updateBar(i, "unit", e.target.value)} placeholder="万" className="h-7 text-xs" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">Alt İstatistikler</Label>
        {bottomStats.map((stat, i) => (
          <div key={i} className="rounded-lg border p-3 space-y-2">
            <Input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Etiket" className="text-xs h-7" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)} placeholder="342" className="text-xs h-7" />
              <Input value={stat.unit} onChange={(e) => updateStat(i, "unit", e.target.value)} placeholder="%" className="text-xs h-7" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={!!stat.hasGradient} onCheckedChange={(v) => updateStat(i, "hasGradient", v)} />
              <Label className="text-xs">Gradient Sayı</Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// SAASPO FEATURE SECTIONS VOICEFLOW CONFIG
// ==========================================

function SaaspoFeatureVoiceflowConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) {
  const features = (config.features as { icon: string; title: string; description: string }[]) ?? []
  const logos = (config.logos as { name: string }[]) ?? []

  function updateFeature(i: number, key: string, value: string) {
    const updated = features.map((f, idx) => idx === i ? { ...f, [key]: value } : f)
    update("features", updated)
  }

  function addFeature() {
    update("features", [...features, { icon: "platform", title: "Yeni Özellik", description: "Açıklama" }])
  }

  function removeFeature(i: number) {
    update("features", features.filter((_, idx) => idx !== i))
  }

  function updateLogo(i: number, value: string) {
    const updated = logos.map((l, idx) => idx === i ? { name: value } : l)
    update("logos", updated)
  }

  function addLogo() {
    update("logos", [...logos, { name: "Marka Adı" }])
  }

  function removeLogo(i: number) {
    update("logos", logos.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-4">
      <Field label="Badge" value={config.badge as string} onChange={(v) => update("badge", v)} placeholder="Enterprise Cloud" />
      <TextareaField label="Başlık (\\n ile satır kır)" value={config.title as string} onChange={(v) => update("title", v)} />
      <TextareaField label="Açıklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Özellikler ({features.length})</Label>
          <Button variant="outline" size="sm" onClick={addFeature} className="h-7 text-xs"><Plus className="mr-1 size-3" />Ekle</Button>
        </div>
        {features.map((f, i) => (
          <div key={i} className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFeature(i)}><X className="size-3" /></Button>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">İkon (platform / rocket / lock / download)</Label>
              <Input value={f.icon} onChange={(e) => updateFeature(i, "icon", e.target.value)} className="h-7 text-xs" />
            </div>
            <Input value={f.title} onChange={(e) => updateFeature(i, "title", e.target.value)} placeholder="Başlık" className="h-7 text-xs" />
            <Input value={f.description} onChange={(e) => updateFeature(i, "description", e.target.value)} placeholder="Açıklama" className="h-7 text-xs" />
          </div>
        ))}
      </div>

      <Field label="Logo Bar Metin" value={config.trustedByText as string} onChange={(v) => update("trustedByText", v)} placeholder="Trusted by the best in the business" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Logolar ({logos.length})</Label>
          <Button variant="outline" size="sm" onClick={addLogo} className="h-7 text-xs"><Plus className="mr-1 size-3" />Ekle</Button>
        </div>
        {logos.map((l, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input value={l.name} onChange={(e) => updateLogo(i, e.target.value)} placeholder="Marka Adı" className="h-7 text-xs flex-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeLogo(i)}><X className="size-3" /></Button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// SPATIAL PRODUCT SHOWCASE CONFIG
// ==========================================
// CUSTOMERS SHOWCASE CONFIG
// ==========================================

// ==========================================
// PERSPECTIVE HERO CONFIG
// ==========================================

function PerspectiveHeroConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">HTML içeriği Three.js sahnesine projeksiyon edilir. Scroll ile kamera döner (300vh alan kaplar).</p>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">Büyük Başlık (6 satır)</Label>
        {(["line1","line2","line3","line4","line5","line6"] as const).map((k, i) => (
          <Field key={k} label={`Satır ${i+1}`} value={config[k] as string ?? ""} onChange={(v) => update(k, v)} />
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">Kart (3D modelin üzerindeki beyaz panel)</Label>
        <TextareaField label="Başlık (\\n ile satır kır)" value={config.cardTitle as string ?? ""} onChange={(v) => update("cardTitle", v)} />
        <TextareaField label="Açıklama" value={config.cardDescription as string ?? ""} onChange={(v) => update("cardDescription", v)} />
        <Field label="Alt Not / Marka" value={config.cardFooter as string ?? ""} onChange={(v) => update("cardFooter", v)} placeholder="stuux.com" />
      </div>

      <Field label="Scroll Etiketi" value={config.scrollLabel as string ?? ""} onChange={(v) => update("scrollLabel", v)} placeholder="SCROLL DOWN" />
      <Field label="Sahne Arka Plan Rengi" value={config.sceneBackground as string ?? "#ffffff"} onChange={(v) => update("sceneBackground", v)} placeholder="#ffffff" />
      <Field label="Model URL (opsiyonel)" value={config.modelUrl as string ?? ""} onChange={(v) => update("modelUrl", v)} placeholder="https://...model.glb" />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="persp-dark"
          checked={!!config.dark}
          onChange={(e) => update("dark", e.target.checked)}
          className="h-4 w-4"
        />
        <Label htmlFor="persp-dark" className="text-xs">Koyu Kart</Label>
      </div>
    </div>
  )
}

// ==========================================

type CustomerLogoItem = { src: string; alt: string; href?: string }

function CustomersShowcaseConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  const logos: CustomerLogoItem[] = Array.isArray(config.logos) ? (config.logos as CustomerLogoItem[]) : []

  function setLogos(next: CustomerLogoItem[]) {
    update("logos", next)
  }
  function updateLogo(i: number, key: string, value: string) {
    const next = logos.map((l, idx) => (idx === i ? { ...l, [key]: value } : l))
    setLogos(next)
  }
  function addLogo() {
    setLogos([...logos, { src: "", alt: "Logo", href: "" }])
  }
  function removeLogo(i: number) {
    setLogos(logos.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Başlık 3 parçaya bölünür, aralarına inline görsel eklenir.</p>

      {/* Headline parts + inline images */}
      <Field label="Başlık — 1. Kısım" value={config.headlinePart1 as string ?? ""} onChange={(v) => update("headlinePart1", v)} placeholder="Tercih edilen" />
      <ImageUploadField label="Inline Görsel 1" value={config.inlineImage1 as string ?? ""} onChange={(v) => update("inlineImage1", v)} />
      <Field label="Başlık — 2. Kısım" value={config.headlinePart2 as string ?? ""} onChange={(v) => update("headlinePart2", v)} placeholder="ve güvenilen" />
      <ImageUploadField label="Inline Görsel 2" value={config.inlineImage2 as string ?? ""} onChange={(v) => update("inlineImage2", v)} />
      <Field label="Başlık — 3. Kısım" value={config.headlinePart3 as string ?? ""} onChange={(v) => update("headlinePart3", v)} placeholder="donanım çözümleri." />

      <Field label="Logo Bar Etiketi" value={config.logoBarLabel as string ?? ""} onChange={(v) => update("logoBarLabel", v)} placeholder="Referanslarımızdan bazıları:" />
      <Field label="Açıklama" value={config.description as string ?? ""} onChange={(v) => update("description", v)} />
      <TextareaField label="İkincil Açıklama" value={config.descriptionMuted as string ?? ""} onChange={(v) => update("descriptionMuted", v)} />
      <div className="grid grid-cols-2 gap-2">
        <Field label="CTA Metni" value={config.ctaText as string ?? ""} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Linki" value={config.ctaHref as string ?? ""} onChange={(v) => update("ctaHref", v)} placeholder="/referanslar" />
      </div>
      <Field label="Fine Print (vurgu)" value={config.finePrintHighlight as string ?? ""} onChange={(v) => update("finePrintHighlight", v)} placeholder="Ücretsiz keşif görüşmesi." />
      <Field label="Fine Print (metin)" value={config.finePrint as string ?? ""} onChange={(v) => update("finePrint", v)} placeholder="Hemen başlamak için iletişime geçin." />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="customers-dark"
          checked={!!config.dark}
          onChange={(e) => update("dark", e.target.checked)}
          className="h-4 w-4"
        />
        <Label htmlFor="customers-dark" className="text-xs">Koyu Mod (dark)</Label>
      </div>

      {/* Logo List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Müşteri Logoları ({logos.length})</Label>
          <Button variant="outline" size="sm" onClick={addLogo} className="h-7 text-xs">
            <Plus className="mr-1 size-3" />Ekle
          </Button>
        </div>
        {logos.map((logo, i) => (
          <div key={i} className="space-y-1.5 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Logo {i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeLogo(i)}>
                <X className="size-3" />
              </Button>
            </div>
            <ImageUploadField label="Görsel" value={logo.src} onChange={(v) => updateLogo(i, "src", v)} />
            <Field label="Alt Metin" value={logo.alt} onChange={(v) => updateLogo(i, "alt", v)} placeholder="Şirket Adı" />
            <Field label="Link (opsiyonel)" value={logo.href ?? ""} onChange={(v) => updateLogo(i, "href", v)} placeholder="https://..." />
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================

type SpProductItem = {
  label: string
  title: string
  description: string
  image: string
  gradientClass: string
  glowClass: string
  ringClass: string
  connectionStatus: string
  batteryLevel: number
  features: { label: string; value: number; icon: string }[]
  specs: { label: string; icon: string }[]
}

const SP_EMPTY_PRODUCT: SpProductItem = {
  label: "Yeni Sekme",
  title: "",
  description: "",
  image: "",
  gradientClass: "from-violet-600 to-purple-900",
  glowClass: "bg-violet-500",
  ringClass: "border-violet-500/50",
  connectionStatus: "Connected",
  batteryLevel: 80,
  features: [],
  specs: [],
}

function SpProductItemFields({
  index,
  product,
  onUpdate,
  onUpdateFeature,
  onAddFeature,
  onRemoveFeature,
  onUpdateSpec,
  onAddSpec,
  onRemoveSpec,
  onRemoveProduct,
  canRemove,
}: {
  index: number
  product: SpProductItem
  onUpdate: (key: string, value: unknown) => void
  onUpdateFeature: (i: number, key: string, value: unknown) => void
  onAddFeature: () => void
  onRemoveFeature: (i: number) => void
  onUpdateSpec: (i: number, key: string, value: unknown) => void
  onAddSpec: () => void
  onRemoveSpec: (i: number) => void
  onRemoveProduct: () => void
  canRemove: boolean
}) {
  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sekme {index + 1} — {product.label || "İsimsiz"}</p>
        {canRemove && (
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={onRemoveProduct}><X className="size-3" /></Button>
        )}
      </div>
      <Field label="Sekme Etiketi" value={product.label ?? ""} onChange={(v) => onUpdate("label", v)} placeholder="Ürün Adı" />
      <Field label="Başlık" value={product.title ?? ""} onChange={(v) => onUpdate("title", v)} />
      <TextareaField label="Açıklama" value={product.description ?? ""} onChange={(v) => onUpdate("description", v)} />
      <ImageUploadField label="Görsel" value={product.image ?? ""} onChange={(v) => onUpdate("image", v)} />
      <Field label="Gradient (Tailwind)" value={product.gradientClass ?? ""} onChange={(v) => onUpdate("gradientClass", v)} placeholder="from-blue-600 to-indigo-900" />
      <Field label="Glow (Tailwind bg-*)" value={product.glowClass ?? ""} onChange={(v) => onUpdate("glowClass", v)} placeholder="bg-blue-500" />
      <Field label="Ring (Tailwind border-*)" value={product.ringClass ?? ""} onChange={(v) => onUpdate("ringClass", v)} placeholder="border-blue-500/50" />
      <Field label="Bağlantı Durumu" value={product.connectionStatus ?? ""} onChange={(v) => onUpdate("connectionStatus", v)} placeholder="Connected" />
      <div className="space-y-1.5">
        <Label className="text-xs">Pil Seviyesi (%)</Label>
        <Input type="number" min={0} max={100} value={product.batteryLevel ?? 0} onChange={(e) => onUpdate("batteryLevel", Number(e.target.value))} className="h-7 text-xs" />
      </div>

      {/* Metrik Ekle — label + value% + icon → progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Metrik Ekle ({(product.features ?? []).length})</Label>
          <Button variant="outline" size="sm" onClick={onAddFeature} className="h-7 text-xs"><Plus className="mr-1 size-3" />Ekle</Button>
        </div>
        {(product.features ?? []).map((f, i) => (
          <div key={i} className="grid grid-cols-[1fr_60px_80px_28px] gap-1.5 items-center">
            <Input value={f.label} onChange={(e) => onUpdateFeature(i, "label", e.target.value)} placeholder="Başlık" className="h-7 text-xs" />
            <Input type="number" min={0} max={100} value={f.value} onChange={(e) => onUpdateFeature(i, "value", Number(e.target.value))} className="h-7 text-xs" />
            <Input value={f.icon} onChange={(e) => onUpdateFeature(i, "icon", e.target.value)} placeholder="zap" className="h-7 text-xs" />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemoveFeature(i)}><X className="size-3" /></Button>
          </div>
        ))}
        <p className="text-[10px] text-muted-foreground">Yüzde değerli progress bar olarak gösterilir.</p>
      </div>

      {/* Özellik Ekle — label + icon only → text list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Özellik Ekle ({(product.specs ?? []).length})</Label>
          <Button variant="outline" size="sm" onClick={onAddSpec} className="h-7 text-xs"><Plus className="mr-1 size-3" />Ekle</Button>
        </div>
        {(product.specs ?? []).map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_28px] gap-1.5 items-center">
            <Input value={s.label} onChange={(e) => onUpdateSpec(i, "label", e.target.value)} placeholder="Açıklama metni" className="h-7 text-xs" />
            <Input value={s.icon} onChange={(e) => onUpdateSpec(i, "icon", e.target.value)} placeholder="zap" className="h-7 text-xs" />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemoveSpec(i)}><X className="size-3" /></Button>
          </div>
        ))}
        <p className="text-[10px] text-muted-foreground">Bar yok — sadece ikon + metin. İkon: zap, wifi, bluetooth, music, activity, cpu, radio, volume, headphones</p>
      </div>
    </div>
  )
}

function SpatialProductShowcaseConfig({
  config,
  update,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
}) {
  // Support old {leftProduct, rightProduct} format migration
  const rawProducts = Array.isArray(config.products) && config.products.length > 0
    ? (config.products as SpProductItem[])
    : [config.leftProduct, config.rightProduct].filter(Boolean) as SpProductItem[]

  const products: SpProductItem[] = rawProducts.length > 0 ? rawProducts : [{ ...SP_EMPTY_PRODUCT, label: "Sol" }, { ...SP_EMPTY_PRODUCT, label: "Sağ" }]

  function setProducts(next: SpProductItem[]) {
    update("products", next)
  }

  function updateProduct(i: number, key: string, value: unknown) {
    const next = products.map((p, idx) => idx === i ? { ...p, [key]: value } : p)
    setProducts(next)
  }

  function updateFeature(pi: number, fi: number, key: string, value: unknown) {
    const features = [...(products[pi].features ?? [])]
    features[fi] = { ...features[fi], [key]: value }
    updateProduct(pi, "features", features)
  }

  function addFeature(pi: number) {
    updateProduct(pi, "features", [...(products[pi].features ?? []), { label: "Yeni", value: 50, icon: "zap" }])
  }

  function removeFeature(pi: number, fi: number) {
    updateProduct(pi, "features", (products[pi].features ?? []).filter((_, idx) => idx !== fi))
  }

  function updateSpec(pi: number, si: number, key: string, value: unknown) {
    const specs = [...(products[pi].specs ?? [])]
    specs[si] = { ...specs[si], [key]: value }
    updateProduct(pi, "specs", specs)
  }

  function addSpec(pi: number) {
    updateProduct(pi, "specs", [...(products[pi].specs ?? []), { label: "Yeni özellik", icon: "zap" }])
  }

  function removeSpec(pi: number, si: number) {
    updateProduct(pi, "specs", (products[pi].specs ?? []).filter((_, idx) => idx !== si))
  }

  function addProduct() {
    setProducts([...products, { ...SP_EMPTY_PRODUCT, label: `Sekme ${products.length + 1}` }])
  }

  function removeProduct(i: number) {
    setProducts(products.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-4">
      {products.map((p, i) => (
        <SpProductItemFields
          key={i}
          index={i}
          product={p}
          onUpdate={(k, v) => updateProduct(i, k, v)}
          onUpdateFeature={(fi, k, v) => updateFeature(i, fi, k, v)}
          onAddFeature={() => addFeature(i)}
          onRemoveFeature={(fi) => removeFeature(i, fi)}
          onUpdateSpec={(si, k, v) => updateSpec(i, si, k, v)}
          onAddSpec={() => addSpec(i)}
          onRemoveSpec={(si) => removeSpec(i, si)}
          onRemoveProduct={() => removeProduct(i)}
          canRemove={products.length > 1}
        />
      ))}
      <Button variant="outline" className="w-full" onClick={addProduct}>
        <Plus className="mr-2 size-4" /> Sekme Ekle
      </Button>
    </div>
  )
}

// ==========================================
// FEATURE CAROUSEL CONFIG
// ==========================================

function FeatureCarouselConfig({
  config,
  update,
  setConfig,
}: {
  config: Record<string, unknown>
  update: (k: string, v: unknown) => void
  setConfig: (c: Record<string, unknown>) => void
}) {
  type CarouselItem = { id: string; label: string; image: string; description: string }
  const features = (config.features as CarouselItem[]) ?? []

  const addFeature = () => {
    setConfig({
      ...config,
      features: [
        ...features,
        { id: `f${Date.now()}`, label: "Yeni Özellik", image: "", description: "" },
      ],
    })
  }

  const updateFeature = (i: number, key: keyof CarouselItem, val: string) => {
    const next = features.map((f, idx) => (idx === i ? { ...f, [key]: val } : f))
    update("features", next)
  }

  const removeFeature = (i: number) => {
    update("features", features.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-4">
      <Field label="Vurgu Rengi" value={config.accentColor as string ?? "#62B2FE"} onChange={(v) => update("accentColor", v)} placeholder="#62B2FE" />
      <Field label="Otomatik Geçiş (ms)" value={String(config.autoPlayInterval ?? 3000)} onChange={(v) => update("autoPlayInterval", Number(v))} placeholder="3000" />

      <div className="space-y-3">
        <Label className="text-xs font-semibold">Özellikler</Label>
        {features.map((f, i) => (
          <div key={f.id} className="border rounded-md p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-destructive" onClick={() => removeFeature(i)}>
                <Trash2 className="size-3" />
              </Button>
            </div>
            <Field label="Etiket" value={f.label} onChange={(v) => updateFeature(i, "label", v)} />
            <Field label="Görsel URL" value={f.image} onChange={(v) => updateFeature(i, "image", v)} placeholder="https://..." />
            <Field label="Açıklama" value={f.description} onChange={(v) => updateFeature(i, "description", v)} />
          </div>
        ))}
        <Button variant="outline" className="w-full" onClick={addFeature}>
          <Plus className="mr-2 size-4" /> Özellik Ekle
        </Button>
      </div>
    </div>
  )
}

