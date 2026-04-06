"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, ShoppingCart, HeadphonesIcon, LayoutDashboard, LogOut, User, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Özet", href: "/portal", icon: LayoutDashboard },
  { title: "Tekliflerim", href: "/portal/teklifler", icon: FileText },
  { title: "Siparişlerim", href: "/portal/siparisler", icon: ShoppingCart },
  { title: "Adresler", href: "/portal/adresler", icon: MapPin },
  { title: "Destek", href: "/portal/destek", icon: HeadphonesIcon },
]

interface PortalNavProps {
  user: { name?: string | null; email?: string | null }
  logo?: string
  companyName?: string
}

export function PortalNav({ user, logo, companyName }: PortalNavProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/portal" className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt={companyName || "Logo"} className="h-7 w-auto object-contain" />
            ) : (
              <span className="text-lg font-bold tracking-tight">{companyName || "STUUX"}</span>
            )}
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const isActive = item.href === "/portal"
                ? pathname === "/portal"
                : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
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
          </Button>
        </div>
      </div>
    </header>
  )
}
