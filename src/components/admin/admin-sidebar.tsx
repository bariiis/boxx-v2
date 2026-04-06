"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  HeadphonesIcon,
  Hash,
  Package,
  Settings,
  Cpu,
  ListChecks,
  Globe,
  ShoppingCart,
  Mail,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuGroups = [
  {
    label: "Genel",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "CRM",
    items: [
      { title: "Organizasyonlar", href: "/admin/organizations", icon: Building2 },
      { title: "Kişiler", href: "/admin/contacts", icon: Users },
      { title: "Çalışanlar", href: "/admin/employees", icon: Users },
    ],
  },
  {
    label: "Satış",
    items: [
      { title: "Teklifler", href: "/admin/quotes", icon: FileText },
      { title: "Siparişler", href: "/admin/orders", icon: ShoppingCart },
    ],
  },
  {
    label: "Ürünler",
    items: [
      { title: "Ürün Yönetimi", href: "/admin/products", icon: Package },
      { title: "Spec Presetleri", href: "/admin/products/presets", icon: ListChecks },
      { title: "Konfiguratör", href: "/admin/configurator", icon: Cpu },
    ],
  },
  {
    label: "Destek",
    items: [
      { title: "Destek Talepleri", href: "/admin/tickets", icon: HeadphonesIcon },
      { title: "Seri No Takip", href: "/admin/serial-numbers", icon: Hash },
    ],
  },
  {
    label: "İçerik",
    items: [
      { title: "Çözümler", href: "/admin/solutions", icon: Globe },
    ],
  },
  {
    label: "Sistem",
    items: [
      { title: "Ayarlar", href: "/admin/settings", icon: Settings },
      { title: "E-posta", href: "/admin/smtp", icon: Mail },
    ],
  },
]

export function AdminSidebar({ logo, companyName }: { logo?: string; companyName?: string }) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/admin" className="flex items-center gap-2">
          {logo ? (
            <img src={logo} alt={companyName || "Logo"} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-xl font-bold tracking-tight">{companyName || "STUUX"}</span>
          )}
          <span className="text-xs text-muted-foreground">Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isActive}
                        render={<Link href={item.href} />}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full text-destructive"
              onClick={async () => {
                // Get CSRF token first, then POST signout
                const csrfRes = await fetch("/api/auth/csrf")
                const { csrfToken } = await csrfRes.json()
                await fetch("/api/auth/signout", {
                  method: "POST",
                  headers: { "Content-Type": "application/x-www-form-urlencoded" },
                  body: new URLSearchParams({ csrfToken }),
                })
                window.location.href = "/login"
              }}
            >
              <LogOut className="size-4" />
              <span>Çıkış Yap</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
