import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { Barjeel } from './Barjeel';
import { House } from './House';
import { Palm } from './Palm';

function Turntable() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.08;
  });
  return (
    <group ref={g} position={[0, -3.2, 0]}>
      <House position={[0, 0, 0]} size={[5.2, 3.2, 5.2]} windows={2} />
      <Barjeel position={[0, 3.2, 0]} scale={0.85} />
      <Palm position={[3.8, 0, 2]} height={4.2} seed={2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[7, 64]} />
        <meshStandardMaterial color="#1a2a3a" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[6.8, 7, 96]} />
        <meshStandardMaterial color="#D6A96B" emissive="#D6A96B" emissiveIntensity={0.4} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** Landing-page hero: the barjeel at dusk on a museum plinth, slowly turning. */
export default function HeroScene() {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [9, 3.2, 11], fov: 38 }} aria-hidden>
      <fog attach="fog" args={['#07111C', 14, 34]} />
      <ambientLight intensity={0.25} />
      <hemisphereLight args={['#ffd9a8', '#07111C', 0.45]} />
      <directionalLight position={[-8, 7, 6]} intensity={2.6} color="#ffc98a" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[6, 2, -6]} intensity={30} color="#35D6C3" distance={20} />
      <Turntable />
      <Sparkles count={60} scale={[14, 8, 14]} size={2} speed={0.3} color="#ffe2b0" opacity={0.6} />
    </Canvas>
  );
}
