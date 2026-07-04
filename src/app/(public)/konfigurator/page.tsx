import { KonfiguratorPage } from "@/components/public/konfigurator/KonfiguratorPage"

export const metadata = {
  title: "Konfigüratör | BOXX",
  description:
    "BOXX iş istasyonu ve sunucularını CPU, GPU, RAM, depolama ve ağ bileşenleriyle yapılandır. Canlı fiyat, güç bütçesi ve uyumluluk kontrolü.",
}

export default async function KonfiguratorRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ base?: string }>
}) {
  const { base } = await searchParams
  return <KonfiguratorPage initialBaseSlug={base} />
}
