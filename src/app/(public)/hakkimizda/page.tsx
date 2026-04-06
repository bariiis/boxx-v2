import { Card, CardContent } from "@/components/ui/card"
import { Shield, Award, Users, Globe } from "lucide-react"

const stats = [
  { label: "Teslim Edilen Sistem", value: "500+" },
  { label: "Mutlu Müşteri", value: "200+" },
  { label: "Yıllık Deneyim", value: "10+" },
  { label: "Türkiye Garanti", value: "3 Yıl" },
]

const values = [
  { icon: Shield, title: "Güvenilirlik", description: "7/24 çalışacak şekilde tasarlanmış, stres testinden geçirilmiş sistemler." },
  { icon: Award, title: "Kalite", description: "Sadece en kaliteli komponentler ve ISV sertifikalı donanımlar." },
  { icon: Users, title: "Uzman Destek", description: "Satış öncesi danışmanlıktan satış sonrası desteğe tam hizmet." },
  { icon: Globe, title: "Türkiye Odaklı", description: "Yerli üretim, Türkçe destek, hızlı teslimat." },
]

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold sm:text-4xl">Hakkımızda</h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              STUUX olarak profesyoneller için yüksek performanslı iş istasyonları, GPU sunucuları
              ve depolama çözümleri tasarlıyor ve üretiyoruz. Medya prodüksiyonundan yapay zekâya,
              mühendislikten bilimsel araştırmaya kadar geniş bir yelpazede hizmet veriyoruz.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold">Değerlerimiz</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((val) => (
              <Card key={val.title}>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <val.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{val.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{val.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
