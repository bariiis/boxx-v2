"use client"

import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ExternalLink } from "lucide-react"
import { usePathname } from "next/navigation"

const breadcrumbMap: Record<string, string> = {
  admin: "Dashboard",
  organizations: "Organizasyonlar",
  contacts: "Kişiler",
  employees: "Çalışanlar",
  quotes: "Teklifler",
  orders: "Siparişler",
  products: "Ürünler",
  categories: "Kategoriler",
  presets: "Spec Presetleri",
  configurator: "Konfiguratör",
  tickets: "Destek Talepleri",
  "serial-numbers": "Seri No Takip",
  solutions: "Çözümler",
  settings: "Ayarlar",
  smtp: "E-posta",
  new: "Yeni",
  edit: "Düzenle",
}

// Map admin paths to their public preview URLs
const previewMap: Record<string, string> = {
  "/admin/products": "/urunler",
  "/admin/solutions": "/cozumler",
}

function isId(segment: string) {
  // CUID: starts with 'c' and is 20+ chars, or UUID pattern
  return /^c[a-z0-9]{20,}$/i.test(segment) || /^[0-9a-f-]{36}$/i.test(segment)
}

export function AdminHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  // Build preview URL if applicable
  const previewUrl = Object.entries(previewMap).find(([admin]) =>
    pathname.startsWith(admin)
  )?.[1]

  // Filter out ID segments for breadcrumb display
  const breadcrumbs = segments
    .map((segment, index) => ({
      segment,
      href: "/" + segments.slice(0, index + 1).join("/"),
      isLast: index === segments.length - 1,
    }))
    .filter(({ segment }) => !isId(segment))

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger className="-ml-2" />
      <Separator orientation="vertical" className="h-6" />
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {breadcrumbs.map(({ segment, href, isLast }, index) => {
            const label = breadcrumbMap[segment] || segment

            return (
              <span key={href} className="flex items-center gap-1.5">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      {previewUrl && (
        <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
          <Link href={previewUrl} target="_blank">
            <ExternalLink className="mr-1.5 size-3" />
            Ön İzleme
          </Link>
        </Button>
      )}
    </header>
  )
}
