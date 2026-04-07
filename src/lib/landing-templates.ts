export interface LandingTemplate {
  id: string
  name: string
  description: string
  sections: { type: string; config: Record<string, unknown> }[]
}

export function getLandingTemplates(): LandingTemplate[] {
  return [
    {
      id: "blank",
      name: "Boş Sayfa",
      description: "Sıfırdan başla, section'ları sen ekle",
      sections: [],
    },
    {
      id: "product-landing",
      name: "Ürün Landing",
      description: "Hero + özellikler + teknik detaylar + fiyat + CTA",
      sections: [
        {
          type: "hero-shade",
          config: {
            headline: "Ürün Adı",
            description: "Ürünün kısa açıklaması.",
            ctaText: "Teklif İste",
            ctaHref: "/iletisim",
            secondaryCtaText: "Detaylar",
            secondaryCtaHref: "#features",
            image: "",
            imageAlt: "",
            beamColorFrom: "#3b82f6",
            beamColorTo: "#8b5cf6",
            dark: true,
          },
        },
        {
          type: "features-block",
          config: {
            headline: "Neden Bu Ürün?",
            description: "",
            marqueeItems: [],
            features: [
              { title: "Özellik 1", description: "Açıklama", icon: "zap" },
              { title: "Özellik 2", description: "Açıklama", icon: "shield" },
              { title: "Özellik 3", description: "Açıklama", icon: "target" },
              { title: "Özellik 4", description: "Açıklama", icon: "heart" },
            ],
            dark: false,
          },
        },
        {
          type: "tech-specs",
          config: {
            headline: "Teknik Özellikler",
            description: "",
            groups: [
              {
                title: "Genel",
                specs: [
                  { label: "Boyut", value: "—" },
                  { label: "Ağırlık", value: "—" },
                ],
              },
            ],
            dark: false,
          },
        },
        {
          type: "purchase-cta",
          config: {
            headline: "Hemen Sipariş Verin",
            description: "",
            price: "₺—",
            priceNote: "",
            ctaText: "Teklif İste",
            ctaHref: "/iletisim",
            dark: true,
          },
        },
      ],
    },
    {
      id: "about-page",
      name: "Hakkımızda",
      description: "Hero + istatistikler + değerler + CTA",
      sections: [
        {
          type: "hero-statement",
          config: {
            headline: "Hakkımızda",
            description: "Şirket kısa tanıtımı buraya gelecek.",
            dark: false,
          },
        },
        {
          type: "stats-counter",
          config: {
            headline: "Rakamlarla Biz",
            stats: [
              { value: "500+", label: "Müşteri" },
              { value: "10+", label: "Yıllık Deneyim" },
              { value: "100+", label: "Proje" },
              { value: "24/7", label: "Destek" },
            ],
            dark: false,
          },
        },
        {
          type: "features-block",
          config: {
            headline: "Değerlerimiz",
            features: [
              { title: "Güven", description: "", icon: "shield" },
              { title: "Kalite", description: "", icon: "target" },
              { title: "İnovasyon", description: "", icon: "zap" },
              { title: "Müşteri Odaklı", description: "", icon: "heart" },
            ],
            marqueeItems: [],
            dark: false,
          },
        },
        {
          type: "cta-banner",
          config: {
            headline: "Birlikte Çalışalım",
            description: "Projeniz için bizimle iletişime geçin.",
            ctaText: "İletişim",
            ctaHref: "/iletisim",
            variant: "gradient",
          },
        },
      ],
    },
    {
      id: "pricing-page",
      name: "Fiyatlandırma",
      description: "Hero + plan kartları + SSS + CTA",
      sections: [
        {
          type: "hero-gradient",
          config: {
            badge: "Fiyatlandırma",
            headline: "Size Uygun Planı",
            highlight: "Seçin",
            description: "Esnek planlar, ihtiyacınıza göre özel paketler.",
            ctaText: "Planları İncele",
            ctaHref: "#plans",
            secondaryCtaText: "",
            secondaryCtaHref: "",
          },
        },
        {
          type: "pricing-table",
          config: {
            headline: "Planlar",
            description: "",
            plans: [
              {
                name: "Başlangıç",
                price: "₺X",
                priceNote: "/aylık",
                description: "Küçük ekipler",
                features: ["Özellik 1", "Özellik 2", "Özellik 3"],
                ctaText: "Başla",
                ctaHref: "/iletisim",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "₺Y",
                priceNote: "/aylık",
                description: "Büyüyen işletmeler",
                features: ["Tüm Başlangıç", "Özellik 4", "Özellik 5", "Özellik 6"],
                ctaText: "Başla",
                ctaHref: "/iletisim",
                highlighted: true,
              },
              {
                name: "Kurumsal",
                price: "Özel",
                priceNote: "",
                description: "Büyük organizasyonlar",
                features: ["Tüm Pro", "SLA", "Özel destek"],
                ctaText: "İletişime Geç",
                ctaHref: "/iletisim",
                highlighted: false,
              },
            ],
            dark: false,
          },
        },
        {
          type: "faq-accordion",
          config: {
            headline: "Sıkça Sorulan Sorular",
            items: [
              { question: "Nasıl başlarım?", answer: "..." },
              { question: "İptal edebilir miyim?", answer: "..." },
              { question: "Hangi ödeme yöntemleri var?", answer: "..." },
            ],
            dark: false,
          },
        },
        {
          type: "cta-banner",
          config: {
            headline: "Hemen Başlayın",
            description: "14 gün ücretsiz deneme",
            ctaText: "Başla",
            ctaHref: "/iletisim",
            variant: "gradient",
          },
        },
      ],
    },
    {
      id: "contact-page",
      name: "İletişim",
      description: "İletişim formu sayfası (CRM'e ticket düşer)",
      sections: [
        {
          type: "contact-form",
          config: {
            headline: "İletişim",
            description: "Sorularınız ve teklif talepleriniz için.",
            email: "info@stuux.com",
            phone: "",
            address: "",
            categories: ["Teklif İste", "Genel Bilgi", "Teknik Destek", "İş Ortaklığı"],
            dark: false,
          },
        },
      ],
    },
    {
      id: "solution-page",
      name: "Çözüm Sayfası",
      description: "Hero + image-text + grid + sosyal kanıt + CTA",
      sections: [
        {
          type: "hero-gradient",
          config: {
            headline: "Çözüm Adı",
            highlight: "Net Sonuçlar",
            description: "İş yükünüze özel optimize edilmiş çözüm.",
            ctaText: "Demo İste",
            ctaHref: "/iletisim",
            secondaryCtaText: "Detaylar",
            secondaryCtaHref: "#features",
          },
        },
        {
          type: "image-text-split",
          config: {
            label: "Özellik",
            headline: "Bu Çözüm Ne İşe Yarar?",
            description: "Detaylı açıklama buraya gelecek.",
            bullets: ["Avantaj 1", "Avantaj 2", "Avantaj 3"],
            image: "",
            imageAlt: "",
            ctaText: "",
            ctaHref: "",
            reverse: false,
            dark: false,
          },
        },
        {
          type: "feature-grid",
          config: {
            headline: "Kullanım Alanları",
            columns: 3,
            items: [
              { title: "Alan 1", description: "", icon: "" },
              { title: "Alan 2", description: "", icon: "" },
              { title: "Alan 3", description: "", icon: "" },
            ],
            dark: false,
          },
        },
        {
          type: "testimonials-v2",
          config: {
            badge: "Müşteri Görüşleri",
            headline: "Müşterilerimiz Ne Diyor?",
            description: "",
            testimonials: [],
            dark: false,
          },
        },
        {
          type: "cta-banner",
          config: {
            headline: "Çözümü Deneyin",
            description: "",
            ctaText: "Demo İste",
            ctaHref: "/iletisim",
            variant: "gradient",
          },
        },
      ],
    },
  ]
}
