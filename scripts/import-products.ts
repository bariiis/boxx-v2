import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { readFileSync } from "fs"

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

function slugify(t: string) {
  return t.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s")
    .replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/â/g,"a")
    .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")
}

// Airtable field IDs
const F = {
  system: "fldm4zlNJlthTYyQF",
  motherboard: "fldZoZjga4iDGX2lB",
  cpu: "fld8BYL4oEZc6hC4s",
  formFactor: "fldzk38g1IbEM4Owy",
  chipset: "fldUgahIXr49KJvjv",
  dimmSlots: "fldA6HfhjUjy19L1s",
  maxRam: "fldhosPfjFlENsgWJ",
  maxGpu: "fld1jKM442xRVDvEq",
  m2Slots: "fldA865DgSzg4bKYJ",
  material: "fld254rHbxxnbj7S8",
  ioPanel: "fldRlEGPNGDBwz0Yo",
  ssdBays: "fldnhkpDzb0IrItR7",
  hddBays: "fldmqY7QmggYh1CYR",
  ethernet: "fldG1qgH6AMkmBT11",
  wireless: "fld33XVt5GtczvWUA",
  remoteManagement: "fldnix6RPgRZ5T5XD",
  audio: "flduQM14hV4Rnw0fc",
  dimensions: "fldU9xxKuoVQ1G4Qo",
  weight: "fldXXkwo0DatseoHb",
  cooling: "fldmsZVcNRKGZ1h8d",
  coolingCapacity: "fldgUXMk7sOJSp5tR",
  psu: "fldyOKiSaSjG6rd1I",
  caseType: "fldmYwuOsLaptfFb8",
  rackMount: "fldakJ1rdBWR94bvC",
  noiseLevel: "fldY4h8IO42Gu4b7O",
  series: "fldZ03F4becWTilkZ",
}

function getVal(cells: Record<string, unknown>, fieldId: string): string {
  const v = cells[fieldId]
  if (!v) return ""
  if (typeof v === "string") return v
  if (typeof v === "number") return String(v)
  if (typeof v === "object" && v !== null && "name" in v) return (v as { name: string }).name
  return String(v)
}

async function getOrCreateCategory(name: string, slug: string, parentId?: string, sortOrder = 0) {
  let cat = await prisma.productCategory.findUnique({ where: { slug } })
  if (!cat) {
    cat = await prisma.productCategory.create({ data: { name, slug, parentId, sortOrder } })
    console.log(`  + Category: ${name}`)
  }
  return cat
}

