const TCMB_URL = "https://www.tcmb.gov.tr/kurlar/today.xml"

interface ExchangeRateResult {
  currency: string
  code: string
  buyRate: number
  sellRate: number
  effectiveBuyRate: number
  effectiveSellRate: number
}

export async function fetchTCMBRates(): Promise<ExchangeRateResult[]> {
  const res = await fetch(TCMB_URL, { cache: "no-store" })
  if (!res.ok) throw new Error(`TCMB fetch failed: ${res.status}`)

  const xml = await res.text()
  const rates: ExchangeRateResult[] = []

  const targetCurrencies = ["USD", "EUR", "GBP"]

  for (const code of targetCurrencies) {
    const regex = new RegExp(
      `<Currency[^>]*CurrencyCode="${code}"[^>]*>([\\s\\S]*?)</Currency>`
    )
    const match = xml.match(regex)
    if (!match) continue

    const block = match[1]

    const getName = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))
      return m ? m[1] : ""
    }

    const forexBuy = parseFloat(getName("ForexBuying")) || 0
    const forexSell = parseFloat(getName("ForexSelling")) || 0
    const banknoteBuy = parseFloat(getName("BanknoteBuying")) || 0
    const banknoteSell = parseFloat(getName("BanknoteSelling")) || 0
    const currencyName = getName("CurrencyName")

    rates.push({
      currency: currencyName,
      code,
      buyRate: forexBuy,
      sellRate: forexSell,
      effectiveBuyRate: banknoteBuy,
      effectiveSellRate: banknoteSell,
    })
  }

  return rates
}
