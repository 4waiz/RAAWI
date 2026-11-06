import { useMemo } from 'react';
import * as THREE from 'three';
import { ghostOf, materials } from './materials';

interface Props {
  position?: [number, number, number];
  scale?: number;
  ghost?: boolean;
  rotation?: number;
}

const W = 2.2; // footprint
const SHAFT_H = 2.6;
const OPEN_H = 2.2;

/**
 * Procedural barjeel (wind tower): solid lower shaft with gypsum relief, an upper chamber
 * open on all four sides with mullions, an X-shaped internal partition, projecting timber
 * poles and a crenellated crown. Stylised interpretation, not a measured survey.
 */
export function Barjeel({ position = [0, 0, 0], scale = 1, ghost = false, rotation = 0 }: Props) {
  const m = materials();
  const plaster = ghost ? ghostOf(m.plaster) : m.plaster;
  const relief = ghost ? ghostOf(m.plasterDark) : m.plasterDark;
  const teak = ghost ? ghostOf(m.pole) : m.pole;

  const parts = useMemo(() => {
    const faces = [0, 1, 2, 3].map((i) => (i * Math.PI) / 2);
    return { faces };
  }, []);

  const openY = SHAFT_H + OPEN_H / 2;
  const crownY = SHAFT_H + OPEN_H;

  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      {/* lower shaft */}
      <mesh position={[0, SHAFT_H / 2, 0]} material={plaster} castShadow receiveShadow>
        <boxGeometry args={[W, SHAFT_H, W]} />
      </mesh>
      {/* gypsum relief strips on each face */}
      {parts.faces.map((rot, fi) => (
        <group key={`r${fi}`} rotation={[0, rot, 0]}>
          {[-0.6, 0, 0.6].map((x) => (
            <mesh key={x} position={[x, SHAFT_H / 2 + 0.1, W / 2 + 0.03]} material={relief} castShadow>
              <boxGeometry args={[0.1, SHAFT_H - 0.6, 0.06]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* ledge between shaft and open chamber */}
      <mesh position={[0, SHAFT_H, 0]} material={relief} castShadow>
        <boxGeometry args={[W + 0.18, 0.14, W + 0.18]} />
      </mesh>
      {/* corner pillars */}
      {[
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ].map(([x, z]) => (
        <mesh key={`p${x}${z}`} position={[(x! * (W - 0.28)) / 2, openY, (z! * (W - 0.28)) / 2]} material={plaster} castShadow>
          <boxGeometry args={[0.28, OPEN_H, 0.28]} />
        </mesh>
      ))}
      {/* mullions: three tall slots per face */}
      {parts.faces.map((rot, fi) => (
        <group key={`m${fi}`} rotation={[0, rot, 0]}>
          {[-0.33, 0.33].map((x) => (
            <mesh key={x} position={[x, openY, W / 2 - 0.08]} material={plaster} castShadow>
              <boxGeometry args={[0.12, OPEN_H, 0.12]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* internal X partition — channels wind down from whichever side faces it */}
      {[Math.PI / 4, -Math.PI / 4].map((r) => (
        <mesh key={r} position={[0, openY - 0.2, 0]} rotation={[0, r, 0]} material={m.shadow}>
          <boxGeometry args={[W * 1.3, OPEN_H + 0.4, 0.05]} />
        </mesh>
      ))}
      {/* dark interior core so openings read as voids */}
      <mesh position={[0, openY, 0]} material={m.shadow}>
        <boxGeometry args={[W - 0.7, OPEN_H - 0.05, W - 0.7]} />
      </mesh>
      {/* projecting timber poles (chandal) */}
      {[SHAFT_H + 0.18, crownY - 0.1].map((y) => (
        <group key={y}>
          {[-0.55, 0.55].map((o) => (
            <group key={o}>
              <mesh position={[o, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={teak} castShadow>
                <cylinderGeometry args={[0.045, 0.045, W + 0.7, 6]} />
              </mesh>
              <mesh position={[0, y + 0.06, o]} rotation={[0, 0, Math.PI / 2]} material={teak} castShadow>
                <cylinderGeometry args={[0.045, 0.045, W + 0.7, 6]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {/* crown slab */}
      <mesh position={[0, crownY + 0.1, 0]} material={plaster} castShadow receiveShadow>
        <boxGeometry args={[W + 0.24, 0.22, W + 0.24]} />
      </mesh>
      {/* crenellations */}
      {parts.faces.map((rot, fi) => (
        <group key={`c${fi}`} rotation={[0, rot, 0]}>
          {[-0.9, -0.3, 0.3, 0.9].map((x) => (
            <mesh key={x} position={[x, crownY + 0.38, (W + 0.12) / 2]} material={plaster} castShadow>
              <coneGeometry args={[0.16, 0.36, 4]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export const BARJEEL_HEIGHT = SHAFT_H + OPEN_H + 0.6;
export const _vec = new THREE.Vector3();
