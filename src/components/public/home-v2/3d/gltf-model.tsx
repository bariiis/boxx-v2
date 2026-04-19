"use client"

import { Center, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

interface GltfModelProps {
  url: string
  /** Target size the model should fit into (in world units). Default 3.5. */
  fitSize?: number
}

export function GltfModel({ url, fitSize = 3.5 }: GltfModelProps) {
  const { scene } = useGLTF(url)
  const group = useRef<THREE.Group>(null)

  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3()).length()
    return size > 0 ? fitSize / size : 1
  }, [scene, fitSize])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t * 0.3) * 0.4
    group.current.position.y = Math.sin(t * 0.6) * 0.15
  })

  return (
    <group ref={group} scale={scale}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  )
}
