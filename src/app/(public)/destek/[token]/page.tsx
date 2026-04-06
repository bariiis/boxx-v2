import { notFound } from "next/navigation"
import { getPublicTicketByToken } from "@/lib/actions/public-ticket-actions"
import { TicketDetailClient } from "@/components/public/ticket-detail-client"

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const ticket = await getPublicTicketByToken(token)

  if (!ticket) notFound()

  return <TicketDetailClient ticket={ticket} token={token} />
}
