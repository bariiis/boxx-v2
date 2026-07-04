import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const ALLOWED_EXT = ["woff2", "woff", "ttf", "otf"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const FORMAT_MAP: Record<string, string> = {
  woff2: "woff2",
  woff: "woff",
  ttf: "truetype",
  otf: "opentype",
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    const ext = (file.name.split(".").pop() || "").toLowerCase()
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json(
        { error: "Desteklenmeyen format. WOFF2, WOFF, TTF veya OTF yükleyin." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya boyutu 5MB'dan büyük olamaz" }, { status: 400 })
    }

    const dir = path.join(process.cwd(), "public", "uploads", "fonts")
    await mkdir(dir, { recursive: true })

    const fileName = `font-${Date.now()}.${ext}`
    const filePath = path.join(dir, fileName)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    return NextResponse.json({
      url: `/uploads/fonts/${fileName}`,
      format: FORMAT_MAP[ext] ?? "woff2",
    })
  } catch {
    return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 })
  }
}
