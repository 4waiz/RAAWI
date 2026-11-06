import { describe, expect, it } from 'vitest';
import { ENTRIES, answerQuestion } from '@nazar/core';
import { STRINGS } from './i18n';
import { POV, shotFor, OVERVIEW } from './scene/cameras';
import { PITCH_STEPS } from './lib/pitch';
import { useNazar } from './store';

describe('i18n', () => {
  it('English and Arabic UI strings have identical keys and no empty values', () => {
    expect(Object.keys(STRINGS.ar).sort()).toEqual(Object.keys(STRINGS.en).sort());
    for (const lang of ['en', 'ar'] as const) for (const v of Object.values(STRINGS[lang])) expect(v.trim()).not.toBe('');
  });
});

describe('scene cameras', () => {
  it('every heritage entry has a glasses POV and an orbit shot', () => {
    for (const e of ENTRIES) {
      expect(POV[e.id]).toBeDefined();
      expect(shotFor(e.id, 'pov', false)).toBe(POV[e.id]);
      expect(shotFor(e.id, 'orbit', false).position).toEqual(e.hotspot.camera.position);
    }
    expect(shotFor(null, 'orbit', true)).toBe(OVERVIEW);
  });
});

describe('presenter script', () => {
  it('has 8 steps with bilingual titles', () => {
    expect(PITCH_STEPS).toHaveLength(8);
    for (const s of PITCH_STEPS) expect(s.title.en && s.title.ar && s.say).toBeTruthy();
  });
});

describe('store conversation context', () => {
  it('applies answers to context and focusing keeps it when asked to', () => {
    const s = useNazar.getState();
    s.focus('barjeel-al-fahidi');
    const a = answerQuestion('What is that tower?', useNazar.getState().ctx);
    s.addAnswer('What is that tower?', a);
    expect(useNazar.getState().ctx.lastQaId).toBe('barjeel-overview');
    useNazar.getState().focus('dallah-hospitality', { keepContext: true });
    expect(useNazar.getState().ctx.lastQaId).toBe('barjeel-overview');
    useNazar.getState().clearMemory();
    expect(useNazar.getState().turns).toHaveLength(0);
    expect(useNazar.getState().ctx.usedQaIds).toHaveLength(0);
  });
});
