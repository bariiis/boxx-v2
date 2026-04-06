import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { readFileSync } from "fs"

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

// Field IDs from Airtable
const FIELDS = {
  software: "fldlQdta6nfueTJKz",
  mainCat: "fldhlfM4WHBK9mjWW",
  subCat: "fldOTowZTG5f3XhKC",
  intro: "fldsc1awrOFKQ8z9y",
  cpu: "fldxsxDsMmKuG1ZYB",
  gpu: "fldHIx8xwDCmOz4pN",
  ram: "fldOr5kEiqAHiu3ZY",
  storage: "fldyjce4Pyc5ze5Kf",
  audio: "fld7JdjL8nl7SOa2f",
  faq: "fldBqANxB2jRdm0tI",
}

// Map Airtable software names to our solution slugs
const SLUG_MAP: Record<string, string> = {
  "Adobe Lightroom Classic": "lightroom-classic",
  "Adobe Photoshop": "photoshop",
  "Üretken Yapay Zeka (Generative AI)": "uretken-yapay-zeka",
  "Adobe After Effects": "after-effects",
  "Adobe Premiere Pro": "premiere-pro",
  "DaVinci Resolve": "davinci-resolve",
  "Foundry Nuke": "foundry-nuke",
  "Autodesk 3ds Max": "3ds-max",
  "Autodesk Maya": "maya",
  "Blender": "blender",
  "Cinema 4D": "cinema-4d",
  "Houdini": "houdini",
  "ZBrush": "zbrush",
  "vMix": "vmix",
  "OBS Studio": "obs-canli-yayin",
  "Unity": "unity",
  "Unreal Engine": "unreal-engine",
  "Sanal Üretim (Virtual Production)": "sanal-uretim",
  "KeyShot": "keyshot",
  "OctaneRender": "octanerender",
  "Redshift": "redshift",
  "V-Ray": "v-ray",
  "Ableton Live": "ableton-live",
  "FL Studio": "fl-studio",
  "Pro Tools": "pro-tools",
  "AutoCAD": "autocad",
  "Autodesk Inventor": "inventor",
  "Revit": "revit",
  "SOLIDWORKS": "solidworks",
  "SOLIDCAM": "solidcam",
  "Enscape": "enscape",
  "Lumion": "lumion",
  "Twinmotion": "twinmotion",
  "Substance 3D": "substance-3d",
  "ArcGIS Pro": "arcgis-pro",
  "Agisoft Metashape": "metashape",
  "Pix4D": "pix4d",
  "RealityScan": "realityscan",
  "PyTorch": "pytorch",
  "TensorFlow": "tensorflow",
  "JAX": "jax",
  "TensorRT / ONNX / Hugging Face": "tensorrt-onnx",
  "Hugging Face / LLM": "hugging-face",
  "Kubeflow / MLFlow / Kubernetes": "ai-olceklendirme",
  "Hashcat": "hashcat",
  "Passware": "passware",
  // Broader matches
  "Bilimsel Hesaplama": "bilimsel-hesaplama",
  "Veri Bilimi": "veri-bilimi",
  "Yapay Zeka Dağıtım ve Çıkarım": "tensorrt-onnx",
  "Yapay Zeka Geliştirme": "pytorch",
  "Yapay Zekayı Ölçeklendirmek için Yüksek Performanslı Sunucular": "ai-olceklendirme",
  "Üretken Yapay Zeka (Fotoğraf)": "uretken-yapay-zeka",
  "Canlı Yayın (Live Streaming)": "obs-canli-yayin",
  "Sanal Prodüksiyon (Virtual Production)": "sanal-uretim",
  "RealityCapture": "realityscan",
  "Oyun Geliştirme (Genel)": "unity",
}

