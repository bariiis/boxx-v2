import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Cpu, Server, HardDrive, Network, Zap, Shield } from "lucide-react"

const productCategories = [
  {
    title: "İş İstasyonları",
    description: "Profesyonel iş akışları için yüksek performanslı masaüstü sistemler",
    icon: Cpu,
    href: "/urunler",
  },
  {
    title: "GPU Sunucular",
    description: "Çoklu GPU ile yapay zekâ, rendering ve HPC çözümleri",
    icon: Server,
    href: "/urunler",
  },
  {
    title: "Depolama",
    description: "TrueNAS tabanlı kurumsal depolama ve yedekleme",
    icon: HardDrive,
    href: "/urunler",
  },
  {
    title: "Network",
    description: "Enterprise, data center ve HPC ağ altyapısı",
    icon: Network,
    href: "/urunler",
  },
]

const solutionHighlights = [
  { title: "Video Düzenleme", apps: "Premiere Pro · DaVinci Resolve · After Effects", href: "/cozumler/video-duzenleme" },
  { title: "3D Tasarım", apps: "Maya · Blender · Cinema 4D · Houdini", href: "/cozumler/3d-tasarim" },
  { title: "Yapay Zekâ", apps: "PyTorch · TensorFlow · CUDA · TensorRT", href: "/cozumler/ai-gelistirme" },
  { title: "Mimari & CAD", apps: "AutoCAD · Revit · SOLIDWORKS", href: "/cozumler/mimari-cad" },
  { title: "Rendering", apps: "V-Ray · Redshift · OctaneRender · KeyShot", href: "/cozumler/rendering" },
  { title: "Yaşam Bilimleri", apps: "Kriyo-EM · Genomik · Moleküler Dinamik", href: "/cozumler/yasam-bilimleri" },
]

const features = [
  { icon: Zap, title: "Yüksek Performans", description: "En son nesil işlemciler ve GPU'lar ile maksimum verimlilik" },
  { icon: Shield, title: "3 Yıl Garanti", description: "Türkiye geneli yerinde servis ve destek garantisi" },
  { icon: Cpu, title: "Özel Konfigürasyon", description: "İhtiyacınıza özel yapılandırılmış donanım çözümleri" },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Profesyoneller İçin{" "}
              <span className="text-primary">Yüksek Performanslı</span>{" "}
              İş İstasyonları
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Medya prodüksiyonundan yapay zekâya, mühendislikten bilimsel hesaplamaya —
              iş akışınıza özel yapılandırılmış donanım çözümleri.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/urunler">
                  Ürünleri İncele
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/iletisim">Uzmanla Konuş</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">Ürün Kategorileri</h2>
          <p className="mt-3 text-muted-foreground">Her iş yüküne uygun donanım çözümleri</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.map((cat) => (
            <Link key={cat.title} href={cat.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <cat.icon className="mb-4 size-10 text-primary" />
                  <h3 className="text-lg font-semibold">{cat.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{cat.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Solutions Highlights */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Çözümler</h2>
            <p className="mt-3 text-muted-foreground">Yazılımınıza özel optimize edilmiş sistemler</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solutionHighlights.map((sol) => (
              <Link key={sol.title} href={sol.href}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold">{sol.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{sol.apps}</p>
                    <span className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                      İncele <ArrowRight className="ml-1 size-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((feat) => (
            <div key={feat.title} className="text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <feat.icon className="size-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{feat.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">Projeniz İçin Doğru Sistemi Bulalım</h2>
          <p className="mt-4 text-primary-foreground/80">
            Uzman ekibimiz ihtiyacınıza en uygun konfigürasyonu belirleyecek.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/iletisim">Teklif İste</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/urunler">Konfiguratör</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
