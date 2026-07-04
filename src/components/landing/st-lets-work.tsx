"use client"

import { LetsWorkTogether } from "@/components/ui/st-lets-work-section"

interface StLetsWorkProps {
  statusText?: string
  headlineLine1?: string
  headlineLine2?: string
  description?: string
  email?: string
  successTitle?: string
  successSubtitle?: string
  bookCallText?: string
  bookCallUrl?: string
  bookCallNote?: string
  demoteHeading?: boolean
}

export function StLetsWorkSection({
  statusText,
  headlineLine1,
  headlineLine2,
  description,
  email,
  successTitle,
  successSubtitle,
  bookCallText,
  bookCallUrl,
  bookCallNote,
}: StLetsWorkProps) {
  return (
    <LetsWorkTogether
      statusText={statusText}
      headlineLine1={headlineLine1}
      headlineLine2={headlineLine2}
      description={description}
      email={email}
      successTitle={successTitle}
      successSubtitle={successSubtitle}
      bookCallText={bookCallText}
      bookCallUrl={bookCallUrl}
      bookCallNote={bookCallNote}
    />
  )
}
