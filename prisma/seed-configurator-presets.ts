/**
 * Seeds SpecPresets for every component category the configurator engine
 * understands. Field `key` values match the SPEC_KEYS constants in
 * src/lib/configurator/specs-from-json.ts — do not change them, or the
 * engine will stop reading the values.
 *
 * Run with:  npx tsx prisma/seed-configurator-presets.ts
 *
 * This script DELETES ALL existing presets and product specs, then recreates
 * clean presets from scratch.
 */

import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const db = new PrismaClient({ adapter })

type Field = {
  key: string
  label: string
  unit?: string
  type?: "TEXT" | "SELECT" | "TEXTAREA"
  options?: string[]
  defaultValue?: string
}

type Preset = {
  name: string
  description: string
  fields: Field[]
}

// componentType is always first so the engine can identify the category.
const ct = (value: string): Field => ({
  key: "componentType",
  label: "Bileşen Tipi",
  type: "SELECT",
  options: [value],
  defaultValue: value,
})

const PRESETS: Preset[] = [
  // ==========================================
  // BASEKIT / CHASSIS
  // ==========================================
  {
    name: "Basekit / Chassis",
    description: "Workstation ana iskelet — slot, bay ve güç kapasitelerini tanımlar.",
    fields: [
      ct("basekit"),
      { key: "socketType", label: "CPU Soket Tipi", type: "SELECT", options: ["LGA1700", "LGA1851", "LGA4677", "AM5", "sTR5", "SP6"] },
      { key: "ramType", label: "RAM Tipi", type: "SELECT", options: ["DDR4", "DDR5", "DDR5 ECC", "DDR5 RDIMM"] },
      { key: "ramSlots", label: "RAM Slot Sayısı" },
      { key: "maxRamCapacity", label: "Max RAM Kapasitesi", unit: "GB" },
      { key: "pcieSlots", label: "Toplam PCIe Slot Genişliği (fallback)" },
      { key: "pcieLayout", label: "PCIe Layout (örn. 16,0,8o,0,0,0,1)", defaultValue: "" },
      { key: "nvmePorts", label: "NVMe M.2 Yuva Sayısı" },
      { key: "ssdBays", label: "2.5\" SSD Bay Sayısı" },
      { key: "hddBays", label: "3.5\" HDD Bay Sayısı" },
      { key: "maxGpuLength", label: "Max GPU Uzunluğu", unit: "mm" },
      { key: "maxGpuCount", label: "Max GPU Sayısı" },
      { key: "supportsDualPsu", label: "Çift PSU Desteği", type: "SELECT", options: ["evet", "hayır"] },
    ],
  },

  // ==========================================
  // CPU
  // ==========================================
  {
    name: "CPU",
    description: "İşlemci — soket uyumluluğu ve TDP kritik.",
    fields: [
      ct("cpu"),
      { key: "socketRequired", label: "Soket", type: "SELECT", options: ["LGA1700", "LGA1851", "LGA4677", "AM5", "sTR5", "SP6"] },
      { key: "tdpWatts", label: "TDP", unit: "W" },
    ],
  },

  // ==========================================
  // GPU
  // ==========================================
  {
    name: "GPU",
    description: "Ekran kartı — PCIe slot genişliği ve uzunluk basekit'e sığmalı.",
    fields: [
      ct("gpu"),
      { key: "tdpWatts", label: "TDP", unit: "W" },
      { key: "pcieSlotWidth", label: "Slot Genişliği (kaç slot kaplar)", type: "SELECT", options: ["1", "1.5", "2", "2.5", "3", "3.5", "4"], defaultValue: "2" },
      { key: "pcieLanesUsed", label: "PCIe Lane (electrical)", type: "SELECT", options: ["4", "8", "16"], defaultValue: "16" },
      { key: "pcieMinPhysical", label: "Min Fiziksel Slot", type: "SELECT", options: ["4", "8", "16"], defaultValue: "16" },
      { key: "lengthMm", label: "Kart Uzunluğu", unit: "mm" },
    ],
  },

  // ==========================================
  // RAM
  // ==========================================
  {
    name: "RAM",
    description: "Bellek modülü — basekit'in ramType ile eşleşmeli.",
    fields: [
      ct("ram"),
      { key: "ramType", label: "Tip", type: "SELECT", options: ["DDR4", "DDR5", "DDR5 ECC", "DDR5 RDIMM"] },
      { key: "ramCapacityGb", label: "Modül Kapasitesi", unit: "GB", type: "SELECT", options: ["8", "16", "32", "64", "96", "128", "256"] },
      { key: "idleWatts", label: "Idle Güç", unit: "W", defaultValue: "3" },
    ],
  },

  // ==========================================
  // NVMe SSD
  // ==========================================
  {
    name: "NVMe SSD",
    description: "M.2 NVMe depolama — basekit'in nvmePorts sayısını tüketir.",
    fields: [
      ct("nvme"),
      { key: "storageInterface", label: "Arayüz", type: "SELECT", options: ["nvme_m2"], defaultValue: "nvme_m2" },
      { key: "storageGb", label: "Kapasite", unit: "GB", type: "SELECT", options: ["250", "500", "1000", "2000", "4000", "8000"] },
      { key: "idleWatts", label: "Idle Güç", unit: "W", defaultValue: "7" },
    ],
  },

  // ==========================================
  // 2.5" SATA SSD
  // ==========================================
  {
    name: "2.5\" SSD",
    description: "SATA SSD — ssdBays tüketir.",
    fields: [
      ct("ssd"),
      { key: "storageInterface", label: "Arayüz", type: "SELECT", options: ["sata_2_5"], defaultValue: "sata_2_5" },
      { key: "storageGb", label: "Kapasite", unit: "GB", type: "SELECT", options: ["250", "500", "1000", "2000", "4000", "8000"] },
      { key: "idleWatts", label: "Idle Güç", unit: "W", defaultValue: "6" },
    ],
  },

  // ==========================================
  // HDD
  // ==========================================
  {
    name: "HDD",
    description: "3.5\" sabit disk — hddBays tüketir.",
    fields: [
      ct("hdd"),
      { key: "storageInterface", label: "Arayüz", type: "SELECT", options: ["sata_3_5"], defaultValue: "sata_3_5" },
      { key: "storageGb", label: "Kapasite", unit: "GB", type: "SELECT", options: ["1000", "2000", "4000", "8000", "12000", "16000", "18000", "20000", "22000"] },
      { key: "idleWatts", label: "Idle Güç", unit: "W", defaultValue: "8" },
    ],
  },

  // ==========================================
  // PSU
  // ==========================================
  {
    name: "Güç Kaynağı (PSU)",
    description: "Güç kaynağı — psuWatts değeri engine'e kapasiteyi bildirir.",
    fields: [
      ct("psu"),
      { key: "psuWatts", label: "Güç", unit: "W", type: "SELECT", options: ["650", "750", "850", "1000", "1200", "1500", "1600", "2000", "2050", "2400"] },
    ],
  },

  // ==========================================
  // COOLING
  // ==========================================
  {
    name: "Soğutma",
    description: "CPU soğutucu — TDP'ye göre seçim yapılmalı.",
    fields: [
      ct("cooling"),
      { key: "tdpWatts", label: "Desteklenen Max TDP", unit: "W" },
    ],
  },

  // ==========================================
  // EXPANSION CARD
  // ==========================================
  {
    name: "Genişleme Kartı",
    description: "Capture, ses, USB, HBA — PCIe slot tüketir.",
    fields: [
      ct("expansion_card"),
      { key: "pcieSlotWidth", label: "Slot Genişliği", type: "SELECT", options: ["1", "2"], defaultValue: "1" },
      { key: "pcieLanesUsed", label: "PCIe Lane (electrical)", type: "SELECT", options: ["1", "4", "8", "16"] },
      { key: "pcieMinPhysical", label: "Min Fiziksel Slot", type: "SELECT", options: ["1", "4", "8", "16"], defaultValue: "1" },
      { key: "tdpWatts", label: "Güç Tüketimi", unit: "W" },
    ],
  },

  // ==========================================
  // NETWORK CARD
  // ==========================================
  {
    name: "Ağ Kartı",
    description: "10G/25G NIC veya Wi-Fi — PCIe slot tüketir.",
    fields: [
      ct("network_card"),
      { key: "pcieSlotWidth", label: "Slot Genişliği", type: "SELECT", options: ["1", "2"], defaultValue: "1" },
      { key: "pcieLanesUsed", label: "PCIe Lane (electrical)", type: "SELECT", options: ["1", "4", "8"] },
      { key: "pcieMinPhysical", label: "Min Fiziksel Slot", type: "SELECT", options: ["1", "4", "8"], defaultValue: "1" },
      { key: "tdpWatts", label: "Güç Tüketimi", unit: "W" },
    ],
  },

  // ==========================================
  // NON-HARDWARE (add-ons — engine bunları kaynak tüketimi için okumaz)
  // ==========================================
  {
    name: "İşletim Sistemi",
    description: "Pre-installed OS seçenekleri.",
    fields: [
      ct("os"),
    ],
  },
  {
    name: "Garanti",
    description: "Uzatılmış garanti planları.",
    fields: [
      ct("warranty"),
    ],
  },
  {
    name: "Güç Kablosu",
    description: "Bölgesel güç kablosu.",
    fields: [
      ct("power_cable"),
    ],
  },
]

