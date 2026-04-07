export type SectionCategory =
  | "hero"
  | "features"
  | "social-proof"
  | "cta"
  | "forms"
  | "media"
  | "layout"

export const SECTION_CATEGORY_LABELS: Record<SectionCategory, string> = {
  hero: "Hero",
  features: "Özellikler",
  "social-proof": "Sosyal Kanıt",
  cta: "Çağrı (CTA)",
  forms: "Formlar",
  media: "Medya",
  layout: "Düzen",
}

export type SectionTypeInfo = {
  type: string
  label: string
  description: string
  category?: SectionCategory
  defaultConfig: Record<string, unknown>
}

export function getCategoryForType(type: string): SectionCategory {
  return CATEGORY_MAP[type] || "layout"
}

// Centralized category mapping — keep entries minimal in getSectionTypes()
const CATEGORY_MAP: Record<string, SectionCategory> = {
  // Hero
  "hero-statement": "hero",
  "hero-shade": "hero",
  "hero-audio-reactive": "hero",
  "hero-video": "hero",
  "hero-gradient": "hero",
  "main-hero": "hero",
  // Features
  "feature-storytelling": "features",
  "features-block": "features",
  "feature-grid": "features",
  "tech-specs": "features",
  "image-text-split": "features",
  "saaspo-feature-linear": "features",
  "stats-counter": "features",
  // Social Proof
  "logo-cloud": "social-proof",
  "testimonials-v2": "social-proof",
  "urunler-slide": "social-proof",
  // CTA
  "purchase-cta": "cta",
  "cta-banner": "cta",
  "cta-illustration": "cta",
  "pricing-table": "cta",
  // Forms
  "contact-form": "forms",
  "faq-accordion": "forms",
  // Media
  "full-bleed-media": "media",
  // Layout
  "bento-grid": "layout",
  "bento-box": "layout",
}

