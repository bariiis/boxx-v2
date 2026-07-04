"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// =========================================
// TYPES
// =========================================

export interface CustomerLogoConfig {
  src: string;
  alt: string;
  href?: string;
}

export interface CustomersShowcaseConfig {
  /** Text before the first inline image, e.g. "Tercih edilen" */
  headlinePart1?: string;
  /** First inline image URL (product / visual) */
  inlineImage1?: string;
  /** Text between the two inline images, e.g. "ve güvenilen" */
  headlinePart2?: string;
  /** Second inline image URL */
  inlineImage2?: string;
  /** Text after the second inline image, e.g. "çözümler." */
  headlinePart3?: string;
  /** Label above the logo bar, e.g. "Görüldüğü yerler:" */
  logoBarLabel?: string;
  /** Customer / partner logos */
  logos?: CustomerLogoConfig[];
  /** Visible description line */
  description?: string;
  /** Muted / secondary description */
  descriptionMuted?: string;
  /** CTA link text */
  ctaText?: string;
  /** CTA link href */
  ctaHref?: string;
  /** Small fine-print line */
  finePrint?: string;
  /** Fine-print highlighted prefix */
  finePrintHighlight?: string;
  dark?: boolean;
}

// =========================================
// DEFAULTS
// =========================================

export const DEFAULT_CONFIG: CustomersShowcaseConfig = {
  headlinePart1: "Tercih edilen",
  inlineImage1: "",
  headlinePart2: "ve güvenilen",
  inlineImage2: "",
  headlinePart3: "donanım çözümleri.",
  logoBarLabel: "Referanslarımızdan bazıları:",
  logos: [],
  description: "Kurumsal altyapı için mühendislik odaklı yaklaşım.",
  descriptionMuted: "Türkiye'nin önde gelen işletmeleri yüksek performans iş yükleri için STUUX'u tercih ediyor.",
  ctaText: "Referansları gör →",
  ctaHref: "/referanslar",
  finePrint: "Hemen başlamak için iletişime geçin.",
  finePrintHighlight: "Ücretsiz keşif görüşmesi.",
  dark: false,
};

// =========================================
// INLINE IMAGE
// =========================================

function InlineProductImage({ src, dark }: { src: string; dark: boolean }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`my-auto -mt-3 inline w-20 md:-mt-6 md:w-44 object-contain ${
        dark ? "brightness-0 invert" : ""
      }`}
      width={176}
      height={99}
      src={src}
      alt=""
    />
  );
}

// =========================================
// MAIN COMPONENT
// =========================================

export default function CustomersShowcase({
  headlinePart1 = DEFAULT_CONFIG.headlinePart1,
  inlineImage1 = DEFAULT_CONFIG.inlineImage1,
  headlinePart2 = DEFAULT_CONFIG.headlinePart2,
  inlineImage2 = DEFAULT_CONFIG.inlineImage2,
  headlinePart3 = DEFAULT_CONFIG.headlinePart3,
  logoBarLabel = DEFAULT_CONFIG.logoBarLabel,
  logos = DEFAULT_CONFIG.logos!,
  description = DEFAULT_CONFIG.description,
  descriptionMuted = DEFAULT_CONFIG.descriptionMuted,
  ctaText = DEFAULT_CONFIG.ctaText,
  ctaHref = DEFAULT_CONFIG.ctaHref,
  finePrint = DEFAULT_CONFIG.finePrint,
  finePrintHighlight = DEFAULT_CONFIG.finePrintHighlight,
  dark = DEFAULT_CONFIG.dark,
}: CustomersShowcaseConfig) {
  const bg = dark ? "bg-zinc-950 text-zinc-100" : "bg-white text-zinc-900";
  const border = dark ? "border-zinc-800" : "border-zinc-200";
  const mutedColor = dark ? "text-zinc-400" : "text-zinc-500";

  return (
    <section className={`${bg} py-8 md:py-12`}>
      {/* Container — matches craft-ds max-w-5xl */}
      <div className="mx-auto max-w-5xl p-6 sm:p-8">
        <div className="flex h-full w-full flex-col gap-8">

          {/* ── Headline with inline images ── */}
          <h2 className="text-3xl font-normal tracking-tight md:text-6xl">
            {headlinePart1 && <>{headlinePart1} </>}
            {inlineImage1 && <InlineProductImage src={inlineImage1} dark={!!dark} />}
            {headlinePart2 && <> {headlinePart2} </>}
            {inlineImage2 && <InlineProductImage src={inlineImage2} dark={!!dark} />}
            {headlinePart3 && <> {headlinePart3}</>}
          </h2>

          {/* ── Logo bar ── */}
          {(logos.length > 0 || logoBarLabel) && (
            <div className={`flex w-fit flex-wrap items-center gap-6 rounded-lg border ${border} p-4`}>
              {logoBarLabel && (
                <p className={`text-sm ${mutedColor}`}>{logoBarLabel}</p>
              )}
              {logos.map((logo, i) => {
                const imgEl = (
                  <Image
                    key={i}
                    className={`h-6 w-fit object-contain ${dark ? "brightness-0 invert" : "brightness-0"} opacity-60 hover:opacity-100 transition-opacity`}
                    src={logo.src}
                    alt={logo.alt}
                    width={120}
                    height={24}
                    unoptimized={logo.src.startsWith("http")}
                  />
                );
                return logo.href ? (
                  <Link key={i} href={logo.href} target="_blank" rel="noopener noreferrer">
                    {imgEl}
                  </Link>
                ) : (
                  <React.Fragment key={i}>{imgEl}</React.Fragment>
                );
              })}
              {logos.length === 0 && (
                <span className={`text-xs ${mutedColor}`}>Logo ekleyin…</span>
              )}
            </div>
          )}

          {/* ── Description + CTA ── */}
          <div className="md:text-lg">
            {description && (
              <p className="hidden md:block">{description}</p>
            )}

            <div className="mt-2 grid gap-2 md:flex md:items-center">
              {descriptionMuted && (
                <p className={`${mutedColor} text-base`}>{descriptionMuted}</p>
              )}
              {ctaText && ctaHref && (
                <Link
                  className={`text-base font-medium transition-opacity hover:opacity-70 ${dark ? "text-zinc-100" : "text-zinc-900"}`}
                  href={ctaHref}
                >
                  {ctaText}
                </Link>
              )}
            </div>

            {(finePrint || finePrintHighlight) && (
              <p className="mt-4 text-xs">
                {finePrintHighlight && (
                  <span className={`${mutedColor}`}>{finePrintHighlight} </span>
                )}
                {finePrint}
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