async function main() {
  console.log("=== TÜM SPEC PRESETLERİ SİLİNİYOR ===")
  // Delete all preset fields first (cascade should handle but be explicit)
  await db.specPresetField.deleteMany({})
  await db.specPreset.deleteMany({})
  console.log("  ✓ Tüm presetler silindi")

  console.log("\n=== TÜM ÜRÜN SPECS VERİLERİ TEMİZLENİYOR ===")
  // Clear all product specs JSON (set to empty array)
  await db.product.updateMany({
    data: { specs: [] },
  })
  console.log("  ✓ Tüm ürün specs verileri temizlendi")

  console.log(`\n=== ${PRESETS.length} PRESET OLUŞTURULUYOR ===`)

  let order = 0
  for (const p of PRESETS) {
    const preset = await db.specPreset.create({
      data: {
        name: p.name,
        description: p.description,
        sortOrder: order++,
      },
    })
    let fieldOrder = 0
    for (const f of p.fields) {
      await db.specPresetField.create({
        data: {
          presetId: preset.id,
          key: f.key,
          label: f.label,
          unit: f.unit || null,
          fieldType: f.type ?? "TEXT",
          options: f.options ? f.options : undefined,
          defaultValue: f.defaultValue ?? null,
          sortOrder: fieldOrder++,
        },
      })
    }
    console.log(`  ✓ ${p.name} (${p.fields.length} alan)`)
  }

  console.log("\n=== TAMAMLANDI ===")
  console.log("Şimdi admin panelinden ürünlerin specs'lerini presetten yükleyerek doldurun.")
  await db.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
