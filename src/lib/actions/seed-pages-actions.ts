"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface SeedPageDef {
  slug: string
  title: string
  description: string
  sections: { type: string; config: Record<string, unknown> }[]
}

const PAGES: SeedPageDef[] = [
  {
    slug: "home",
    title: "Anasayfa",
    description: "STUUX - Profesyoneller için yüksek performanslı iş istasyonları",
    sections: [
      {
        type: "hero-statement",
        config: {
          subheadline: "STUUX",
          headline: "Profesyoneller İçin Yüksek Performanslı İş İstasyonları",
          description:
            "Medya prodüksiyonundan yapay zekâya, mühendislikten bilimsel hesaplamaya — iş akışınıza özel yapılandırılmış donanım çözümleri.",
          ctaText: "Ürünleri İncele",
          ctaHref: "/urunler",
          secondaryCtaText: "Uzmanla Konuş",
          secondaryCtaHref: "/iletisim",
          dark: false,
        },
      },
      {
        type: "feature-grid",
        config: {
          headline: "Ürün Kategorileri",
          columns: 2,
          items: [
            { title: "İş İstasyonları", description: "Profesyonel iş akışları için yüksek performanslı masaüstü sistemler", icon: "cpu" },
            { title: "GPU Sunucular", description: "Çoklu GPU ile yapay zekâ, rendering ve HPC çözümleri", icon: "server" },
            { title: "Depolama", description: "TrueNAS tabanlı kurumsal depolama ve yedekleme", icon: "hard-drive" },
            { title: "Network", description: "Enterprise, data center ve HPC ağ altyapısı", icon: "network" },
          ],
          dark: false,
        },
      },
      {
        type: "feature-grid",
        config: {
          headline: "Çözümler",
          columns: 3,
          items: [
            { title: "Video Düzenleme", description: "Premiere Pro · DaVinci Resolve · After Effects", icon: "" },
            { title: "3D Tasarım", description: "Maya · Blender · Cinema 4D · Houdini", icon: "" },
            { title: "Yapay Zekâ", description: "PyTorch · TensorFlow · CUDA · TensorRT", icon: "" },
            { title: "Mimari & CAD", description: "AutoCAD · Revit · SOLIDWORKS", icon: "" },
            { title: "Rendering", description: "V-Ray · Redshift · OctaneRender · KeyShot", icon: "" },
            { title: "Yaşam Bilimleri", description: "Kriyo-EM · Genomik · Moleküler Dinamik", icon: "" },
          ],
          dark: false,
        },
      },
      {
        type: "features-block",
        config: {
          headline: "Neden STUUX?",
          description: "",
          marqueeItems: [],
          features: [
            { title: "Yüksek Performans", description: "En son nesil işlemciler ve GPU'lar ile maksimum verimlilik", icon: "zap" },
            { title: "3 Yıl Garanti", description: "Türkiye geneli yerinde servis ve destek garantisi", icon: "shield" },
            { title: "Özel Konfigürasyon", description: "İhtiyacınıza özel yapılandırılmış donanım çözümleri", icon: "cpu" },
            { title: "Uzman Destek", description: "Satış öncesi danışmanlıktan satış sonrası desteğe", icon: "heart" },
          ],
          dark: false,
        },
      },
      {
        type: "cta-illustration",
        config: {
          headline: "Projeniz İçin Doğru Sistemi Bulalım",
          description: "Uzman ekibimiz ihtiyacınıza en uygun konfigürasyonu belirleyecek.",
          ctaText: "Teklif İste",
          ctaHref: "/iletisim",
          image: "",
          imageAlt: "",
          dark: true,
        },
      },
    ],
  },
  {
    slug: "hakkimizda",
    title: "Hakkımızda",
    description: "STUUX hakkında",
    sections: [
      {
        type: "hero-statement",
        config: {
          headline: "Hakkımızda",
          description:
            "STUUX olarak profesyoneller için yüksek performanslı iş istasyonları, GPU sunucuları ve depolama çözümleri tasarlıyor ve üretiyoruz. Medya prodüksiyonundan yapay zekâya, mühendislikten bilimsel araştırmaya kadar geniş bir yelpazede hizmet veriyoruz.",
          dark: false,
        },
      },
      {
        type: "stats-counter",
        config: {
          headline: "Rakamlarla STUUX",
          description: "",
          stats: [
            { value: "500+", label: "Teslim Edilen Sistem" },
            { value: "200+", label: "Mutlu Müşteri" },
            { value: "10+", label: "Yıllık Deneyim" },
            { value: "3 Yıl", label: "Türkiye Garanti" },
          ],
          dark: false,
        },
      },
      {
        type: "features-block",
        config: {
          headline: "Değerlerimiz",
          description: "",
          marqueeItems: [],
          features: [
            { title: "Güvenilirlik", description: "7/24 çalışacak şekilde tasarlanmış, stres testinden geçirilmiş sistemler.", icon: "shield" },
            { title: "Kalite", description: "Sadece en kaliteli komponentler ve ISV sertifikalı donanımlar.", icon: "target" },
            { title: "Uzman Destek", description: "Satış öncesi danışmanlıktan satış sonrası desteğe tam hizmet.", icon: "heart" },
            { title: "Türkiye Odaklı", description: "Yerli üretim, Türkçe destek, hızlı teslimat.", icon: "zap" },
          ],
          dark: false,
        },
      },
    ],
  },
  {
    slug: "iletisim",
    title: "İletişim",
    description: "Bizimle iletişime geçin",
    sections: [
      {
        type: "contact-form",
        config: {
          headline: "İletişim",
          description:
            "Sorularınız, teklif talepleriniz veya teknik destek için bizimle iletişime geçin. Uzman ekibimiz size en kısa sürede dönüş yapacaktır.",
          email: "info@stuux.com",
          phone: "",
          address: "",
          categories: ["Teklif İste", "Genel Bilgi", "Teknik Destek", "İş Ortaklığı", "Kariyer", "Diğer"],
          dark: false,
        },
      },
    ],
  },
  // cozumler → kept as functional code page (dynamic catalog).
  // Migrate when "solutions-listing" section type is added.
]

export async function seedStaticPages(overwrite = false) {
  const created: string[] = []
  const skipped: string[] = []

  for (const page of PAGES) {
    const existing = await db.landingPage.findUnique({ where: { slug: page.slug } })

    if (existing && !overwrite) {
      skipped.push(page.slug)
      continue
    }

    if (existing && overwrite) {
      await db.landingSection.deleteMany({ where: { landingPageId: existing.id } })
      await db.landingPage.update({
        where: { id: existing.id },
        data: { title: page.title, description: page.description, isActive: true },
      })
      for (let i = 0; i < page.sections.length; i++) {
        const s = page.sections[i]
        await db.landingSection.create({
          data: {
            landingPageId: existing.id,
            sectionType: s.type,
            config: JSON.stringify(s.config),
            sortOrder: i,
          },
        })
      }
      created.push(`${page.slug} (overwritten)`)
    } else {
      const landing = await db.landingPage.create({
        data: {
          slug: page.slug,
          title: page.title,
          description: page.description,
          isActive: true,
        },
      })
      for (let i = 0; i < page.sections.length; i++) {
        const s = page.sections[i]
        await db.landingSection.create({
          data: {
            landingPageId: landing.id,
            sectionType: s.type,
            config: JSON.stringify(s.config),
            sortOrder: i,
          },
        })
      }
      created.push(page.slug)
    }
  }

  revalidatePath("/admin/landing-pages")
  revalidatePath("/")
  return { created, skipped }
}
