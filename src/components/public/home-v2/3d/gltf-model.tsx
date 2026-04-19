"use client"

import { Bounds, Center, useGLTF } from "@react-three/drei"
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
    group.current.rotation.y = Math.sin(t * 0.3) * 0.4
    group.current.position.y = Math.sin(t * 0.6) * 0.15
  })

  return (
    <Bounds fit clip margin={1.2}>
      <Center>
        <group ref={group}>
          <primitive object={scene} />
        </group>
      </Center>
    </Bounds>
  )
}
