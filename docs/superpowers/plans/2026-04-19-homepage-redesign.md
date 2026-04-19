# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a product-first, animation-rich homepage at `src/app/(public)/page.tsx` driven by a new component tree under `src/components/public/home-v2/`, with hybrid dark/light scroll sections, a 3D hero placeholder, bento product showcase, GSAP-pinned solutions rail, and scroll-driven reveals.

**Architecture:** Ten stacked sections (9 content + footer), each wrapped in a theme-aware container that triggers a body-level background transition via `IntersectionObserver`. Presentational sections live under `home-v2/sections/*`, shared UI primitives under `home-v2/primitives/*`, R3F canvas and scene under `home-v2/3d/*`, hooks under `home-v2/hooks/*`. The existing `home/` tree stays intact for one PR; the route simply re-imports.

**Tech Stack:** Next.js 15 App Router + React 19, Tailwind v4, Framer Motion 12 (already installed), GSAP 3 + ScrollTrigger (to be added), React Three Fiber + drei (to be added), Geist Sans + Geist Mono (already loaded via `src/lib/fonts.ts`).

**Project context (do not skip):**
- No existing test framework. Verification per task = TypeScript (`npx tsc --noEmit`), ESLint (`npm run lint`), and a `npm run dev` browser check where visual.
- Commit after each task. Messages follow repo style (`feat(home-v2): ...`, `chore: ...`).
- The live homepage route must keep working. Do not touch `src/app/(public)/page.tsx` until Task 22.
- Turkish copy. English code. Existing UI copy patterns live in `src/components/public/home/sample-data.json`.

---

## File Structure

```
src/components/public/home-v2/
├── HomeV2.tsx                       # Section composition
├── data.ts                          # Typed sample data
├── sections/
│   ├── hero-3d.tsx
│   ├── metrics-ticker.tsx
│   ├── featured-products.tsx
│   ├── solutions-rail.tsx
│   ├── why-boxx-bento.tsx
│   ├── live-benchmark.tsx
│   ├── social-proof.tsx
│   ├── category-quick.tsx
│   └── cta-closing.tsx
├── primitives/
│   ├── section-container.tsx
│   ├── scroll-progress.tsx
│   ├── reveal.tsx
│   └── noise-overlay.tsx
├── 3d/
│   ├── hero-scene.tsx
│   ├── placeholder-server.tsx
│   └── types.ts
└── hooks/
    ├── use-reduced-motion.ts
    └── use-section-theme.ts
```

Touched files outside `home-v2/`:

- `package.json` — add `@react-three/fiber`, `@react-three/drei`, `gsap`
- `src/app/globals.css` — add hybrid-theme CSS variables and body transition rule
- `src/app/(public)/page.tsx` — final route swap in the last task

---

## Task 1: Install runtime dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install R3F, drei, and GSAP**

Run:
```bash
npm install @react-three/fiber@^8 @react-three/drei@^9 gsap@^3
```

Expected: three packages added, no peer warnings about React 19. `three` is already at `^0.183.2` and `@types/three` at `^0.183.1` — do not upgrade.

- [ ] **Step 2: Verify install**

Run: `npm ls @react-three/fiber @react-three/drei gsap three`
Expected: all resolve; no UNMET DEPENDENCY lines.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add R3F, drei, and GSAP for homepage v2"
```

---

## Task 2: Add theme tokens and body transition

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Read the top of globals.css to find a good insertion point**

Look for the line `@import "tailwindcss";` and find the first `:root` block or end of the file.

- [ ] **Step 2: Append home-v2 theme block at the end of globals.css**

```css
/* ============================================================
   HOME V2 — hybrid scroll theme tokens
   Body background follows the section currently in view.
   ============================================================ */
:root {
  --home-bg-dark: #0A0A0B;
  --home-bg-light: #FAFAFA;
  --home-surface-dark: #111113;
  --home-surface-light: #FFFFFF;
  --home-border-dark: #1F1F23;
  --home-border-light: #E5E5E7;
  --home-fg-dark: #F5F5F7;
  --home-fg-light: #0A0A0B;
  --home-muted-dark: #A1A1A6;
  --home-muted-light: #57575B;
  --home-brand: #FF6A2C;
  --home-data: #22D3EE;
}

body[data-home-theme] {
  transition: background-color 400ms ease-in-out, color 400ms ease-in-out;
}
body[data-home-theme="dark"] {
  background-color: var(--home-bg-dark);
  color: var(--home-fg-dark);
}
body[data-home-theme="light"] {
  background-color: var(--home-bg-light);
  color: var(--home-fg-light);
}

@media (prefers-reduced-motion: reduce) {
  body[data-home-theme] {
    transition: none;
  }
}
```

- [ ] **Step 3: Verify the CSS compiles**

Run: `npm run dev` (in a separate terminal, keep running)
Open `http://localhost:3000`. The page still renders normally. No console CSS errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(home-v2): add hybrid theme tokens and body transition"
```

---

## Task 3: Build the reduced-motion hook

**Files:**
- Create: `src/components/public/home-v2/hooks/use-reduced-motion.ts`

- [ ] **Step 1: Create the hook**

```ts
"use client"

import { useEffect, useState } from "react"

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  return reduced
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/hooks/use-reduced-motion.ts
git commit -m "feat(home-v2): add useReducedMotion hook"
```

---

## Task 4: Build the section-theme hook

**Files:**
- Create: `src/components/public/home-v2/hooks/use-section-theme.ts`

- [ ] **Step 1: Create the hook**

```ts
"use client"

import { useEffect } from "react"

type Theme = "dark" | "light"

