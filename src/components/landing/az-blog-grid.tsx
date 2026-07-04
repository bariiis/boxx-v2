"use client"

import Image from "next/image"

interface BlogItem {
  title: string
  date: string
  image: string
  href?: string
}

interface AzBlogGridProps {
  headline?: string
  description?: string
  ctaText?: string
  ctaHref?: string
  items?: BlogItem[]
}

export function AzBlogGrid({
  headline = "Featured news",
  description = "Inspiring ideas, creative insights, and the latest in design and tech.",
  ctaText = "News Overview",
  ctaHref = "#",
  items = [
    { title: "Frontend innovations and user journeys", date: "02 February, 2026", image: "", href: "#" },
    { title: "Branding in creating digital experiences", date: "28 January, 2026", image: "", href: "#" },
    { title: "Elevating digital workshops with engaging design", date: "15 January, 2026", image: "", href: "#" },
    { title: "Designing for the future of interactive digital spaces", date: "03 January, 2026", image: "", href: "#" },
  ],
}: AzBlogGridProps) {
  return (
    <section className="bg-[var(--lp-bg,#0a0a0a)] text-[var(--lp-fg,#fff)]">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-12 lg:py-32">
        {/* Title block */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2
              className="text-[clamp(2rem,4vw,4rem)] font-bold leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {headline}
            </h2>
          </div>
          <div className="flex flex-col justify-between gap-4">
            {ctaText && (
              <div>
                <a
                  href={ctaHref}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-medium tracking-wider transition-colors hover:bg-white/10"
                >
                  {ctaText}
                </a>
              </div>
            )}
            {description && (
              <p className="max-w-md text-lg font-medium leading-relaxed">
                {description}{" "}
              </p>
            )}
          </div>
        </div>

        {/* Blog grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.href || "#"}
              className="group block"
            >
              {/* Date */}
              <p className="mb-3 text-xs font-medium tracking-wider opacity-50">
                {item.date}
              </p>

              {/* Image */}
              <div className="mb-4 overflow-hidden rounded-lg">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-[3/2] w-full bg-gradient-to-br from-neutral-700 to-neutral-800 transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm font-medium leading-snug transition-opacity group-hover:opacity-80 lg:text-base">
                {item.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
