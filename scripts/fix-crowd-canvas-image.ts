import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { config as loadEnv } from "dotenv"

loadEnv()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  const sections = await db.landingSection.findMany({
    where: { sectionType: "crowd-canvas" },
  })

  let updated = 0
  for (const s of sections) {
    let config: Record<string, unknown>
    try {
      config = JSON.parse(s.config)
    } catch {
      continue
    }
    const current = config.imageSrc as string | undefined
    if (!current || current.includes("codepen.io") || current.includes("jsdelivr") || current === "") {
      config.imageSrc = "/images/peeps/all-peeps.png"
      await db.landingSection.update({
        where: { id: s.id },
        data: { config: JSON.stringify(config) },
      })
      updated++
    }
  }

  console.log(`Found ${sections.length} crowd-canvas sections, updated ${updated}`)
}

main()
  .then(() => db.$disconnect())
  .catch((e) => {
    console.error(e)
    db.$disconnect()
    process.exit(1)
  })
