import { getPublicTicketCategories } from "@/lib/actions/public-ticket-actions"
import { SupportPageClient } from "@/components/public/support-page-client"

export const metadata = {
  title: "Destek | BOXX",
  description: "Teknik destek talebi oluştur veya mevcut talebini takip et.",
}

export default async function SupportPage() {
  const categories = await getPublicTicketCategories()

  return <SupportPageClient categories={categories} />
}
