"use client"

import Image from "next/image"

interface StickyImage {
  src: string
  tag: string
}

interface AzStickyCaptionProps {
  headline?: string
  highlightedWords?: string[]
  ctaText?: string
  ctaHref?: string
  images?: StickyImage[]
}

export function AzStickyCaption({
  headline = "Digital agency specializing in innovative design & cutting-edge development",
  highlightedWords = ["innovative design", "development"],
  ctaText = "Services",
  ctaHref = "#",
  images = [
    { src: "", tag: "Branding" },
    { src: "", tag: "Illustrations" },
    { src: "", tag: "Photography" },
    { src: "", tag: "Fashion" },
    { src: "", tag: "Packaging" },
  ],
}: AzStickyCaptionProps) {
  // Highlight words in the headline
  let processedHeadline = headline
  highlightedWords.forEach((word) => {
    processedHeadline = processedHeadline.replace(
      word,
      `<span class="text-[var(--lp-primary,#6366f1)]">${word}</span>`
    )
  })

  return (
    <section className="relative bg-[var(--lp-bg,#0a0a0a)] text-[var(--lp-fg,#fff)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Sticky caption top */}
        <div className="py-24 lg:py-32">
          {ctaText && (
            <div className="mb-8">
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-medium tracking-wider transition-colors hover:bg-white/10"
              >
                {ctaText}
              </a>
            </div>
          )}

          <p
            className="max-w-4xl text-[clamp(1.5rem,3.5vw,3.5rem)] font-medium leading-[1.2] tracking-tight"
            dangerouslySetInnerHTML={{ __html: processedHeadline }}
          />
        </div>

        {/* Scrolling images grid */}
        <div className="space-y-16 pb-24 lg:pb-32">
          {images.map((img, i) => {
            // Alternate layout positions
            const layouts = [
              "ml-auto w-3/5 lg:w-5/12",
              "mr-auto w-4/5 lg:w-6/12",
              "ml-auto w-3/5 lg:w-4/12",
              "mx-auto w-3/5 lg:w-5/12",
              "mr-auto w-2/3 lg:w-5/12",
            ]
            const layout = layouts[i % layouts.length]

            return (
              <div key={i} className={`${layout}`}>
                <div className="group relative overflow-hidden rounded-lg">
                  {img.src ? (
                    <Image
                      src={img.src}
                      alt={img.tag}
                      width={800}
                      height={600}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full bg-gradient-to-br from-neutral-700 to-neutral-800 transition-transform duration-700 group-hover:scale-105" />
                  )}
                </div>
                <div className="mt-3">
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium tracking-wider">
                    {img.tag}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
