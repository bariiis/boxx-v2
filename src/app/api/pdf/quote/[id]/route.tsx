import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { db } from "@/lib/db"
import { QuotePDF } from "@/lib/pdf/quote-pdf"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Support both quote ID and public token
  const quote = await db.quote.findFirst({
    where: { OR: [{ id }, { publicToken: id }] },
    include: {
      organization: true,
      contact: true,
      createdBy: { select: { name: true, surname: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, sku: true } },
          configItems: {
            include: { product: { select: { name: true } } },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  if (!quote) {
    return NextResponse.json({ error: "Teklif bulunamadı" }, { status: 404 })
  }

  const settings = await db.setting.findUnique({ where: { key: "company_name" } })
  const companyName = settings?.value || "STUUX"

  try {
    const buffer = await renderToBuffer(
      <QuotePDF quote={quote as any} companyName={companyName} />
    )

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${quote.quoteNumber}.pdf"`,
      },
    })
  } catch (err) {
    console.error("PDF generation error:", err)
    return NextResponse.json({ error: "PDF oluşturulamadı" }, { status: 500 })
  }
}
