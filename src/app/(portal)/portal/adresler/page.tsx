import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getMyAddresses } from "@/lib/actions/portal-actions"
import { ShippingAddressManager } from "@/components/admin/shipping-address-manager"

export default async function MyAddressesPage() {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Sevkiyat Adresleri</h1>
        <p className="text-muted-foreground">
          Adres eklemek için hesabınız bir şirkete bağlı olmalıdır.
        </p>
      </div>
    )
  }

  const addresses = await getMyAddresses()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sevkiyat Adresleri</h1>
      <ShippingAddressManager
        organizationId={session.user.organizationId}
        addresses={addresses}
      />
    </div>
  )
}
