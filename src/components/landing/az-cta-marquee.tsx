"use client"

import Image from "next/image"

interface MarqueeImage {
  src: string
  tag: string
}

interface AzCtaMarqueeProps {
  headline?: string
  ctaText?: string
  ctaHref?: string
  images?: MarqueeImage[]
  dark?: boolean
}

export function AzCtaMarquee({
  headline = "Let's talk about your project",
  ctaText = "Write a line",
  ctaHref = "#",
  images = [
    { src: "", tag: "Photography" },
    { src: "", tag: "3D Models" },
    { src: "", tag: "Development" },
    { src: "", tag: "Illustrations" },
    { src: "", tag: "Fashion" },
    { src: "", tag: "Digital Art" },
    { src: "", tag: "Packaging" },
    { src: "", tag: "Motion" },
  ],
  dark = true,
}: AzCtaMarqueeProps) {
  const bgClass = dark
    ? "bg-[var(--lp-fg,#fff)] text-[var(--lp-bg,#0a0a0a)]"
    : "bg-[var(--lp-bg,#0a0a0a)] text-[var(--lp-fg,#fff)]"

  return (
    <section className={`${bgClass} overflow-hidden`}>
      <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-12 lg:py-32">
        {ctaText && (
          <div className="mb-8">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full border border-current/20 px-5 py-2.5 text-sm font-medium tracking-wider opacity-70 transition-opacity hover:opacity-100"
            >
              {ctaText}
            </a>
          </div>
        )}

        <h2
          className="mx-auto max-w-4xl text-[clamp(2rem,5vw,5rem)] font-bold leading-tight tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {headline}
        </h2>
      </div>

      {/* Marquee images */}
      {images.length > 0 && (
        <div className="relative overflow-hidden pb-16">
          <div className="flex animate-[azMarquee_30s_linear_infinite] gap-4">
            {[...images, ...images].map((img, i) => (
              <div key={i} className="flex-shrink-0" style={{ width: 280 }}>
                <div className="mb-2">
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-xs font-medium tracking-wider ${
                      dark
                        ? "border-black/15 text-black/60"
                        : "border-white/15 text-white/60"
                    }`}
                  >
                    {img.tag}
                  </span>
                </div>
                <div className="overflow-hidden rounded-lg">
                  {img.src ? (
                    <Image
                      src={img.src}
                      alt={img.tag}
                      width={280}
                      height={280}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div
                      className={`aspect-square w-full ${
                        dark
                          ? "bg-gradient-to-br from-neutral-200 to-neutral-300"
                          : "bg-gradient-to-br from-neutral-700 to-neutral-800"
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes azMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
