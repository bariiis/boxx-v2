import { notFound } from "next/navigation"
import { getLandingPageBySlug } from "@/lib/actions/landing-actions"
import { LandingPageRenderer } from "@/components/landing/landing-renderer"

// Reserved slugs handled by their own folders/routes — never serve them from DB.
const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "login",
  "register",
  "customer",
  "urunler",
  "destek",
  "cozumler",
  "landing",
  "konfigurator",
])

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (RESERVED_SLUGS.has(slug)) return {}
  const landing = await getLandingPageBySlug(slug)
  if (!landing) return { title: "Sayfa Bulunamadı" }
  return {
    title: landing.metaTitle || `${landing.title} | STUUX`,
    description: landing.metaDescription || landing.description || undefined,
  }
}

export default async function DynamicLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (RESERVED_SLUGS.has(slug)) notFound()

  const landing = await getLandingPageBySlug(slug)
  if (!landing) notFound()

  const sections = landing.sections.map((s) => ({
    id: s.id,
    type: s.sectionType,
    config: JSON.parse(s.config) as Record<string, unknown>,
  }))

  return <LandingPageRenderer sections={sections} />
}
