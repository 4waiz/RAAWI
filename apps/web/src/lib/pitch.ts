import { useNazar } from '../store';
import { ask, stopAudio } from './assistant';
import { stopListening } from './speech';

export interface PitchStep {
  id: string;
  title: { en: string; ar: string };
  say: string; // what the presenter says (English pitch)
  run: () => Promise<void> | void;
}

const st = () => useNazar.getState();
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Ensure the conversation already contains the barjeel overview, so steps can be jumped to. */
async function ensureBarjeelIntro() {
  const s = st();
  if (!s.ctx.usedQaIds.includes('barjeel-overview')) {
    s.focus('barjeel-al-fahidi');
    await ask('Nazar, what is that tower?', 'scripted');
  }
}

export const PITCH_STEPS: PitchStep[] = [
  {
    id: 'open',
    title: { en: 'Enter the living heritage world', ar: 'ادخل عالم التراث الحي' },
    say: 'This is NAZAR. We are standing above a stylised Al Fahidi Historical Neighbourhood in Dubai.',
    run: () => {
      const s = st();
      s.set({ overlay: null, highlight: null, airflow: false, view: 'orbit', captureLed: false });
      s.setLang('en');
      s.showOverview();
    },
  },
  {
    id: 'look',
    title: { en: 'LOOK — wearable point of view', ar: 'انظر — منظور النظارة' },
    say: "Now we're a visitor wearing Ray-Ban Meta glasses, looking up at a wind tower. The glasses have no display — NAZAR speaks.",
    run: () => {
      const s = st();
      s.set({ overlay: null, highlight: null, airflow: false, device: 'rayban-meta' });
      s.focus('barjeel-al-fahidi');
      s.set({ view: 'pov', captureLed: true });
    },
  },
  {
    id: 'ask1',
    title: { en: 'ASK — “Nazar, what is that tower?”', ar: 'اسأل — «يا نظر، ما هذا البرج؟»' },
    say: 'The visitor just asks, naturally.',
    run: async () => {
      const s = st();
      s.set({ overlay: null, highlight: null });
      if (s.focusEntryId !== 'barjeel-al-fahidi') s.focus('barjeel-al-fahidi');
      st().set({ view: 'pov', captureLed: true });
      await ask('Nazar, what is that tower?', 'scripted');
    },
  },
  {
    id: 'listen',
    title: { en: 'UNDERSTAND — sourced, verified answer', ar: 'افهم — إجابة موثّقة بالمصادر' },
    say: 'Every answer comes from curated heritage sources — and the sources and confidence are always visible.',
    run: async () => {
      await ensureBarjeelIntro();
      st().set({ highlight: 'sources', overlay: null });
    },
  },
  {
    id: 'followup',
    title: { en: 'Follow-up — “How did it keep buildings cool?”', ar: 'سؤال متابعة — «كيف كان يبرّد البيوت؟»' },
    say: 'NAZAR remembers that “it” means the barjeel — and the 3D world shows how the air moves.',
    run: async () => {
      await ensureBarjeelIntro();
      const s = st();
      s.set({ highlight: null, overlay: null, view: 'orbit' });
      await ask('How did it keep buildings cool?', 'scripted');
    },
  },
  {
    id: 'arabic',
    title: { en: 'Arabic — «يا نظر، ما هذه الدلّة؟»', ar: 'بالعربية — «يا نظر، ما هذه الدلّة؟»' },
    say: 'NAZAR is bilingual. Switching to Arabic, the visitor walks into a majlis and looks at the dallah.',
    run: async () => {
      const s = st();
      s.set({ highlight: null, overlay: null, airflow: false });
      s.setLang('ar');
      s.focus('dallah-hospitality');
      st().set({ view: 'pov', captureLed: true });
      await wait(900);
      await ask('يا نظر، ما هذه الدلّة؟', 'scripted');
    },
  },
  {
    id: 'trust',
    title: { en: 'Trust — privacy, consent & honest labels', ar: 'الثقة — الخصوصية والموافقة' },
    say: 'Camera and mic are off until permitted, nothing is stored, no face recognition, and every capability is labelled honestly.',
    run: () => {
      stopAudio();
      st().setLang('en');
      st().set({ overlay: 'trust', highlight: null, captureLed: false });
    },
  },
  {
    id: 'architecture',
    title: { en: 'Architecture & path to Meta glasses', ar: 'البنية والمسار إلى نظارات Meta' },
    say: 'Under the hood: consent-gated input, context, curated retrieval, grounded generation and citation checks — and an Android companion on Meta’s Device Access Toolkit.',
    run: () => {
      stopAudio();
      st().setLang('en');
      st().set({ overlay: 'architecture', highlight: null });
    },
  },
];

/** Restart the demo without reloading the page. */
export function resetDemo() {
  stopAudio();
  stopListening();
  const s = st();
  s.resetAll();
}
