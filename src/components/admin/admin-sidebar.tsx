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
  UserRound,
  UserCog,
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
  ChevronUp,
  Layers,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AdminUser {
  name: string
  email: string
  role: string
  image?: string
}

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
      { title: "Kişiler", href: "/admin/contacts", icon: UserRound },
      { title: "Çalışanlar", href: "/admin/employees", icon: UserCog },
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
      { title: "Landing Pages", href: "/admin/landing-pages", icon: Layers },
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

export function AdminSidebar({
  logo,
  companyName,
  user,
}: {
  logo?: string
  companyName?: string
  user?: AdminUser
}) {
  const pathname = usePathname()

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-5 py-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          {logo ? (
            <img src={logo} alt={companyName || "Logo"} className="h-7 w-auto object-contain" />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              {(companyName || "S")[0]}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">{companyName || "STUUX"}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin Panel</span>
          </div>
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
      <SidebarFooter className="border-t p-3">
        {user && (
          <div className="mb-2 flex items-center gap-2.5 rounded-md px-2 py-1.5">
            {user.image ? (
              <img src={user.image} alt={user.name} className="size-7 rounded-full object-cover" />
            ) : (
              <div className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                {initials}
              </div>
            )}
            <div className="flex-1 truncate">
              <p className="truncate text-xs font-medium">{user.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full text-muted-foreground hover:text-destructive"
              onClick={async () => {
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