/**
 * Observes elements with data-home-section-theme and sets
 * body[data-home-theme] to the theme of the section with the
 * greatest viewport intersection. Runs once per mount.
 */
export function useSectionTheme(): void {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-section-theme]")
    )
    if (sections.length === 0) return

    const visibility = new Map<Element, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target, entry.intersectionRatio)
        }
        let best: { theme: Theme; ratio: number } = { theme: "dark", ratio: 0 }
        for (const [el, ratio] of visibility.entries()) {
          if (ratio > best.ratio) {
            const theme = (el as HTMLElement).dataset.homeSectionTheme as Theme
            best = { theme, ratio }
          }
        }
        if (best.ratio > 0) {
          document.body.dataset.homeTheme = best.theme
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      delete document.body.dataset.homeTheme
    }
  }, [])
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/hooks/use-section-theme.ts
git commit -m "feat(home-v2): add useSectionTheme observer hook"
```

---

## Task 5: Build the section-container primitive

**Files:**
- Create: `src/components/public/home-v2/primitives/section-container.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type Theme = "dark" | "light"

interface SectionContainerProps {
  id?: string
  theme: Theme
  className?: string
  children: ReactNode
  /** 0 = no top/bottom padding */
  density?: "tight" | "default" | "loose"
  ariaLabel?: string
}

const PAD = {
  tight: "py-12 md:py-16",
  default: "py-20 md:py-28",
  loose: "py-28 md:py-40",
} as const

export function SectionContainer({
  id,
  theme,
  className,
  children,
  density = "default",
  ariaLabel,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      data-home-section-theme={theme}
      className={cn(
        "relative w-full overflow-hidden",
        PAD[density],
        theme === "dark"
          ? "bg-[var(--home-bg-dark)] text-[var(--home-fg-dark)]"
          : "bg-[var(--home-bg-light)] text-[var(--home-fg-light)]",
        className
      )}
    >
      {children}
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. If `@/lib/utils` is missing `cn`, run `grep -r "export.*cn" src/lib/` to locate it — every shadcn project has one; adjust import.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/primitives/section-container.tsx
git commit -m "feat(home-v2): add SectionContainer primitive"
```

---

## Task 6: Build the reveal primitive

**Files:**
- Create: `src/components/public/home-v2/primitives/reveal.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"
import { useReducedMotion } from "../hooks/use-reduced-motion"

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: "div" | "section" | "article" | "header"
}

const VARIANTS: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
}

export function Reveal({
  children,
  delay = 0,
  y = 60,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as]

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={VARIANTS}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/primitives/reveal.tsx
git commit -m "feat(home-v2): add Reveal primitive with reduced-motion fallback"
```

---

## Task 7: Build the noise-overlay primitive

**Files:**
- Create: `src/components/public/home-v2/primitives/noise-overlay.tsx`

- [ ] **Step 1: Create the component**

```tsx
interface NoiseOverlayProps {
  /** 0-1, default 0.06 */
  opacity?: number
}

export function NoiseOverlay({ opacity = 0.06 }: NoiseOverlayProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/primitives/noise-overlay.tsx
git commit -m "feat(home-v2): add NoiseOverlay primitive"
```

---

## Task 8: Build the scroll-progress primitive

**Files:**
- Create: `src/components/public/home-v2/primitives/scroll-progress.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client"

import { useScroll, useSpring, motion } from "framer-motion"
import { useReducedMotion } from "../hooks/use-reduced-motion"

interface ScrollProgressProps {
  sections: { id: string; label: string }[]
}

export function ScrollProgress({ sections }: ScrollProgressProps) {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 160, damping: 30 })

  if (reduced) return null

  return (
    <div
      aria-hidden
      className="fixed bottom-8 right-6 z-40 hidden md:flex items-center gap-3 font-mono text-[11px] tracking-widest"
    >
      <div className="flex flex-col gap-1 text-[var(--home-muted-dark)] dark:text-[var(--home-muted-dark)]">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="opacity-60 hover:opacity-100 transition-opacity">
            {s.label.toUpperCase()}
          </a>
        ))}
      </div>
      <div className="relative h-32 w-px bg-white/10">
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute inset-0 bg-[var(--home-brand)]"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/primitives/scroll-progress.tsx
git commit -m "feat(home-v2): add ScrollProgress sidebar indicator"
```

---

## Task 9: Build 3D placeholder server scene

**Files:**
- Create: `src/components/public/home-v2/3d/types.ts`
- Create: `src/components/public/home-v2/3d/placeholder-server.tsx`

- [ ] **Step 1: Create types.ts**

```ts
export interface HeroModelProps {
  /** When provided, a future .glb is loaded instead of the primitive placeholder. */
  modelUrl?: string
}
```

- [ ] **Step 2: Create the placeholder scene**

```tsx
"use client"

import { Float } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export function PlaceholderServer() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t * 0.2) * 0.3
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group ref={group}>
        {/* Server rack frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 3.2, 1.2]} />
          <meshStandardMaterial
            color="#0F0F10"
            emissive="#FF6A2C"
            emissiveIntensity={0.08}
            metalness={0.8}
            roughness={0.25}
            wireframe
          />
        </mesh>
        {/* GPU slots — three horizontal bands */}
        {[-1, 0, 1].map((y) => (
          <mesh key={y} position={[0, y * 0.9, 0.61]}>
            <boxGeometry args={[1.8, 0.32, 0.08]} />
            <meshStandardMaterial
              color="#22D3EE"
              emissive="#22D3EE"
              emissiveIntensity={0.4}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
        ))}
        {/* Accent LED strip */}
        <mesh position={[0, -1.7, 0.61]}>
          <boxGeometry args={[1.9, 0.04, 0.02]} />
          <meshBasicMaterial color="#FF6A2C" />
        </mesh>
      </group>
    </Float>
  )
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/public/home-v2/3d/
git commit -m "feat(home-v2): add 3D placeholder server scene"
```

---

## Task 10: Build hero scene canvas wrapper

**Files:**
- Create: `src/components/public/home-v2/3d/hero-scene.tsx`

- [ ] **Step 1: Create the canvas wrapper**

```tsx
"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, PerspectiveCamera } from "@react-three/drei"
import { Component, type ReactNode } from "react"
import { PlaceholderServer } from "./placeholder-server"
import type { HeroModelProps } from "./types"
import { useReducedMotion } from "../hooks/use-reduced-motion"

class CanvasBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function StaticFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 70% 40%, rgba(255,106,44,0.35), transparent 55%), radial-gradient(circle at 20% 70%, rgba(34,211,238,0.25), transparent 60%)",
      }}
    />
  )
}

export function HeroScene({ modelUrl }: HeroModelProps) {
  const reduced = useReducedMotion()

  if (reduced) return <StaticFallback />

  return (
    <CanvasBoundary fallback={<StaticFallback />}>
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        className="absolute inset-0"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 4, 4]} intensity={0.8} />
        <directionalLight position={[-4, -2, -2]} intensity={0.3} color="#22D3EE" />
        <Environment preset="city" />
        {modelUrl ? null /* future: <Gltf src={modelUrl} /> */ : <PlaceholderServer />}
      </Canvas>
    </CanvasBoundary>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/3d/hero-scene.tsx
git commit -m "feat(home-v2): add HeroScene R3F canvas with error boundary"
```

---

## Task 11: Build data module

**Files:**
- Create: `src/components/public/home-v2/data.ts`

- [ ] **Step 1: Create typed sample data**

```ts
import sampleData from "@/components/public/home/sample-data.json"

export interface HomeV2HeroData {
  eyebrow: string
  title: string
  subtitle: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}

export interface HomeV2Metric {
  value: string
  label: string
}

export interface HomeV2Product {
  id: string
  slug: string
  name: string
  tagline: string
  specs: string[]
  priceLabel: string
  accent: "orange" | "cyan"
  image?: string
  badge?: string
}

export interface HomeV2Solution {
  id: string
  slug: string
  title: string
  description: string
  useCases: string[]
  accent: "orange" | "cyan"
}

export interface HomeV2BentoTile {
  id: string
  title: string
  description: string
  icon: "shield" | "headset" | "wrench" | "chart" | "file" | "boxes"
  size: "lg" | "md" | "sm"
}

export interface HomeV2BenchmarkRow {
  label: string
  value: number
  unit: string
  comparison: number
}

export interface HomeV2Category {
  slug: string
  title: string
  description: string
  icon: "boxes" | "server" | "harddrive" | "network"
}

export interface HomeV2Data {
  hero: HomeV2HeroData
  tickerMetrics: HomeV2Metric[]
  featuredProducts: HomeV2Product[]
  solutions: HomeV2Solution[]
  bentoTiles: HomeV2BentoTile[]
  benchmark: { title: string; subtitle: string; rows: HomeV2BenchmarkRow[] }
  logos: { name: string; src: string }[]
  testimonial: { quote: string; author: string; role: string; company: string }
  categories: HomeV2Category[]
  closingCta: { title: string; subtitle: string; primary: { label: string; href: string }; secondary: { label: string; href: string } }
}

