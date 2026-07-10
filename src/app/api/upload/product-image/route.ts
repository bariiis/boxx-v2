import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getStaffSession } from "@/lib/auth-guard"

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  if (!(await getStaffSession())) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const productId = formData.get("productId") as string | null

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    if (!productId || !/^[a-zA-Z0-9_-]+$/.test(productId)) {
      return NextResponse.json({ error: "Ürün ID gerekli" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Desteklenmeyen format. PNG, JPG veya WebP yükleyin." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Dosya boyutu 5MB'dan büyük olamaz" },
        { status: 400 }
      )
    }

    const dir = path.join(process.cwd(), "public", "uploads", "products", productId)
    await mkdir(dir, { recursive: true })

    const ext = file.name.split(".").pop() || "jpg"
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = path.join(dir, fileName)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const url = `/uploads/products/${productId}/${fileName}`
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 })
  }
}
