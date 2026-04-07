import { getLandingPageBySlug } from "@/lib/actions/landing-actions"
import { LandingPageRenderer } from "@/components/landing/landing-renderer"
import ContactFallback from "./contact-fallback"

export async function generateMetadata() {
  const landing = await getLandingPageBySlug("iletisim")
  if (!landing) return { title: "İletişim | STUUX" }
  return {
    title: landing.metaTitle || `${landing.title} | STUUX`,
    description: landing.metaDescription || landing.description || undefined,
  }
}

export default async function ContactPage() {
  const landing = await getLandingPageBySlug("iletisim")

  if (!landing || landing.sections.length === 0) {
    return <ContactFallback />
  }

  const sections = landing.sections.map((s) => ({
    id: s.id,
    type: s.sectionType,
    config: JSON.parse(s.config) as Record<string, unknown>,
  }))

  return <LandingPageRenderer sections={sections} />
}
