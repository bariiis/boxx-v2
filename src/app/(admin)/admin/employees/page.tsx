import { getEmployees } from "@/lib/actions/employee-actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Users } from "lucide-react"
import Link from "next/link"

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  EMPLOYEE: "Çalışan",
}

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search || ""
  const page = parseInt(params.page || "1")

  const { employees, total } = await getEmployees({ search, page })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Çalışanlar</h1>
          <p className="text-muted-foreground">{total} kayıt bulundu</p>
        </div>
        <Button asChild>
          <Link href="/admin/employees/new">
            <Plus className="mr-2 size-4" />
            Yeni Çalışan
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanıcı Adı</TableHead>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  <Users className="mx-auto mb-2 size-8 opacity-50" />
                  Henüz çalışan bulunmuyor
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.username || "-"}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/employees/${emp.id}`}
                      className="hover:underline"
                    >
                      {emp.name} {emp.surname}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                  <TableCell className="text-muted-foreground">{emp.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={emp.role === "ADMIN" ? "default" : "secondary"}>
                      {roleLabels[emp.role] || emp.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={emp.isActive ? "default" : "destructive"}>
                      {emp.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/employees/${emp.id}`}>Düzenle</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
