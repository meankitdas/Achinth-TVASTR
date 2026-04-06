import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { IcosahedronGeometry, TorusGeometry } from 'three'

/**
 * ForgeCore — The central metallic artifact in the hero section.
 * An icosahedron with layered geometry suggesting a forged industrial core.
 * Warm amber point lights simulate a forge glow.
 * Animates with slow rotation + gentle float.
 * 
 * @param {number} scale - Responsive scale factor (0.6 mobile, 0.8 tablet, 1.0 desktop)
 */
export function ForgeCore({ scale = 1 }) {
  const outerRef = useRef()
  const innerRef = useRef()
  const ringRef = useRef()

  // Floating animation offset — smooth sine wave
  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta

    // Faster rotation on multiple axes for an organic feel
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.28
      outerRef.current.rotation.x += delta * 0.12
      outerRef.current.position.y = Math.sin(time.current * 1.0) * 0.12
    }

    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.45
      innerRef.current.rotation.z += delta * 0.18
    }

    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.35
      ringRef.current.rotation.z -= delta * 0.22
    }
  })

  // Wireframe geometry for outer shell
  const wireframeGeom = useMemo(() => new IcosahedronGeometry(1.4, 1), [])
  const solidGeom = useMemo(() => new IcosahedronGeometry(0.9, 0), [])
  const torusGeom = useMemo(() => new TorusGeometry(1.8, 0.025, 8, 48), [])

  return (
    <group scale={scale}>
      {/* Forge glow lights — warm amber tones */}
      <pointLight position={[2, 2, 2]} color="#f59e0b" intensity={3} distance={8} />
      <pointLight position={[-2, -1, 1]} color="#d97706" intensity={2} distance={6} />
      <pointLight position={[0, 0, 3]} color="#fbbf24" intensity={1.5} distance={5} />
      <ambientLight color="#1a1510" intensity={0.4} />

      {/* Outer wireframe icosahedron — structural shell */}
      <mesh ref={outerRef} geometry={wireframeGeom}>
        <meshStandardMaterial
          color="#888896"
          metalness={0.9}
          roughness={0.2}
          wireframe
          transparent
          opacity={0.35}
          emissive="#f59e0b"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Inner solid icosahedron — the forge core */}
      <mesh ref={innerRef} geometry={solidGeom}>
        <meshStandardMaterial
          color="#c8c8d0"
          metalness={1.0}
          roughness={0.15}
          envMapIntensity={1}
          emissive="#f59e0b"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Orbital ring — precision engineering motif */}
      <mesh ref={ringRef} geometry={torusGeom}>
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.8}
          roughness={0.3}
          emissive="#f59e0b"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}
