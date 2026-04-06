export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { getQuoteByToken } from "@/lib/actions/quote-actions"
import { getSettings } from "@/lib/actions/settings-actions"
import { QuotePublicView } from "@/components/public/quote-public-view"

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const [quote, settings] = await Promise.all([
    getQuoteByToken(token),
    getSettings(),
  ])

  if (!quote) notFound()

  return (
    <QuotePublicView
      quote={quote}
      token={token}
      companyLogo={settings.company_logo}
      companyName={settings.company_name}
      defaultNotes={settings.default_quote_notes}
    />
  )
}
