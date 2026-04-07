import { notFound } from "next/navigation"
import { getLandingPage } from "@/lib/actions/landing-actions"
import { LandingEditor } from "@/components/admin/landing-editor"

export default async function LandingPageEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const landing = await getLandingPage(id)
  if (!landing) notFound()

  return <LandingEditor landing={landing} />
}
