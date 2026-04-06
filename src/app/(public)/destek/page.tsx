import { getPublicTicketCategories } from "@/lib/actions/public-ticket-actions"
import { SupportPageClient } from "@/components/public/support-page-client"

export const metadata = {
  title: "Destek | STUUX",
  description: "Teknik destek talebi oluşturun veya mevcut talebinizi takip edin.",
}

export default async function SupportPage() {
  const categories = await getPublicTicketCategories()

  return <SupportPageClient categories={categories} />
}
