export const dynamic = "force-dynamic"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Toaster } from "@/components/ui/sonner"
import { getSettings } from "@/lib/actions/settings-actions"
import { auth } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, session] = await Promise.all([
    getSettings("general"),
    auth(),
  ])

  const user = session?.user ? {
    name: session.user.name || "",
    email: session.user.email || "",
    role: (session.user as { role?: string }).role || "ADMIN",
    image: session.user.image || undefined,
  } : undefined

  return (
    <SidebarProvider>
      <AdminSidebar logo={settings.company_logo} companyName={settings.company_name} user={user} />
      <SidebarInset>
        <AdminHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
