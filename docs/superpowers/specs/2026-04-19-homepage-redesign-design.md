# Homepage Redesign — Design Spec

**Date:** 2026-04-19
**Status:** Approved (awaiting implementation plan)
**Scope:** `src/app/(public)/page.tsx` and the component tree it renders

## Goal

Replace the current static homepage (`src/components/public/home/Home.tsx`, 1061 lines) with a visually richer, animation-driven version. Structure stays product-first; visuals upgrade to match the "Opal Tadpole" reference in `memory/feedback_ui_reference.md` — modern, dark-first with hybrid scroll theme transitions, 3D hero, bento product showcase, and scroll-driven reveals.

## Non-goals

- No changes to Admin panel, Portal, or other public pages (`urunler`, `cozumler`, `destek`, etc.)
- No redesign of shared chrome (`public-header`, `public-footer`)
- No CMS integration for homepage content in this round — sample data stays in a local module
- No Stripe/iyzico touch, no auth changes
- Not replacing the existing `src/components/public/home/Home.tsx` in the same PR; the new tree lives under `home-v2/` and the route switches over once approved

## Design System

### Colors (hybrid scroll: dark ↔ light sections)

| Role | Dark section | Light section |
|------|--------------|---------------|
| Background | `#0A0A0B` | `#FAFAFA` |
| Surface | `#111113` | `#FFFFFF` |
| Border | `#1F1F23` | `#E5E5E7` |
| Text primary | `#F5F5F7` | `#0A0A0B` |
| Text muted | `#A1A1A6` | `#57575B` |
| Brand accent | `#FF6A2C` (STUUX orange) | same |
| Data accent | `#22D3EE` (cyan) | same |
| Success / alert | `#4ADE80` / `#F87171` | same |

Accent rationale: `ACCENT_STYLES` in the current `Home.tsx` already centers on orange; cyan is reserved for numeric/monospace data highlights (benchmark bars, live metric ticker).

### Typography

- **Display / Heading:** Geist Sans, weight 500–700, tracking `-0.02em`
- **Body:** Geist Sans, weight 400, line-height 1.6
- **Accent (numbers, labels, SKU, scroll indicator):** Geist Mono
- **Scale:** 12 / 14 / 16 / 20 / 24 / 32 / 48 / 72 / 120

Loaded through the `geist` package so it works with Next.js `next/font` without network fetches.

### Effect vocabulary

- Radial gradient halos (retain current `ACCENT_STYLES.halo` system concept)
- 1px borders with subtle inset highlight: `shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`
- Glassmorphism only on dark sections: `backdrop-blur-xl bg-white/[0.04]`
- Noise / grain overlay on dark sections (SVG filter, opt-in per section)
- Hover transitions 150–250ms ease-out, restricted to `transform`, `opacity`, `color`, `background-color` — no scale/size changes that cause layout shift

## Section Architecture

Ten sections with alternating themes. Section boundaries transition `background-color` (400ms ease-in-out) based on `IntersectionObserver`, not raw scroll position.

| # | Section | Theme | Height | Purpose |
|---|---------|-------|--------|---------|
| 1 | Hero (3D) | dark | 100vh | Holographic server/GPU silhouette, headline left, dual CTA, scroll hint |
| 2 | Live metrics ticker | dark | 80px | Monospace marquee of signal numbers |
| 3 | Featured products | light | auto | Bento: one hero card (2×2) + two side cards + two small cards, spec reveal on hover |
| 4 | Solutions rail | dark | auto | GSAP-pinned horizontal scroll: AI, Render, CAD, Data Center |
| 5 | Why BOXX bento | light | auto | 6-tile bento: warranty, support, custom build, benchmark, case study, part catalog |
| 6 | Live benchmark | dark | auto | Cyan bar chart animating to real values when in view |
| 7 | Social proof | light | auto | Logo grid + rotating testimonial card stack |
| 8 | Category quick-pick | dark | auto | Existing category grid ported with new halo hover |
| 9 | Closing CTA | light | 60vh | Split: headline + dual CTA / mini 3D |
| 10 | Footer | dark | — | Existing `public-footer` |

Per-section theme switch is driven by a `useSectionTheme` hook that observes each section and sets a `data-theme="dark|light"` attribute on `<body>`, which CSS uses to drive root background transitions.

## Interaction & Animation

### Hero

- `@react-three/fiber` `<Canvas frameloop="demand">` with a placeholder wireframe rack built from primitives + `<MeshDistortMaterial>` + `<Float>` for idle motion
- Mouse parallax: camera target lerps toward mouse position (damping 0.08)
- `prefers-reduced-motion`: static gradient mesh fallback (no canvas mount)
- Accepts `modelUrl?: string` prop — when set, a `<Gltf>` replaces the placeholder

### Scroll reveal (Framer Motion)

- `whileInView`, `once: true`
- Each reveal: opacity 0→1, y 60→0, 600ms ease-out
- Stagger children 80ms within product / category / bento grids

### Scroll-pin (GSAP ScrollTrigger)

- Section 4: horizontal scroll-snap rail pinned with `ScrollTrigger.pin` + scrub
- Section 6: bar chart values scrubbed from 0 to target as the section enters viewport

### Live ticker (Section 2)

- Framer Motion loop, `x: [0, -1000]`, infinite
- Pause on hover

### Card hover (Sections 3, 5)

- `group-hover`: border color shift, inner shadow, icon translate-Y -2px, background halo opacity 0→1
- No `scale` transform (per existing feedback rule: no layout-shifting hover)
- 200ms ease-out

### Scroll progress indicator

- Fixed bottom-right vertical bar with monospace section labels
- Shows current section name + progress fill

### Reduced motion fallback

