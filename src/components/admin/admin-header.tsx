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
import { ExternalLink, User, Settings, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"

interface AdminUser {
  name: string
  email: string
  role: string
  image?: string
}

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

const previewMap: Record<string, string> = {
  "/admin/products": "/urunler",
  "/admin/solutions": "/cozumler",
}

const roleLabels: Record<string, string> = {
  ADMIN: "Yönetici",
  EMPLOYEE: "Çalışan",
}

function isId(segment: string) {
  return /^c[a-z0-9]{20,}$/i.test(segment) || /^[0-9a-f-]{36}$/i.test(segment)
}

export function AdminHeader({ user }: { user?: AdminUser }) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const previewUrl = Object.entries(previewMap).find(([admin]) =>
    pathname.startsWith(admin)
  )?.[1]

  const breadcrumbs = segments
    .map((segment, index) => ({
      segment,
      href: "/" + segments.slice(0, index + 1).join("/"),
      isLast: index === segments.length - 1,
    }))
    .filter(({ segment }) => !isId(segment))

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

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

      <div className="flex items-center gap-2">
        {previewUrl && (
          <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
            <Link href={previewUrl} target="_blank">
              <ExternalLink className="mr-1.5 size-3" />
              Ön İzleme
            </Link>
          </Button>
        )}

        {user && (
          <div className="flex items-center gap-3 border-l pl-3">
            <div className="hidden text-right text-xs sm:block">
              <p className="font-medium leading-none">{user.name}</p>
              <p className="mt-0.5 text-muted-foreground">{roleLabels[user.role] || user.role}</p>
            </div>
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="size-8 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {initials}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
