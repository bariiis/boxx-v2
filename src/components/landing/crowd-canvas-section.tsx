"use client"

import { gsap } from "gsap"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type Peep = {
  image: HTMLImageElement
  rect: number[]
  width: number
  height: number
  x: number
  y: number
  anchorY: number
  scaleX: number
  walk: gsap.core.Timeline | null
  setRect: (rect: number[]) => void
  render: (ctx: CanvasRenderingContext2D) => void
}

type CrowdCanvasProps = {
  src: string
  rows?: number
  cols?: number
}

export function CrowdCanvas({ src, rows = 15, cols = 7 }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1

    const randomRange = (min: number, max: number) => min + Math.random() * (max - min)
    const randomIndex = <T,>(array: T[]) => (randomRange(0, array.length) | 0) as number
    const removeFromArray = <T,>(array: T[], i: number) => array.splice(i, 1)[0]
    const removeItemFromArray = <T,>(array: T[], item: T) => removeFromArray(array, array.indexOf(item))
    const removeRandomFromArray = <T,>(array: T[]) => removeFromArray(array, randomIndex(array))
    const getRandomFromArray = <T,>(array: T[]) => array[randomIndex(array) | 0]

    const stage = { width: 0, height: 0 }

    const resetPeep = ({ peep }: { peep: Peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random())
      const startY = stage.height - peep.height + offsetY
      let startX: number
      let endX: number
      if (direction === 1) {
        startX = -peep.width
        endX = stage.width
        peep.scaleX = 1
      } else {
        startX = stage.width + peep.width
        endX = 0
        peep.scaleX = -1
      }
      peep.x = startX
      peep.y = startY
      peep.anchorY = startY
      return { startX, startY, endX }
    }

    const normalWalk = ({
      peep,
      props,
    }: {
      peep: Peep
      props: { startX: number; startY: number; endX: number }
    }) => {
      const { startY, endX } = props
      const xDuration = 10
      const yDuration = 0.25
      const tl = gsap.timeline()
      tl.timeScale(randomRange(0.5, 1.5))
      tl.to(peep, { duration: xDuration, x: endX, ease: "none" }, 0)
      tl.to(
        peep,
        { duration: yDuration, repeat: xDuration / yDuration, yoyo: true, y: startY - 10 },
        0
      )
      return tl
    }

    const walks = [normalWalk]

    const createPeep = ({ image, rect }: { image: HTMLImageElement; rect: number[] }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (r: number[]) => {
          peep.rect = r
          peep.width = r[2]
          peep.height = r[3]
        },
        render: (c: CanvasRenderingContext2D) => {
          c.save()
          c.translate(peep.x, peep.y)
          c.scale(peep.scaleX, 1)
          c.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height
          )
          c.restore()
        },
      }
      peep.setRect(rect)
      return peep
    }

    const img = new Image()
    const allPeeps: Peep[] = []
    const availablePeeps: Peep[] = []
    const crowd: Peep[] = []
    let rafToken: number | null = null
    let started = false

    const createPeeps = () => {
      const { naturalWidth: width, naturalHeight: height } = img
      if (!width || !height) return
      const total = rows * cols
      const rectWidth = width / rows
      const rectHeight = height / cols
      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          })
        )
      }
    }

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep)
      availablePeeps.push(peep)
    }

    const addPeepToCrowd = (): Peep => {
      const peep = removeRandomFromArray(availablePeeps)
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({ peep }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep)
        addPeepToCrowd()
      })
      peep.walk = walk
      crowd.push(peep)
      crowd.sort((a, b) => a.anchorY - b.anchorY)
      return peep
    }

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk?.progress(Math.random())
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(dpr, dpr)
      crowd.forEach((peep) => peep.render(ctx))
      ctx.restore()
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      stage.width = w
      stage.height = h
      canvas.width = w * dpr
      canvas.height = h * dpr

      crowd.forEach((peep) => peep.walk?.kill())
      crowd.length = 0
      availablePeeps.length = 0
      availablePeeps.push(...allPeeps)
      initCrowd()
    }

    const tryStart = () => {
      if (started) return
      if (!img.complete || !img.naturalWidth) return
      const rect = canvas.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) {
        rafToken = requestAnimationFrame(tryStart)
        return
      }
      started = true
      createPeeps()
      resize()
      gsap.ticker.add(render)
    }

    img.onload = tryStart
    img.onerror = () => {
      ctx.fillStyle = "rgba(255,0,0,0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    img.src = src
    // If cached, onload may not fire
    if (img.complete && img.naturalWidth) tryStart()
    else rafToken = requestAnimationFrame(tryStart)

    const handleResize = () => {
      if (started) resize()
    }
    window.addEventListener("resize", handleResize)

    const ro = new ResizeObserver(() => {
      if (started) resize()
    })
    ro.observe(canvas)

    return () => {
      if (rafToken) cancelAnimationFrame(rafToken)
      window.removeEventListener("resize", handleResize)
      ro.disconnect()
      gsap.ticker.remove(render)
      crowd.forEach((peep) => peep.walk?.kill())
    }
  }, [src, rows, cols])

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
}

export function CrowdCanvasSection({
  label = "",
  headline = "KALABALIĞIN İÇİNDE KAYBOLMA",
  description,
  primaryCtaText = "",
  primaryCtaHref = "",
  secondaryCtaText = "",
  secondaryCtaHref = "",
  imageSrc = "/images/peeps/all-peeps.png",
  rows = 15,
  cols = 7,
  height = "100vh",
  dark = false,
}: {
  label?: string
  headline?: string
  description?: string
  primaryCtaText?: string
  primaryCtaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  imageSrc?: string
  rows?: number
  cols?: number
  height?: string
  dark?: boolean
}) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        dark ? "bg-black text-white" : "bg-white text-black"
      )}
      style={{ height, minHeight: "500px" }}
    >
      <div className="pointer-events-none absolute inset-x-0 z-10 grid content-start justify-items-center gap-6 px-4 text-center" style={{ top: "200px" }}>
        {label && (
          <span
            className={cn(
              "relative max-w-[14ch] text-xs uppercase leading-tight opacity-40",
              "after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:content-['']",
              dark
                ? "after:bg-gradient-to-b after:from-black after:to-white"
                : "after:bg-gradient-to-b after:from-white after:to-black"
            )}
          >
            {label}
          </span>
        )}
        {headline && (
          <h1
            className="max-w-[14ch] text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {headline}
          </h1>
        )}
        {description && (
          <p className="max-w-[65ch] text-sm leading-relaxed opacity-70 sm:text-base">{description}</p>
        )}
        {(primaryCtaText || secondaryCtaText) && (
          <div className="pointer-events-auto mt-2 flex flex-wrap items-center justify-center gap-3">
            {primaryCtaText && (
              <a
                href={primaryCtaHref || "#"}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]",
                  dark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
                )}
              >
                {primaryCtaText}
              </a>
            )}
            {secondaryCtaText && (
              <a
                href={secondaryCtaHref || "#"}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-semibold transition-colors",
                  dark
                    ? "border-white/30 text-white hover:bg-white/10"
                    : "border-black/30 text-black hover:bg-black/5"
                )}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        )}
      </div>
      <CrowdCanvas src={imageSrc} rows={rows} cols={cols} />
    </section>
  )
}
