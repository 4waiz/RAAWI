import type { Lang } from '@nazar/core';

/* ---------------- Speech recognition (browser Web Speech API) ---------------- */

type SR = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getSR(): (new () => SR) | null {
  if (typeof window === 'undefined') return null;
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const sttSupported = () => getSR() !== null;

export interface ListenHandlers {
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onError: (code: string) => void;
  onEnd: () => void;
}

let active: SR | null = null;

export function startListening(lang: Lang, h: ListenHandlers): () => void {
  const Ctor = getSR();
  if (!Ctor) {
    h.onError('unsupported');
    h.onEnd();
    return () => {};
  }
  active?.abort();
  const rec = new Ctor();
  rec.lang = lang === 'ar' ? 'ar-AE' : 'en-US';
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = 1;
  let finalText = '';
  rec.onresult = (e: any) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript;
      else interim += r[0].transcript;
    }
    h.onInterim((finalText + interim).trim());
  };
  rec.onerror = (e: any) => h.onError(e?.error ?? 'error');
  rec.onend = () => {
    active = null;
    if (finalText.trim()) h.onFinal(finalText.trim());
    h.onEnd();
  };
  active = rec;
  try {
    rec.start();
  } catch {
    h.onError('start-failed');
    h.onEnd();
  }
  return () => rec.stop();
}

export function stopListening() {
  active?.stop();
}

/* ---------------- Speech synthesis ---------------- */

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

let voicesCache: SpeechSynthesisVoice[] = [];
function loadVoices(): SpeechSynthesisVoice[] {
  if (!ttsSupported()) return [];
  const v = window.speechSynthesis.getVoices();
  if (v.length) voicesCache = v;
  return voicesCache;
}
if (ttsSupported()) {
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

export function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  const prefs = lang === 'ar' ? ['ar-AE', 'ar-SA', 'ar'] : ['en-GB', 'en-US', 'en'];
  for (const p of prefs) {
    const exact = voices.filter((v) => v.lang.toLowerCase().startsWith(p.toLowerCase()));
    if (exact.length) return exact.find((v) => /natural|neural|premium|google/i.test(v.name)) ?? exact[0]!;
  }
  return null;
}

export const hasVoiceFor = (lang: Lang) => pickVoice(lang) !== null;

/** Split long text into sentence chunks — Chrome cuts off long utterances. */
function chunks(text: string): string[] {
  const parts = text.match(/[^.!?؟…]+[.!?؟…]*\s*/g) ?? [text];
  const out: string[] = [];
  let cur = '';
  for (const p of parts) {
    if ((cur + p).length > 220 && cur) {
      out.push(cur.trim());
      cur = p;
    } else cur += p;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

let speakToken = 0;

/** Speak text. Resolves when finished or interrupted. Returns false if no voice/support. */
export function speak(text: string, lang: Lang, onStart?: () => void): Promise<boolean> {
  if (!ttsSupported()) return Promise.resolve(false);
  const synth = window.speechSynthesis;
  synth.cancel();
  const token = ++speakToken;
  const voice = pickVoice(lang);
  const pieces = chunks(text);
  return new Promise((resolve) => {
    let i = 0;
    let started = false;
    const watchdog = setTimeout(() => {
      // Some browsers never fire events when no voice is available.
      if (!started && token === speakToken) {
        synth.cancel();
        resolve(false);
      }
    }, 4000);
    const next = () => {
      if (token !== speakToken) return resolve(true);
      if (i >= pieces.length) {
        clearTimeout(watchdog);
        return resolve(true);
      }
      const u = new SpeechSynthesisUtterance(pieces[i++]!);
      u.lang = lang === 'ar' ? 'ar-AE' : 'en-GB';
      if (voice) u.voice = voice;
      u.rate = lang === 'ar' ? 0.95 : 1.0;
      u.pitch = 1;
      u.onstart = () => {
        if (!started) {
          started = true;
          clearTimeout(watchdog);
          onStart?.();
        }
      };
      u.onend = next;
      u.onerror = () => {
        clearTimeout(watchdog);
        resolve(started);
      };
      synth.speak(u);
    };
    next();
  });
}

export function stopSpeaking() {
  speakToken++;
  if (ttsSupported()) window.speechSynthesis.cancel();
}
