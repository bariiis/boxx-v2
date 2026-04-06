"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { testSmtpConnection } from "@/lib/email"

export async function getSmtpConfig(userId: string) {
  return db.smtpConfig.findUnique({ where: { userId } })
}

export async function saveSmtpConfig(
  userId: string,
  data: {
    host: string
    port: number
    secure: boolean
    username: string
    password: string
    fromName?: string
    fromEmail?: string
  }
) {
  const config = await db.smtpConfig.upsert({
    where: { userId },
    update: data,
    create: { ...data, userId },
  })
  revalidatePath("/admin/smtp")
  return config
}

export async function testSmtp(data: {
  host: string
  port: number
  secure: boolean
  username: string
  password: string
}) {
  return testSmtpConnection(data)
}

export async function sendTestEmail(userId: string, to: string) {
  const { sendEmail } = await import("@/lib/email")
  const result = await sendEmail(
    {
      to,
      subject: "STUUX - SMTP Test E-postası",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1e293b;">SMTP Bağlantı Testi Başarılı!</h2>
          <p>Bu e-posta STUUX yönetim panelinden gönderilmiştir.</p>
          <p style="color: #94a3b8; font-size: 12px;">Tarih: ${new Date().toLocaleString("tr-TR")}</p>
        </div>
      `,
    },
    userId
  )
  return result
}