async function main() {
  // Create categories
  const ws = await getOrCreateCategory("İş İstasyonları", "is-istasyonlari", undefined, 0)
  const gpu = await getOrCreateCategory("GPU Sunucular", "gpu-sunucular", undefined, 1)
  const openFrame = await getOrCreateCategory("Open Frame", "open-frame", undefined, 2)

  const pixelTwo = await getOrCreateCategory("Pixel Two", "pixel-two", ws.id, 0)
  const c500w = await getOrCreateCategory("C500W", "c500w", ws.id, 1)
  const c700w = await getOrCreateCategory("Designer C700W", "designer-c700w", ws.id, 2)
  const c1000w = await getOrCreateCategory("Designer C1000W", "designer-c1000w", ws.id, 3)
  const gigas = await getOrCreateCategory("GIGAS İş İstasyonu", "gigas-is-istasyonu", gpu.id, 0)
  const gigasGpu = await getOrCreateCategory("GIGAS GPU Sunucu", "gigas-gpu-sunucu", gpu.id, 1)
  const xtia = await getOrCreateCategory("Xtia", "xtia", openFrame.id, 0)
  const xworks = await getOrCreateCategory("Xworks", "xworks", openFrame.id, 1)

  // Delete "Mini İş İstasyonları" if empty
  const mini = await prisma.productCategory.findUnique({ where: { slug: "mini-is-istasyonlari" } })
  if (mini) {
    const products = await prisma.product.findMany({ where: { categoryId: mini.id } })
    if (products.length === 0) {
      await prisma.productCategory.delete({ where: { id: mini.id } })
      console.log("  - Deleted empty: Mini İş İstasyonları")
    }
  }

  // Category mapping by system name
  const catMap: Record<string, string> = {
    "Pixel Two - INTEL": pixelTwo.id,
    "Pixel Two - AMD": pixelTwo.id,
    "C500W - INTEL": c500w.id,
    "C500W - AMD": c500w.id,
    "Designer C700W - TREADRIPPER": c700w.id,
    "Designer C700W - TREADRIPPER PRO": c700w.id,
    "Designer C700W - SINGLE EPYC": c700w.id,
    "Designer C700W - XEON 600": c700w.id,
    "Designer C1000W - DUAL EPYC": c1000w.id,
    "Designer C1000W - DUAL XEON": c1000w.id,
    "GIGAS İŞ İSTASYONU Treadripper Pro": gigas.id,
    "GIGAS İŞ İSTASYONU Xeon 600": gigas.id,
    "GIGAS İŞ İSTASYONU EPYC": gigas.id,
    "GIGAS GPU SUNUCU - Dual EPYC": gigasGpu.id,
    "GIGAS GPU SUNUCU - Dual Xeon": gigasGpu.id,
    "Xtia - INTEL": xtia.id,
    "Xtia - AMD": xtia.id,
    "Xworks - INTEL": xworks.id,
    "Xworks- AMD": xworks.id,
    "Xworks - AMD": xworks.id,
  }

  // SKU mapping
  const skuMap: Record<string, string> = {
    "Pixel Two - INTEL": "STX-PT-Z890",
    "Pixel Two - AMD": "STX-PT-X870",
    "C500W - INTEL": "STX-C5-INT",
    "C500W - AMD": "STX-C5-AMD",
    "Designer C700W - TREADRIPPER": "STX-C7-TR",
    "Designer C700W - TREADRIPPER PRO": "STX-C7-TRP",
    "Designer C700W - SINGLE EPYC": "STX-C7-EPYC",
    "Designer C700W - XEON 600": "STX-C7-XEON",
    "Designer C1000W - DUAL EPYC": "STX-C10-EPYC",
    "Designer C1000W - DUAL XEON": "STX-C10-XEON",
    "GIGAS İŞ İSTASYONU Treadripper Pro": "STX-GW-TRP",
    "GIGAS İŞ İSTASYONU Xeon 600": "STX-GW-XEON",
    "GIGAS İŞ İSTASYONU EPYC": "STX-GW-EPYC",
    "GIGAS GPU SUNUCU - Dual EPYC": "STX-GG-EPYC",
    "GIGAS GPU SUNUCU - Dual Xeon": "STX-GG-XEON",
    "Xtia - INTEL": "STX-OF-XTIA-INT",
    "Xtia - AMD": "STX-OF-XTIA-AMD",
    "Xworks - INTEL": "STX-OF-XW-INT",
    "Xworks- AMD": "STX-OF-XW-AMD",
  }

  // Read Airtable JSON (passed as arg, or read all from API)
  // For now, process from saved files
  const files = process.argv.slice(2)
  let allRecords: { cellValuesByFieldId: Record<string, unknown> }[] = []

  if (files.length > 0) {
    for (const f of files) {
      const data = JSON.parse(readFileSync(f, "utf-8"))
      allRecords.push(...data.records)
    }
  }

  if (allRecords.length === 0) {
    console.log("No Airtable data files provided. Using existing products and updating specs only.")
    return
  }

  console.log(`\nProcessing ${allRecords.length} Airtable records...\n`)

  let updated = 0
  let created = 0

  for (const record of allRecords) {
    const cells = record.cellValuesByFieldId || {}
    const systemName = getVal(cells, F.system)
    if (!systemName) continue

    const sku = skuMap[systemName]
    if (!sku) {
      console.log(`  SKIP: No SKU for "${systemName}"`)
      continue
    }

    const specs: Record<string, string> = {}
    specs.cpu = getVal(cells, F.cpu)
    specs.motherboard = getVal(cells, F.motherboard)
    specs.chipset = getVal(cells, F.chipset)
    specs.formFactor = getVal(cells, F.formFactor)
    specs.maxRam = getVal(cells, F.maxRam)
    specs.dimmSlots = getVal(cells, F.dimmSlots)
    specs.maxGpu = getVal(cells, F.maxGpu)
    specs.m2Slots = getVal(cells, F.m2Slots)
    specs.ssdBays = getVal(cells, F.ssdBays)
    specs.hddBays = getVal(cells, F.hddBays)
    specs.material = getVal(cells, F.material)
    specs.ioPanel = getVal(cells, F.ioPanel)
    specs.ethernet = getVal(cells, F.ethernet)
    specs.wireless = getVal(cells, F.wireless)
    specs.remoteManagement = getVal(cells, F.remoteManagement)
    specs.audio = getVal(cells, F.audio)
    specs.dimensions = getVal(cells, F.dimensions)
    specs.weight = getVal(cells, F.weight)
    specs.cooling = getVal(cells, F.cooling)
    specs.coolingCapacity = getVal(cells, F.coolingCapacity)
    specs.psu = getVal(cells, F.psu)
    specs.caseType = getVal(cells, F.caseType)
    specs.rackMount = getVal(cells, F.rackMount)
    specs.noiseLevel = getVal(cells, F.noiseLevel)
    specs.series = getVal(cells, F.series)

    // Remove empty values
    for (const [k, v] of Object.entries(specs)) {
      if (!v) delete specs[k]
    }

    const catId = catMap[systemName]

    const existing = await prisma.product.findUnique({ where: { sku } })
    if (existing) {
      await prisma.product.update({
        where: { sku },
        data: {
          specs: specs as never,
          ...(catId && { categoryId: catId }),
        },
      })
      updated++
      console.log(`  UPDATE: ${systemName} → ${sku}`)
    } else {
      await prisma.product.create({
        data: {
          name: systemName,
          sku,
          slug: slugify(systemName),
          type: "CONFIGURABLE",
          warrantyMonths: 36,
          specs: specs as never,
          ...(catId && { categoryId: catId }),
        },
      })
      created++
      console.log(`  CREATE: ${systemName} → ${sku}`)
    }
  }

  console.log(`\nDone! Created: ${created}, Updated: ${updated}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
