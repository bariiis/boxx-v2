import { getOrganizations } from "@/lib/actions/organization-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { orgStatusConfig, StatusBadge } from "@/lib/status-colors"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Building2 } from "lucide-react"
import Link from "next/link"
import { OrganizationSearch } from "@/components/admin/organization-search"
import { DeleteOrganizationButton } from "@/components/admin/delete-organization-button"

const typeLabels: Record<string, string> = {
  COMPANY: "Şirket",
  UNIVERSITY: "Üniversite",
  INDIVIDUAL: "Bireysel",
  GOVERNMENT: "Kamu Kurumu",
  NGO: "STK/Dernek",
  OTHER: "Diğer",
}

const _unused: Record<string, { label: string; variant: string }> = {
  LEAD: { label: "Lead", variant: "outline" },
  ACTIVE: { label: "Aktif", variant: "default" },
  PASSIVE: { label: "Pasif", variant: "secondary" },
  CUSTOMER: { label: "Müşteri", variant: "default" },
}

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; status?: string }>
}) {
  const params = await searchParams
  const search = params.search || ""
  const page = parseInt(params.page || "1")
  const status = params.status as "LEAD" | "ACTIVE" | "PASSIVE" | "CUSTOMER" | undefined

  const { organizations, total, totalPages } = await getOrganizations({ search, page, status })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizasyonlar</h1>
          <p className="text-muted-foreground">{total} kayıt bulundu</p>
        </div>
        <Button asChild>
          <Link href="/admin/organizations/new">
            <Plus className="mr-2 size-4" />
            Yeni Organizasyon
          </Link>
        </Button>
      </div>

      <OrganizationSearch defaultSearch={search} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organizasyon</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Şehir</TableHead>
              <TableHead className="text-center">Kişiler</TableHead>
              <TableHead className="text-center">Teklifler</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  <Building2 className="mx-auto mb-2 size-8 opacity-50" />
                  Henüz organizasyon bulunmuyor
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org) => {
                const _si = org.status
                return (
                  <TableRow key={org.id}>
                    <TableCell>
                      <Link
                        href={`/admin/organizations/${org.id}`}
                        className="font-medium hover:underline"
                      >
                        {org.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {typeLabels[org.type] || org.type}
                    </TableCell>
                    <TableCell>
                      <StatusBadge config={orgStatusConfig} status={org.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{org.phone || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{org.city || "-"}</TableCell>
                    <TableCell className="text-center">{org.contacts.length}</TableCell>
                    <TableCell className="text-center">{org.quotes.length}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/organizations/${org.id}`}>Düzenle</Link>
                        </Button>
                        <DeleteOrganizationButton id={org.id} name={org.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link
                href={`/admin/organizations?page=${i + 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
              >
                {i + 1}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
