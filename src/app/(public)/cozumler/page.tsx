import { getLandingPageBySlug } from "@/lib/actions/landing-actions"
import { LandingPageRenderer } from "@/components/landing/landing-renderer"
import SolutionsFallback from "./solutions-fallback"

export async function generateMetadata() {
  const landing = await getLandingPageBySlug("cozumler")
  if (!landing) return { title: "Çözümler | STUUX" }
  return {
    title: landing.metaTitle || `${landing.title} | STUUX`,
    description: landing.metaDescription || landing.description || undefined,
  }
}

export default async function SolutionsPage() {
  const landing = await getLandingPageBySlug("cozumler")

  if (!landing || landing.sections.length === 0) {
    return <SolutionsFallback />
  }

  const sections = landing.sections.map((s) => ({
    id: s.id,
    type: s.sectionType,
    config: JSON.parse(s.config) as Record<string, unknown>,
  }))

  return <LandingPageRenderer sections={sections} />
}
