import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
type OrbitControlsImpl = React.ElementRef<typeof OrbitControls>;
import { useNazar } from '../store';
import { shotFor } from './cameras';

const tmpPos = new THREE.Vector3();
const tmpTarget = new THREE.Vector3();

/** Smooth, interruptible camera transitions between heritage points; orbit controls otherwise. */
export function CameraRig() {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const focusEntryId = useNazar((s) => s.focusEntryId);
  const view = useNazar((s) => s.view);
  const overview = useNazar((s) => s.overview);
  const animating = useRef(true);
  const reduceMotion = useRef(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    animating.current = true;
    if (reduceMotion.current) {
      const shot = shotFor(focusEntryId, view, overview);
      camera.position.set(...shot.position);
      controls.current?.target.set(...shot.target);
      controls.current?.update();
      animating.current = false;
    }
  }, [focusEntryId, view, overview, camera]);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const stop = () => (animating.current = false);
    c.addEventListener('start', stop);
    return () => c.removeEventListener('start', stop);
  }, []);

  useFrame((_, dt) => {
    const c = controls.current;
    if (!c || !animating.current) return;
    const shot = shotFor(focusEntryId, view, overview);
    tmpPos.set(...shot.position);
    tmpTarget.set(...shot.target);
    const k = 1 - Math.exp(-dt * 2.4);
    camera.position.lerp(tmpPos, k);
    c.target.lerp(tmpTarget, k);
    c.update();
    if (camera.position.distanceTo(tmpPos) < 0.03 && c.target.distanceTo(tmpTarget) < 0.03) animating.current = false;
  });

  const pov = view === 'pov' && !overview;
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan={!pov}
      enableZoom={!pov}
      minDistance={2}
      maxDistance={95}
      maxPolarAngle={pov ? Math.PI * 0.62 : Math.PI * 0.47}
      rotateSpeed={pov ? 0.35 : 0.6}
    />
  );
}
