import { NextRequest, NextResponse } from "next/server"

// Proxies external GLB/GLTF files to bypass browser CORS restrictions.
// Usage: /api/glb-proxy?url=https://example.com/model.glb
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "url param required" }, { status: 400 })
  }

  let targetUrl: URL
  try {
    targetUrl = new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  if (targetUrl.protocol !== "https:" && targetUrl.protocol !== "http:") {
    return NextResponse.json({ error: "Only http/https allowed" }, { status: 400 })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  try {
    const upstream = await fetch(targetUrl.toString(), {
      headers: { "User-Agent": "Mozilla/5.0" },
      redirect: "follow",
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream returned HTTP ${upstream.status}` },
        { status: 502 }
      )
    }

    const buffer = await upstream.arrayBuffer()

    // Detect format from magic bytes — no throwing if buffer is short
    const bytes = new Uint8Array(buffer.slice(0, 4))
    const isGlb = bytes[0] === 0x67 && bytes[1] === 0x6c && bytes[2] === 0x54 && bytes[3] === 0x46
    const isGltfJson = bytes[0] === 0x7b // starts with '{'
    const contentType = isGlb
      ? "model/gltf-binary"
      : isGltfJson
        ? "model/gltf+json"
        : upstream.headers.get("content-type") || "application/octet-stream"

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (err) {
    clearTimeout(timeout)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Proxy fetch failed: ${msg}` }, { status: 502 })
  }
}
