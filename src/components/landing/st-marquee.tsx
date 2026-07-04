"use client"

import dynamic from "next/dynamic"
import { PerspectiveMarquee } from "@/components/ui/st-perspective-marquee"

// Remotion Player must be loaded client-side only (no SSR)
const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false }
)

interface StMarqueeProps {
  items?: string[]
  fontSize?: number
  fontWeight?: number
  pixelsPerFrame?: number
  rotateY?: number
  rotateX?: number
  perspective?: number
  speed?: number
  dark?: boolean
  height?: string
  durationInFrames?: number
  fps?: number
  demoteHeading?: boolean
}

function MarqueeScene({
  items,
  fontSize,
  fontWeight,
  pixelsPerFrame,
  rotateY,
  rotateX,
  perspective,
  speed,
  dark,
}: {
  items: string[]
  fontSize: number
  fontWeight: number
  pixelsPerFrame: number
  rotateY: number
  rotateX: number
  perspective: number
  speed: number
  dark: boolean
}) {
  return (
    <PerspectiveMarquee
      items={items}
      fontSize={fontSize}
      fontWeight={fontWeight}
      pixelsPerFrame={pixelsPerFrame}
      rotateY={rotateY}
      rotateX={rotateX}
      perspective={perspective}
      speed={speed}
      background={dark ? "#050505" : "#fafafa"}
      fadeColor={dark ? "#050505" : "#fafafa"}
      color={dark ? "#fafafa" : "#171717"}
    />
  )
}

export function StMarqueeSection({
  items = ["STUUX", "Workstation", "GPU Server", "Storage", "Networking", "Performance", "Reliability", "Innovation"],
  fontSize = 84,
  fontWeight = 700,
  pixelsPerFrame = 2,
  rotateY = -28,
  rotateX = 8,
  perspective = 1200,
  speed = 1,
  dark = true,
  height = "60vh",
  durationInFrames = 240,
  fps = 30,
}: StMarqueeProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height,
        backgroundColor: dark ? "#050505" : "#fafafa",
      }}
    >
      <Player
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={MarqueeScene as any}
        inputProps={{
          items,
          fontSize,
          fontWeight,
          pixelsPerFrame,
          rotateY,
          rotateX,
          perspective,
          speed,
          dark,
        }}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={1280}
        compositionHeight={720}
        style={{ width: "100%", height: "100%" }}
        controls={false}
        autoPlay
        loop
        clickToPlay={false}
      />
    </section>
  )
}
