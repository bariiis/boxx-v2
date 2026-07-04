import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"


const ALLOWED_TYPES = [
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/webp",
]
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Desteklenmeyen format. SVG, PNG, JPG veya WebP yükleyin." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Dosya boyutu 2MB'dan büyük olamaz" },
        { status: 400 }
      )
    }

    const ext = file.name.split(".").pop() || "png"
    const fileName = `logo-${Date.now()}.${ext}`
    const filePath = path.join(process.cwd(), "public", "uploads", fileName)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    return NextResponse.json({ url: `/uploads/${fileName}` })
  } catch {
    return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 })
  }
}