function richTextToHtml(text: string | undefined | null): string {
  if (!text) return ""
  // Convert markdown-like rich text to basic HTML
  return text
    .split("\n")
    .map((line) => {
      line = line.trim()
      if (!line) return ""
      // Bold: **text** or __text__
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      line = line.replace(/__(.*?)__/g, "<strong>$1</strong>")
      // Italic
      line = line.replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Bullet points
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return `<li>${line.slice(2)}</li>`
      }
      // Headers
      if (line.startsWith("# ")) return `<h2>${line.slice(2)}</h2>`
      if (line.startsWith("## ")) return `<h3>${line.slice(3)}</h3>`
      return `<p>${line}</p>`
    })
    .join("\n")
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error("Usage: npx tsx scripts/import-airtable-content.ts <path-to-airtable-json>")
    process.exit(1)
  }

  const raw = JSON.parse(readFileSync(filePath, "utf-8"))
  const records = raw.records as { id: string; cellValuesByFieldId: Record<string, unknown> }[]

  console.log(`Found ${records.length} Airtable records`)

  let matched = 0
  let skipped = 0

  for (const record of records) {
    const cells = record.cellValuesByFieldId || {}
    const softwareName = cells[FIELDS.software] as string | undefined
    if (!softwareName) { skipped++; continue }

    // Find matching slug
    let slug = SLUG_MAP[softwareName]
    if (!slug) {
      // Try partial match
      for (const [name, s] of Object.entries(SLUG_MAP)) {
        if (softwareName.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(softwareName.toLowerCase())) {
          slug = s
          break
        }
      }
    }

    if (!slug) {
      console.log(`  SKIP: No slug match for "${softwareName}"`)
      skipped++
      continue
    }

    // Find solution in DB
    const solution = await prisma.solution.findUnique({ where: { slug } })
    if (!solution) {
      console.log(`  SKIP: Solution not found in DB for slug "${slug}" (${softwareName})`)
      skipped++
      continue
    }

    // Get field values
    const intro = richTextToHtml(cells[FIELDS.intro] as string)
    const cpu = richTextToHtml(cells[FIELDS.cpu] as string)
    const gpu = richTextToHtml(cells[FIELDS.gpu] as string)
    const ram = richTextToHtml(cells[FIELDS.ram] as string)
    const storage = richTextToHtml(cells[FIELDS.storage] as string)
    const audio = richTextToHtml(cells[FIELDS.audio] as string)
    const faq = richTextToHtml(cells[FIELDS.faq] as string)

    // Update sections
    const updates = [
      { tabKey: "intro", content: intro },
      { tabKey: "cpu", content: cpu },
      { tabKey: "gpu", content: gpu },
      { tabKey: "ram", content: ram },
      { tabKey: "storage", content: storage },
      { tabKey: "faq", content: faq },
    ]

    for (const update of updates) {
      if (!update.content) continue
      try {
        await prisma.solutionSection.update({
          where: { solutionId_tabKey: { solutionId: solution.id, tabKey: update.tabKey } },
          data: { content: update.content },
        })
      } catch {
        // Section might not exist
      }
    }

    // If audio content exists and no "audio" section, create one
    if (audio) {
      const existing = await prisma.solutionSection.findUnique({
        where: { solutionId_tabKey: { solutionId: solution.id, tabKey: "audio" } },
      })
      if (!existing) {
        await prisma.solutionSection.create({
          data: { solutionId: solution.id, tabKey: "audio", tabLabel: "Ses Kartı", sortOrder: 5, content: audio },
        })
        // Move FAQ to sortOrder 6
        await prisma.solutionSection.update({
          where: { solutionId_tabKey: { solutionId: solution.id, tabKey: "faq" } },
          data: { sortOrder: 6 },
        }).catch(() => {})
      } else {
        await prisma.solutionSection.update({
          where: { solutionId_tabKey: { solutionId: solution.id, tabKey: "audio" } },
          data: { content: audio },
        })
      }
    }

    matched++
    console.log(`  OK: ${softwareName} → ${slug}`)
  }

  console.log(`\nDone! Matched: ${matched}, Skipped: ${skipped}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
