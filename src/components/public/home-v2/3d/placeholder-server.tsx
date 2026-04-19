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
        <mesh position={[0, -1.7, 0.61]}>
          <boxGeometry args={[1.9, 0.04, 0.02]} />
          <meshBasicMaterial color="#FF6A2C" />
        </mesh>
      </group>
    </Float>
  )
}
