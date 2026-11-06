import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ghostOf, materials } from './materials';

interface Props {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: number;
  ghost?: boolean;
  door?: boolean;
  windows?: number;
  acUnits?: boolean;
}

const dummy = new THREE.Object3D();

/** Courtyard-house block: plaster walls, teak door, latticed windows, crenellated parapet (instanced). */
export function House({ position, size, rotation = 0, ghost = false, door = true, windows = 2, acUnits = false }: Props) {
  const [w, h, d] = size;
  const m = materials();
  const plaster = ghost ? ghostOf(m.plaster) : m.plaster;
  const merlonRef = useRef<THREE.InstancedMesh>(null);

  const merlons = useMemo(() => {
    const pts: [number, number, number, number][] = [];
    const step = 0.7;
    for (let x = -w / 2 + 0.3; x <= w / 2 - 0.3; x += step) {
      pts.push([x, h + 0.2, d / 2 - 0.1, 0], [x, h + 0.2, -d / 2 + 0.1, 0]);
    }
    for (let z = -d / 2 + 0.3; z <= d / 2 - 0.3; z += step) {
      pts.push([w / 2 - 0.1, h + 0.2, z, Math.PI / 2], [-w / 2 + 0.1, h + 0.2, z, Math.PI / 2]);
    }
    return pts;
  }, [w, h, d]);

  useLayoutEffect(() => {
    const im = merlonRef.current;
    if (!im) return;
    merlons.forEach(([x, y, z, r], i) => {
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, r, 0);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
    });
    im.instanceMatrix.needsUpdate = true;
  }, [merlons]);

  const winXs = useMemo(() => {
    if (windows <= 0) return [];
    const span = w * 0.6;
    return Array.from({ length: windows }, (_, i) => (windows === 1 ? 0 : -span / 2 + (span / (windows - 1)) * i));
  }, [w, windows]);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, h / 2, 0]} material={plaster} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      {/* cornice band */}
      <mesh position={[0, h - 0.05, 0]} material={ghost ? ghostOf(m.plasterDark) : m.plasterDark}>
        <boxGeometry args={[w + 0.12, 0.12, d + 0.12]} />
      </mesh>
      <instancedMesh ref={merlonRef} args={[undefined, undefined, merlons.length]} material={plaster} castShadow>
        <boxGeometry args={[0.32, 0.4, 0.14]} />
      </instancedMesh>
      {door && (
        <group position={[winXs.length ? 0 : 0, 0, d / 2 + 0.02]}>
          <mesh position={[0, 1.15, 0]} material={m.teak} castShadow>
            <boxGeometry args={[1.1, 2.3, 0.08]} />
          </mesh>
          <mesh position={[0, 2.42, 0]} material={m.plasterDark}>
            <boxGeometry args={[1.4, 0.18, 0.12]} />
          </mesh>
        </group>
      )}
      {winXs.map((x) => (
        <group key={x} position={[x === 0 && door ? 0 : x, h * 0.62, d / 2 + 0.02]} visible={!(x === 0 && door)}>
          <mesh material={m.shadow}>
            <boxGeometry args={[0.7, 0.9, 0.06]} />
          </mesh>
          {[-0.18, 0, 0.18].map((bx) => (
            <mesh key={bx} position={[bx, 0, 0.04]} material={m.teak}>
              <boxGeometry args={[0.05, 0.9, 0.04]} />
            </mesh>
          ))}
          <mesh position={[0, 0.5, 0.03]} material={m.teak}>
            <boxGeometry args={[0.86, 0.08, 0.08]} />
          </mesh>
        </group>
      ))}
      {acUnits && (
        <group position={[w / 2 + 0.25, h * 0.55, 0]}>
          <mesh material={m.ac} castShadow>
            <boxGeometry args={[0.45, 0.6, 0.9]} />
          </mesh>
          <mesh position={[0.23, 0, 0]} material={m.shadow}>
            <cylinderGeometry args={[0.22, 0.22, 0.02, 16]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
