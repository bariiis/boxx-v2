"use client"

import { useRef, type CSSProperties } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export interface ImmersiveGalleryProps {
  headline?: string
  images?: { src: string }[]
  light?: boolean
  demoteHeading?: boolean
}

const IMAGE_STYLES = [
  "w-[25vw] h-[25vh]",
  "w-[35vw] h-[30vh] -top-[30vh] left-[5vw]",
  "w-[20vw] h-[55vh] -top-[15vh] -left-[25vw]",
  "w-[25vw] h-[25vh] left-[27.5vw]",
  "w-[20vw] h-[30vh] top-[30vh] left-[5vw]",
  "w-[30vw] h-[25vh] top-[27.5vh] -left-[22.5vw]",
  "w-[15vw] h-[15vh] top-[22.5vh] left-[25vw]",
]

export function ImmersiveGallery({
  headline = "",
  images = [],
  light = false,
  demoteHeading = false,
}: ImmersiveGalleryProps) {
  const lightVars = light
    ? ({
        ["--lp-bg" as string]: "#ffffff",
        ["--lp-fg" as string]: "#0a0a0a",
        ["--lp-muted" as string]: "#f5f5f5",
        ["--lp-muted-fg" as string]: "#6b7280",
        ["--lp-border" as string]: "#e5e7eb",
      } as CSSProperties)
    : {}
  const container = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9])
  // Yalnızca headline varsa scroll sonunda görseller soluklaşsın (headline'ı açığa çıkarmak için).
  // Aksi halde her zaman tam opak kalır.
  const hasHeadline = Boolean(headline && headline.trim())
  const opacityImage = useTransform(scrollYProgress, [0, 0.7, 1], hasHeadline ? [1, 1, 0] : [1, 1, 1])
  const opacitySection2 = useTransform(scrollYProgress, [0.6, 0.8], [0, 1])
  const scaleSection2 = useTransform(scrollYProgress, [0.6, 0.8], [0.8, 1])

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  // 7 sabit slot — her slot sadece kendi indexindeki görseli gösterir
  // (boş kalan slotlar render edilmez, böylece tekrar/overlap oluşmaz)
  const slots = Array.from({ length: 7 }, (_, i) => images[i]?.src || "")

  const Heading = demoteHeading ? "h3" : "h2"

  return (
    <div
      ref={container}
      className="relative h-[200vh]"
      style={{ backgroundColor: "var(--lp-bg)", color: "var(--lp-fg)", ...lightVars }}
    >
      <div className="sticky top-0 h-[100vh] overflow-hidden">
        {slots.map((src, index) =>
          src ? (
            <motion.div
              key={index}
              initial={{ opacity: 1, scale: 1 }}
              style={{ scale: scales[index % 7], opacity: opacityImage }}
              className="absolute flex items-center justify-center w-full h-full top-0"
            >
              <div className={`relative ${IMAGE_STYLES[index]}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Galeri görseli ${index + 1}`}
                  className="object-contain w-full h-full"
                />
              </div>
            </motion.div>
          ) : null,
        )}

        {headline && (
          <motion.div
            style={{ opacity: opacitySection2, scale: scaleSection2 }}
            className="w-full h-full flex items-center justify-center max-w-3xl mx-auto p-8 relative"
          >
            <Heading
              className="text-2xl md:text-4xl font-thin py-4"
              style={{ lineHeight: 1.5, color: "var(--lp-fg)" }}
            >
              {headline}
            </Heading>
          </motion.div>
        )}
      </div>
    </div>
  )
}
