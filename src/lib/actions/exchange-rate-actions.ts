"use server"

import { db } from "@/lib/db"
import { fetchTCMBRates } from "@/lib/exchange-rates"
import { revalidatePath } from "next/cache"
import type { Currency } from "@/generated/prisma"

export async function fetchAndSaveRates() {
  const rates = await fetchTCMBRates()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const saved = []

  for (const rate of rates) {
    const currency = rate.code as Currency
    if (!["USD", "EUR", "GBP"].includes(currency)) continue

    const record = await db.exchangeRate.upsert({
      where: {
        currency_source_date: {
          currency,
          source: "TCMB",
          date: today,
        },
      },
      update: {
        buyRate: rate.buyRate,
        sellRate: rate.sellRate,
      },
      create: {
        currency,
        source: "TCMB",
        buyRate: rate.buyRate,
        sellRate: rate.sellRate,
        date: today,
      },
    })
    saved.push({ ...record, name: rate.currency, effectiveBuyRate: rate.effectiveBuyRate, effectiveSellRate: rate.effectiveSellRate })
  }

  revalidatePath("/admin/settings")
  return { rates, savedCount: saved.length }
}

export async function saveManualRates(
  rates: { currency: Currency; buyRate: number; sellRate: number; source: string }[]
) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (const rate of rates) {
    await db.exchangeRate.upsert({
      where: {
        currency_source_date: {
          currency: rate.currency,
          source: rate.source,
          date: today,
        },
      },
      update: { buyRate: rate.buyRate, sellRate: rate.sellRate },
      create: { ...rate, date: today },
    })
  }

  revalidatePath("/admin/settings")
}

export async function getStoredRates() {
  return db.exchangeRate.findMany({
    orderBy: [{ date: "desc" }, { currency: "asc" }],
    take: 10,
  })
}
