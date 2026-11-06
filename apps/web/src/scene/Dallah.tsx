import { useMemo } from 'react';
import * as THREE from 'three';
import { materials } from './materials';

/** Lathe-turned dallah (Arabic coffee pot) with a crescent beak spout, lid finial and handle. */
export function Dallah({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const m = materials();
  const geos = useMemo(() => {
    const profile = [
      [0.0, 0.0], [0.17, 0.0], [0.2, 0.03], [0.22, 0.09], [0.2, 0.17], [0.13, 0.25], [0.09, 0.31],
      [0.1, 0.36], [0.135, 0.42], [0.13, 0.45], [0.0, 0.45],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const body = new THREE.LatheGeometry(profile, 40);
    const lidProfile = [[0.0, 0.0], [0.13, 0.0], [0.1, 0.05], [0.04, 0.13], [0.025, 0.16], [0.05, 0.19], [0.0, 0.24]].map(
      ([x, y]) => new THREE.Vector2(x, y),
    );
    const lid = new THREE.LatheGeometry(lidProfile, 32);
    const spoutCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.12, 0.27, 0),
      new THREE.Vector3(0.22, 0.34, 0),
      new THREE.Vector3(0.3, 0.45, 0),
      new THREE.Vector3(0.36, 0.53, 0),
      new THREE.Vector3(0.43, 0.56, 0),
    ]);
    const spout = new THREE.TubeGeometry(spoutCurve, 24, 0.022, 10, false);
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.12, 0.4, 0),
      new THREE.Vector3(-0.27, 0.38, 0),
      new THREE.Vector3(-0.3, 0.22, 0),
      new THREE.Vector3(-0.2, 0.1, 0),
    ]);
    const handle = new THREE.TubeGeometry(handleCurve, 20, 0.018, 8, false);
    return { body, lid, spout, handle };
  }, []);
  return (
    <group position={position} scale={scale}>
      <mesh geometry={geos.body} material={m.brass} castShadow />
      <mesh geometry={geos.lid} material={m.brass} position={[0, 0.45, 0]} castShadow />
      <mesh geometry={geos.spout} material={m.brass} castShadow />
      <mesh geometry={geos.handle} material={m.brass} castShadow />
    </group>
  );
}

/** Small handleless finjan cup. */
export function Finjan({ position }: { position: [number, number, number] }) {
  const m = materials();
  return (
    <mesh position={position} material={m.marble} castShadow>
      <cylinderGeometry args={[0.05, 0.035, 0.06, 16, 1, true]} />
    </mesh>
  );
}