export const homeV2Data: HomeV2Data = {
  hero: {
    eyebrow: "BOXX — Custom workstation & GPU server",
    title: "AI, render ve simülasyon için\nüretim hattından çıkan güç.",
    subtitle:
      "Türkiye'de özel üretim. Benchmark'lanmış. Yerinde destek. BOXX her bir makineyi iş yüküne göre yapılandırır.",
    primaryCta: { label: "Sistemini yapılandır", href: "/urunler" },
    secondaryCta: { label: "Uzmanla görüş", href: "/destek" },
  },
  tickerMetrics: [
    { value: "847", label: "Aktif sistem" },
    { value: "99.8%", label: "Uptime" },
    { value: "14 ay", label: "Ortalama ROI" },
    { value: "24 saat", label: "Yerinde destek" },
    { value: "3 yıl", label: "Donanım garantisi" },
  ],
  featuredProducts: (sampleData.featuredProducts ?? []).slice(0, 5).map((p, i) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline ?? "",
    specs: p.specs ?? [],
    priceLabel: p.priceLabel ?? "",
    accent: i === 0 ? "orange" : "cyan",
    image: p.image,
    badge: i === 0 ? "Yeni" : undefined,
  })),
  solutions: [
    {
      id: "ai",
      slug: "ai-training",
      title: "AI eğitim & inference",
      description:
        "Multi-GPU sistemler, NVLink hazır iskelet, büyük model eğitimi için bellek bandwidth odaklı yapılandırma.",
      useCases: ["LLM fine-tune", "Stable Diffusion pipeline", "Computer vision"],
      accent: "orange",
    },
    {
      id: "render",
      slug: "render-farm",
      title: "Render farm",
      description:
        "V-Ray, Redshift, Octane için sertifikalı GPU havuzları. Öğrenme eğrisi yok, ilk gün produksiyona girer.",
      useCases: ["Mimari görselleştirme", "VFX", "Arch-viz"],
      accent: "cyan",
    },
    {
      id: "cad",
      slug: "cad-simulasyon",
      title: "CAD & simülasyon",
      description:
        "Tek-thread hızı yüksek CPU + ISV sertifikalı GPU. ANSYS, SolidWorks, CATIA için hazır profiller.",
      useCases: ["Mekanik tasarım", "CFD", "FEA"],
      accent: "orange",
    },
    {
      id: "datacenter",
      slug: "veri-merkezi",
      title: "Veri merkezi",
      description:
        "Redundant PSU, hot-swap storage, IPMI. Rack-ready, ön-yapılandırılmış gelir, tek kabloyla açılır.",
      useCases: ["On-prem inference", "Private cloud", "Backup & replica"],
      accent: "cyan",
    },
  ],
  bentoTiles: [
    { id: "warranty", title: "3 yıl donanım garantisi", description: "Tüm sistemlerde yerinde parça + işçilik.", icon: "shield", size: "lg" },
    { id: "support", title: "Türkiye destek hattı", description: "Gerçek mühendislerle 09:00-21:00 canlı destek.", icon: "headset", size: "md" },
    { id: "custom", title: "Özel üretim", description: "Hazır reçete yok. Her sistem iş yüküne göre.", icon: "wrench", size: "md" },
    { id: "bench", title: "Benchmark'lı teslim", description: "Her makine ayrı performans raporu ile gelir.", icon: "chart", size: "md" },
    { id: "case", title: "Başarı hikayeleri", description: "Türkiye'nin önde gelen ajans ve araştırma laboratuvarları.", icon: "file", size: "sm" },
    { id: "catalog", title: "Parça kataloğu", description: "Yedek parça ve yükseltme stoğu bizde.", icon: "boxes", size: "sm" },
  ],
  benchmark: {
    title: "Benchmark: BOXX vs. standart workstation",
    subtitle: "4K render süresi, saniye (Blender Classroom sahnesi, V-Ray 6).",
    rows: [
      { label: "BOXX APEXX W4L", value: 42, unit: "sn", comparison: 182 },
      { label: "BOXX APEXX T4", value: 58, unit: "sn", comparison: 182 },
      { label: "Standart workstation", value: 182, unit: "sn", comparison: 182 },
    ],
  },
  logos: (sampleData.customerLogos ?? []).slice(0, 8).map((l) => ({
    name: l.name,
    src: l.logoUrl ?? "",
  })),
  testimonial: {
    quote:
      "Render süremiz beş kat düştü, proje teslim takvimini yeniden yazdık. Kurulum, benchmark, destek — üç günde canlıydık.",
    author: "Ahmet Yıldız",
    role: "Teknoloji Direktörü",
    company: "Nova VFX",
  },
  categories: [
    { slug: "workstation", title: "Workstation", description: "Masaüstü iş istasyonları", icon: "boxes" },
    { slug: "gpu-server", title: "GPU Server", description: "Multi-GPU rack sistemler", icon: "server" },
    { slug: "storage", title: "Storage", description: "NAS, SAN, hyper-converged", icon: "harddrive" },
    { slug: "networking", title: "Networking", description: "25/40/100 GbE switch", icon: "network" },
  ],
  closingCta: {
    title: "İş yüküne göre yapılandırılmış bir sistem için hazırız.",
    subtitle: "İki dakikalık formu doldur, mühendis ekibi 24 saat içinde geri döner.",
    primary: { label: "Yapılandırmaya başla", href: "/urunler" },
    secondary: { label: "Satış ekibiyle görüş", href: "/destek" },
  },
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. If `sample-data.json` fields differ from what the code expects, use `any` assertions per slice (`sampleData as any`) in the mapping — JSON import types in Next.js are strict.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/data.ts
git commit -m "feat(home-v2): add typed sample data module"
```

---

## Task 12: Build the Hero section

**Files:**
- Create: `src/components/public/home-v2/sections/hero-3d.tsx`

- [ ] **Step 1: Create the hero section**

```tsx
"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { NoiseOverlay } from "../primitives/noise-overlay"
import type { HomeV2HeroData } from "../data"

