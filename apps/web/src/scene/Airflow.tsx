import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useNazar } from '../store';

/**
 * Educational airflow visualisation for the main barjeel. Path coordinates are in world space
 * around the main house at (2.5, 0, -2). Cool air (teal) is caught by the windward opening,
 * descends the shaft and crosses the room; warm air (gold) rises and leaves on the lee side.
 */
const COOL = new THREE.CatmullRomCurve3(
  [
    [-7, 9.7, -2], [-1, 9.5, -2], [1.4, 9.2, -2], [2.0, 8.4, -2], [2.0, 6.2, -2], [2.1, 3.4, -2],
    [2.6, 1.6, -1.6], [4.4, 1.2, -1.2], [6.0, 1.8, -1.0], [8.5, 2.4, -1.0],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
);
const WARM = new THREE.CatmullRomCurve3(
  [
    [0.8, 1.6, -3.4], [2.6, 3.0, -2.8], [3.0, 5.6, -2.5], [3.0, 8.4, -2.4], [3.5, 9.4, -2.2], [5.5, 10.4, -2.0], [8.5, 11.4, -2.0],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
);

const dummy = new THREE.Object3D();

function Stream({ curve, count, color, speed }: { curve: THREE.CatmullRomCurve3; count: number; color: string; speed: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const offsets = useMemo(() => Array.from({ length: count }, (_, i) => i / count + Math.random() * 0.01), [count]);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 80, 0.035, 6, false), [curve]);
  useFrame(({ clock }) => {
    const im = ref.current;
    if (!im) return;
    const t = clock.elapsedTime * speed;
    offsets.forEach((o, i) => {
      const u = (o + t) % 1;
      curve.getPointAt(u, dummy.position);
      const s = Math.sin(u * Math.PI) * 1.2 + 0.2;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
    });
    im.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial color={color} transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

export function Airflow() {
  const perfLow = useNazar((s) => s.perfLow);
  const lang = useNazar((s) => s.lang);
  const n = perfLow ? 28 : 64;
  const label = 'pointer-events-none select-none whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide shadow-lg';
  return (
    <group>
      <Stream curve={COOL} count={n} color="#35D6C3" speed={0.09} />
      <Stream curve={WARM} count={Math.round(n / 2)} color="#E8A85A" speed={0.07} />
      <Html position={[-4.5, 10.4, -2]} center zIndexRange={[14, 0]}>
        <div className={`${label} bg-teal/90 text-midnight`}>{lang === 'ar' ? 'نسيم بارد يدخل' : 'Breeze caught'}</div>
      </Html>
      <Html position={[5.6, 3.2, -1]} center zIndexRange={[14, 0]}>
        <div className={`${label} bg-teal/90 text-midnight`}>{lang === 'ar' ? 'تيار يبرّد الغرفة' : 'Airflow cools the room'}</div>
      </Html>
      <Html position={[6.4, 11.2, -2]} center zIndexRange={[14, 0]}>
        <div className={`${label} bg-[#E8A85A]/90 text-midnight`}>{lang === 'ar' ? 'هواء دافئ يخرج' : 'Warm air escapes'}</div>
      </Html>
    </group>
  );
}
