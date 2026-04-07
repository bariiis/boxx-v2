"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ScrollReveal } from "./scroll-reveal"

interface FullBleedMediaProps {
  image?: string
  video?: string
  alt?: string
  caption?: string
  aspectRatio?: "video" | "wide" | "square"
  parallax?: boolean
  dark?: boolean
}

export function FullBleedMedia({
  image,
  video,
  alt = "",
  caption,
  aspectRatio = "video",
  parallax = true,
  dark = true,
}: FullBleedMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  const aspectClass =
    aspectRatio === "wide"
      ? "aspect-[21/9]"
      : aspectRatio === "square"
        ? "aspect-square"
        : "aspect-video"

  return (
    <section
      className={dark ? "bg-[#0a0a0a]" : "bg-white"}
      ref={containerRef}
    >
      <div className="mx-auto max-w-[1400px] px-5 py-[clamp(3rem,8vh,6rem)] sm:px-8">
        <ScrollReveal variant="scale" duration={1}>
          <div className={`relative ${aspectClass} overflow-hidden rounded-2xl`}>
            {video ? (
              <video
                src={video}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
            ) : image ? (
              parallax ? (
                <motion.div className="absolute inset-[-10%] size-[120%]" style={{ y }}>
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </motion.div>
              ) : (
                <Image
                  src={image}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              )
            ) : null}
          </div>
        </ScrollReveal>

        {caption && (
          <ScrollReveal variant="fade-up" delay={0.2}>
            <p
              className={`mt-4 text-center text-sm ${
                dark ? "text-neutral-500" : "text-neutral-400"
              }`}
            >
              {caption}
            </p>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
