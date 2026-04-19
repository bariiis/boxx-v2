import sampleData from "@/components/public/home/sample-data.json"

export interface HomeV2HeroData {
  eyebrow: string
  title: string
  subtitle: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}

export interface HomeV2Metric {
  value: string
  label: string
}

export interface HomeV2Product {
  id: string
  slug: string
  name: string
  tagline: string
  specs: string[]
  priceLabel: string
  accent: "orange" | "cyan"
  image?: string
  badge?: string
}

export interface HomeV2Solution {
  id: string
  slug: string
  title: string
  description: string
  useCases: string[]
  accent: "orange" | "cyan"
}

export interface HomeV2BentoTile {
  id: string
  title: string
  description: string
  icon: "shield" | "headset" | "wrench" | "chart" | "file" | "boxes"
  size: "lg" | "md" | "sm"
}

export interface HomeV2BenchmarkRow {
  label: string
  value: number
  unit: string
  comparison: number
}

export interface HomeV2Category {
  slug: string
  title: string
  description: string
  icon: "boxes" | "server" | "harddrive" | "network"
}

export interface HomeV2Data {
  hero: HomeV2HeroData
  tickerMetrics: HomeV2Metric[]
  featuredProducts: HomeV2Product[]
  solutions: HomeV2Solution[]
  bentoTiles: HomeV2BentoTile[]
  benchmark: { title: string; subtitle: string; rows: HomeV2BenchmarkRow[] }
  logos: { name: string; src: string }[]
  testimonial: { quote: string; author: string; role: string; company: string }
  categories: HomeV2Category[]
  closingCta: { title: string; subtitle: string; primary: { label: string; href: string }; secondary: { label: string; href: string } }
}

const sourceProducts = ((sampleData as { featuredProducts?: Array<Record<string, unknown>> }).featuredProducts ?? [])
const sourceLogos = ((sampleData as { customerLogos?: Array<Record<string, unknown>> }).customerLogos ?? [])

export const homeV2Data: HomeV2Data = {
  hero: {
    eyebrow: "BOXX — Custom workstation & GPU server",
    title: "AI, render ve simülasyon için\nüretim hattından çıkan güç.",
    subtitle:
      "Türkiye'de özel üretim. Benchmark'lanmış. Yerinde destek. BOXX her bir makineyi iş yüküne göre yapılandırır.",
    primaryCta: { label: "Sistemini yapılandır", href: "/urunler" },
    secondaryCta: { label: "Uzmanla görüş", href: "/destek" },
  },
  tickerMetrics: [
    { value: "847", label: "Aktif sistem" },
    { value: "99.8%", label: "Uptime" },
    { value: "14 ay", label: "Ortalama ROI" },
    { value: "24 saat", label: "Yerinde destek" },
    { value: "3 yıl", label: "Donanım garantisi" },
  ],
  featuredProducts: sourceProducts.slice(0, 5).map((p, i) => ({
    id: String(p.id ?? `product-${i}`),
    slug: String(p.slug ?? ""),
    name: String(p.name ?? ""),
    tagline: String(p.tagline ?? ""),
    specs: Array.isArray(p.specs) ? (p.specs as string[]) : [],
    priceLabel: String(p.priceLabel ?? ""),
    accent: i === 0 ? "orange" : "cyan",
    image: typeof p.image === "string" ? p.image : undefined,
    badge: i === 0 ? "Yeni" : undefined,
  })),
  solutions: [
    {
      id: "ai",
      slug: "ai-training",
      title: "AI eğitim & inference",
      description:
        "Multi-GPU sistemler, NVLink hazır iskelet, büyük model eğitimi için bellek bandwidth odaklı yapılandırma.",
      useCases: ["LLM fine-tune", "Stable Diffusion pipeline", "Computer vision"],
      accent: "orange",
    },
    {
      id: "render",
      slug: "render-farm",
      title: "Render farm",
      description:
        "V-Ray, Redshift, Octane için sertifikalı GPU havuzları. Öğrenme eğrisi yok, ilk gün produksiyona girer.",
      useCases: ["Mimari görselleştirme", "VFX", "Arch-viz"],
      accent: "cyan",
    },
    {
      id: "cad",
      slug: "cad-simulasyon",
      title: "CAD & simülasyon",
      description:
        "Tek-thread hızı yüksek CPU + ISV sertifikalı GPU. ANSYS, SolidWorks, CATIA için hazır profiller.",
      useCases: ["Mekanik tasarım", "CFD", "FEA"],
      accent: "orange",
    },
    {
      id: "datacenter",
      slug: "veri-merkezi",
      title: "Veri merkezi",
      description:
        "Redundant PSU, hot-swap storage, IPMI. Rack-ready, ön-yapılandırılmış gelir, tek kabloyla açılır.",
      useCases: ["On-prem inference", "Private cloud", "Backup & replica"],
      accent: "cyan",
    },
  ],
  bentoTiles: [
    { id: "warranty", title: "3 yıl donanım garantisi", description: "Tüm sistemlerde yerinde parça + işçilik.", icon: "shield", size: "lg" },
    { id: "support", title: "Türkiye destek hattı", description: "Gerçek mühendislerle 09:00-21:00 canlı destek.", icon: "headset", size: "md" },
    { id: "custom", title: "Özel üretim", description: "Hazır reçete yok. Her sistem iş yüküne göre.", icon: "wrench", size: "md" },
    { id: "bench", title: "Benchmark'lı teslim", description: "Her makine ayrı performans raporu ile gelir.", icon: "chart", size: "md" },
    { id: "case", title: "Başarı hikayeleri", description: "Türkiye'nin önde gelen ajans ve araştırma laboratuvarları.", icon: "file", size: "sm" },
    { id: "catalog", title: "Parça kataloğu", description: "Yedek parça ve yükseltme stoğu bizde.", icon: "boxes", size: "sm" },
  ],
  benchmark: {
    title: "Benchmark: BOXX vs. standart workstation",
    subtitle: "4K render süresi, saniye (Blender Classroom sahnesi, V-Ray 6).",
    rows: [
      { label: "BOXX APEXX W4L", value: 42, unit: "sn", comparison: 182 },
      { label: "BOXX APEXX T4", value: 58, unit: "sn", comparison: 182 },
      { label: "Standart workstation", value: 182, unit: "sn", comparison: 182 },
    ],
  },
  logos: sourceLogos.slice(0, 8).map((l) => ({
    name: String(l.name ?? ""),
    src: typeof l.logoUrl === "string" ? l.logoUrl : "",
  })),
  testimonial: {
    quote:
      "Render süremiz beş kat düştü, proje teslim takvimini yeniden yazdık. Kurulum, benchmark, destek — üç günde canlıydık.",
    author: "Ahmet Yıldız",
    role: "Teknoloji Direktörü",
    company: "Nova VFX",
  },
  categories: [
    { slug: "workstation", title: "Workstation", description: "Masaüstü iş istasyonları", icon: "boxes" },
    { slug: "gpu-server", title: "GPU Server", description: "Multi-GPU rack sistemler", icon: "server" },
    { slug: "storage", title: "Storage", description: "NAS, SAN, hyper-converged", icon: "harddrive" },
    { slug: "networking", title: "Networking", description: "25/40/100 GbE switch", icon: "network" },
  ],
  closingCta: {
    title: "İş yüküne göre yapılandırılmış bir sistem için hazırız.",
    subtitle: "İki dakikalık formu doldur, mühendis ekibi 24 saat içinde geri döner.",
    primary: { label: "Yapılandırmaya başla", href: "/urunler" },
    secondary: { label: "Satış ekibiyle görüş", href: "/destek" },
  },
}
