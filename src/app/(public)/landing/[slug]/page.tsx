export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { getLandingPageBySlug } from "@/lib/actions/landing-actions"
import { listCustomFonts } from "@/lib/actions/font-actions"
import { getProductForLandingHero } from "@/lib/actions/product-actions"
import { LandingPageRenderer } from "@/components/landing/landing-renderer"
import { buildFontFaceCss, type LandingTheme } from "@/lib/fonts"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const landing = await getLandingPageBySlug(slug)
  if (!landing) return { title: "Sayfa Bulunamadı", robots: { index: false, follow: false } }

  const title = landing.metaTitle || `${landing.title} | STUUX`
  const description = landing.metaDescription || landing.description || undefined
  const url = `/landing/${landing.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "STUUX",
      locale: "tr_TR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: landing.isActive
      ? { index: true, follow: true }
      : { index: false, follow: false },
  }
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const landing = await getLandingPageBySlug(slug)
  if (!landing) notFound()

  const rawSections = landing.sections.map((s) => ({
    id: s.id,
    type: s.sectionType,
    config: JSON.parse(s.config) as Record<string, unknown>,
  }))

  // Enrich product-hero sections with live product data
  const sections = await Promise.all(
    rawSections.map(async (s) => {
      if (s.type === "product-hero" && typeof s.config.productId === "string" && s.config.productId) {
        const data = await getProductForLandingHero(s.config.productId)
        if (data) {
          return {
            ...s,
            config: {
              ...s.config,
              product: { ...data.product, createdAt: data.product.createdAt.toISOString() },
              useCases: data.useCases,
              tags: data.tags,
            },
          }
        }
      }
      return s
    })
  )

  const theme: LandingTheme | null = landing.theme ? JSON.parse(landing.theme) : null
  const customFonts = await listCustomFonts()
  const fontFaceCss = buildFontFaceCss(customFonts)

  return (
    <>
      {fontFaceCss && <style dangerouslySetInnerHTML={{ __html: fontFaceCss }} />}
      {/* -mt-16 pulls content up by the sticky header height so hero sections start at viewport top */}
      <div className="-mt-16">
        <LandingPageRenderer
          sections={sections}
          theme={theme}
          customFonts={customFonts.map((f) => ({ family: f.family }))}
        />
      </div>
    </>
  )
}
