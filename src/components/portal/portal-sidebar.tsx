"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileText,
  HeadphonesIcon,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  ShoppingCart,
  X,
  ExternalLink,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PortalSidebarProps {
  user: { name?: string | null; email?: string | null }
  logo?: string
  companyName?: string
}

const navItems: { title: string; href: string; icon: LucideIcon; matchPrefix?: boolean }[] = [
  { title: "Özet", href: "/portal", icon: LayoutDashboard },
  { title: "Tekliflerim", href: "/portal/teklifler", icon: FileText, matchPrefix: true },
  { title: "Siparişlerim", href: "/portal/siparisler", icon: ShoppingCart, matchPrefix: true },
  { title: "Destek", href: "/portal/destek", icon: HeadphonesIcon, matchPrefix: true },
  { title: "Adresler", href: "/portal/adresler", icon: MapPin, matchPrefix: true },
]

export function PortalSidebar({ user, logo, companyName }: PortalSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const csrfRes = await fetch("/api/auth/csrf")
    const { csrfToken } = await csrfRes.json()
    await fetch("/api/auth/signout", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ csrfToken }),
    })
    window.location.href = "/login"
  }

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Menüyü aç"
        className="fixed left-4 top-3 z-30 inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Menüyü kapat"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setMobileOpen(false)
          }}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm dark:bg-slate-950/70 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-950 lg:static lg:w-64 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo + Portal badge */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <Link
            href="/portal"
            className="flex items-center gap-2 text-slate-900 dark:text-white"
            onClick={() => setMobileOpen(false)}
          >
            {logo ? (
              <img src={logo} alt={companyName || "BOXX"} className="h-7 w-auto object-contain" />
            ) : (
              <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight">
                {companyName || "BOXX"}
                <span aria-hidden className="text-orange-500">.</span>
              </span>
            )}
            <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-['JetBrains_Mono'] text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-teal-400">
              Portal
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Menüyü kapat"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 font-['JetBrains_Mono'] text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Menü
          </div>
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.matchPrefix
                ? pathname.startsWith(item.href)
                : pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-left font-['Space_Grotesk'] text-sm font-medium transition",
                      isActive
                        ? "bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/70 dark:hover:text-slate-100",
                    )}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-orange-500"
                      />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive
                          ? "text-orange-500"
                          : "text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300",
                      )}
                    />
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer: public site link + user card */}
        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <Link
            href="/"
            className="mb-2 flex w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 font-['Space_Grotesk'] text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Public siteye dön
          </Link>
          <div className="flex items-center gap-3 rounded-md bg-slate-100 px-3 py-2 dark:bg-slate-900">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700 font-['Space_Grotesk'] text-sm font-bold text-white">
              {(user.name || user.email || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-['Space_Grotesk'] text-sm font-semibold text-slate-900 dark:text-white">
                {user.name || "Kullanıcı"}
              </div>
              {user.email && (
                <div className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Çıkış yap"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
