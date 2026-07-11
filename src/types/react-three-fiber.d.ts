// React 19 moved JSX into the React namespace. @react-three/fiber v8 augments
// the legacy global `JSX` namespace, which TypeScript no longer consults for
// `React.JSX.IntrinsicElements`. Re-augment `React.JSX` so R3F intrinsics
// (`mesh`, `group`, `boxGeometry`, etc.) type-check under React 19.
import type { ThreeElements } from "@react-three/fiber"

declare module "react" {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- augmentation must extend, not alias
    interface IntrinsicElements extends ThreeElements {}
  }
}
