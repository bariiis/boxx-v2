export const dynamic = "force-dynamic"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/sonner"
import { PortalSidebar } from "@/components/portal/portal-sidebar"
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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="flex min-h-screen">
        <PortalSidebar
          user={session.user}
          logo={settings.company_logo}
          companyName={settings.company_name}
        />
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
