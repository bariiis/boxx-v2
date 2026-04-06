import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, surname, email, phone, password, companyName } = await request.json()

    if (!name || !surname || !email || !password) {
      return NextResponse.json({ error: "Tüm zorunlu alanları doldurun" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Şifre en az 6 karakter olmalı" }, { status: 400 })
    }

    // Check if email exists
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kayıtlı" }, { status: 400 })
    }

    const bcrypt = await import("bcryptjs")
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create organization if company name provided
    let organizationId: string | undefined
    if (companyName) {
      const org = await db.organization.create({
        data: {
          name: companyName,
          type: "COMPANY",
          source: "WEBSITE",
          status: "LEAD",
          email,
          phone,
        },
      })
      organizationId = org.id

      // Create contact
      await db.contact.create({
        data: {
          firstName: name,
          lastName: surname,
          email,
          phone,
          organizationId: org.id,
        },
      })
    }

    // Create user
    await db.user.create({
      data: {
        name,
        surname,
        email,
        phone,
        password: hashedPassword,
        role: "CUSTOMER",
        ...(organizationId && { organization: { connect: { id: organizationId } } }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Register error:", err)
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 })
  }
}
