import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import * as dotenv from "dotenv"
import bcrypt from "bcryptjs"

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  const admin = await db.user.findUnique({ where: { email: "admin@stuux.com" } })
  if (!admin) {
    console.log("ADMIN NOT FOUND — seed çalıştırılmamış")
  } else {
    console.log("ADMIN found:", {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      hasPassword: !!admin.password,
    })
    if (admin.password) {
      const ok = await bcrypt.compare("admin123", admin.password)
      console.log("admin123 matches:", ok)
    }
  }
  await db.$disconnect()
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
