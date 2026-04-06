export const dynamic = "force-dynamic"

import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { CompareBar } from "@/components/public/compare-bar"
import { Toaster } from "@/components/ui/sonner"
import { getSettings } from "@/lib/actions/settings-actions"
import { getSolutionMenuData } from "@/lib/actions/solution-actions"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, menuData] = await Promise.all([
    getSettings("general"),
    getSolutionMenuData(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader
        logo={settings.company_logo}
        companyName={settings.company_name}
        solutionMenu={menuData}
      />
      <main className="flex-1 pb-16">{children}</main>
      <PublicFooter companyName={settings.company_name} />
      <CompareBar />
      <Toaster />
    </div>
  )
}
