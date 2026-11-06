import type { Answer, ConversationContext, Lang } from '@nazar/core';

/**
 * Optional NAZAR API (Cloudflare Worker). When VITE_NAZAR_API_URL is not set — as on the
 * GitHub Pages deployment — the app runs entirely on the curated, client-side knowledge layer.
 */
export const API_BASE: string = (import.meta.env.VITE_NAZAR_API_URL ?? '').replace(/\/$/, '');

export interface Health {
  ok: boolean;
  provider: string;
  liveAI: boolean;
  vision: boolean;
}

async function withTimeout<T>(p: (signal: AbortSignal) => Promise<T>, ms: number): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await p(ctrl.signal);
  } finally {
    clearTimeout(t);
  }
}

export async function checkHealth(): Promise<Health | null> {
  if (!API_BASE) return null;
  try {
    return await withTimeout(async (signal) => {
      const r = await fetch(`${API_BASE}/api/health`, { signal });
      if (!r.ok) return null;
      return (await r.json()) as Health;
    }, 3500);
  } catch {
    return null;
  }
}

export async function askRemote(question: string, lang: Lang, ctx: ConversationContext): Promise<{ answer: Answer; fallback?: string }> {
  return withTimeout(async (signal) => {
    const r = await fetch(`${API_BASE}/api/ask`, {
      method: 'POST',
      signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        question,
        lang,
        context: { focusEntryId: ctx.focusEntryId, activeEntryId: ctx.activeEntryId, lastQaId: ctx.lastQaId, usedQaIds: ctx.usedQaIds },
      }),
    });
    if (!r.ok) throw new Error(`ask_http_${r.status}`);
    return r.json();
  }, 10000);
}

export interface VisionResult {
  entryId: string | null;
  confidence: number;
  status: 'confident' | 'uncertain' | 'unrecognised';
  description: string;
}

export async function analyseImage(blob: Blob, lang: Lang): Promise<VisionResult> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result).split(',')[1] ?? '');
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(blob);
  });
  return withTimeout(async (signal) => {
    const r = await fetch(`${API_BASE}/api/vision`, {
      method: 'POST',
      signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ consent: true, lang, image: { mimeType: 'image/jpeg', base64 } }),
    });
    if (!r.ok) throw new Error(`vision_http_${r.status}`);
    return r.json();
  }, 15000);
}
