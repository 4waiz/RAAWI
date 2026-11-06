import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { materials } from './materials';

const leafGeo = (() => {
  const g = new THREE.ConeGeometry(0.28, 2.4, 4, 1, true);
  g.translate(0, 1.2, 0);
  g.scale(1, 1, 0.25);
  return g;
})();
const trunkGeo = new THREE.CylinderGeometry(0.12, 0.2, 1, 7);

interface Props {
  position: [number, number, number];
  height?: number;
  sway?: boolean;
  seed?: number;
}

export function Palm({ position, height = 4.2, sway = true, seed = 1 }: Props) {
  const m = materials();
  const crown = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!sway || !crown.current) return;
    const t = clock.elapsedTime + seed * 1.7;
    crown.current.rotation.z = Math.sin(t * 0.8) * 0.04;
    crown.current.rotation.x = Math.cos(t * 0.6) * 0.03;
  });
  const lean = ((seed * 37) % 10) / 100 - 0.05;
  return (
    <group position={position} rotation={[lean, seed, lean * 0.6]}>
      <mesh geometry={trunkGeo} material={m.palmTrunk} position={[0, height / 2, 0]} scale={[1, height, 1]} castShadow />
      <group ref={crown} position={[0, height, 0]}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh
            key={i}
            geometry={leafGeo}
            material={m.palmLeaf}
            rotation={[1.0 + (i % 3) * 0.25, (i / 9) * Math.PI * 2, 0]}
            castShadow
          />
        ))}
      </group>
    </group>
  );
}
