"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send, Clock, User, Shield, Paperclip, FileIcon, Download } from "lucide-react"
import { addPublicMessage } from "@/lib/actions/public-ticket-actions"
import { toast } from "sonner"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Açık", color: "bg-blue-100 text-blue-700" },
  AWAITING_REPLY: { label: "Yanıt Bekleniyor", color: "bg-amber-100 text-amber-700" },
  RESOLVED: { label: "Çözüldü", color: "bg-green-100 text-green-700" },
  CLOSED: { label: "Kapatıldı", color: "bg-gray-100 text-gray-700" },
}

interface Message {
  id: string
  content: string
  isInternal: boolean
  createdAt: Date
  sender: { name: string | null; surname: string | null; role: string } | null
}

interface TicketData {
  id: string
  ticketNumber: string
  subject: string
  description: string
  status: string
  contactName: string | null
  contactEmail: string | null
  createdAt: Date
  category: { name: string } | null
  messages: Message[]
  attachments: { id: string; fileName: string; fileUrl: string; fileSize: number; mimeType: string }[]
}

export function TicketDetailClient({ ticket, token }: { ticket: TicketData; token: string }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const st = statusConfig[ticket.status] || statusConfig.OPEN
  const isClosed = ticket.status === "CLOSED"

  async function handleSend() {
    if (!message.trim()) return
    setLoading(true)
    try {
      await addPublicMessage(token, message.trim())
      setMessage("")
      toast.success("Mesaj gönderildi")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/destek"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Destek
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-mono">{ticket.ticketNumber}</h1>
                <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${st.color}`}>
                  {st.label}
                </span>
              </div>
              <h2 className="mt-1 text-lg">{ticket.subject}</h2>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                {ticket.category && <span>{ticket.category.name}</span>}
                <span>{format(ticket.createdAt, "dd MMM yyyy HH:mm", { locale: tr })}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-4">
        {/* Original description */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="size-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{ticket.contactName || "Müşteri"}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(ticket.createdAt, "dd MMM yyyy HH:mm", { locale: tr })}
                  </span>
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">{ticket.description}</p>
                {/* Attachments */}
                {ticket.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Paperclip className="size-3" /> {ticket.attachments.length} ek
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ticket.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          {att.mimeType.startsWith("image/") ? (
                            <img
                              src={att.fileUrl}
                              alt={att.fileName}
                              className="h-20 w-auto rounded-md border object-cover transition-opacity group-hover:opacity-80"
                            />
                          ) : (
                            <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 transition-colors group-hover:bg-muted">
                              <FileIcon className="size-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs font-medium truncate max-w-32">{att.fileName}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {(att.fileSize / 1024 / 1024).toFixed(1)} MB
                                </p>
                              </div>
                              <Download className="size-3 text-muted-foreground" />
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {ticket.messages.map((msg) => {
          const isStaff = msg.sender?.role === "ADMIN" || msg.sender?.role === "EMPLOYEE"
          return (
            <Card key={msg.id} className={isStaff ? "border-l-4 border-l-primary" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                    isStaff ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {isStaff ? <Shield className="size-4" /> : <User className="size-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {isStaff
                          ? `${msg.sender?.name || ""} ${msg.sender?.surname || ""}`.trim() || "Destek Ekibi"
                          : ticket.contactName || "Müşteri"
                        }
                      </span>
                      {isStaff && (
                        <Badge variant="outline" className="text-[10px]">Destek Ekibi</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(msg.createdAt, "dd MMM yyyy HH:mm", { locale: tr })}
                      </span>
                    </div>
                    <p className="mt-2 text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Reply form */}
        {!isClosed ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Yanıt Yaz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
                rows={4}
              />
              <Button onClick={handleSend} disabled={loading || !message.trim()}>
                <Send className="mr-2 size-4" />
                {loading ? "Gönderiliyor..." : "Gönder"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Clock className="mx-auto mb-2 size-8 opacity-50" />
              Bu destek talebi kapatılmıştır. Yeni bir sorun için lütfen yeni talep oluşturun.
            </CardContent>
          </Card>
        )}

        {/* Ticket info footer */}
        <p className="text-center text-xs text-muted-foreground">
          Bu sayfanın linkini saklayın — talebinizi buradan takip edebilirsiniz.
        </p>
      </section>
    </div>
  )
}
