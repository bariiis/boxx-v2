import {
  Geist,
  Geist_Mono,
  Inter,
  Space_Grotesk,
  Plus_Jakarta_Sans,
  DM_Sans,
  Manrope,
  Sora,
  Outfit,
  JetBrains_Mono,
  Bodoni_Moda,
  Jost,
  Instrument_Serif,
  Poppins,
  Urbanist,
} from "next/font/google"

// ============================================================
// PRESET FONTS — loaded statically via next/font (build-time)
// Each exposes a CSS variable that we attach to <html>.
// ============================================================

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] })
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] })
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] })
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] })
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] })
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] })
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] })
const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
})
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
})
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

/** Class string to put on <html> so all preset fonts are available as CSS vars. */
export const fontVariables = [
  geistSans.variable,
  geistMono.variable,
  inter.variable,
  spaceGrotesk.variable,
  jakarta.variable,
  dmSans.variable,
  manrope.variable,
  sora.variable,
  outfit.variable,
  jetbrainsMono.variable,
  bodoniModa.variable,
  jost.variable,
  instrumentSerif.variable,
  poppins.variable,
  urbanist.variable,
].join(" ")

export interface PresetFont {
  /** Stable id used in DB */
  id: string
  /** Display label in admin UI */
  label: string
  /** CSS variable that resolves to the font family */
  cssVar: string
  /** Fallback stack appended after the var */
  fallback: string
  category: "sans" | "mono" | "display"
}

export const PRESET_FONTS: PresetFont[] = [
  { id: "geist", label: "Geist", cssVar: "--font-geist-sans", fallback: "system-ui, sans-serif", category: "sans" },
  { id: "inter", label: "Inter", cssVar: "--font-inter", fallback: "system-ui, sans-serif", category: "sans" },
  { id: "space-grotesk", label: "Space Grotesk", cssVar: "--font-space-grotesk", fallback: "system-ui, sans-serif", category: "display" },
  { id: "jakarta", label: "Plus Jakarta Sans", cssVar: "--font-jakarta", fallback: "system-ui, sans-serif", category: "sans" },
  { id: "dm-sans", label: "DM Sans", cssVar: "--font-dm-sans", fallback: "system-ui, sans-serif", category: "sans" },
  { id: "manrope", label: "Manrope", cssVar: "--font-manrope", fallback: "system-ui, sans-serif", category: "sans" },
  { id: "sora", label: "Sora", cssVar: "--font-sora", fallback: "system-ui, sans-serif", category: "display" },
  { id: "outfit", label: "Outfit", cssVar: "--font-outfit", fallback: "system-ui, sans-serif", category: "display" },
  { id: "geist-mono", label: "Geist Mono", cssVar: "--font-geist-mono", fallback: "ui-monospace, monospace", category: "mono" },
  { id: "jetbrains-mono", label: "JetBrains Mono", cssVar: "--font-jetbrains-mono", fallback: "ui-monospace, monospace", category: "mono" },
  { id: "bodoni-moda", label: "Bodoni Moda", cssVar: "--font-bodoni-moda", fallback: "Georgia, serif", category: "display" },
  { id: "jost", label: "Jost", cssVar: "--font-jost", fallback: "system-ui, sans-serif", category: "sans" },
  { id: "instrument-serif", label: "Instrument Serif", cssVar: "--font-instrument-serif", fallback: "Georgia, serif", category: "display" },
]

export function getPresetFont(id: string): PresetFont | undefined {
  return PRESET_FONTS.find((f) => f.id === id)
}

/** Resolve a font reference (preset id OR custom font family name) to a CSS font-family value. */
export function resolveFontFamily(
  ref: string | undefined,
  customFonts: { family: string }[] = []
): string {
  if (!ref) return "var(--font-geist-sans), system-ui, sans-serif"
  const preset = getPresetFont(ref)
  if (preset) return `var(${preset.cssVar}), ${preset.fallback}`
  // custom font lookup by family
  const custom = customFonts.find((c) => c.family === ref)
  if (custom) return `"${custom.family}", system-ui, sans-serif`
  return `${ref}, system-ui, sans-serif`
}

// ============================================================
// CUSTOM FONT @font-face GENERATION
// ============================================================

export interface CustomFontFace {
  family: string
  fileUrl: string
  weight?: number
  style?: string
  format?: string
}

export function buildFontFaceCss(fonts: CustomFontFace[]): string {
  return fonts
    .map(
      (f) => `@font-face{font-family:"${f.family}";src:url("${f.fileUrl}") format("${f.format ?? "woff2"}");font-weight:${f.weight ?? 400};font-style:${f.style ?? "normal"};font-display:swap;}`
    )
    .join("")
}

// ============================================================
// THEME TYPES
// ============================================================

export interface LandingTheme {
  fonts?: { heading?: string; body?: string }
  colors?: {
    bg?: string
    fg?: string
    muted?: string
    mutedFg?: string
    primary?: string
    primaryFg?: string
    accent?: string
    border?: string
  }
  /** Per-element font sizes in pixels. Empty/0 = leave to component default. */
  sizes?: {
    h1?: number
    h2?: number
    h3?: number
    h4?: number
    body?: number
  }
}

export const DEFAULT_THEME: Required<Omit<LandingTheme, "sizes">> & {
  sizes: NonNullable<LandingTheme["sizes"]>
} = {
  fonts: { heading: "geist", body: "geist" },
  colors: {
    bg: "#ffffff",
    fg: "#0a0a0a",
    muted: "#f4f4f5",
    mutedFg: "#71717a",
    primary: "#0066ff",
    primaryFg: "#ffffff",
    accent: "#7c3aed",
    border: "#e4e4e7",
  },
  sizes: {},
}
