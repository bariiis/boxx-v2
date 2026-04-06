import { getSettings } from "@/lib/actions/settings-actions"
import { getStoredRates } from "@/lib/actions/exchange-rate-actions"
import { SettingsForm } from "@/components/admin/settings-form"
import { ExchangeRatePanel } from "@/components/admin/exchange-rate-panel"

export default async function SettingsPage() {
  const [settings, storedRates] = await Promise.all([
    getSettings(),
    getStoredRates(),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ayarlar</h1>
      <ExchangeRatePanel storedRates={storedRates} rateSource={settings.exchange_rate_source || "TCMB"} />
      <SettingsForm settings={settings} />
    </div>
  )
}
