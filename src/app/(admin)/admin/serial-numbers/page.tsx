import { getSerialNumbers } from "@/lib/actions/serial-number-actions"
import { AdminPagination } from "@/components/admin/pagination"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Plus, Hash, Shield, AlertTriangle, XCircle } from "lucide-react"
import Link from "next/link"
import { format, differenceInDays } from "date-fns"
import { tr } from "date-fns/locale"

function warrantyBadge(end: Date | null) {
  if (!end) return <Badge variant="secondary">Belirtilmemiş</Badge>
  const days = differenceInDays(end, new Date())
  if (days < 0) return <Badge variant="destructive">Süresi Dolmuş</Badge>
  if (days < 30) return <Badge variant="destructive">{days} gün kaldı</Badge>
  if (days < 90) return <Badge variant="outline">{days} gün kaldı</Badge>
  return <Badge variant="default">{days} gün kaldı</Badge>
}

export default async function SerialNumbersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; warranty?: string }>
}) {
  const params = await searchParams
  const search = params.search || ""
  const page = parseInt(params.page || "1")
  const warranty = params.warranty as "active" | "expiring" | "expired" | undefined

  const { serialNumbers, total, totalPages } = await getSerialNumbers({ search, page, warranty })

  const preservedParams: Record<string, string> = {}
  if (search) preservedParams.search = search
  if (warranty) preservedParams.warranty = warranty

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Seri No Takip</h1>
          <p className="text-muted-foreground">{total} kayıt</p>
        </div>
        <Button asChild>
          <Link href="/admin/serial-numbers/new">
            <Plus className="mr-2 size-4" />
            Yeni Seri No
          </Link>
        </Button>
      </div>

      <div className="flex gap-2">
        {[
          { label: "Tümü", value: undefined, icon: Hash },
          { label: "Garanti Aktif", value: "active", icon: Shield },
          { label: "Yakında Dolacak", value: "expiring", icon: AlertTriangle },
          { label: "Süresi Dolmuş", value: "expired", icon: XCircle },
        ].map((f) => (
          <Button
            key={f.label}
            variant={warranty === f.value ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={`/admin/serial-numbers${f.value ? `?warranty=${f.value}` : ""}`}>
              <f.icon className="mr-1.5 size-3.5" />
              {f.label}
            </Link>
          </Button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seri No</TableHead>
              <TableHead>Ürün</TableHead>
              <TableHead>Organizasyon</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Garanti</TableHead>
              <TableHead>Konfigürasyon</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serialNumbers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  <Hash className="mx-auto mb-2 size-8 opacity-50" />
                  Henüz seri numara kaydı yok
                </TableCell>
              </TableRow>
            ) : (
              serialNumbers.map((sn) => (
                <TableRow key={sn.id}>
                  <TableCell>
                    <Link href={`/admin/serial-numbers/${sn.id}`} className="font-mono font-medium hover:underline">
                      {sn.serialNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{sn.product?.name || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{sn.organization?.name || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {sn.contact ? `${sn.contact.firstName} ${sn.contact.lastName}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={sn.isActive ? "default" : "secondary"}>
                      {sn.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>{warrantyBadge(sn.warrantyEnd)}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                    {sn.configuration || "-"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/serial-numbers/${sn.id}`}>Aç</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdminPagination
        basePath="/admin/serial-numbers"
        currentPage={page}
        totalPages={totalPages}
        searchParams={preservedParams}
      />
    </div>
  )
}
