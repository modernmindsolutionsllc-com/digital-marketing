import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function SignalCluster() {
  const clusterRef = useRef(null);
  const ringRef = useRef(null);

  useFrame((state, delta) => {
    if (clusterRef.current) {
      clusterRef.current.rotation.y += delta * 0.28;
      clusterRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.18;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.22;
    }
  });

  return (
    <group ref={clusterRef}>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh castShadow receiveShadow>
          <torusKnotGeometry args={[1.25, 0.26, 240, 32]} />
          <meshStandardMaterial color="#7ff5ff" emissive="#1ecbff" emissiveIntensity={0.95} metalness={0.4} roughness={0.18} />
        </mesh>
      </Float>

      <mesh ref={ringRef} rotation={[Math.PI / 3.8, 0, Math.PI / 8]}>
        <torusGeometry args={[2.05, 0.045, 20, 120]} />
        <meshStandardMaterial color="#ffab6b" emissive="#ff7f36" emissiveIntensity={0.75} metalness={0.2} roughness={0.25} />
      </mesh>

      <Float speed={2.2} rotationIntensity={0.7} floatIntensity={1.25}>
        <mesh position={[-1.9, 1.1, 0.45]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#ffe3bd" emissive="#ffb067" emissiveIntensity={0.95} />
        </mesh>
      </Float>

      <Float speed={1.6} rotationIntensity={0.55} floatIntensity={1.05}>
        <mesh position={[1.7, -1.2, -0.25]}>
          <icosahedronGeometry args={[0.28, 1]} />
          <meshStandardMaterial color="#9fdcff" emissive="#5bc8ff" emissiveIntensity={0.9} />
        </mesh>
      </Float>

      <mesh position={[0, 0, -1.8]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.8, 72]} />
        <meshStandardMaterial color="#0f2433" transparent opacity={0.42} />
      </mesh>
    </group>
  );
}

export default function HeroSignalScene() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5.4], fov: 38 }} dpr={[1, 1.75]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 3]} intensity={1.15} color="#dffaff" />
        <pointLight position={[-4, -2, 3]} intensity={16} distance={12} color="#ff9a5c" />
        <pointLight position={[3, 2, 4]} intensity={15} distance={14} color="#31c5ff" />
        <SignalCluster />
      </Canvas>
    </div>
  );
}
