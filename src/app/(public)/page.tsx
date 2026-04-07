import { getLandingPageBySlug } from "@/lib/actions/landing-actions"
import { LandingPageRenderer } from "@/components/landing/landing-renderer"
import HomeFallback from "./home-fallback"

export async function generateMetadata() {
  const landing = await getLandingPageBySlug("home")
  if (!landing) return { title: "STUUX" }
  return {
    title: landing.metaTitle || `${landing.title} | STUUX`,
    description: landing.metaDescription || landing.description || undefined,
  }
}

export default async function HomePage() {
  const landing = await getLandingPageBySlug("home")

  if (!landing || landing.sections.length === 0) {
    // Fallback: original static home until admin seeds the page
    return <HomeFallback />
  }

  const sections = landing.sections.map((s) => ({
    id: s.id,
    type: s.sectionType,
    config: JSON.parse(s.config) as Record<string, unknown>,
  }))

  return <LandingPageRenderer sections={sections} />
}
