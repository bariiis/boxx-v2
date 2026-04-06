import { notFound } from "next/navigation"
import { getOrganization } from "@/lib/actions/organization-actions"
import { getOrganizationUsers } from "@/lib/actions/customer-user-actions"
import { OrganizationForm } from "@/components/admin/organization-form"
import { ShippingAddressManager } from "@/components/admin/shipping-address-manager"
import { PortalAccessButton } from "@/components/admin/org-portal-access"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [organization, portalUsers] = await Promise.all([
    getOrganization(id),
    getOrganizationUsers(id),
  ])

  if (!organization) notFound()

  const portalUserEmails = new Set(portalUsers.map((u) => u.email))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{organization.name}</h1>
        <Badge variant="outline">{organization.type}</Badge>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Bilgiler</TabsTrigger>
          <TabsTrigger value="contacts">
            Kişiler ({organization.contacts.length})
          </TabsTrigger>
          <TabsTrigger value="quotes">
            Teklifler ({organization.quotes.length})
          </TabsTrigger>
          <TabsTrigger value="tickets">
            Destek ({organization.tickets.length})
          </TabsTrigger>
          <TabsTrigger value="addresses">
            Sevkiyat ({organization.shippingAddresses.length})
          </TabsTrigger>
          <TabsTrigger value="serials">
            Seri No ({organization.serialNumbers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <OrganizationForm organization={organization} />
        </TabsContent>

        <TabsContent value="contacts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Kişiler</CardTitle>
            </CardHeader>
            <CardContent>
              {organization.contacts.length === 0 ? (
                <p className="text-muted-foreground">Henüz kişi eklenmemiş.</p>
              ) : (
                <div className="space-y-3">
                  {organization.contacts.map((contact) => {
                    const existingUser = contact.email
                      ? portalUsers.find((u) => u.email === contact.email) || null
                      : null
                    return (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="font-medium">
                            {contact.title && `${contact.title} `}
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {contact.email} {contact.phone && `| ${contact.phone}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {contact.department && (
                            <Badge variant="secondary">{contact.department}</Badge>
                          )}
                          <PortalAccessButton
                            contact={contact}
                            organizationId={organization.id}
                            existingUser={existingUser}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Teklifler</CardTitle>
            </CardHeader>
            <CardContent>
              {organization.quotes.length === 0 ? (
                <p className="text-muted-foreground">Henüz teklif oluşturulmamış.</p>
              ) : (
                <div className="space-y-3">
                  {organization.quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{quote.quoteNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {quote.projectName || "Proje adı belirtilmemiş"}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge>{quote.status}</Badge>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {format(quote.createdAt, "dd MMM yyyy", { locale: tr })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Destek Talepleri</CardTitle>
            </CardHeader>
            <CardContent>
              {organization.tickets.length === 0 ? (
                <p className="text-muted-foreground">Henüz destek talebi yok.</p>
              ) : (
                <div className="space-y-3">
                  {organization.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{ticket.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.ticketNumber}
                        </p>
                      </div>
                      <Badge>{ticket.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="mt-6">
          <ShippingAddressManager
            organizationId={organization.id}
            addresses={organization.shippingAddresses}
          />
        </TabsContent>

        <TabsContent value="serials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Seri Numaraları</CardTitle>
            </CardHeader>
            <CardContent>
              {organization.serialNumbers.length === 0 ? (
                <p className="text-muted-foreground">Henüz seri numara kaydı yok.</p>
              ) : (
                <div className="space-y-3">
                  {organization.serialNumbers.map((sn) => (
                    <div
                      key={sn.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{sn.serialNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {sn.configuration || "Konfigürasyon bilgisi yok"}
                        </p>
                      </div>
                      <Badge variant={sn.isActive ? "default" : "secondary"}>
                        {sn.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
