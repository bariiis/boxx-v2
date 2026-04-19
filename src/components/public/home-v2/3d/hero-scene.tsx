"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, PerspectiveCamera } from "@react-three/drei"
import { Component, Suspense, type ReactNode } from "react"
import { PlaceholderServer } from "./placeholder-server"
import { GltfModel } from "./gltf-model"
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
        <Suspense fallback={<PlaceholderServer />}>
          {modelUrl ? <GltfModel url={modelUrl} /> : <PlaceholderServer />}
        </Suspense>
      </Canvas>
    </CanvasBoundary>
  )
}