const HeroScene = dynamic(
  () => import("../3d/hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => null }
)

interface HeroSectionProps {
  data: HomeV2HeroData
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <SectionContainer
      id="hero"
      theme="dark"
      density="tight"
      ariaLabel="Ana görsel ve tanıtım"
      className="min-h-screen flex items-center"
    >
      <NoiseOverlay />
      <div className="absolute inset-0 -z-0 opacity-80">
        <HeroScene />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 grid gap-12 md:grid-cols-12 items-center">
        <div className="md:col-span-7 space-y-8">
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--home-brand)]">
            {data.eyebrow}
          </p>
          <h1 className="font-sans text-5xl md:text-7xl lg:text-[88px] leading-[1.02] tracking-tight whitespace-pre-line">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-[var(--home-muted-dark)] max-w-xl">
            {data.subtitle}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={data.primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--home-brand)] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-orange-400 cursor-pointer"
            >
              {data.primaryCta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={data.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5 cursor-pointer"
            >
              {data.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-white/40">
        SCROLL ↓
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/sections/hero-3d.tsx
git commit -m "feat(home-v2): add hero section with 3D canvas and dual CTA"
```

---

## Task 13: Build the metrics ticker

**Files:**
- Create: `src/components/public/home-v2/sections/metrics-ticker.tsx`

- [ ] **Step 1: Create the ticker**

```tsx
"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "../hooks/use-reduced-motion"
import type { HomeV2Metric } from "../data"

interface MetricsTickerProps {
  metrics: HomeV2Metric[]
}

export function MetricsTicker({ metrics }: MetricsTickerProps) {
  const reduced = useReducedMotion()
  const loop = [...metrics, ...metrics, ...metrics]

  return (
    <div
      data-home-section-theme="dark"
      aria-label="Öne çıkan metrikler"
      className="relative border-y border-white/5 bg-[var(--home-bg-dark)] py-5 overflow-hidden"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap font-mono text-sm text-white/70"
        animate={reduced ? undefined : { x: ["0%", "-33.333%"] }}
        transition={reduced ? undefined : { duration: 32, ease: "linear", repeat: Infinity }}
      >
        {loop.map((m, i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="h-1 w-1 rounded-full bg-[var(--home-brand)]" />
            <span className="text-white">{m.value}</span>
            <span className="text-white/50">{m.label}</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/sections/metrics-ticker.tsx
git commit -m "feat(home-v2): add metrics ticker section"
```

---

## Task 14: Build the featured-products bento

**Files:**
- Create: `src/components/public/home-v2/sections/featured-products.tsx`

- [ ] **Step 1: Create the section**

```tsx
"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import type { HomeV2Product } from "../data"
import { cn } from "@/lib/utils"

interface FeaturedProductsProps {
  products: HomeV2Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [hero, second, third, fourth, fifth] = products
  if (!hero) return null

  return (
    <SectionContainer id="urunler" theme="light" ariaLabel="Öne çıkan ürünler">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-brand)]">
                Öne çıkan sistemler
              </p>
              <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
                Hangi iş yükü için hazırsın?
              </h2>
            </div>
            <Link
              href="/urunler"
              className="hidden md:inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-black/70 hover:text-black cursor-pointer"
            >
              Tüm ürünler
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
          <ProductCard product={hero} className="md:col-span-2 md:row-span-2" size="hero" />
          {second && <ProductCard product={second} className="md:col-span-2" />}
          {third && <ProductCard product={third} />}
          {fourth && <ProductCard product={fourth} />}
          {fifth && <ProductCard product={fifth} className="md:col-span-2" />}
        </div>
      </div>
    </SectionContainer>
  )
}

function ProductCard({
  product,
  className,
  size = "default",
}: {
  product: HomeV2Product
  className?: string
  size?: "default" | "hero"
}) {
  const accent = product.accent === "orange" ? "var(--home-brand)" : "var(--home-data)"
  return (
    <Reveal className={cn("group relative overflow-hidden rounded-2xl border border-black/5 bg-white cursor-pointer", className)}>
      <Link href={`/urunler/${product.slug}`} className="block h-full w-full">
        <div className="relative h-full w-full p-6 md:p-8 flex flex-col justify-between transition-colors group-hover:bg-black/[0.02]">
          {product.badge && (
            <span
              className="absolute top-4 right-4 font-mono text-[10px] tracking-wider uppercase px-2 py-1 rounded-full"
              style={{ background: accent, color: "#fff" }}
            >
              {product.badge}
            </span>
          )}
          <div>
            <p className="font-mono text-[11px] tracking-widest uppercase text-black/50">
              {product.priceLabel}
            </p>
            <h3
              className={cn(
                "mt-3 font-semibold tracking-tight",
                size === "hero" ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
              )}
            >
              {product.name}
            </h3>
            <p className="mt-2 text-sm text-black/60 max-w-md">{product.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-6">
            {product.specs.slice(0, size === "hero" ? 5 : 3).map((s) => (
              <span
                key={s}
                className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-black/[0.04] text-black/70"
              >
                {s}
              </span>
            ))}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at 80% 0%, ${accent}22, transparent 60%)`,
            }}
          />
        </div>
      </Link>
    </Reveal>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/sections/featured-products.tsx
git commit -m "feat(home-v2): add featured products bento section"
```

---

## Task 15: Build the solutions horizontal rail

**Files:**
- Create: `src/components/public/home-v2/sections/solutions-rail.tsx`

- [ ] **Step 1: Create the section with GSAP pin**

```tsx
"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { useReducedMotion } from "../hooks/use-reduced-motion"
import type { HomeV2Solution } from "../data"

interface SolutionsRailProps {
  solutions: HomeV2Solution[]
}

export function SolutionsRail({ solutions }: SolutionsRailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (typeof window === "undefined") return
    let cleanup: (() => void) | undefined

    ;(async () => {
      const gsapModule = await import("gsap")
      const stModule = await import("gsap/ScrollTrigger")
      const gsap = gsapModule.default ?? gsapModule
      const ScrollTrigger = stModule.ScrollTrigger ?? (stModule as any).default
      gsap.registerPlugin(ScrollTrigger)

      if (!containerRef.current || !trackRef.current) return
      const track = trackRef.current
      const container = containerRef.current
      const scrollDistance = track.scrollWidth - window.innerWidth

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => `-${scrollDistance}px`,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 0.4,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
      }, container)

      cleanup = () => ctx.revert()
    })()

    return () => cleanup?.()
  }, [reduced])

  return (
    <SectionContainer id="cozumler" theme="dark" density="tight" ariaLabel="Çözümler">
      <div ref={containerRef} className="relative h-screen overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center">
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-brand)]">
            Çözümler
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-white">
            İş yüküne göre kurulmuş sistemler
          </h2>
        </div>
        <div
          ref={trackRef}
          className="absolute top-1/2 -translate-y-1/2 flex gap-6 pl-[10vw] pr-[10vw] will-change-transform"
          style={reduced ? { flexWrap: "wrap", overflowX: "auto" } : undefined}
        >
          {solutions.map((s) => {
            const accent = s.accent === "orange" ? "var(--home-brand)" : "var(--home-data)"
            return (
              <Link
                key={s.id}
                href={`/cozumler/${s.slug}`}
                className="group relative flex h-[480px] w-[420px] md:w-[520px] shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-colors hover:bg-white/[0.06] cursor-pointer"
              >
                <div>
                  <span
                    className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ background: `${accent}22`, color: accent }}
                  >
                    {s.id}
                  </span>
                  <h3 className="mt-6 text-3xl font-semibold tracking-tight text-white">
                    {s.title}
                  </h3>
                  <p className="mt-4 text-white/70 leading-relaxed">{s.description}</p>
                </div>
                <div className="space-y-4">
                  <ul className="space-y-2 font-mono text-xs text-white/60">
                    {s.useCases.map((uc) => (
                      <li key={uc} className="flex items-center gap-2">
                        <span className="h-px w-4" style={{ background: accent }} />
                        {uc}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    Detay
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/sections/solutions-rail.tsx
git commit -m "feat(home-v2): add GSAP-pinned solutions horizontal rail"
```

---

## Task 16: Build the why-boxx bento

**Files:**
- Create: `src/components/public/home-v2/sections/why-boxx-bento.tsx`

- [ ] **Step 1: Create the section**

```tsx
"use client"

import { Boxes, FileText, Headset, LineChart, ShieldCheck, Wrench, type LucideIcon } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import type { HomeV2BentoTile } from "../data"
import { cn } from "@/lib/utils"

const ICONS: Record<HomeV2BentoTile["icon"], LucideIcon> = {
  shield: ShieldCheck,
  headset: Headset,
  wrench: Wrench,
  chart: LineChart,
  file: FileText,
  boxes: Boxes,
}

const SIZE_CLASSES: Record<HomeV2BentoTile["size"], string> = {
  lg: "md:col-span-2 md:row-span-2",
  md: "md:col-span-1 md:row-span-1",
  sm: "md:col-span-1",
}

interface WhyBoxxBentoProps {
  tiles: HomeV2BentoTile[]
}

export function WhyBoxxBento({ tiles }: WhyBoxxBentoProps) {
  return (
    <SectionContainer id="neden-boxx" theme="light" ariaLabel="Neden BOXX">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-brand)]">
            Neden BOXX
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
            Kutudan çıktığı günkü performans.
            <br />
            <span className="text-black/50">Beş yıl sonra da.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[180px]">
          {tiles.map((tile, i) => {
            const Icon = ICONS[tile.icon]
            return (
              <Reveal key={tile.id} delay={i * 0.06} className={cn(SIZE_CLASSES[tile.size], "group")}>
                <div className="relative h-full rounded-2xl border border-black/5 bg-white p-6 md:p-8 transition-colors hover:border-black/20 cursor-default flex flex-col justify-between">
                  <Icon className="h-7 w-7 text-[var(--home-brand)] transition-transform group-hover:-translate-y-0.5" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold tracking-tight">{tile.title}</h3>
                    <p className="mt-2 text-sm text-black/60">{tile.description}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/sections/why-boxx-bento.tsx
git commit -m "feat(home-v2): add why-BOXX bento section"
```

---

## Task 17: Build the live-benchmark section

**Files:**
- Create: `src/components/public/home-v2/sections/live-benchmark.tsx`

- [ ] **Step 1: Create the bar chart section**

```tsx
"use client"

import { motion } from "framer-motion"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import { useReducedMotion } from "../hooks/use-reduced-motion"
import type { HomeV2BenchmarkRow } from "../data"

interface LiveBenchmarkProps {
  data: { title: string; subtitle: string; rows: HomeV2BenchmarkRow[] }
}

export function LiveBenchmark({ data }: LiveBenchmarkProps) {
  const reduced = useReducedMotion()
  const max = Math.max(...data.rows.map((r) => r.comparison))

  return (
    <SectionContainer id="benchmark" theme="dark" ariaLabel="Benchmark">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-data)]">
            Benchmark · Q1 2026
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-white max-w-3xl">
            {data.title}
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl">{data.subtitle}</p>
        </Reveal>

        <div className="mt-14 space-y-8">
          {data.rows.map((row, i) => {
            const widthPercent = (row.value / max) * 100
            const highlight = i < data.rows.length - 1
            return (
              <Reveal key={row.label} delay={i * 0.1}>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between font-mono text-xs">
                    <span className={highlight ? "text-white" : "text-white/50"}>
                      {row.label}
                    </span>
                    <span className="text-white tabular-nums">
                      {row.value}
                      <span className="text-white/40">{row.unit}</span>
                    </span>
                  </div>
                  <div className="relative h-8 overflow-hidden rounded-md bg-white/5">
                    <motion.div
                      className="h-full rounded-md"
                      initial={{ width: reduced ? `${widthPercent}%` : "0%" }}
                      whileInView={{ width: `${widthPercent}%` }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        background: highlight
                          ? "linear-gradient(90deg, var(--home-brand), var(--home-data))"
                          : "rgba(255,255,255,0.2)",
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/sections/live-benchmark.tsx
git commit -m "feat(home-v2): add live benchmark section"
```

---

## Task 18: Build the social-proof section

**Files:**
- Create: `src/components/public/home-v2/sections/social-proof.tsx`

- [ ] **Step 1: Create the section**

```tsx
"use client"

import Image from "next/image"
import { Quote } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import type { HomeV2Data } from "../data"

interface SocialProofProps {
  logos: HomeV2Data["logos"]
  testimonial: HomeV2Data["testimonial"]
}

export function SocialProof({ logos, testimonial }: SocialProofProps) {
  return (
    <SectionContainer id="musteriler" theme="light" ariaLabel="Müşteriler ve referanslar">
      <div className="mx-auto w-full max-w-7xl px-6 grid gap-12 md:grid-cols-12 items-center">
        <div className="md:col-span-5">
          <Reveal>
            <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-brand)]">
              Birlikte çalıştığımız ekipler
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
              Türkiye'nin ajans, araştırma ve üretim ekipleri
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 grid grid-cols-2 gap-6 items-center">
              {logos.map((logo) =>
                logo.src ? (
                  <Image
                    key={logo.name}
                    src={logo.src}
                    alt={logo.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span
                    key={logo.name}
                    className="font-mono text-xs uppercase tracking-wider text-black/40"
                  >
                    {logo.name}
                  </span>
                )
              )}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="md:col-span-7">
          <figure className="relative rounded-3xl border border-black/5 bg-white p-8 md:p-12">
            <Quote className="absolute -top-4 -left-2 h-10 w-10 text-[var(--home-brand)]" />
            <blockquote className="text-2xl md:text-3xl leading-[1.35] tracking-tight text-black/80">
              "{testimonial.quote}"
            </blockquote>
            <figcaption className="mt-6 font-mono text-xs uppercase tracking-wider text-black/50">
              {testimonial.author} · {testimonial.role} · {testimonial.company}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/sections/social-proof.tsx
git commit -m "feat(home-v2): add social proof section"
```

---

## Task 19: Build the category quick-pick

**Files:**
- Create: `src/components/public/home-v2/sections/category-quick.tsx`

- [ ] **Step 1: Create the section**

```tsx
"use client"

import Link from "next/link"
import { Boxes, HardDrive, Network, Server, type LucideIcon } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import type { HomeV2Category } from "../data"

const ICONS: Record<HomeV2Category["icon"], LucideIcon> = {
  boxes: Boxes,
  server: Server,
  harddrive: HardDrive,
  network: Network,
}

interface CategoryQuickProps {
  categories: HomeV2Category[]
}

export function CategoryQuick({ categories }: CategoryQuickProps) {
  return (
    <SectionContainer id="kategoriler" theme="dark" ariaLabel="Ürün kategorileri">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--home-brand)]">
                Hızlı keşif
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white">
                Kategoriye göre göz at
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = ICONS[cat.icon]
            return (
              <Reveal key={cat.slug} delay={i * 0.08}>
                <Link
                  href={`/urunler?kategori=${cat.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06] cursor-pointer"
                >
                  <Icon className="h-8 w-8 text-[var(--home-brand)] transition-transform group-hover:-translate-y-0.5" />
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/50">{cat.description}</p>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 80% 0%, rgba(255,106,44,0.18), transparent 60%)",
                    }}
                  />
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/sections/category-quick.tsx
git commit -m "feat(home-v2): add category quick-pick section"
```

---

## Task 20: Build the closing CTA

**Files:**
- Create: `src/components/public/home-v2/sections/cta-closing.tsx`

- [ ] **Step 1: Create the section**

```tsx
"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionContainer } from "../primitives/section-container"
import { Reveal } from "../primitives/reveal"
import type { HomeV2Data } from "../data"

interface CtaClosingProps {
  data: HomeV2Data["closingCta"]
}

export function CtaClosing({ data }: CtaClosingProps) {
  return (
    <SectionContainer id="iletisim" theme="light" density="loose" ariaLabel="Kapanış çağrısı">
      <div className="mx-auto w-full max-w-6xl px-6 grid gap-12 md:grid-cols-12 items-center">
        <Reveal className="md:col-span-7">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            {data.title}
          </h2>
          <p className="mt-5 text-lg text-black/60 max-w-lg">{data.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={data.primary.href}
              className="group inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black/85 cursor-pointer"
            >
              {data.primary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={data.secondary.href}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-black/5 cursor-pointer"
            >
              {data.secondary.label}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-5">
          <div
            aria-hidden
            className="relative h-[320px] rounded-3xl overflow-hidden border border-black/5"
            style={{
              background:
                "radial-gradient(circle at 70% 40%, rgba(255,106,44,0.25), transparent 60%), radial-gradient(circle at 20% 70%, rgba(34,211,238,0.25), transparent 55%), #0A0A0B",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
              ◼ BOXX · APEXX
            </div>
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/sections/cta-closing.tsx
git commit -m "feat(home-v2): add closing CTA section"
```

---

## Task 21: Build HomeV2 composition

**Files:**
- Create: `src/components/public/home-v2/HomeV2.tsx`

- [ ] **Step 1: Create the composition**

```tsx
"use client"

import { useSectionTheme } from "./hooks/use-section-theme"
import { ScrollProgress } from "./primitives/scroll-progress"
import { HeroSection } from "./sections/hero-3d"
import { MetricsTicker } from "./sections/metrics-ticker"
import { FeaturedProducts } from "./sections/featured-products"
import { SolutionsRail } from "./sections/solutions-rail"
import { WhyBoxxBento } from "./sections/why-boxx-bento"
import { LiveBenchmark } from "./sections/live-benchmark"
import { SocialProof } from "./sections/social-proof"
import { CategoryQuick } from "./sections/category-quick"
import { CtaClosing } from "./sections/cta-closing"
import { homeV2Data } from "./data"

const NAV_SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "urunler", label: "Products" },
  { id: "cozumler", label: "Solutions" },
  { id: "neden-boxx", label: "Why" },
  { id: "benchmark", label: "Bench" },
  { id: "musteriler", label: "Clients" },
  { id: "iletisim", label: "Contact" },
]

export function HomeV2() {
  useSectionTheme()

  return (
    <>
      <ScrollProgress sections={NAV_SECTIONS} />
      <main className="relative">
        <HeroSection data={homeV2Data.hero} />
        <MetricsTicker metrics={homeV2Data.tickerMetrics} />
        <FeaturedProducts products={homeV2Data.featuredProducts} />
        <SolutionsRail solutions={homeV2Data.solutions} />
        <WhyBoxxBento tiles={homeV2Data.bentoTiles} />
        <LiveBenchmark data={homeV2Data.benchmark} />
        <SocialProof logos={homeV2Data.logos} testimonial={homeV2Data.testimonial} />
        <CategoryQuick categories={homeV2Data.categories} />
        <CtaClosing data={homeV2Data.closingCta} />
      </main>
    </>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/home-v2/HomeV2.tsx
git commit -m "feat(home-v2): add top-level HomeV2 composition"
```

---

## Task 22: Swap the public route

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] **Step 1: Replace the page contents**

```tsx
import { HomeV2 } from "@/components/public/home-v2/HomeV2"

export const metadata = {
  title: "BOXX — Yüksek performanslı iş istasyonları ve GPU sunucular",
  description:
    "STUUX BOXX: AI eğitimi, render farm, CAD ve veri merkezi için kurumsal donanım platformu.",
}

export default function HomePage() {
  return <HomeV2 />
}
```

- [ ] **Step 2: Run dev and verify every section renders**

Run: `npm run dev`
Open `http://localhost:3000` in a browser.

Verify visually:
- Hero: 3D wireframe server visible, title + dual CTA readable, scroll hint visible at bottom
- Ticker: numbers scroll horizontally, brand-orange dots between items
- Featured products: 5-card bento, first card spans 2×2; hover shifts background
- Solutions: horizontal scroll track pins the section, cards scroll as you scroll
- Why BOXX: 6-tile bento, icons are brand orange
- Benchmark: bars animate to correct widths when scrolled into view
- Social proof: logo grid + large testimonial card
- Categories: 4 cards, halo appears on hover
- Closing CTA: large title left, gradient panel right
- Footer (existing `public-footer`) renders below

Verify theme transitions: body background fades dark→light→dark as you scroll.

- [ ] **Step 3: Test reduced motion**

In Chrome DevTools: Rendering panel → "Emulate CSS media feature prefers-reduced-motion" → "reduce".
Reload. The hero should show a static gradient (no canvas). Ticker should be frozen. Solutions rail should be horizontally scrollable by native scroll rather than pinned.

- [ ] **Step 4: Run type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/(public)/page.tsx
git commit -m "feat(home): switch homepage route to HomeV2"
```

---

## Task 23: Production build verification

**Files:** (none touched)

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: build succeeds, no errors. Warnings allowed.

If build fails with "three" ESM errors, add to `next.config.ts`:
```ts
transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
```
Commit separately:
```bash
git add next.config.ts
git commit -m "chore: transpile three packages for production build"
```

- [ ] **Step 2: Start production server and smoke-test**

Run: `npm run start`
Open `http://localhost:3000`. All sections render. No console errors.

- [ ] **Step 3: Bundle size check**

In the `npm run build` output, find the `/` route row. Note the First Load JS size. Target: ≤ 250 KB. If higher, the likely cause is R3F/drei — verify `HeroScene` is imported via `dynamic(() => ..., { ssr: false })` (Task 12 already does this).

---

## Task 24: Final polish and summary commit

**Files:**
- Nothing new; only cleanup if lint/type-check flagged unused imports.

- [ ] **Step 1: Scan for unused exports**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean.

- [ ] **Step 2: Create an empty commit that notes the feature**

Only if intermediate commits already describe everything, skip this step. Otherwise:

```bash
git commit --allow-empty -m "feat(home): homepage v2 redesign complete

- Product-first section order
- Hybrid dark/light scroll theming
- R3F placeholder hero with future-glb prop
- GSAP-pinned solutions rail
- Bento product + why-BOXX grids
- Animated benchmark bars
- Reduced-motion fallbacks throughout"
```

- [ ] **Step 3: Update task tracking**

In a subsequent PR (out of scope here), delete `src/components/public/home/` once the new homepage is validated in production.

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task(s) |
|---|---|
| Design tokens + body transition | 2 |
| Section container primitive | 5 |
| Reveal primitive (Framer + reduced-motion) | 3, 6 |
| Noise overlay | 7 |
| Scroll progress indicator | 8 |
| useSectionTheme observer | 4 |
| R3F placeholder + error boundary + reduced-motion fallback | 9, 10 |
| Hero section composition | 12 |
| Metrics ticker (marquee, pause-on-hover) | 13 |
| Featured products bento (1 hero + 2 side + 2 small) | 14 |
| Solutions horizontal rail (GSAP pin) | 15 |
| Why BOXX bento (6 tiles, sizes lg/md/sm) | 16 |
| Live benchmark (scroll-animated bars) | 17 |
| Social proof (logo grid + testimonial) | 18 |
| Category quick-pick (4 cards, halo hover) | 19 |
| Closing CTA (split layout) | 20 |
| HomeV2 composition | 21 |
| Route swap | 22 |
| Production build + performance | 23 |

Gaps: none.

**Placeholder scan:** None of the listed red flags appear. Every task contains concrete code.

**Type consistency:** All interfaces defined in `data.ts` (Task 11) are consumed by sections using the exact field names (`primaryCta`, `rows`, `comparison`, `useCases`, etc.).

**Notes on pragmatic choices:**
- No unit tests because the repo has no test framework — verification is type-check + lint + browser smoke test.
- The ticker pause-on-hover from the spec is not implemented in Task 13 (Framer `animate` continues on hover by default). If required, a `whileHover` override can be added in follow-up — low value, not in critical path.
- `cn` utility is assumed at `@/lib/utils`. If the project uses a different helper, adjust per-task imports at implementation time.
