import nodemailer from "nodemailer"
import { db } from "@/lib/db"

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

async function getSmtpConfig(userId?: string) {
  // Try user-specific SMTP first
  if (userId) {
    const userSmtp = await db.smtpConfig.findUnique({ where: { userId } })
    if (userSmtp) return userSmtp
  }

  // Fallback: find any admin SMTP config
  const adminSmtp = await db.smtpConfig.findFirst({
    include: { user: { select: { role: true } } },
    orderBy: { user: { role: "asc" } },
  })
  return adminSmtp
}

export async function sendEmail(options: EmailOptions, userId?: string) {
  const smtp = await getSmtpConfig(userId)
  if (!smtp) {
    console.warn("SMTP yapılandırılmamış, e-posta gönderilemedi:", options.subject)
    return false
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.username,
      pass: smtp.password,
    },
  })

  try {
    await transporter.sendMail({
      from: options.from || `${smtp.fromName || "STUUX"} <${smtp.fromEmail || smtp.username}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
    return true
  } catch (err) {
    console.error("E-posta gönderim hatası:", err)
    return false
  }
}

export async function testSmtpConnection(config: {
  host: string
  port: number
  secure: boolean
  username: string
  password: string
}) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.username,
      pass: config.password,
    },
  })

  try {
    await transporter.verify()
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

// ==========================================
// EMAIL TEMPLATES
// ==========================================

export function quoteEmailTemplate({
  quoteNumber,
  companyName,
  customerName,
  projectName,
  totalAmount,
  currency,
  publicUrl,
}: {
  quoteNumber: string
  companyName: string
  customerName: string
  projectName?: string
  totalAmount: number
  currency: string
  publicUrl: string
}) {
  const sym: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }
  const s = sym[currency] || "$"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e293b; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">${companyName}</h1>
        <p style="margin: 4px 0 0; color: #94a3b8; font-size: 14px;">Teklif Bildirimi</p>
      </div>
      <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px;">Sayın ${customerName},</p>
        <p>Tarafınıza <strong>${quoteNumber}</strong> numaralı teklif hazırlanmıştır.</p>
        ${projectName ? `<p><strong>Proje:</strong> ${projectName}</p>` : ""}
        <p style="font-size: 24px; font-weight: bold; color: #1e293b;">
          ${totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}
        </p>
        <p>Teklifi incelemek, onaylamak veya reddetmek için aşağıdaki butona tıklayın:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${publicUrl}" style="display: inline-block; background: #1e293b; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Teklifi İncele
          </a>
        </div>
        <p style="font-size: 12px; color: #94a3b8;">
          Bu e-posta ${companyName} tarafından otomatik olarak gönderilmiştir.
        </p>
      </div>
    </div>
  `
}

export function orderConfirmationTemplate({
  orderNumber,
  companyName,
  customerName,
  totalAmount,
  currency,
}: {
  orderNumber: string
  companyName: string
  customerName: string
  totalAmount: number
  currency: string
}) {
  const sym: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" }
  const s = sym[currency] || "$"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #059669; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">${companyName}</h1>
        <p style="margin: 4px 0 0; color: #a7f3d0; font-size: 14px;">Sipariş Onayı</p>
      </div>
      <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px;">Sayın ${customerName},</p>
        <p>Teklifiniz onaylanmış ve <strong>${orderNumber}</strong> numaralı sipariş oluşturulmuştur.</p>
        <p style="font-size: 24px; font-weight: bold; color: #059669;">
          ${totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}
        </p>
        <p>Siparişiniz hazırlanmaya başlanacaktır. Süreç hakkında bilgilendirileceksiniz.</p>
        <p style="font-size: 12px; color: #94a3b8;">
          Bu e-posta ${companyName} tarafından otomatik olarak gönderilmiştir.
        </p>
      </div>
    </div>
  `
}

export function ticketNotificationTemplate({
  ticketNumber,
  companyName,
  customerName,
  subject,
  publicUrl,
}: {
  ticketNumber: string
  companyName: string
  customerName: string
  subject: string
  publicUrl: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e293b; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">${companyName}</h1>
        <p style="margin: 4px 0 0; color: #94a3b8; font-size: 14px;">Destek Talebi Yanıtı</p>
      </div>
      <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px;">Sayın ${customerName},</p>
        <p><strong>${ticketNumber}</strong> numaralı destek talebinize yanıt verilmiştir.</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${publicUrl}" style="display: inline-block; background: #1e293b; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Yanıtı Görüntüle
          </a>
        </div>
        <p style="font-size: 12px; color: #94a3b8;">
          Bu e-posta ${companyName} tarafından otomatik olarak gönderilmiştir.
        </p>
      </div>
    </div>
  `
}
