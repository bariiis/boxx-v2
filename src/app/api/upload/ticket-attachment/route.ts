import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const ALLOWED_TYPES = [
  "image/png", "image/jpeg", "image/webp", "image/gif",
  "video/mp4", "video/webm", "video/quicktime",
  "application/pdf",
  "application/zip", "application/x-zip-compressed",
  "text/plain", "text/csv",
]
const MAX_SIZE = 25 * 1024 * 1024 // 25MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const ticketId = formData.get("ticketId") as string | null

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Desteklenmeyen format. Resim, video, PDF veya ZIP yükleyin." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Dosya boyutu 25MB'dan büyük olamaz" },
        { status: 400 }
      )
    }

    // Allow only safe id characters so the folder can't escape the uploads dir
    const folder = ticketId && /^[a-zA-Z0-9_-]+$/.test(ticketId) ? ticketId : "general"
    const dir = path.join(process.cwd(), "public", "uploads", "tickets", folder)
    await mkdir(dir, { recursive: true })

    const ext = file.name.split(".").pop() || "bin"
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = path.join(dir, safeName)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const url = `/uploads/tickets/${folder}/${safeName}`
    return NextResponse.json({
      url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    })
  } catch {
    return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 })
  }
}