- GSAP pins disabled → native scroll
- R3F canvas → static render
- Framer reveal → instant
- Ticker → frozen

## Component & File Architecture

```
src/components/public/home-v2/
├── HomeV2.tsx                   # Thin composition — orders sections, passes data
├── sections/
│   ├── hero-3d.tsx              # <Canvas> + copy + CTAs
│   ├── metrics-ticker.tsx
│   ├── featured-products.tsx    # Big bento
│   ├── solutions-rail.tsx       # GSAP horizontal scroll
│   ├── why-boxx-bento.tsx
│   ├── live-benchmark.tsx
│   ├── social-proof.tsx
│   ├── category-quick.tsx
│   └── cta-closing.tsx
├── primitives/
│   ├── section-container.tsx    # data-theme wrapper, reveal root
│   ├── scroll-progress.tsx
│   ├── reveal.tsx               # Framer Motion whileInView
│   └── noise-overlay.tsx        # SVG grain filter
├── 3d/
│   ├── hero-scene.tsx           # <Canvas frameloop="demand">
│   ├── placeholder-server.tsx   # Wireframe placeholder
│   └── types.ts
├── hooks/
│   ├── use-reduced-motion.ts
│   └── use-section-theme.ts
└── data.ts                      # Typed sample data (sourced from existing sample-data.json shape)
```

### Unit responsibilities

- `HomeV2` — composition only. No business logic, no state.
- `sections/*` — each reads its own typed data slice, owns local interaction state, has no cross-section dependencies
- `primitives/*` — pure presentational, no data
- `3d/*` — isolated R3F, can be dynamically imported for code-splitting
- `hooks/*` — cross-section behaviors, testable in isolation

### Data flow

1. `app/(public)/page.tsx` (server component) imports sample data from `home-v2/data.ts`
2. Passes typed slices to `<HomeV2 {...data} />` (client component)
3. `HomeV2` destructures into section props — no global store, no context needed for this round

### Existing component reuse

- `public-header`, `public-footer` — unchanged
- `ACCENT_STYLES` color logic from current `Home.tsx` is the model for the new token set, but we define fresh tokens in Tailwind rather than copying the object
- Existing landing section components under `src/components/landing/*` are **not** reused on the homepage — they are for the CMS landing-page builder and have different data contracts

## Global Changes

### Dependencies (to add)

- `@react-three/fiber`
- `@react-three/drei`
- `three`
- `gsap` (only ScrollTrigger used)
- `framer-motion` (verify; add if missing)
- `geist` (Vercel font package — Sans + Mono)

### Tailwind config

- Add `brand.orange.*` and `data.cyan.*` color scales
- Add `fontFamily.sans = ['var(--font-geist-sans)', ...]` and `fontFamily.mono = ['var(--font-geist-mono)', ...]`

### `src/app/globals.css`

- Add CSS custom properties `--bg-dark`, `--bg-light`, `--fg-dark`, `--fg-light`
- Body uses `data-theme` attribute to swap between dark/light root bg
- Global transition on `body { transition: background-color 400ms ease-in-out }`

### `src/app/layout.tsx`

- Wire `GeistSans` and `GeistMono` via `next/font` with CSS variables
- No other changes to existing providers

### `next.config.ts`

- Add `transpilePackages: ['three']` if R3F bundle errors surface — verify during implementation

### Route change

- `src/app/(public)/page.tsx` swaps `HomePage` import from `home/HomePage` to `home-v2/HomeV2`
- Old `src/components/public/home/` tree stays on disk for one PR; removed in follow-up once the redesign is confirmed

## Error Handling

- 3D canvas is wrapped in a React error boundary that falls back to the static gradient mesh if `three` fails to load
- GSAP is dynamically imported in a `useEffect` to avoid SSR crashes; if the import fails, sections degrade to native scroll
- Framer Motion handles its own SSR safety
- Image assets use `next/image` with explicit `alt` text (accessibility rule)

## Performance Budget

- Initial JS budget for the homepage route: ≤ 180 KB gzipped
- Three.js is the largest dependency — loaded via dynamic import, only on the homepage route
- `<Canvas frameloop="demand">` prevents continuous GPU work when idle
- Scroll triggers use `IntersectionObserver`, not scroll listeners
- Images: `next/image` with `sizes` attribute, WebP served automatically

## Accessibility

- All interactive elements have visible focus states (2px outline, brand accent)
- All images have descriptive `alt` text; decorative 3D canvas has `aria-hidden`
- Color contrast ≥ 4.5:1 in both dark and light sections
- `prefers-reduced-motion` disables canvas animation, scroll pinning, ticker, and reveal transitions
- Tab order matches visual order; skip-link lands above the hero
- Ticker has `aria-label` and is not the only source of any information

## Testing

- Visual regression: manually verified at 375 / 768 / 1024 / 1440 px
- Lighthouse: Performance ≥ 85, Accessibility ≥ 95 on desktop
- Reduced motion: verified with `prefers-reduced-motion: reduce` media query toggle
- Build: `npm run build` passes; type-check clean
- No unit tests for presentational components in this round; hooks (`useSectionTheme`, `useReducedMotion`) get basic tests

## Open Questions (resolved)

- **3D model source:** Placeholder primitives now; real `.glb` swapped in later via `modelUrl` prop
- **Animation library mix:** Framer Motion for reveal/hover, GSAP for scroll-pin/scrub, R3F for hero
- **Typography:** Geist Sans + Geist Mono
- **Theme strategy:** Hybrid scroll (per-section dark/light), IntersectionObserver-driven

## Out of scope (potential follow-ups)

- Migrating homepage content into the Landing CMS
- Deleting the old `home/` tree (separate cleanup PR)
- A/B testing framework for hero variants
- Real benchmark data pipeline for Section 6 (uses static sample data for now)
