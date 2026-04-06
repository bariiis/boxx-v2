export const dynamic = "force-dynamic"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/sonner"
import { PortalNav } from "@/components/portal/portal-nav"
import { getSettings } from "@/lib/actions/settings-actions"

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const settings = await getSettings("general")

  return (
    <div className="min-h-screen bg-muted/40">
      <PortalNav user={session.user} logo={settings.company_logo} companyName={settings.company_name} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
