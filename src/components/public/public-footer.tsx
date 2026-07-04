import Link from "next/link"

interface FooterLinkGroup {
  title: string
  links: { label: string; href: string }[]
}

const defaultFooterLinks: FooterLinkGroup[] = [
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

export function PublicFooter({
  companyName,
  groups,
}: {
  companyName?: string
  groups?: FooterLinkGroup[]
}) {
  const footerLinks = groups && groups.length > 0 ? groups : defaultFooterLinks
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/60 dark:border-slate-800/80 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="mb-4 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {group.title}
              </p>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-['Space_Grotesk'] text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-8 dark:border-slate-800/80 sm:flex-row">
          <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-slate-500">
            &copy; {new Date().getFullYear()} {companyName || "STUUX"}
            <span aria-hidden className="mx-1 text-orange-500">.</span>
            Tüm hakları saklıdır
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <Link
              href="/gizlilik"
              className="font-['Space_Grotesk'] font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-300"
            >
              Gizlilik Politikası
            </Link>
            <Link
              href="/kvkk"
              className="font-['Space_Grotesk'] font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-300"
            >
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
