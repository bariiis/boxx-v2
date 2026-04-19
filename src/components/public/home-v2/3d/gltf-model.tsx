"use client"

import { Bounds, Center, Float, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

interface GltfModelProps {
  url: string
}

export function GltfModel({ url }: GltfModelProps) {
  const { scene } = useGLTF(url)
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t * 0.2) * 0.3
  })

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Bounds fit clip observe margin={1.2}>
        <Center>
          <group ref={group}>
            <primitive object={scene} />
          </group>
        </Center>
      </Bounds>
    </Float>
  )
}
