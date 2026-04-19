"use client"

import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { SkeletonUtils } from "three-stdlib"
import * as THREE from "three"

interface GltfModelProps {
  url: string
  /** World-space diagonal the normalized model should occupy. Default 3.5. */
  fitSize?: number
}

export function GltfModel({ url, fitSize = 3.5 }: GltfModelProps) {
  const { scene: rawScene } = useGLTF(url)
  const group = useRef<THREE.Group>(null)

  const normalizedScene = useMemo(() => {
    const cloned = SkeletonUtils.clone(rawScene)
    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const diagonal = size.length()
    const scale = diagonal > 0 ? fitSize / diagonal : 1

    cloned.position.sub(center.multiplyScalar(scale))
    cloned.scale.setScalar(scale)
    return cloned
  }, [rawScene, fitSize])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t * 0.3) * 0.4
    group.current.position.y = Math.sin(t * 0.6) * 0.15
  })

  return (
    <group ref={group}>
      <primitive object={normalizedScene} />
    </group>
  )
}
