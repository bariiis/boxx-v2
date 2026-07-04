"use client";

import { useEffect, useRef } from "react";

const DEFAULT_HLS_URL =
  "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

const DEFAULT_VIDEO_HUMAN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_090051_64ea5059-da6b-492b-a171-aa7ecc767dc3.mp4";

const DEFAULT_VIDEO_AI =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_093237_ff0ddc63-c068-4e29-96da-fdd0e40af133.mp4";

const gradientText = {
  background: "linear-gradient(90deg, #666666 0%, #d0d0d0 50%, #666666 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  display: "block",
  lineHeight: 1.1,
  marginBottom: "-0.22em",
} as React.CSSProperties;

function VideoIcon({ src, size = 72 }: { src: string; size?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <span
      className="inline-block align-middle"
      style={{
        width: `clamp(48px, 10vw, ${size}px)`,
        height: `clamp(48px, 10vw, ${size}px)`,
        flexShrink: 0,
        position: "relative",
        zIndex: 0,
        isolation: "isolate",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          clipPath: "circle(50% at 50% 50%)",
          WebkitClipPath: "circle(50% at 50% 50%)",
        } as React.CSSProperties}
      >
        <source src={src} type="video/mp4" />
      </video>
    </span>
  );
}

export interface HeroSectionConfig {
  hlsUrl?: string;
  headingLine1?: string;
  headingLine2?: string;
  inlineWord1?: string;
  inlineWord2?: string;
  humanVideoUrl?: string;
  aiVideoUrl?: string;
  subheading?: string;
  ctaText?: string;
  ctaHref?: string;
  iconSize?: number;
  contentMarginTop?: number;
  productImage?: string;
}

export function HeroSection({ config = {} }: { config?: HeroSectionConfig }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const hlsUrl = config.hlsUrl || DEFAULT_HLS_URL;
  const headingLine1 = config.headingLine1 ?? "The vision";
  const headingLine2 = config.headingLine2 ?? "of engineering";
  const inlineWord1 = config.inlineWord1 ?? "human";
  const inlineWord2 = config.inlineWord2 ?? "AI";
  const humanVideoUrl = config.humanVideoUrl || DEFAULT_VIDEO_HUMAN;
  const aiVideoUrl = config.aiVideoUrl || DEFAULT_VIDEO_AI;
  const subheading = config.subheading ?? "We help you map the talent you need, track the talent you have, and close your gaps to thrive in a GenAI world.";
  const ctaText = config.ctaText ?? "Join The Movement!";
  const ctaHref = config.ctaHref ?? "#";
  const iconSize = config.iconSize ?? 110;
  const contentMarginTop = config.contentMarginTop ?? 0;
  const productImage = config.productImage ?? "";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct MP4 — no HLS needed
    if (/\.mp4(\?|$)/i.test(hlsUrl)) {
      video.src = hlsUrl;
      video.play().catch(() => {});
      return;
    }

    let cleanup: (() => void) | undefined;

    import("hls.js").then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        const hls = new Hls({ autoStartLoad: true });
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        cleanup = () => hls.destroy();
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
        video.play().catch(() => {});
      }
    });

    return () => cleanup?.();
  }, [hlsUrl]);

  return (
    <section
      style={{
        minHeight: "100vh",
        height: "auto",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      <div
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto"
        style={{ marginTop: contentMarginTop }}
      >
        <h1
          className="leading-tight"
          style={{
            fontFamily: "'YDYoonche L', 'YDYoonche M', sans-serif",
            fontSize: "clamp(2.2rem, 7vw, 6.5rem)",
            color: "#fff",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          <span style={{ ...gradientText, position: "relative", zIndex: 2 }}>{headingLine1}</span>
          <span style={{ ...gradientText, position: "relative", zIndex: 2 }}>{headingLine2}</span>
          <span
            className="flex items-center justify-center gap-3 flex-wrap"
            style={{ color: "#fff", lineHeight: 1.1 }}
          >
            <span style={{ color: "#999" }}>is</span>
            <VideoIcon src={humanVideoUrl} size={iconSize} />
            <span>{inlineWord1}</span>
            <span style={{ color: "#999", position: "relative", top: "0.15em", marginLeft: "0.25em" }}>+</span>
            <VideoIcon src={aiVideoUrl} size={iconSize} />
            <span>{inlineWord2}</span>
          </span>
        </h1>

        <p
          className="mt-4 max-w-xl text-center px-2"
          style={{
            fontSize: "clamp(0.95rem, 2.2vw, 1.2rem)",
            color: "#ccc",
            lineHeight: 1.4,
            fontWeight: 400,
          }}
        >
          {subheading}
        </p>

        {productImage && (
          <div className="mt-8 mb-2">
            <img
              src={productImage}
              alt=""
              style={{ maxHeight: 420, maxWidth: "100%", objectFit: "contain" }}
            />
          </div>
        )}

        <a
          href={ctaHref}
          className="mt-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0px_6px_32px_8px_rgba(39,243,169,0.22)] active:scale-[0.98]"
          style={{
            padding: "12px 28px",
            background: "#000",
            boxShadow: "0px 6px 24px 6px rgba(39, 243, 169, 0.15)",
            borderRadius: 8,
            outline: "1px solid #30463C",
            outlineOffset: -1,
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 400 }}>
            {ctaText}
          </span>
        </a>
      </div>
    </section>
  );
}
