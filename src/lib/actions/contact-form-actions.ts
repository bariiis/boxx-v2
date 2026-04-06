"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function submitContactForm(data: {
  name: string
  company?: string
  email: string
  phone?: string
  subject: string
  category: string
  message: string
  productSlug?: string
}) {
  // Create or find organization
  let organizationId: string | undefined
  if (data.company) {
    const existing = await db.organization.findFirst({
      where: { name: { equals: data.company, mode: "insensitive" } },
    })
    if (existing) {
      organizationId = existing.id
    } else {
      const org = await db.organization.create({
        data: {
          name: data.company,
          type: "COMPANY",
          source: "WEBSITE",
          status: "LEAD",
          email: data.email,
          phone: data.phone,
        },
      })
      organizationId = org.id
    }
  }

  // Create contact if not exists
  const nameParts = data.name.trim().split(" ")
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(" ") || "-"

  let contactId: string | undefined
  const existingContact = await db.contact.findFirst({
    where: { email: data.email },
  })
  if (existingContact) {
    contactId = existingContact.id
  } else {
    const contact = await db.contact.create({
      data: {
        firstName,
        lastName,
        email: data.email,
        phone: data.phone,
        organizationId,
      },
    })
    contactId = contact.id
  }

  // Product info
  let productName: string | undefined
  if (data.productSlug) {
    const product = await db.product.findUnique({
      where: { slug: data.productSlug },
      select: { name: true },
    })
    productName = product?.name
  }

  // Create ticket for tracking
  const year = new Date().getFullYear()
  const prefix = `WEB-${year}-`
  const last = await db.ticket.findFirst({
    where: { ticketNumber: { startsWith: prefix } },
    orderBy: { ticketNumber: "desc" },
  })
  const lastNum = last ? parseInt(last.ticketNumber.replace(prefix, "")) : 0
  const ticketNumber = `${prefix}${String(lastNum + 1).padStart(4, "0")}`

  const fullMessage = [
    data.message,
    productName ? `\n\n---\nİlgili Ürün: ${productName}` : "",
    data.company ? `Şirket: ${data.company}` : "",
  ].filter(Boolean).join("\n")

  const ticket = await db.ticket.create({
    data: {
      ticketNumber,
      subject: `[${data.category}] ${data.subject}`,
      description: fullMessage,
      contactName: data.name,
      contactEmail: data.email,
      organizationId,
      contactId,
      priority: data.category === "Teklif İste" ? "HIGH" : "NORMAL",
    },
  })

  // Send email notification to admin
  try {
    const { sendEmail } = await import("@/lib/email")
    const settings = await db.setting.findUnique({ where: { key: "company_email" } })
    const adminEmail = settings?.value

    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `Yeni İletişim Formu: ${data.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #1e293b;">Yeni İletişim Formu</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Ad Soyad</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.name}</td></tr>
              ${data.company ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Şirket</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.company}</td></tr>` : ""}
              <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">E-posta</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.email}</td></tr>
              ${data.phone ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Telefon</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.phone}</td></tr>` : ""}
              <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Kategori</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.category}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Konu</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.subject}</td></tr>
              ${productName ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Ürün</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${productName}</td></tr>` : ""}
            </table>
            <div style="margin-top: 16px; padding: 12px; background: #f8fafc; border-radius: 4px;">
              <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
            </div>
            <p style="margin-top: 16px; font-size: 12px; color: #94a3b8;">Talep No: ${ticketNumber}</p>
          </div>
        `,
      })
    }
  } catch {}

  revalidatePath("/admin/tickets")
  return { ticketNumber, publicToken: ticket.publicToken }
}
