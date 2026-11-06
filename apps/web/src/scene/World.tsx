import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Sky, Sparkles, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { useNazar } from '../store';
import { AlFahidi, MosqueStation, OasisStation } from './Stations';
import { Airflow } from './Airflow';
import { CameraRig } from './CameraRig';
import { Hotspots } from './Hotspots';
import { sandTexture } from './textures';
import { registerSceneCapture } from './capture';
import { OVERVIEW } from './cameras';

const SUN: [number, number, number] = [-40, 22, 18];

function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, -10]} receiveShadow>
        <circleGeometry args={[220, 64]} />
        <meshStandardMaterial map={sandTexture()} color="#c7a274" roughness={1} />
      </mesh>
      {[
        [-70, -60, 18],
        [60, -75, 24],
        [-20, -95, 30],
        [90, 10, 16],
        [-95, 20, 20],
      ].map(([x, z, r], i) => (
        <mesh key={i} position={[x!, -0.7 - r! * 0.82, z!]} scale={[1.6, 1, 1]}>
          <sphereGeometry args={[r!, 24, 12]} />
          <meshStandardMaterial color="#c39a68" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function CaptureBridge() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    registerSceneCapture(async (maxSize) => {
      gl.render(scene, camera);
      const src = gl.domElement;
      const scale = Math.min(1, maxSize / Math.max(src.width, src.height));
      const c = document.createElement('canvas');
      c.width = Math.round(src.width * scale);
      c.height = Math.round(src.height * scale);
      c.getContext('2d')!.drawImage(src, 0, 0, c.width, c.height);
      return new Promise((resolve) => c.toBlob((b) => resolve(b), 'image/jpeg', 0.82));
    });
    return () => registerSceneCapture(null);
  }, [gl, scene, camera]);
  return null;
}

export default function World({ interactive = true }: { interactive?: boolean }) {
  const perfLow = useNazar((s) => s.perfLow);
  const airflow = useNazar((s) => s.airflow);
  return (
    <Canvas
      shadows={!perfLow}
      dpr={perfLow ? [0.75, 1] : [1, 1.75]}
      gl={{ antialias: !perfLow, powerPreference: 'high-performance' }}
      camera={{ position: OVERVIEW.position, fov: 42, near: 0.1, far: 600 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={['#e9c99a']} />
      <fog attach="fog" args={['#e3c193', 70, 230]} />
      <Sky sunPosition={SUN} turbidity={7} rayleigh={1.6} mieCoefficient={0.006} mieDirectionalG={0.85} />
      <hemisphereLight args={['#fff1d6', '#7a5a3a', 0.55]} />
      <ambientLight intensity={0.18} />
      <directionalLight
        position={SUN}
        intensity={2.3}
        color="#ffd9a3"
        castShadow={!perfLow}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
      />
      <Suspense fallback={null}>
        <Ground />
        <AlFahidi />
        <MosqueStation />
        <OasisStation />
        {airflow && <Airflow />}
        {!perfLow && <Sparkles count={70} scale={[50, 12, 40]} position={[0, 6, -4]} size={2.2} speed={0.25} color="#fff3d1" opacity={0.5} />}
      </Suspense>
      {interactive && <Hotspots />}
      <CameraRig />
      <CaptureBridge />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
