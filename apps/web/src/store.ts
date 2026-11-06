import { create } from 'zustand';
import { applyTurn, createContext, setFocus, type Answer, type ConversationContext, type Lang } from '@nazar/core';
import { STRINGS } from './i18n';

export type AssistantState = 'idle' | 'listening' | 'thinking' | 'speaking';
export type ViewMode = 'orbit' | 'pov';
export type DeviceProfile = 'rayban-meta' | 'display-concept';
export type TurnSource = 'voice' | 'typed' | 'scripted' | 'suggestion';

export interface UITurn {
  id: string;
  role: 'visitor' | 'nazar';
  text: string;
  lang: Lang;
  source?: TurnSource;
  answer?: Answer;
}

export interface Consent {
  microphone: boolean;
  camera: boolean;
  imageUpload: boolean;
}

interface NazarState {
  lang: Lang;
  focusEntryId: string | null;
  view: ViewMode;
  /** 'overview' = wide shot of the whole world (no focus). */
  overview: boolean;
  assistant: AssistantState;
  interim: string;
  turns: UITurn[];
  ctx: ConversationContext;
  muted: boolean;
  airflow: boolean;
  thenNow: 'then' | 'now';
  perfLow: boolean;
  device: DeviceProfile;
  consent: Consent;
  captureLed: boolean;
  highlight: string | null;
  overlay: 'architecture' | 'trust' | null;
  apiStatus: { checked: boolean; live: boolean; vision: boolean; provider: string };
  setLang: (l: Lang) => void;
  focus: (id: string | null, opts?: { keepContext?: boolean }) => void;
  showOverview: () => void;
  setView: (v: ViewMode) => void;
  setAssistant: (s: AssistantState) => void;
  setInterim: (t: string) => void;
  addVisitorTurn: (text: string, lang: Lang, source: TurnSource) => void;
  addAnswer: (question: string, answer: Answer) => void;
  clearMemory: () => void;
  set: (p: Partial<NazarState>) => void;
  setConsent: (p: Partial<Consent>) => void;
  resetAll: () => void;
}

let turnSeq = 0;
const nextId = () => `t${Date.now().toString(36)}${(turnSeq++).toString(36)}`;

function readPerfDefault(): boolean {
  try {
    const saved = localStorage.getItem('nazar.perfLow');
    if (saved !== null) return saved === '1';
  } catch {
    /* storage unavailable */
  }
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  const mobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  return mobile || cores <= 4;
}

const initial = () => ({
  focusEntryId: null as string | null,
  view: 'orbit' as ViewMode,
  overview: true,
  assistant: 'idle' as AssistantState,
  interim: '',
  turns: [] as UITurn[],
  ctx: createContext(null),
  airflow: false,
  thenNow: 'then' as const,
  captureLed: false,
  highlight: null as string | null,
  overlay: null as NazarState['overlay'],
});

export const useNazar = create<NazarState>((set, get) => ({
  lang: 'en',
  muted: false,
  perfLow: readPerfDefault(),
  device: 'rayban-meta',
  consent: { microphone: false, camera: false, imageUpload: false },
  apiStatus: { checked: false, live: false, vision: false, provider: 'none' },
  ...initial(),
  setLang: (lang) => {
    set({ lang });
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  },
  focus: (id, opts) =>
    set((s) => ({
      focusEntryId: id,
      overview: id === null,
      ctx: opts?.keepContext ? { ...s.ctx, focusEntryId: id } : setFocus(s.ctx, id),
      airflow: id === 'barjeel-al-fahidi' ? s.airflow : false,
    })),
  showOverview: () => set((s) => ({ overview: true, focusEntryId: null, view: 'orbit', ctx: { ...s.ctx, focusEntryId: null } })),
  setView: (view) => set({ view }),
  setAssistant: (assistant) => set({ assistant, captureLed: assistant === 'listening' ? get().captureLed : get().captureLed }),
  setInterim: (interim) => set({ interim }),
  addVisitorTurn: (text, lang, source) => set((s) => ({ turns: [...s.turns, { id: nextId(), role: 'visitor' as const, text, lang, source }].slice(-40) })),
  addAnswer: (question, answer) =>
    set((s) => ({
      ctx: applyTurn(s.ctx, question, answer),
      turns: [...s.turns, { id: nextId(), role: 'nazar' as const, text: answer.spoken, lang: answer.lang, answer }].slice(-40),
    })),
  clearMemory: () => set((s) => ({ ctx: createContext(s.focusEntryId), turns: [] })),
  set: (p) => set(p),
  setConsent: (p) => set((s) => ({ consent: { ...s.consent, ...p } })),
  resetAll: () => {
    set({ ...initial() });
    get().setLang('en');
  },
}));

export function useT() {
  const lang = useNazar((s) => s.lang);
  return STRINGS[lang];
}
