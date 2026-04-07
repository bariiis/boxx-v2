import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, ExternalLink, Layers } from "lucide-react"
import { getLandingPages, deleteLandingPage } from "@/lib/actions/landing-actions"
import { DeleteLandingButton } from "@/components/admin/delete-landing-button"
import { SeedPagesButton } from "@/components/admin/seed-pages-button"

export default async function LandingPagesListPage() {
  const { landingPages } = await getLandingPages()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Landing Pages</h1>
          <p className="text-sm text-muted-foreground">
            Ürünler için özel tasarlanmış landing sayfaları
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SeedPagesButton />
          <Button asChild>
            <Link href="/admin/landing-pages/new">
              <Plus className="mr-2 size-4" />
              Yeni Landing Page
            </Link>
          </Button>
        </div>
      </div>

      {landingPages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Layers className="mb-4 size-12 text-muted-foreground/30" />
            <h3 className="text-lg font-medium">Henüz landing page yok</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              İlk landing page&apos;inizi oluşturun
            </p>
            <Button className="mt-4" asChild>
              <Link href="/admin/landing-pages/new">
                <Plus className="mr-2 size-4" />
                Oluştur
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {landingPages.map((lp) => (
            <Card key={lp.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Layers className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{lp.title}</h3>
                      <Badge variant={lp.isActive ? "default" : "secondary"}>
                        {lp.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>/landing/{lp.slug}</span>
                      <span>{lp._count.sections} section</span>
                      {lp.product && <span>Ürün: {lp.product.name}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/landing/${lp.slug}`} target="_blank">
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/landing-pages/${lp.id}`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteLandingButton id={lp.id} title={lp.title} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
