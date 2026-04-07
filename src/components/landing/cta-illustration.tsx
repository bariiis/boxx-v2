"use client"

import * as React from "react"
import { motion, type Variants } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CtaIllustrationProps {
  headline: string
  description?: string
  ctaText?: string
  ctaHref?: string
  image?: string
  imageAlt?: string
  dark?: boolean
}

export function CtaIllustration({
  headline,
  description,
  ctaText = "Teklif İste",
  ctaHref = "/iletisim",
  image,
  imageAlt = "",
  dark = true,
}: CtaIllustrationProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className={`${dark ? "bg-[#0a0a0a] text-white" : "bg-white text-[#0a0a0a]"}`}>
      <div className="flex w-full items-center justify-center px-4 py-20 md:py-32">
        <motion.div
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {image && (
            <motion.div variants={itemVariants} className="mb-8">
              <img
                src={image}
                alt={imageAlt}
                className="h-auto w-64 select-none"
              />
            </motion.div>
          )}

          <motion.h2
            variants={itemVariants}
            className="mb-4 text-4xl font-bold tracking-tight md:text-5xl"
          >
            {headline}
          </motion.h2>

          {description && (
            <motion.p
              variants={itemVariants}
              className={`mb-8 max-w-lg text-base md:text-lg ${dark ? "text-neutral-400" : "text-neutral-600"}`}
            >
              {description}
            </motion.p>
          )}

          <motion.div variants={itemVariants}>
            <Button
              asChild
              size="lg"
              className={`h-12 rounded-full pl-6 pr-4 text-base ${
                dark
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-[#0a0a0a] text-white hover:bg-neutral-800"
              }`}
            >
              <Link href={ctaHref}>
                {ctaText}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
