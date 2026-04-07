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

  let mainNav: { title: string; href: string }[] | undefined
  if (settings.header_menu) {
    try {
      const parsed = JSON.parse(settings.header_menu)
      if (Array.isArray(parsed)) mainNav = parsed
    } catch {
      // ignore invalid JSON
    }
  }

  let footerGroups: { title: string; links: { label: string; href: string }[] }[] | undefined
  if (settings.footer_columns) {
    try {
      const parsed = JSON.parse(settings.footer_columns)
      if (Array.isArray(parsed)) footerGroups = parsed
    } catch {
      // ignore invalid JSON
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader
        logo={settings.company_logo}
        companyName={settings.company_name}
        solutionMenu={menuData}
        mainNav={mainNav}
      />
      <main className="flex-1 pb-16">{children}</main>
      <PublicFooter companyName={settings.company_name} groups={footerGroups} />
      <CompareBar />
      <Toaster />
    </div>
  )
}
