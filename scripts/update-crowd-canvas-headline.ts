import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { config as loadEnv } from "dotenv"

loadEnv()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

async function main() {
  const sections = await db.landingSection.findMany({
    where: { sectionType: "crowd-canvas" },
  })

  for (const s of sections) {
    const config = JSON.parse(s.config)
    config.label = ""
    config.headline = "KALABALIĞIN İÇİNDE KAYBOLMA"
    config.description = LOREM
    config.primaryCtaText = "Detaylar"
    config.primaryCtaHref = config.primaryCtaHref || "#"
    config.secondaryCtaText = "İletişim"
    config.secondaryCtaHref = config.secondaryCtaHref || "/iletisim"
    await db.landingSection.update({
      where: { id: s.id },
      data: { config: JSON.stringify(config) },
    })
  }
  console.log(`Updated ${sections.length} crowd-canvas sections`)
}

main()
  .then(() => db.$disconnect())
  .catch((e) => {
    console.error(e)
    db.$disconnect()
    process.exit(1)
  })
