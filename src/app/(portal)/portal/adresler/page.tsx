import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getMyAddresses } from "@/lib/actions/portal-actions"
import { ShippingAddressManager } from "@/components/admin/shipping-address-manager"

export default async function MyAddressesPage() {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return (
      <div className="flex flex-col gap-4">
        <header>
          <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
            Adresler
          </div>
          <h1 className="mt-1 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Sevkiyat Adresleri
            <span aria-hidden className="text-orange-500">.</span>
          </h1>
        </header>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Adres eklemek için hesabının bir şirkete bağlı olması gerekir.
          </p>
        </div>
      </div>
    )
  }

  const addresses = await getMyAddresses()

  return (
    <div className="flex flex-col gap-6">
      <header>
        <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.22em] text-orange-600 dark:text-orange-400">
          Adresler
        </div>
        <h1 className="mt-1 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Sevkiyat Adresleri
          <span aria-hidden className="text-orange-500">.</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Siparişlerin için kayıtlı teslim noktaları.
        </p>
      </header>
      <ShippingAddressManager
        organizationId={session.user.organizationId}
        addresses={addresses}
      />
    </div>
  )
}
