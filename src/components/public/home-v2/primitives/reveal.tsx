"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"
import { useReducedMotion } from "../hooks/use-reduced-motion"

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: "div" | "section" | "article" | "header"
}

const VARIANTS: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
}

export function Reveal({
  children,
  delay = 0,
  y = 60,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as]

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={VARIANTS}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
