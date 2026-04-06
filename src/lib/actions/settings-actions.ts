"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSettings(group?: string) {
  const where = group ? { group } : {}
  const settings = await db.setting.findMany({ where })
  return Object.fromEntries(settings.map((s) => [s.key, s.value]))
}

export async function getSetting(key: string) {
  const setting = await db.setting.findUnique({ where: { key } })
  return setting?.value
}

export async function updateSettings(data: Record<string, string>) {
  for (const [key, value] of Object.entries(data)) {
    await db.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value, group: key.startsWith("company") ? "general" : "quote" },
    })
  }
  revalidatePath("/admin/settings")
}

export async function getLatestExchangeRates() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return db.exchangeRate.findMany({
    where: { date: { gte: today } },
    orderBy: { date: "desc" },
  })
}

export async function saveExchangeRates(rates: {
  currency: "TRY" | "USD" | "EUR" | "GBP"
  buyRate: number
  sellRate: number
  source: string
}[]) {
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
