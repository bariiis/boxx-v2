import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getSettings } from "@/lib/actions/settings-actions"
import { QuoteForm } from "@/components/admin/quote-form"

export default async function NewQuotePage() {
  const [session, settings] = await Promise.all([
    auth(),
    getSettings("quote"),
  ])
  if (!session?.user) redirect("/login")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Yeni Teklif</h1>
      <QuoteForm userId={session.user.id} defaults={settings} />
    </div>
  )
}
