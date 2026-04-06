import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getSmtpConfig } from "@/lib/actions/smtp-actions"
import { SmtpForm } from "@/components/admin/smtp-form"

export default async function SmtpPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const config = await getSmtpConfig(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">E-posta Ayarları</h1>
        <p className="text-muted-foreground">SMTP sunucu ayarlarını yapılandırın. E-posta bildirimleri bu ayarlar üzerinden gönderilir.</p>
      </div>
      <SmtpForm userId={session.user.id} config={config} />
    </div>
  )
}
