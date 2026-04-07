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
      </CardContent>
    </Card>
  )
}

const sectionTypeLabels: Record<string, string> = {
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
      <TextareaField label="Aciklama" value={config.description as string} onChange={(v) => update("description", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA Metin" value={config.ctaText as string} onChange={(v) => update("ctaText", v)} />
        <Field label="CTA Link" value={config.ctaHref as string} onChange={(v) => update("ctaHref", v)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ikinci CTA Metin" value={config.secondaryCtaText as string} onChange={(v) => update("secondaryCtaText", v)} />
        <Field label="Ikinci CTA Link" value={config.secondaryCtaHref as string} onChange={(v) => update("secondaryCtaHref", v)} />
      </div>
      <Field label="Video URL" value={config.videoSrc as string} onChange={(v) => update("videoSrc", v)} placeholder="Video dosya yolu veya URL" />
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
              <div key={i} className="flex items-center gap-2 rounded-lg border p-3">
                <div className="flex-1 space-y-2">
                  <Input
                    value={logo.src}
                    onChange={(e) => updateLogo(i, "src", e.target.value)}
                    placeholder="Logo URL"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={logo.alt}
                      onChange={(e) => updateLogo(i, "alt", e.target.value)}
                      placeholder="Alt metin"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={logo.height || 20}
                      onChange={(e) => updateLogo(i, "height", Number(e.target.value))}
                      placeholder="Yukseklik (px)"
                      className="w-24"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeLogo(i)}
                >
                  <Trash2 className="size-4" />
                </Button>
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
      // upload failed silently
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
          <span className="text-xs">PNG, JPG, WebP, SVG (max 2MB)</span>
        </button>
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

function DarkToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Switch checked={value !== false} onCheckedChange={onChange} />
      <Label>Koyu Tema</Label>
    </div>
  )
}
