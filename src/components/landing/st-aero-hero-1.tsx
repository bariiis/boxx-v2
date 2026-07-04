"use client"

import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Marquee } from "@/components/ui/marquee"

interface StAeroHero1Props {
  headline?: string
  description?: string
  ctaText?: string
  ctaHref?: string
  image?: string
  imageAlt?: string
  avatarCount?: string
  avatarLabel?: string
  avatarImages?: string[]
  logos?: string[]
  demoteHeading?: boolean
}

export function StAeroHero1({
  headline = "Sustainable Solutions for a Better Future",
  description = "Empowering businesses and communities to thrive in a low-carbon world through tailored clean energy solutions.",
  ctaText = "Start a Project",
  ctaHref = "#",
  image = "https://images.cnippet.dev/image/upload/v1770400411/img_14001.jpg",
  imageAlt = "",
  avatarCount = "15,000+",
  avatarLabel = "Teams Connected",
  avatarImages = [
    "https://images.cnippet.dev/image/upload/v1770400411/a1.jpg",
    "https://images.cnippet.dev/image/upload/v1770400411/a2.jpg",
    "https://images.cnippet.dev/image/upload/v1770400411/a3.jpg",
    "https://images.cnippet.dev/image/upload/v1770400411/a4.jpg",
  ],
  logos = [
    "https://images.cnippet.dev/image/upload/v1770400411/logoipsum-1.png",
    "https://images.cnippet.dev/image/upload/v1770400411/logoipsum-2.png",
    "https://images.cnippet.dev/image/upload/v1770400411/logoipsum-3.png",
    "https://images.cnippet.dev/image/upload/v1770400411/logoipsum-4.png",
    "https://images.cnippet.dev/image/upload/v1770400411/logoipsum-5.png",
  ],
  demoteHeading = false,
}: StAeroHero1Props) {
  const HeadingTag = demoteHeading ? "h2" : "h1"

  return (
    <section className="relative w-full overflow-hidden pt-0 text-black dark:bg-white">
      <div className="relative z-10 mx-auto h-full w-full max-w-full">
        <div className="grid grid-cols-1 md:h-screen md:grid-cols-12">
          <div className="h-64 w-full md:col-span-6 md:h-full">
            {image ? (
              <Image
                alt={imageAlt}
                className="h-full w-full overflow-hidden object-cover object-center"
                height={1080}
                src={image}
                width={1920}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
            )}
          </div>

          <div className="flex w-full items-center justify-between px-6 pt-8 pb-10 text-left md:col-span-6 md:pt-20 md:pr-6 md:pb-0 md:pl-10">
            <div className="w-full max-w-3xl space-y-6">
              <HeadingTag
                className="font-normal text-4xl tracking-tighter md:text-6xl lg:text-7xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {headline}
              </HeadingTag>

              <p className="max-w-2xl font-light text-base md:text-lg lg:text-xl">
                {description}
              </p>

              <div className="mt-auto space-y-7">
                {/* Avatars */}
                {avatarImages.length > 0 && (
                  <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-auto">
                    <div className="flex -space-x-3">
                      {avatarImages.map((src, i) => (
                        <Avatar
                          className="size-12 border-2 border-white transition-all duration-300 hover:grayscale-0"
                          key={i}
                        >
                          <AvatarImage src={src} />
                          <AvatarFallback>U{i + 1}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div className="flex flex-col font-normal text-sm">
                      <span className="text-base sm:text-lg">{avatarCount}</span>
                      <span>{avatarLabel}</span>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                {ctaText && (
                  <div className="flex w-fit gap-6">
                    <a
                      href={ctaHref || "#"}
                      className="group flex cursor-pointer items-center gap-0"
                    >
                      <span className="rounded-full bg-[#e1fcad] px-6 py-3 text-black duration-500 ease-in-out group-hover:bg-[#122023] group-hover:text-[#e1fcad] group-hover:transition-colors">
                        {ctaText}
                      </span>
                      <div className="relative flex h-fit cursor-pointer items-center overflow-hidden rounded-full bg-[#e1fcad] p-5 text-black duration-500 ease-in-out group-hover:bg-[#122023] group-hover:text-[#e1fcad] group-hover:transition-colors">
                        <ArrowUpRight className="absolute h-5 w-5 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10" />
                        <ArrowUpRight className="absolute h-5 w-5 -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2" />
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Logo marquee */}
              {logos.length > 0 && (
                <div className="relative -mx-4 mt-8 sm:-mx-6 lg:-mx-8">
                  <div className="absolute left-0 z-40 h-full w-20 bg-linear-to-r from-white" />
                  <div className="absolute right-0 z-40 h-full w-20 bg-linear-to-l from-white" />

                  <Marquee className="[--duration:25s]" pauseOnHover repeat={2}>
                    {logos.map((src, index) => (
                      <div
                        className="flex items-center justify-center px-3 md:px-5"
                        key={index}
                      >
                        <Image
                          alt="Logo"
                          className="h-5 w-auto md:h-8"
                          height={24}
                          src={src}
                          width={100}
                        />
                      </div>
                    ))}
                  </Marquee>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
