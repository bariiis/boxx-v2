"use client"

import { motion, type Variant } from "framer-motion"
import { type ReactNode } from "react"

type RevealVariant = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade" | "scale"

const hiddenVariants: Record<RevealVariant, Variant> = {
  "fade-up": { opacity: 0, y: 40 },
  "fade-down": { opacity: 0, y: -40 },
  "fade-left": { opacity: 0, x: -40 },
  "fade-right": { opacity: 0, x: 40 },
  "fade": { opacity: 0 },
  "scale": { opacity: 0, scale: 0.95 },
}

const visibleVariants: Record<RevealVariant, Variant> = {
  "fade-up": { opacity: 1, y: 0 },
  "fade-down": { opacity: 1, y: 0 },
  "fade-left": { opacity: 1, x: 0 },
  "fade-right": { opacity: 1, x: 0 },
  "fade": { opacity: 1 },
  "scale": { opacity: 1, scale: 1 },
}

interface ScrollRevealProps {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.8,
  className,
  once = true,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px 0px" }}
      variants={{
        hidden: hiddenVariants[variant],
        visible: {
          ...visibleVariants[variant],
          transition: {
            duration,
            delay,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger container: her child sırayla animate olur
interface StaggerContainerProps {
  children: ReactNode
  stagger?: number
  className?: string
}

export function StaggerContainer({
  children,
  stagger = 0.1,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger item: StaggerContainer içinde kullanılır
interface StaggerItemProps {
  children: ReactNode
  variant?: RevealVariant
  duration?: number
  className?: string
}

export function StaggerItem({
  children,
  variant = "fade-up",
  duration = 0.8,
  className,
}: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: hiddenVariants[variant],
        visible: {
          ...visibleVariants[variant],
          transition: {
            duration,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parallax wrapper
interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.3, className }: ParallaxProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false }}
      style={{ willChange: "transform" }}
      whileHover={undefined}
      transition={{ type: "tween" }}
      className={className}
    >
      <motion.div
        style={{ y: 0 }}
        initial={{ y: speed * 50 }}
        whileInView={{ y: speed * -50 }}
        viewport={{ once: false, margin: "-200px 0px" }}
        transition={{ type: "tween", ease: "linear", duration: 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
