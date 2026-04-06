"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, ChevronRight, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface SolutionMenuItem {
  id: string
  name: string
  slug: string
  children: {
    id: string
    name: string
    slug: string
    solutions: { title: string; slug: string; icon: string | null }[]
  }[]
  solutions: { title: string; slug: string; icon: string | null }[]
}

const mainNav = [
  { title: "Ürünler", href: "/urunler" },
  { title: "Hakkımızda", href: "/hakkimizda" },
  { title: "Destek", href: "/destek" },
  { title: "İletişim", href: "/iletisim" },
]

interface PublicHeaderProps {
  logo?: string
  companyName?: string
  solutionMenu?: SolutionMenuItem[]
}

export function PublicHeader({ logo, companyName, solutionMenu = [] }: PublicHeaderProps) {
  const pathname = usePathname()
  const [megaOpen, setMegaOpen] = useState(false)
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Find the currently hovered subcategory's solutions
  const activeSolutions = (() => {
    for (const cat of solutionMenu) {
      // Direct solutions under parent
      if (activeSubcat === cat.slug) return { label: cat.name, items: cat.solutions }
      // Subcategory solutions
      const child = cat.children.find((c) => c.slug === activeSubcat)
      if (child) return { label: child.name, items: child.solutions }
    }
    // Default: first subcategory with solutions
    for (const cat of solutionMenu) {
      for (const child of cat.children) {
        if (child.solutions.length > 0) return { label: child.name, items: child.solutions }
      }
    }
    return null
  })()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            <img src={logo} alt={companyName || "Logo"} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-xl font-bold tracking-tight">{companyName || "STUUX"}</span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {/* Solutions Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => { setMegaOpen(false); setActiveSubcat(null) }}
          >
            <button
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/cozumler") && "text-foreground",
              )}
            >
              Çözümler
              <ChevronRight className={cn("size-3 transition-transform", megaOpen && "rotate-90")} />
            </button>

            {megaOpen && (
              <div className="absolute left-0 top-full pt-2">
                <div className="flex rounded-lg border bg-popover shadow-xl">
                  {/* Left: Categories + Subcategories */}
                  <div className="w-64 border-r py-3">
                    {solutionMenu.map((cat) => (
                      <div key={cat.id} className="mb-1">
                        {/* Parent category header */}
                        <p className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                          {cat.name}
                        </p>
                        {/* Subcategories */}
                        {cat.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/cozumler/kategori/${child.slug}`}
                            className={cn(
                              "flex w-full items-center justify-between px-6 py-1.5 text-left text-sm transition-colors",
                              activeSubcat === child.slug
                                ? "bg-accent font-medium text-accent-foreground"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            )}
                            onMouseEnter={() => setActiveSubcat(child.slug)}
                            onClick={() => setMegaOpen(false)}
                          >
                            {child.name}
                            {child.solutions.length > 0 && <ChevronRight className="size-3 opacity-50" />}
                          </Link>
                        ))}
                        {/* If parent has direct solutions (no subcategories like Yaşam Bilimleri) */}
                        {cat.children.length === 0 && (
                          <button
                            className={cn(
                              "flex w-full items-center justify-between px-6 py-1.5 text-left text-sm transition-colors",
                              activeSubcat === cat.slug
                                ? "bg-accent font-medium text-accent-foreground"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            )}
                            onMouseEnter={() => setActiveSubcat(cat.slug)}
                          >
                            {cat.name}
                            {cat.solutions.length > 0 && <ChevronRight className="size-3 opacity-50" />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Right: Solution pages for active subcategory */}
                  <div className="w-72 p-4">
                    {activeSolutions && activeSolutions.items.length > 0 ? (
                      <>
                        <p className="mb-3 text-xs font-semibold text-muted-foreground">
                          Önerilen Sistemler:
                        </p>
                        <div className="space-y-1">
                          {activeSolutions.items.map((sol) => (
                            <Link
                              key={sol.slug}
                              href={`/cozumler/${sol.slug}`}
                              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                              onClick={() => setMegaOpen(false)}
                            >
                              {sol.icon && <img src={sol.icon} alt="" className="size-5 object-contain" />}
                              {sol.title}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        Bir kategori üzerine gelin
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href && "text-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
            <Link href="/login">
              <User className="mr-2 size-4" />
              Giriş
            </Link>
          </Button>
          <Button size="sm" asChild className="hidden sm:flex">
            <Link href="/iletisim">Uzmanla Konuş</Link>
          </Button>

          {/* Mobile */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-5" />
              </Button>
            } />
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetTitle>Menü</SheetTitle>
              <nav className="mt-6 space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Çözümler</p>
                  {solutionMenu.map((cat) => (
                    <div key={cat.id} className="mb-3">
                      <p className="mb-1 text-sm font-bold">{cat.name}</p>
                      {cat.children.map((child) => (
                        <div key={child.id}>
                          <p className="px-3 py-1 text-sm text-muted-foreground">{child.name}</p>
                          {child.solutions.map((sol) => (
                            <Link
                              key={sol.slug}
                              href={`/cozumler/${sol.slug}`}
                              className="flex items-center gap-2 rounded-md px-6 py-1 text-sm hover:bg-accent"
                              onClick={() => setMobileOpen(false)}
                            >
                              {sol.icon && <img src={sol.icon} alt="" className="size-4 object-contain" />}
                              {sol.title}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-1">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>Giriş Yap</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/iletisim" onClick={() => setMobileOpen(false)}>Uzmanla Konuş</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
