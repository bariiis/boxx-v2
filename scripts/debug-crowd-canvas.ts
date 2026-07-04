import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { config as loadEnv } from "dotenv"

loadEnv()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  const sections = await db.landingSection.findMany({
    where: { sectionType: "crowd-canvas" },
    include: { landingPage: { select: { slug: true, title: true } } },
  })
  console.log(`Crowd canvas sections: ${sections.length}`)
  for (const s of sections) {
    console.log("---")
    console.log("page:", s.landingPage.slug, "/", s.landingPage.title)
    console.log("id:", s.id)
    console.log("config:", s.config)
  }
}

main()
  .then(() => db.$disconnect())
  .catch((e) => {
    console.error(e)
    db.$disconnect()
    process.exit(1)
  })
