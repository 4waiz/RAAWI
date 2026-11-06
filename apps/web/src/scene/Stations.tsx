import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import { Barjeel } from './Barjeel';
import { House } from './House';
import { Palm } from './Palm';
import { Dallah, Finjan } from './Dallah';
import { materials } from './materials';
import { carpetTexture, waterTexture } from './textures';
import { useNazar } from '../store';

export function Plinth({ position, radius }: { position: [number, number, number]; radius: number }) {
  const m = materials();
  return (
    <group position={position}>
      <mesh position={[0, -0.35, 0]} material={m.plinth} receiveShadow>
        <cylinderGeometry args={[radius, radius + 0.6, 0.7, 64]} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.rim}>
        <ringGeometry args={[radius - 0.18, radius, 96]} />
      </mesh>
    </group>
  );
}

/** Al Fahidi courtyard-house quarter with the hero barjeel, lanes and a majlis courtyard. */
export function AlFahidi() {
  const airflow = useNazar((s) => s.airflow);
  const thenNow = useNazar((s) => s.thenNow);
  const perfLow = useNazar((s) => s.perfLow);
  const now = thenNow === 'now';
  const m = materials();
  return (
    <group>
      <Plinth position={[0, 0, 0]} radius={17} />
      {/* sikka lanes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3.2]} receiveShadow>
        <planeGeometry args={[30, 2.2]} />
        <meshStandardMaterial color="#e6cfa6" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.012, -3]} receiveShadow>
        <planeGeometry args={[1.8, 24]} />
        <meshStandardMaterial color="#e6cfa6" roughness={1} />
      </mesh>

      {/* hero house + barjeel (cutaway when airflow is shown) */}
      <House position={[2.5, 0, -2]} size={[7, 5, 7]} ghost={airflow} windows={3} acUnits={now} />
      <Barjeel position={[2.5, 5, -2]} ghost={airflow} />
      {airflow && (
        <group position={[2.5, 0, -2]}>
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 3]} />
            <meshStandardMaterial map={carpetTexture()} roughness={0.9} />
          </mesh>
          {[-1.6, 1.6].map((x) => (
            <mesh key={x} position={[x, 0.2, 0]} material={m.teak}>
              <boxGeometry args={[0.5, 0.35, 2.6]} />
            </mesh>
          ))}
        </group>
      )}

      {/* neighbouring houses */}
      <House position={[-7.5, 0, -4]} size={[6, 4.2, 6]} rotation={0.02} acUnits={now} />
      <Barjeel position={[-8.6, 4.2, -5]} scale={0.72} />
      <House position={[10.5, 0, -3]} size={[5, 4.6, 6]} windows={2} acUnits={now} />
      <House position={[9.5, 0, 8.5]} size={[6, 3.8, 5]} rotation={Math.PI} windows={2} />
      <Barjeel position={[10.6, 3.8, 9.2]} scale={0.6} rotation={0.2} />
      <House position={[2, 0, -11]} size={[9, 4, 4.5]} windows={3} />
      <House position={[-10.5, 0, 9]} size={[4.5, 3.6, 4.5]} rotation={Math.PI} door={false} />

      {/* majlis courtyard (dallah station) */}
      <group position={[-6.2, 0, 5.2]}>
        {[
          [0, -2.6, 6, 0.2],
          [-3, 0, 0.2, 5.4],
        ].map(([x, z, w, d], i) => (
          <mesh key={i} position={[x!, 0.7, z!]} material={m.plaster} castShadow receiveShadow>
            <boxGeometry args={[w!, 1.4, d!]} />
          </mesh>
        ))}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <planeGeometry args={[3.6, 2.6]} />
          <meshStandardMaterial map={carpetTexture()} roughness={0.95} />
        </mesh>
        {[
          [-1.6, 0, 0.45, 2.4],
          [0, -1.15, 3.0, 0.45],
        ].map(([x, z, w, d], i) => (
          <mesh key={`c${i}`} position={[x!, 0.16, z!]} castShadow>
            <boxGeometry args={[w!, 0.3, d!]} />
            <meshStandardMaterial color="#8a2a20" roughness={0.9} />
          </mesh>
        ))}
        {/* brass tray, dallah and cups */}
        <mesh position={[0, 0.06, 0]} material={m.brass} receiveShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.04, 40]} />
        </mesh>
        <Dallah position={[0, 0.08, 0]} scale={1.2} />
        <Finjan position={[0.32, 0.11, 0.22]} />
        <Finjan position={[0.36, 0.11, -0.1]} />
        <Finjan position={[-0.3, 0.11, 0.3]} />
        <Palm position={[2.4, 0, -1.8]} height={4.6} seed={3} sway={!perfLow} />
      </group>

      <Palm position={[6.6, 0, 3.8]} height={5} seed={5} sway={!perfLow} />
      <Palm position={[-13, 0, -1]} height={4.4} seed={8} sway={!perfLow} />
      {!perfLow && <Palm position={[14, 0, 2]} height={4.8} seed={11} />}

      {now && <Skyline />}
    </group>
  );
}

