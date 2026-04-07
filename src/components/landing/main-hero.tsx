"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface MainHeroSlide {
  img: string
  line1: string
  line2?: string
}

export interface MainHeroProps {
  slides?: MainHeroSlide[]
}

const defaultSlides: MainHeroSlide[] = [
  { img: "https://cdn.cosmos.so/8b0252bd-cb64-45f4-aef8-672c7f628f76?format=jpeg", line1: "BETWEEN SHADOW", line2: "AND LIGHT" },
  { img: "https://cdn.cosmos.so/7b3f4c48-ec63-4bac-b472-910c037a0eb4?format=jpeg", line1: "SILENCE SPEAKS", line2: "THROUGH FORM" },
  { img: "https://cdn.cosmos.so/444502b9-4cb9-4f14-a068-f0213df08729?format=jpeg", line1: "ESSENCE BEYOND", line2: "PERCEPTION" },
  { img: "https://cdn.cosmos.so/ef511e17-a35b-42e6-9122-2754bbd2ad7e?format=jpeg", line1: "TRUTH IN", line2: "EMPTINESS" },
  { img: "https://cdn.cosmos.so/cf68a397-080a-437a-994e-69dedd9e6e06?format=jpeg", line1: "SURRENDER TO", line2: "THE VOID" },
]

export function MainHero({ slides }: MainHeroProps) {
  const list = slides && slides.length > 0 ? slides : defaultSlides
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((p) => (p + 1) % list.length)
  const prev = () => setCurrent((p) => (p - 1 + list.length) % list.length)

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-black">
      {list.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ backgroundImage: `url(${slide.img})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
            <div className="flex flex-col items-center text-center text-white">
              <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none drop-shadow-xl">
                {slide.line1}
              </span>
              {slide.line2 && (
                <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none drop-shadow-xl">
                  {slide.line2}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={prev}
        aria-label="Önceki"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Sonraki"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-6 right-6 z-20 font-mono text-sm tracking-widest text-white/90">
        {pad(current + 1)} / {pad(list.length)}
      </div>
    </section>
  )
}
