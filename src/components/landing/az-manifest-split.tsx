"use client"

import Image from "next/image"

interface AzManifestSplitProps {
  manifestText?: string
  manifestHighlight?: string
  ctaText?: string
  ctaHref?: string
  image?: string
  imageAlt?: string
  description?: string
  tags?: string[]
}

export function AzManifestSplit({
  manifestText = "We are a creative web agency specializing in innovative design and cutting-edge development.",
  manifestHighlight = "We help businesses stand out and thrive in the modern landscape.",
  ctaText = "The Studio",
  ctaHref = "#",
  image = "",
  imageAlt = "",
  description = "From pixel-perfect designs to flawless code, every aspect of our projects is crafted with care to ensure the highest standards of quality.",
  tags = ["Innovations", "Excellence", "Creativity", "Experience", "Competence", "Passion"],
}: AzManifestSplitProps) {
  return (
    <section className="bg-[var(--lp-bg,#0a0a0a)] text-[var(--lp-fg,#fff)]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        {/* Manifest block */}
        <div className="mb-20 lg:mb-28">
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

          <p className="max-w-5xl text-[clamp(1.25rem,3vw,2.75rem)] font-medium leading-[1.3] tracking-tight">
            {manifestText}{" "}
            <span className="text-[var(--lp-muted-fg,#999)]">
              {manifestHighlight}
            </span>
          </p>
        </div>

        {/* Split section: image + description */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="overflow-hidden rounded-lg">
            {image ? (
              <Image
                src={image}
                alt={imageAlt || ""}
                width={1200}
                height={800}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="aspect-[3/2] w-full bg-gradient-to-br from-neutral-700 to-neutral-800" />
            )}
          </div>

          {/* Text + Tags */}
          <div className="flex flex-col justify-center">
            <p className="text-lg font-medium leading-relaxed lg:text-xl">
              {description}
            </p>

            {tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium tracking-wider uppercase text-[var(--lp-muted-fg,#999)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
