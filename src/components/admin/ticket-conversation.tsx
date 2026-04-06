"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Lock, Upload, Paperclip } from "lucide-react"
import { addTicketMessage, addTicketAttachment } from "@/lib/actions/ticket-actions"
import { toast } from "sonner"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface Message {
  id: string
  content: string
  isInternal: boolean
  createdAt: Date
  sender: { id: string; name: string | null; surname: string | null; role: string } | null
}

interface Attachment {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  createdAt: Date
}

interface TicketData {
  id: string
  description: string
  createdAt: Date
  messages: Message[]
  attachments: Attachment[]
}

export function TicketConversation({ ticket, userId }: { ticket: TicketData; userId: string }) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function handleSend() {
    if (!content.trim()) return
    setSending(true)
    try {
      await addTicketMessage({
        ticketId: ticket.id,
        senderId: userId,
        content: content.trim(),
        isInternal,
      })
      setContent("")
      setIsInternal(false)
      toast.success("Mesaj gönderildi")
      router.refresh()
    } catch {
      toast.error("Gönderilemedi")
    } finally {
      setSending(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 25 * 1024 * 1024) {
      toast.error("Dosya boyutu 25MB'dan büyük olamaz")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Yükleme başarısız")
        return
      }

      await addTicketAttachment({
        ticketId: ticket.id,
        fileName: file.name,
        fileUrl: data.url,
        fileSize: file.size,
        mimeType: file.type,
      })
      toast.success("Dosya yüklendi")
      router.refresh()
    } catch {
      toast.error("Yükleme başarısız")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      {/* Initial description */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground mb-2">
            {format(ticket.createdAt, "dd MMM yyyy HH:mm", { locale: tr })} — Talep açıldı
          </p>
          <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
        </CardContent>
      </Card>

      {/* Messages */}
      {ticket.messages.map((msg) => (
        <Card key={msg.id} className={msg.isInternal ? "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20" : ""}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {msg.sender ? `${msg.sender.name} ${msg.sender.surname}` : "Sistem"}
                </span>
                {msg.sender?.role && (
                  <Badge variant="outline" className="text-[10px]">
                    {msg.sender.role === "ADMIN" ? "Admin" : msg.sender.role === "EMPLOYEE" ? "Çalışan" : "Müşteri"}
                  </Badge>
                )}
                {msg.isInternal && (
                  <Badge variant="secondary" className="text-[10px]">
                    <Lock className="mr-1 size-2.5" />Dahili
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {format(msg.createdAt, "dd MMM yyyy HH:mm", { locale: tr })}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
          </CardContent>
        </Card>
      ))}

      {/* Attachments */}
      {ticket.attachments.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium mb-2">Ekler ({ticket.attachments.length})</p>
            <div className="space-y-2">
              {ticket.attachments.map((att) => (
                <a key={att.id} href={att.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border p-2 text-sm hover:bg-muted">
                  <Paperclip className="size-4 text-muted-foreground" />
                  <span className="flex-1">{att.fileName}</span>
                  <span className="text-xs text-muted-foreground">{formatSize(att.fileSize)}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reply form */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Yanıtınızı yazın..."
            rows={4}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isInternal}
                  onCheckedChange={(v) => setIsInternal(v === true)}
                  id="internal"
                />
                <Label htmlFor="internal" className="text-sm">
                  <Lock className="mr-1 inline size-3" />
                  Dahili not (müşteri görmez)
                </Label>
              </div>
              <label className="cursor-pointer">
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                <Button type="button" variant="outline" size="sm" asChild disabled={uploading}>
                  <span>
                    <Upload className="mr-2 size-3" />
                    {uploading ? "Yükleniyor..." : "Dosya Ekle"}
                  </span>
                </Button>
              </label>
            </div>
            <Button onClick={handleSend} disabled={sending || !content.trim()}>
              <Send className="mr-2 size-4" />
              {sending ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