/** "Now" interpretation: modern towers on the horizon behind the heritage quarter. */
function Skyline() {
  const m = materials();
  const lang = useNazar((s) => s.lang);
  const towers = useMemo(
    () => Array.from({ length: 11 }, (_, i) => ({ x: -26 + i * 5.2, h: 14 + ((i * 53) % 22), w: 2.6 + ((i * 7) % 3) })),
    [],
  );
  return (
    <group position={[2, 0, -40]}>
      {towers.map((t, i) => (
        <mesh key={i} position={[t.x, t.h / 2, (i % 3) * -3]} material={m.glass} castShadow>
          <boxGeometry args={[t.w, t.h, t.w]} />
        </mesh>
      ))}
      <Html position={[2, 40, 0]} center zIndexRange={[14, 0]}>
        <div className="pointer-events-none whitespace-nowrap rounded-full border border-gold/40 bg-midnight/80 px-3 py-1 text-[11px] text-ivory">
          {lang === 'ar' ? 'تفسير تعليمي — ليس إعادة بناء تاريخية موثّقة' : 'Educational interpretation — not a verified reconstruction'}
        </div>
      </Html>
    </group>
  );
}

/** Simplified, not-to-scale Sheikh Zayed Grand Mosque diorama. */
export function MosqueStation() {
  const m = materials();
  const domes = useMemo(() => {
    const out: [number, number, number, number][] = [];
    for (const x of [-8.5, -5.5, 5.5, 8.5]) for (const z of [-3, 0, 3]) out.push([x, 5.2, z, 0.9]);
    for (const x of [-3, 3]) for (const z of [-3.6, 3.6]) out.push([x, 5.2, z, 1.2]);
    for (let x = -10; x <= 10; x += 2.5) out.push([x, 3.1, 7.2, 0.6]);
    return out;
  }, []);
  const columns = useMemo(() => {
    const out: [number, number][] = [];
    for (let x = -10; x <= 10; x += 1.25) out.push([x, 7.8]);
    return out;
  }, []);
  return (
    <group position={[36, 0, -20]}>
      <Plinth position={[0, 0, 0]} radius={16} />
      <mesh position={[0, 0.3, 0]} material={m.marble} receiveShadow castShadow>
        <boxGeometry args={[26, 0.6, 19]} />
      </mesh>
      {/* prayer hall */}
      <mesh position={[0, 2.7, -1]} material={m.marble} castShadow receiveShadow>
        <boxGeometry args={[22, 4.4, 11]} />
      </mesh>
      {/* front arcade */}
      <mesh position={[0, 2.85, 7.8]} material={m.marble} castShadow>
        <boxGeometry args={[21.5, 0.5, 1.2]} />
      </mesh>
      {columns.map(([x, z]) => (
        <group key={x} position={[x, 0.6, z]}>
          <mesh position={[0, 1.05, 0]} material={m.marble} castShadow>
            <cylinderGeometry args={[0.14, 0.16, 2.1, 10]} />
          </mesh>
          <mesh position={[0, 2.12, 0]} material={m.gold}>
            <cylinderGeometry args={[0.22, 0.14, 0.18, 10]} />
          </mesh>
        </group>
      ))}
      {/* main dome */}
      <mesh position={[0, 5.6, -1]} material={m.marble} castShadow>
        <cylinderGeometry args={[3.2, 3.4, 1.2, 40]} />
      </mesh>
      <mesh position={[0, 6.2, -1]} scale={[1, 1.18, 1]} material={m.marble} castShadow>
        <sphereGeometry args={[3.2, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh position={[0, 10.3, -1]} material={m.gold}>
        <coneGeometry args={[0.18, 0.9, 10]} />
      </mesh>
      {domes.map(([x, y, z, r], i) => (
        <group key={i} position={[x, y, z - 1]}>
          <mesh scale={[1, 1.2, 1]} material={m.marble} castShadow>
            <sphereGeometry args={[r, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh position={[0, r * 1.25, 0]} material={m.gold}>
            <coneGeometry args={[0.06, 0.3, 6]} />
          </mesh>
        </group>
      ))}
      {/* four minarets */}
      {[
        [-12, -8.5],
        [12, -8.5],
        [-12, 8.5],
        [12, 8.5],
      ].map(([x, z]) => (
        <group key={`${x}${z}`} position={[x!, 0.6, z!]}>
          <mesh position={[0, 3.5, 0]} material={m.marble} castShadow>
            <cylinderGeometry args={[0.55, 0.65, 7, 12]} />
          </mesh>
          <mesh position={[0, 7.1, 0]} material={m.marble}>
            <cylinderGeometry args={[0.85, 0.6, 0.35, 12]} />
          </mesh>
          <mesh position={[0, 8.6, 0]} material={m.marble} castShadow>
            <cylinderGeometry args={[0.42, 0.5, 2.8, 12]} />
          </mesh>
          <mesh position={[0, 10.05, 0]} material={m.marble}>
            <cylinderGeometry args={[0.66, 0.45, 0.28, 12]} />
          </mesh>
          <mesh position={[0, 10.9, 0]} material={m.marble} castShadow>
            <cylinderGeometry args={[0.32, 0.38, 1.4, 12]} />
          </mesh>
          <mesh position={[0, 11.75, 0]} scale={[1, 1.3, 1]} material={m.gold}>
            <sphereGeometry args={[0.34, 14, 10]} />
          </mesh>
          <mesh position={[0, 12.5, 0]} material={m.gold}>
            <coneGeometry args={[0.05, 0.6, 6]} />
          </mesh>
        </group>
      ))}
      {/* reflective pools */}
      {[-6.5, 6.5].map((x) => (
        <mesh key={x} position={[x, 0.62, 10.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9, 2.2]} />
          <meshStandardMaterial map={waterTexture()} roughness={0.08} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Al Ain oasis: palm grove, mud-brick walls and a flowing falaj channel. */
export function OasisStation() {
  const m = materials();
  const perfLow = useNazar((s) => s.perfLow);
  const water = useRef<THREE.Texture | null>(null);
  if (!water.current) {
    water.current = waterTexture().clone();
    water.current.repeat.set(1, 8);
    water.current.needsUpdate = true;
  }
  useFrame((_, dt) => {
    if (water.current) water.current.offset.y -= dt * 0.25;
  });
  const palms = useMemo(() => {
    const out: [number, number, number][] = [];
    const n = perfLow ? 12 : 26;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (i % 3) * 0.2;
      const r = 3.5 + ((i * 37) % 60) / 10;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      if (Math.abs(x) < 1.2) continue;
      out.push([x, 0, z]);
    }
    return out;
  }, [perfLow]);
  return (
    <group position={[-34, 0, -18]}>
      <Plinth position={[0, 0, 0]} radius={12.5} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <circleGeometry args={[12.3, 48]} />
        <meshStandardMaterial color="#8f7a4e" roughness={1} />
      </mesh>
      {/* falaj channel with low walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <planeGeometry args={[0.8, 22]} />
        <meshStandardMaterial map={water.current} roughness={0.1} metalness={0.3} emissive="#0b3b40" emissiveIntensity={0.4} />
      </mesh>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.15, 0]} material={m.mud} castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.3, 22]} />
        </mesh>
      ))}
      {/* walled plantations */}
      {[
        [-5.5, 0, 9, 0.35],
        [5.5, 0, 9, 0.35],
      ].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x!, 0.6, z! + (i ? 5 : -5)]} material={m.mud} castShadow receiveShadow>
          <boxGeometry args={[w!, 1.2, d!]} />
        </mesh>
      ))}
      {palms.map((p, i) => (
        <Palm key={i} position={p} height={3.6 + (i % 4) * 0.5} seed={i + 20} sway={!perfLow} />
      ))}
    </group>
  );
}
