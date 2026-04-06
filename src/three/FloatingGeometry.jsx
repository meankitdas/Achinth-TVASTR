import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OctahedronGeometry, TetrahedronGeometry, IcosahedronGeometry } from 'three'

/**
 * FloatingGeometry — Lightweight ambient particles for the hero background.
 * Small geometric shapes (octahedrons, tetrahedrons) drifting slowly in 3D.
 * Each particle has a unique speed, axis, and starting position.
 * Kept minimal: max 12 particles, no textures.
 * 
 * @param {number} scale - Responsive scale factor (0.6 mobile, 0.8 tablet, 1.0 desktop)
 */

// Single particle component — isolated to avoid re-renders
function Particle({ position, geometry, speed, rotAxis, scale }) {
  const ref = useRef()
  const time = useRef(Math.random() * Math.PI * 2) // random phase offset

  useFrame((_, delta) => {
    time.current += delta * speed
    if (ref.current) {
      ref.current.rotation[rotAxis] += delta * speed * 0.5
      // Gentle floating drift
      ref.current.position.y = position[1] + Math.sin(time.current) * 0.3
      ref.current.position.x = position[0] + Math.cos(time.current * 0.7) * 0.15
    }
  })

  return (
    <mesh ref={ref} position={position} geometry={geometry}>
      <meshStandardMaterial
        color="#f59e0b"
        metalness={0.7}
        roughness={0.4}
        emissive="#f59e0b"
        emissiveIntensity={0.3}
        transparent
        opacity={0.4}
      />
    </mesh>
  )
}

export function FloatingGeometry({ scale = 1 }) {
  // Reuse geometries across particles to minimize GPU allocations
  const octaGeom = useMemo(() => new OctahedronGeometry(0.08, 0), [])
  const tetraGeom = useMemo(() => new TetrahedronGeometry(0.07, 0), [])
  const icoGeom = useMemo(() => new IcosahedronGeometry(0.05, 0), [])

  // Dispose geometries on unmount to prevent WebGL memory leak
  useEffect(() => {
    return () => {
      octaGeom.dispose()
      tetraGeom.dispose()
      icoGeom.dispose()
    }
  }, [octaGeom, tetraGeom, icoGeom])

  // Deterministic particle layout — spread around the hero canvas
  // Positions are scaled responsively to keep particles in view
  const particles = useMemo(() => [
    { id: 0, pos: [-3.2, 1.8, -1.5], geom: octaGeom, speed: 0.3, axis: 'y' },
    { id: 1, pos: [3.5, 0.5, -2.0], geom: tetraGeom, speed: 0.25, axis: 'x' },
    { id: 2, pos: [-2.8, -1.2, -1.0], geom: icoGeom, speed: 0.4, axis: 'z' },
    { id: 3, pos: [2.2, 2.1, -1.8], geom: octaGeom, speed: 0.2, axis: 'y' },
    { id: 4, pos: [-1.5, 2.8, -2.2], geom: tetraGeom, speed: 0.35, axis: 'x' },
    { id: 5, pos: [3.8, -1.5, -1.5], geom: icoGeom, speed: 0.28, axis: 'z' },
    { id: 6, pos: [-3.5, -0.8, -2.5], geom: octaGeom, speed: 0.22, axis: 'y' },
    { id: 7, pos: [1.2, -2.5, -1.2], geom: tetraGeom, speed: 0.38, axis: 'x' },
    { id: 8, pos: [-0.5, 3.2, -2.0], geom: icoGeom, speed: 0.18, axis: 'z' },
    { id: 9, pos: [2.8, -2.8, -2.8], geom: octaGeom, speed: 0.32, axis: 'y' },
    { id: 10, pos: [-2.0, -2.8, -1.8], geom: tetraGeom, speed: 0.27, axis: 'x' },
    { id: 11, pos: [0.8, 3.5, -3.0], geom: icoGeom, speed: 0.21, axis: 'z' },
  ], [octaGeom, tetraGeom, icoGeom])

  return (
    <group scale={scale}>
      {particles.map((p) => (
        <Particle
          key={p.id}
          position={p.pos}
          geometry={p.geom}
          speed={p.speed}
          rotAxis={p.axis}
          scale={scale}
        />
      ))}
    </group>
  )
}
