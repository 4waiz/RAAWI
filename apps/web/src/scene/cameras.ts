import { ENTRY_BY_ID } from '@nazar/core';

export type Vec3 = [number, number, number];
export interface CamShot {
  position: Vec3;
  target: Vec3;
}

export const OVERVIEW: CamShot = { position: [6, 40, 62], target: [0, 0, -10] };

/** Eye-level "glasses" points of view for each heritage point (≈1.7 m eye height). */
export const POV: Record<string, CamShot> = {
  'barjeel-al-fahidi': { position: [1.2, 1.7, 8.6], target: [2.5, 8.4, -2] },
  'dallah-hospitality': { position: [-4.4, 1.55, 7.9], target: [-6.2, 0.45, 5.2] },
  'sheikh-zayed-grand-mosque': { position: [36, 1.7, 4], target: [36, 7, -20] },
  'al-ain-oasis': { position: [-34, 1.7, -7.5], target: [-34, 3, -22] },
};

export function shotFor(entryId: string | null, view: 'orbit' | 'pov', overview: boolean): CamShot {
  if (overview || !entryId) return OVERVIEW;
  if (view === 'pov' && POV[entryId]) return POV[entryId]!;
  const e = ENTRY_BY_ID[entryId];
  return e ? { position: e.hotspot.camera.position, target: e.hotspot.camera.target } : OVERVIEW;
}
