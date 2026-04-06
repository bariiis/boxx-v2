import { notFound } from "next/navigation"
import { getSolution } from "@/lib/actions/solution-actions"
import { SolutionEditor } from "@/components/admin/solution-editor"

export default async function SolutionEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const solution = await getSolution(id)
  if (!solution) notFound()

  return <SolutionEditor solution={solution} />
}
