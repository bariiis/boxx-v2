"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type RoadmapMilestoneStatus = "complete" | "in-progress" | "pending"

export interface RoadmapMilestone {
  id: number | string
  name: string
  status: RoadmapMilestoneStatus
  top?: string
  left?: string
  right?: string
  bottom?: string
}

export interface AnimatedRoadmapSectionProps {
  headline?: string
  highlightedWord?: string
  headlineSuffix?: string
  description?: string
  primaryCtaText?: string
  primaryCtaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  mapImageSrc?: string
  milestones?: RoadmapMilestone[]
  demoteHeading?: boolean
}

function MilestoneMarker({ milestone, index }: { milestone: RoadmapMilestone; index: number }) {
  const statusClasses: Record<RoadmapMilestoneStatus, string> = {
    complete: "bg-green-500 border-green-700",
    "in-progress": "bg-blue-500 border-blue-700 animate-pulse",
    pending: "bg-muted border-border",
  }

  const position: React.CSSProperties = {
    top: milestone.top,
    left: milestone.left,
    right: milestone.right,
    bottom: milestone.bottom,
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.3, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.8 }}
      className="absolute flex items-center gap-4"
      style={position}
    >
      <div className="relative flex h-8 w-8 items-center justify-center">
        <div
          className={cn(
            "absolute h-3 w-3 rounded-full border-2",
            statusClasses[milestone.status] ?? statusClasses.pending,
          )}
        />
        <div className="absolute h-full w-full rounded-full bg-primary/10" />
      </div>
      <div className="rounded-full border bg-card px-4 py-2 text-sm font-medium text-card-foreground shadow-sm whitespace-nowrap">
        {milestone.name}
      </div>
    </motion.div>
  )
}

export function AnimatedRoadmapSection({
  headline = "Stay ahead with a",
  highlightedWord = "clear",
  headlineSuffix = "product plan",
  description = "Visualize your roadmap, assign tasks, and hit every milestone—faster and smarter.",
  primaryCtaText = "Get started",
  primaryCtaHref = "#",
  secondaryCtaText = "See how it works",
  secondaryCtaHref = "#",
  mapImageSrc = "",
  milestones = [],
  demoteHeading = false,
}: AnimatedRoadmapSectionProps) {
  const targetRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })
  const pathLength = useTransform(scrollYProgress, [0.15, 0.7], [0, 1])

  const Heading = demoteHeading ? "h2" : "h1"

  return (
    <section className="w-full bg-background text-foreground pb-16 md:pb-24">
      <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center md:py-24">
        <Heading className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          {headline}{" "}
          {highlightedWord && (
            <span className="bg-primary/20 p-2 rounded-md">{highlightedWord}</span>
          )}{" "}
          {headlineSuffix}
        </Heading>
        {description && (
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">{description}</p>
        )}
        {(primaryCtaText || secondaryCtaText) && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {primaryCtaText && (
              <Button size="lg" asChild>
                <Link href={primaryCtaHref || "#"}>{primaryCtaText}</Link>
              </Button>
            )}
            {secondaryCtaText && (
              <Button size="lg" variant="outline" asChild>
                <Link href={secondaryCtaHref || "#"}>{secondaryCtaText}</Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <div
        ref={targetRef}
        className="relative w-full max-w-4xl mx-auto pt-8 pb-0"
        aria-label="Animasyonlu ürün yol haritası"
      >
        {mapImageSrc && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="absolute inset-0 top-10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mapImageSrc}
              alt=""
              className="h-full w-full object-contain"
            />
          </motion.div>
        )}

        <div className="relative h-[400px]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 400"
            preserveAspectRatio="none"
            className="absolute top-0 left-0"
          >
            <motion.path
              d="M 50 350 Q 200 50 400 200 T 750 100"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray="10 5"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          {milestones.map((milestone, index) => (
            <MilestoneMarker key={milestone.id} milestone={milestone} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
