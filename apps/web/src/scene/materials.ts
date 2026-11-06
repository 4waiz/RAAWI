import * as THREE from 'three';
import { plasterTexture, teakTexture } from './textures';

export const COLORS = {
  midnight: '#07111C',
  ivory: '#F7F1E7',
  sand: '#D9B98D',
  gold: '#D6A96B',
  teal: '#35D6C3',
  plaster: '#e2c9a2',
  shade: '#5d4630',
  marble: '#f4f1ea',
};

let mats: ReturnType<typeof make> | null = null;
function make() {
  return {
    plaster: new THREE.MeshStandardMaterial({ map: plasterTexture(), color: '#f1dcb9', roughness: 0.95 }),
    plasterDark: new THREE.MeshStandardMaterial({ map: plasterTexture(), color: '#cdb08a', roughness: 0.95 }),
    teak: new THREE.MeshStandardMaterial({ map: teakTexture(), color: '#a0714b', roughness: 0.75 }),
    pole: new THREE.MeshStandardMaterial({ color: '#6b4a2c', roughness: 0.85 }),
    shadow: new THREE.MeshStandardMaterial({ color: '#2a1d14', roughness: 1 }),
    marble: new THREE.MeshStandardMaterial({ color: COLORS.marble, roughness: 0.35, metalness: 0.02 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d9ad62', roughness: 0.3, metalness: 0.85, emissive: '#3a2508', emissiveIntensity: 0.25 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c99a52', roughness: 0.28, metalness: 0.9 }),
    palmTrunk: new THREE.MeshStandardMaterial({ color: '#7a5a3a', roughness: 1 }),
    palmLeaf: new THREE.MeshStandardMaterial({ color: '#4f6b32', roughness: 0.9, side: THREE.DoubleSide }),
    mud: new THREE.MeshStandardMaterial({ map: plasterTexture(), color: '#b98d5f', roughness: 1 }),
    plinth: new THREE.MeshStandardMaterial({ color: '#1a2a3a', roughness: 0.6, metalness: 0.2 }),
    rim: new THREE.MeshStandardMaterial({ color: '#d6a96b', roughness: 0.35, metalness: 0.8, emissive: '#d6a96b', emissiveIntensity: 0.15 }),
    glass: new THREE.MeshStandardMaterial({ color: '#2b4a66', roughness: 0.15, metalness: 0.7 }),
    ac: new THREE.MeshStandardMaterial({ color: '#e8e8e8', roughness: 0.5 }),
  };
}
export function materials() {
  if (!mats) mats = make();
  return mats;
}

/** A see-through copy used for the airflow cutaway. */
const ghosts = new WeakMap<THREE.Material, THREE.Material>();
export function ghostOf(m: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
  let g = ghosts.get(m) as THREE.MeshStandardMaterial | undefined;
  if (!g) {
    g = m.clone();
    g.transparent = true;
    g.opacity = 0.22;
    g.depthWrite = false;
    ghosts.set(m, g);
  }
  return g;
}
