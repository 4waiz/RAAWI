import { describe, expect, it, vi } from 'vitest';
import { allow, createApp } from '../src/app';

const ENV = { ALLOWED_ORIGINS: 'http://localhost:5173', AI_PROVIDER: 'gemini' };
const post = (body: unknown) => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

function geminiReturning(json: unknown) {
  return vi.fn(async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(json) }] } }] }), { status: 200 }));
}

describe('NAZAR API', () => {
  it('reports no live AI without credentials', async () => {
    const res = await createApp().request('/api/health', {}, ENV);
    expect(await res.json()).toMatchObject({ ok: true, provider: 'none', liveAI: false });
  });

  it('returns the curated answer when no provider is configured', async () => {
    const res = await createApp().request('/api/ask', post({ question: 'What is that tower?', context: { focusEntryId: 'barjeel-al-fahidi' } }), ENV);
    const body = (await res.json()) as any;
    expect(body.answer.mode).toBe('curated');
    expect(body.answer.qaId).toBe('barjeel-overview');
    expect(body.fallback).toBe('no_provider');
  });

  it('validates input', async () => {
    const res = await createApp().request('/api/ask', post({ question: '' }), ENV);
    expect(res.status).toBe(400);
    const res2 = await createApp().request('/api/ask', post({ question: 'x'.repeat(600) }), ENV);
    expect(res2.status).toBe(400);
  });

  it('uses live AI when the answer cites supplied facts', async () => {
    const fetchMock = geminiReturning({ declined: false, spoken: 'It is a wind tower.', detail: '', usedFactIds: ['barjeel-overview'] });
    const res = await createApp(fetchMock as any).request('/api/ask', post({ question: 'What is that tower?', context: { focusEntryId: 'barjeel-al-fahidi' } }), { ...ENV, GEMINI_API_KEY: 'test' });
    const body = (await res.json()) as any;
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(body.answer.mode).toBe('live-ai');
    expect(body.answer.spoken).toBe('It is a wind tower.');
    expect(body.answer.sources.length).toBeGreaterThan(0);
  });

  it('falls back to curated when the model cites facts it was not given', async () => {
    const fetchMock = geminiReturning({ declined: false, spoken: 'Invented claim.', usedFactIds: ['made-up-fact'] });
    const res = await createApp(fetchMock as any).request('/api/ask', post({ question: 'What is that tower?', context: { focusEntryId: 'barjeel-al-fahidi' } }), { ...ENV, GEMINI_API_KEY: 'test' });
    const body = (await res.json()) as any;
    expect(body.answer.mode).toBe('curated');
    expect(body.fallback).toBe('citation_validation_failed');
  });

  it('falls back to curated on provider outage', async () => {
    const fetchMock = vi.fn(async () => new Response('boom', { status: 503 }));
    const res = await createApp(fetchMock as any).request('/api/ask', post({ question: 'How did it keep buildings cool?', context: { focusEntryId: 'barjeel-al-fahidi' } }), { ...ENV, GEMINI_API_KEY: 'test' });
    const body = (await res.json()) as any;
    expect(body.answer.mode).toBe('curated');
    expect(body.answer.qaId).toBe('barjeel-cooling');
    expect(body.fallback).toBe('provider_error');
  });

  it('refuses vision without explicit consent', async () => {
    const res = await createApp().request('/api/vision', post({ consent: false, image: { mimeType: 'image/jpeg', base64: 'A'.repeat(200) } }), { ...ENV, GEMINI_API_KEY: 'test' });
    expect(res.status).toBe(400);
  });

  it('reports vision unavailable without a provider', async () => {
    const res = await createApp().request('/api/vision', post({ consent: true, image: { mimeType: 'image/jpeg', base64: 'A'.repeat(200) } }), ENV);
    expect(res.status).toBe(503);
  });

  it('marks low-confidence vision results as uncertain and rejects unknown ids', async () => {
    const low = geminiReturning({ entryId: 'dallah-hospitality', confidence: 0.4, description: 'a brass pot' });
    const r1 = (await (await createApp(low as any).request('/api/vision', post({ consent: true, image: { mimeType: 'image/jpeg', base64: 'A'.repeat(200) } }), { ...ENV, GEMINI_API_KEY: 'k' })).json()) as any;
    expect(r1.status).toBe('uncertain');
    const bad = geminiReturning({ entryId: 'eiffel-tower', confidence: 0.99, description: '' });
    const r2 = (await (await createApp(bad as any).request('/api/vision', post({ consent: true, image: { mimeType: 'image/jpeg', base64: 'A'.repeat(200) } }), { ...ENV, GEMINI_API_KEY: 'k' })).json()) as any;
    expect(r2.entryId).toBeNull();
    expect(r2.status).toBe('unrecognised');
  });

  it('only allows configured CORS origins', async () => {
    const ok = await createApp().request('/api/health', { headers: { origin: 'http://localhost:5173' } }, ENV);
    expect(ok.headers.get('access-control-allow-origin')).toBe('http://localhost:5173');
    const bad = await createApp().request('/api/health', { headers: { origin: 'https://evil.example' } }, ENV);
    expect(bad.headers.get('access-control-allow-origin')).toBeNull();
  });

  it('rate limits bursts', () => {
    const now = 1_000_000;
    let allowed = 0;
    for (let i = 0; i < 30; i++) if (allow('burst-test', 20, 0, now)) allowed++;
    expect(allowed).toBe(20);
  });
});
