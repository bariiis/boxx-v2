import { getSolutions } from "@/lib/actions/solution-actions"
import { AdminPagination } from "@/components/admin/pagination"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Plus, Globe } from "lucide-react"
import Link from "next/link"
import { DeleteSolutionButton } from "@/components/admin/delete-solution-button"

export default async function SolutionsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const { solutions, total, totalPages } = await getSolutions({ page, limit: 50 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Çözümler</h1>
          <p className="text-muted-foreground">{total} sayfa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/solutions/categories">Kategoriler</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/solutions/new">
              <Plus className="mr-2 size-4" />
              Yeni Çözüm Sayfası
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Sekmeler</TableHead>
              <TableHead>Chartlar</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solutions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  <Globe className="mx-auto mb-2 size-8 opacity-50" />
                  Henüz çözüm sayfası yok
                </TableCell>
              </TableRow>
            ) : (
              solutions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Link href={`/admin/solutions/${s.id}`} className="font-medium hover:underline">
                      {s.title}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{s.slug}</TableCell>
                  <TableCell className="text-muted-foreground">{s.category?.name || "-"}</TableCell>
                  <TableCell><Badge variant="outline">{s.sections.length} sekme</Badge></TableCell>
                  <TableCell><Badge variant="outline">{s.benchmarks.length} chart</Badge></TableCell>
                  <TableCell>
                    <Badge variant={s.isActive ? "default" : "secondary"}>
                      {s.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/solutions/${s.id}`}>Düzenle</Link>
                      </Button>
                      <DeleteSolutionButton id={s.id} title={s.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdminPagination
        basePath="/admin/solutions"
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  )
}
