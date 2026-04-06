import { getContacts } from "@/lib/actions/contact-actions"
import { db } from "@/lib/db"
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
import { OrganizationSearch } from "@/components/admin/organization-search"
import { DeleteContactButton } from "@/components/admin/delete-contact-button"

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search || ""
  const page = parseInt(params.page || "1")

  const { contacts, total, totalPages } = await getContacts({ search, page })

  // Get all customer portal users to check access
  const portalEmails = new Set(
    (await db.user.findMany({
      where: { role: "CUSTOMER" },
      select: { email: true },
    })).map((u) => u.email)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kişiler</h1>
          <p className="text-muted-foreground">{total} kayıt bulundu</p>
        </div>
        <Button asChild>
          <Link href="/admin/contacts/new">
            <Plus className="mr-2 size-4" />
            Yeni Kişi
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <OrganizationSearch defaultSearch={search} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Organizasyon</TableHead>
              <TableHead>Departman</TableHead>
              <TableHead>Portal</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  <Users className="mx-auto mb-2 size-8 opacity-50" />
                  Henüz kişi bulunmuyor
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Link
                      href={`/admin/contacts/${contact.id}`}
                      className="font-medium hover:underline"
                    >
                      {contact.title && `${contact.title} `}
                      {contact.firstName} {contact.lastName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.email || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.phone || "-"}
                  </TableCell>
                  <TableCell>
                    {contact.organization ? (
                      <Link
                        href={`/admin/organizations/${contact.organization.id}`}
                        className="hover:underline"
                      >
                        {contact.organization.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.department || "-"}
                  </TableCell>
                  <TableCell>
                    {contact.email && portalEmails.has(contact.email) ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">Aktif</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/contacts/${contact.id}`}>Düzenle</Link>
                      </Button>
                      <DeleteContactButton
                        id={contact.id}
                        name={`${contact.firstName} ${contact.lastName}`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
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
              <Link href={`/admin/contacts?page=${i + 1}${search ? `&search=${search}` : ""}`}>
                {i + 1}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
