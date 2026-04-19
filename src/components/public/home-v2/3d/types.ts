export interface HeroModelProps {
  /** When provided, a future .glb is loaded instead of the primitive placeholder. */
  modelUrl?: string
  /** World-space diagonal the normalized model should occupy. Default 3.5. */
  modelFitSize?: number
}
