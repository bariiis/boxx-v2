"use client"

import { useEffect } from "react"
import { StuuxHeroIntro } from "./sections/stuux-hero-intro"
import { StuuxJourneyHorizontal } from "./sections/stuux-journey-horizontal"
import { StuuxDetailReveal } from "./sections/stuux-detail-reveal"
import { StuuxFooterCta } from "./sections/stuux-footer-cta"
import { StuuxStickyCta } from "./primitives/stuux-sticky-cta"
import { homeV2Data } from "./data"

export function HomeV2() {
  useEffect(() => {
    document.body.classList.add("stuux-theme")
    // Remove the legacy hybrid theme token so STUUX palette takes over
    document.body.removeAttribute("data-home-theme")
    return () => {
      document.body.classList.remove("stuux-theme")
    }
  }, [])

  return (
    <>
      <main className="stuux-theme relative">
        <StuuxHeroIntro data={homeV2Data.hero} />
        <StuuxJourneyHorizontal />
        <StuuxDetailReveal
          logos={homeV2Data.logos}
          testimonial={homeV2Data.testimonial}
        />
        <StuuxFooterCta />
      </main>
      <StuuxStickyCta />
    </>
  )
}