export function getSectionTypes(): SectionTypeInfo[] {
  return [
    {
      type: "hero-statement",
      label: "Hero Statement",
      description: "Dev tipografi, animasyonlu ana başlık",
      defaultConfig: {
        headline: "Başlık Buraya",
        subheadline: "",
        description: "",
        ctaText: "Teklif İste",
        ctaHref: "/iletisim",
        secondaryCtaText: "",
        secondaryCtaHref: "",
        image: "",
        dark: true,
      },
    },
    {
      type: "hero-audio-reactive",
      label: "Hero Audio Reactive",
      description: "Canvas dalga animasyonu, müzik reaktif, film grain efektli",
      defaultConfig: {
        tagline: "",
        headline: "Başlık Buraya",
        headlineSecondLine: "",
        subtitle: "",
        creditText: "",
        audioSrc: "",
        dark: true,
      },
    },
    {
      type: "hero-shade",
      label: "Hero Shade",
      description: "Gradient glow + BorderBeam animasyonlu hero, görsel kartlı",
      defaultConfig: {
        headline: "Başlık Buraya",
        description: "",
        ctaText: "Teklif İste",
        ctaHref: "/iletisim",
        secondaryCtaText: "",
        secondaryCtaHref: "",
        image: "",
        imageAlt: "",
        beamColorFrom: "#ffaa40",
        beamColorTo: "#9c40ff",
        dark: true,
      },
    },
    {
      type: "hero-video",
      label: "Hero Video",
      description: "Arka plan videolu hero, logo banner ile",
      defaultConfig: {
        headline: "Başlık Buraya",
        description: "",
        ctaText: "Teklif İste",
        ctaHref: "/iletisim",
        secondaryCtaText: "",
        secondaryCtaHref: "",
        videoSrc: "",
        height: "large",
        showLogoBanner: false,
        logoBannerText: "En iyi ekiplerin tercihi",
        logos: [],
        dark: true,
      },
    },
    {
      type: "feature-storytelling",
      label: "Feature Storytelling",
      description: "Başlık + açıklama + büyük görsel (sağ-sol layout)",
      defaultConfig: {
        label: "",
        headline: "Özellik Başlığı",
        description: "",
        image: "",
        reverse: false,
        dark: true,
      },
    },
    {
      type: "features-block",
      label: "Features Block",
      description: "Başlık + marquee etiketler + 4 özellik kartı, dashed border",
      defaultConfig: {
        headline: "Neden Bizi Tercih Etmelisiniz?",
        description: "",
        marqueeItems: [],
        features: [
          { title: "Özellik 1", description: "Açıklama", icon: "zap" },
          { title: "Özellik 2", description: "Açıklama", icon: "target" },
          { title: "Özellik 3", description: "Açıklama", icon: "shield" },
          { title: "Özellik 4", description: "Açıklama", icon: "heart" },
        ],
        dark: true,
      },
    },
    {
      type: "feature-grid",
      label: "Feature Grid",
      description: "2x2 veya 3x3 border-based özellik kartları",
      defaultConfig: {
        headline: "",
        columns: 2,
        items: [
          { title: "Özellik 1", description: "Açıklama", icon: "" },
          { title: "Özellik 2", description: "Açıklama", icon: "" },
          { title: "Özellik 3", description: "Açıklama", icon: "" },
          { title: "Özellik 4", description: "Açıklama", icon: "" },
        ],
        dark: true,
      },
    },
    {
      type: "full-bleed-media",
      label: "Full-Bleed Media",
      description: "Tam genişlik görsel veya video, parallax efekti",
      defaultConfig: {
        image: "",
        video: "",
        alt: "",
        caption: "",
        aspectRatio: "video",
        parallax: true,
        dark: true,
      },
    },
    {
      type: "tech-specs",
      label: "Tech Specs",
      description: "Gruplu teknik özellik tabloları",
      defaultConfig: {
        headline: "Teknik Özellikler",
        description: "",
        groups: [
          {
            title: "Genel",
            specs: [
              { label: "Özellik", value: "Değer" },
            ],
          },
        ],
        dark: true,
      },
    },
    {
      type: "purchase-cta",
      label: "Purchase CTA",
      description: "Fiyat + CTA butonları, vurgulu section",
      defaultConfig: {
        headline: "Hemen Sipariş Verin",
        description: "",
        price: "",
        priceNote: "",
        ctaText: "Teklif İste",
        ctaHref: "/iletisim",
        secondaryCtaText: "",
        secondaryCtaHref: "",
        dark: true,
      },
    },
    {
      type: "bento-grid",
      label: "Bento Grid (Animated)",
      description: "6 slotlu animasyonlu bento grid, istatistik ve özellik kartları",
      defaultConfig: {
        headline: "",
        subheadline: "",
        items: [
          { title: "Özellik 1", description: "Açıklama", stat: "", badge: "", image: "" },
          { title: "Özellik 2", description: "Açıklama", stat: "", badge: "", image: "" },
          { title: "", description: "", stat: "10X", badge: "", image: "" },
          { title: "Özellik 4", description: "Açıklama", stat: "42%", badge: "Yeni", image: "" },
          { title: "Özellik 5", description: "Açıklama", stat: "", badge: "", image: "" },
          { title: "Özellik 6", description: "Geniş alt kart açıklaması", stat: "", badge: "", image: "" },
        ],
        dark: true,
      },
    },
    {
      type: "bento-box",
      label: "Bento Box",
      description: "Harita, mesaj, istatistik ve grafik grid'i",
      defaultConfig: {
        topLeftLabel: "Gerçek zamanlı konum takibi",
        topLeftDescription: "Gelişmiş takip sistemi ile tüm varlıklarınızı anında bulun.",
        topLeftMapBadge: "Son bağlantı: Türkiye",
        topRightLabel: "E-posta ve web destek",
        topRightDescription: "İhtiyacınız olan yardım için e-posta veya web üzerinden bize ulaşın.",
        centerStat: "%99.99 Çalışma Süresi",
        bottomLabel: "Aktivite akışı",
        bottomDescription: "Uygulamanızın aktivitesini gerçek zamanlı izleyin.",
        dark: true,
      },
    },
    {
      type: "logo-cloud",
      label: "Logo Cloud",
      description: "Sonsuz kayan logo şeridi, mask gradient efektli",
      defaultConfig: {
        headline: "",
        subheadline: "",
        logos: [],
        speed: 80,
        reverse: false,
        dark: true,
      },
    },
    {
      type: "saaspo-feature-linear",
      label: "Saaspo Feature (Linear)",
      description: "Linear tarzi timeline + proje kartlari + ozellik grid'i",
      defaultConfig: {
        badge: "Project and long-term planning",
        title: "Set the product direction",
        description: "Align your team around a unified product timeline. Plan, manage, and track all product initiatives with Linear's visual planning tools.",
      },
    },
    {
      type: "stats-counter",
      label: "Stats Counter",
      description: "Vurgulu büyük rakamlar, 2-4 sütun",
      defaultConfig: {
        headline: "",
        description: "",
        stats: [
          { value: "500+", label: "Teslim Edilen Sistem" },
          { value: "200+", label: "Mutlu Müşteri" },
          { value: "10+", label: "Yıllık Deneyim" },
          { value: "3 Yıl", label: "Garanti" },
        ],
        dark: false,
      },
    },
    {
      type: "faq-accordion",
      label: "FAQ Accordion",
      description: "Sıkça sorulan sorular, tıklayınca açılan",
      defaultConfig: {
        headline: "Sıkça Sorulan Sorular",
        description: "",
        items: [
          { question: "Soru 1", answer: "Cevap 1" },
          { question: "Soru 2", answer: "Cevap 2" },
          { question: "Soru 3", answer: "Cevap 3" },
        ],
        dark: false,
      },
    },
    {
      type: "contact-form",
      label: "İletişim Formu",
      description: "Tam fonksiyonel iletişim formu (CRM'e ticket olarak düşer)",
      defaultConfig: {
        headline: "İletişim",
        description: "Sorularınız ve teklif talepleriniz için bizimle iletişime geçin.",
        email: "info@stuux.com",
        phone: "",
        address: "",
        categories: ["Teklif İste", "Genel Bilgi", "Teknik Destek", "İş Ortaklığı", "Diğer"],
        dark: false,
      },
    },
    {
      type: "pricing-table",
      label: "Pricing Table",
      description: "3 sütunlu fiyatlandırma kartları, vurgulanmış plan ile",
      defaultConfig: {
        headline: "Fiyatlandırma",
        description: "İhtiyacınıza uygun planı seçin",
        plans: [
          {
            name: "Başlangıç",
            price: "₺X",
            priceNote: "/aylık",
            description: "Küçük ekipler için",
            features: ["Özellik 1", "Özellik 2", "Özellik 3"],
            ctaText: "Başla",
            ctaHref: "/iletisim",
            highlighted: false,
          },
          {
            name: "Profesyonel",
            price: "₺Y",
            priceNote: "/aylık",
            description: "Büyüyen işletmeler için",
            features: ["Tüm Başlangıç özellikleri", "Özellik 4", "Özellik 5", "Özellik 6"],
            ctaText: "Başla",
            ctaHref: "/iletisim",
            highlighted: true,
          },
          {
            name: "Kurumsal",
            price: "Özel",
            priceNote: "",
            description: "Büyük organizasyonlar için",
            features: ["Tüm Profesyonel özellikleri", "Özel destek", "SLA garantisi"],
            ctaText: "İletişime Geç",
            ctaHref: "/iletisim",
            highlighted: false,
          },
        ],
        dark: false,
      },
    },
    {
      type: "image-text-split",
      label: "Image + Text Split",
      description: "İki sütun: görsel + başlık/açıklama/bullet/CTA",
      defaultConfig: {
        label: "",
        headline: "Başlık",
        description: "",
        bullets: [],
        image: "",
        imageAlt: "",
        ctaText: "",
        ctaHref: "",
        reverse: false,
        dark: false,
      },
    },
    {
      type: "cta-banner",
      label: "CTA Banner",
      description: "Vurgulu çağrı bandı, gradient/solid/minimal varyantlı",
      defaultConfig: {
        headline: "Hemen Başlayın",
        description: "",
        ctaText: "Teklif İste",
        ctaHref: "/iletisim",
        secondaryCtaText: "",
        secondaryCtaHref: "",
        variant: "gradient",
      },
    },
    {
      type: "hero-gradient",
      label: "Hero Gradient",
      description: "Animasyonlu gradient blob, grid overlay, vurgulu başlık, modern hero",
      defaultConfig: {
        badge: "",
        headline: "Profesyoneller İçin",
        highlight: "Yüksek Performans",
        description: "İhtiyacınıza özel donanım çözümleri.",
        ctaText: "Ürünleri İncele",
        ctaHref: "/urunler",
        secondaryCtaText: "Uzmanla Konuş",
        secondaryCtaHref: "/iletisim",
        image: "",
      },
    },
    {
      type: "main-hero",
      label: "Main Hero",
      description: "Tam ekran fade slideshow, çift satır başlık ve sayaç",
      defaultConfig: {
        slides: [
          { img: "", line1: "BAŞLIK", line2: "İKİNCİ SATIR" },
          { img: "", line1: "BAŞLIK 2", line2: "İKİNCİ SATIR" },
          { img: "", line1: "BAŞLIK 3", line2: "İKİNCİ SATIR" },
        ],
      },
    },
    {
      type: "testimonials-v2",
      label: "Testimonials V2",
      description: "3 kolonlu dikey kayan müşteri yorumları, framer-motion animasyonlu",
      defaultConfig: {
        badge: "Yorumlar",
        headline: "Kullanıcılarımız ne diyor?",
        description: "Ekiplerin platformumuzla operasyonlarını nasıl kolaylaştırdığını keşfedin.",
        testimonials: [
          { text: "", image: "", name: "", role: "" },
          { text: "", image: "", name: "", role: "" },
          { text: "", image: "", name: "", role: "" },
        ],
        dark: false,
      },
    },
    {
      type: "urunler-slide",
      label: "Ürünler Slide",
      description: "Marquee ürün/üye kartları, başlık ve opsiyonel testimonial",
      defaultConfig: {
        headline: "Ürünlerimiz",
        description: "",
        members: [
          { image: "", name: "Ürün 1", role: "Açıklama" },
          { image: "", name: "Ürün 2", role: "Açıklama" },
          { image: "", name: "Ürün 3", role: "Açıklama" },
          { image: "", name: "Ürün 4", role: "Açıklama" },
        ],
        testimonial: "",
        testimonialName: "",
        testimonialRole: "",
        testimonialImage: "",
        dark: false,
      },
    },
    {
      type: "cta-illustration",
      label: "CTA Illustration",
      description: "Görsel + başlık + açıklama + CTA buton, ortalanmış",
      defaultConfig: {
        headline: "Hemen Başlayın",
        description: "",
        ctaText: "Teklif İste",
        ctaHref: "/iletisim",
        image: "",
        imageAlt: "",
        dark: true,
      },
    },
  ]
}
