import Link from "next/link"

const footerLinks = [
  {
    title: "Ürünler",
    links: [
      { label: "İş İstasyonları", href: "/urunler" },
      { label: "GPU Sunucular", href: "/urunler" },
      { label: "Depolama", href: "/urunler" },
      { label: "Network", href: "/urunler" },
    ],
  },
  {
    title: "Çözümler",
    links: [
      { label: "Medya ve Eğlence", href: "/cozumler/video-duzenleme" },
      { label: "Mühendislik", href: "/cozumler/mimari-cad" },
      { label: "Yapay Zekâ & HPC", href: "/cozumler/ai-gelistirme" },
      { label: "Yaşam Bilimleri", href: "/cozumler/yasam-bilimleri" },
    ],
  },
  {
    title: "Şirket",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Kariyer", href: "/hakkimizda" },
      { label: "Basın Kiti", href: "/hakkimizda" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },
  {
    title: "Destek",
    links: [
      { label: "Destek Talebi", href: "/destek" },
      { label: "Seri No Sorgula", href: "/destek" },
      { label: "Driver İndirme", href: "/destek" },
    ],
  },
]

export function PublicFooter({ companyName }: { companyName?: string }) {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-sm font-semibold">{group.title}</p>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {companyName || "STUUX"}. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/gizlilik" className="hover:text-foreground">Gizlilik Politikası</Link>
            <Link href="/kvkk" className="hover:text-foreground">KVKK</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
