import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei'

function FloatingBubbles() {
  const count = 15
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 10
      const size = Math.random() * 0.5 + 0.2
      temp.push({ x, y, z, size })
    }
    return temp
  }, [])

  return (
    <>
      {particles.map((p, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2} position={[p.x, p.y, p.z]}>
          <Sphere args={[p.size, 32, 32]}>
            <MeshDistortMaterial
              color="#e0e7ff"
              speed={3}
              distort={0.4}
              transparent
              opacity={0.3}
            />
          </Sphere>
        </Float>
      ))}
    </>
  )
}

const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <FloatingBubbles />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  )
}

export default ThreeBackground
