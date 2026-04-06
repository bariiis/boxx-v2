export const dynamic = "force-dynamic"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Toaster } from "@/components/ui/sonner"
import { getSettings } from "@/lib/actions/settings-actions"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings("general")

  return (
    <SidebarProvider>
      <AdminSidebar logo={settings.company_logo} companyName={settings.company_name} />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
