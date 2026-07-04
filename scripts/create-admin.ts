import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import * as dotenv from "dotenv"
import bcrypt from "bcryptjs"

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  const hashed = await bcrypt.hash("admin123", 12)
  const admin = await db.user.upsert({
    where: { email: "admin@stuux.com" },
    update: { password: hashed, role: "ADMIN" },
    create: {
      email: "admin@stuux.com",
      name: "Admin",
      password: hashed,
      role: "ADMIN",
    },
  })
  console.log("Admin ready:", admin.email, "role:", admin.role)
  await db.$disconnect()
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
