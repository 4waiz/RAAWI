import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { ENTRIES, ENTRY_BY_ID, SOURCES, answerQuestion, retrieveGrounding, type Answer, type ConversationContext } from '@nazar/core';
import { getProvider, type Env } from './providers';

const LangSchema = z.enum(['en', 'ar']);
const EntryId = z.string().max(64).nullable();

const AskSchema = z.object({
  question: z.string().trim().min(1).max(500),
  lang: LangSchema.default('en'),
  context: z
    .object({
      focusEntryId: EntryId.default(null),
      activeEntryId: EntryId.default(null),
      lastQaId: z.string().max(64).nullable().default(null),
      usedQaIds: z.array(z.string().max(64)).max(50).default([]),
    })
    .default({}),
});

const VisionSchema = z.object({
  consent: z.literal(true, { errorMap: () => ({ message: 'Explicit image-upload consent is required.' }) }),
  lang: LangSchema.default('en'),
  image: z.object({
    mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
    // ~1.5 MB of base64 max — the client downsizes frames before upload.
    base64: z.string().min(100).max(2_000_000).regex(/^[A-Za-z0-9+/=]+$/),
  }),
});

const LlmAnswerSchema = z.object({
  declined: z.boolean().default(false),
  spoken: z.string().min(1).max(600),
  detail: z.string().max(1500).default(''),
  usedFactIds: z.array(z.string()).default([]),
});

const VisionResultSchema = z.object({
  entryId: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  description: z.string().max(300).default(''),
});

/** Simple per-isolate token bucket. For production, pair with Cloudflare Rate Limiting rules. */
const buckets = new Map<string, { tokens: number; at: number }>();
export function allow(key: string, capacity = 20, refillPerSec = 0.2, now = Date.now()): boolean {
  const b = buckets.get(key) ?? { tokens: capacity, at: now };
  b.tokens = Math.min(capacity, b.tokens + ((now - b.at) / 1000) * refillPerSec);
  b.at = now;
  if (b.tokens < 1) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(key, b);
  if (buckets.size > 5000) buckets.clear();
  return true;
}

const SYSTEM_ASK = `You are NAZAR, a respectful Emirati cultural heritage guide speaking through audio-only smart glasses.
Rules:
- Use ONLY the numbered FACTS provided. Do not add names, dates, numbers or claims that are not in the facts.
- If the facts do not answer the question, set "declined": true and say briefly that your verified sources do not cover it.
- "spoken": 1-3 short sentences suitable for text-to-speech, natural and warm. "detail": optional fuller explanation.
- Answer in the requested language (en = English, ar = Modern Standard Arabic).
- Keep any uncertainty stated in the facts.
- Return JSON: {"declined": boolean, "spoken": string, "detail": string, "usedFactIds": string[]}.`;

export function createApp(fetchImpl: typeof fetch = fetch) {
  const app = new Hono<{ Bindings: Env }>();

  app.use('/api/*', async (c, next) => {
    const allowed = (c.env?.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    return cors({ origin: (o) => (allowed.includes(o) ? o : null), allowMethods: ['GET', 'POST'], allowHeaders: ['content-type'], maxAge: 600 })(c, next);
  });

  app.use('/api/*', async (c, next) => {
    if (c.req.method === 'POST') {
      const len = Number(c.req.header('content-length') ?? '0');
      if (len > 2_200_000) return c.json({ error: 'payload_too_large' }, 413);
      const ip = c.req.header('cf-connecting-ip') ?? 'local';
      if (!allow(`${ip}:${c.req.path}`)) return c.json({ error: 'rate_limited' }, 429);
    }
    await next();
    c.header('cache-control', 'no-store');
    c.header('x-content-type-options', 'nosniff');
  });

  app.get('/api/health', (c) => {
    const p = getProvider(c.env ?? {}, fetchImpl);
    return c.json({ ok: true, provider: p?.name ?? 'none', model: p?.model ?? null, liveAI: Boolean(p), vision: Boolean(p), entries: ENTRIES.length });
  });

  app.post('/api/ask', async (c) => {
    const parsed = AskSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: 'invalid_request', issues: parsed.error.issues.map((i) => i.message) }, 400);
    const { question, lang, context } = parsed.data;
    const ctx: ConversationContext = { ...context, history: [] };
    const curated = answerQuestion(question, ctx, { preferredLang: lang });
    const provider = getProvider(c.env ?? {}, fetchImpl);
    if (!provider || curated.confidence === 'declined' && !curated.entryId) return c.json({ answer: curated, fallback: provider ? 'no_entity' : 'no_provider' });

    const grounding = retrieveGrounding(question, ctx, lang);
    if (!grounding.entry || grounding.facts.length === 0) return c.json({ answer: curated, fallback: 'no_grounding' });

    const factList = grounding.facts.map((f) => `[${f.id}] ${f.text}`).join('\n');
    const user = `LANGUAGE: ${curated.lang}\nLANDMARK: ${grounding.entry.name.en}\nFACTS:\n${factList}\n\nVISITOR QUESTION: ${question}`;
    try {
      const raw = await provider.generateJSON({ system: SYSTEM_ASK, user }, AbortSignal.timeout(8000));
      const llm = LlmAnswerSchema.parse(raw);
      const allowedIds = new Set(grounding.facts.map((f) => f.id));
      // Citation validation: every cited fact must be one we supplied, and a non-declined answer must cite something.
      if (llm.usedFactIds.some((id) => !allowedIds.has(id)) || (!llm.declined && llm.usedFactIds.length === 0)) {
        return c.json({ answer: curated, fallback: 'citation_validation_failed' });
      }
      const used = grounding.facts.filter((f) => llm.usedFactIds.includes(f.id));
      const sourceIds = [...new Set(used.flatMap((f) => f.sourceIds))];
      const answer: Answer = {
        ...curated,
        spoken: llm.spoken,
        detail: llm.detail || curated.detail,
        qaId: used[0]?.id ?? curated.qaId,
        confidence: llm.declined ? 'declined' : curated.confidence,
        sources: sourceIds.map((id) => SOURCES[id]!).filter(Boolean),
        mode: 'live-ai',
      };
      return c.json({ answer, provider: provider.name });
    } catch (err) {
      return c.json({ answer: curated, fallback: 'provider_error', detail: err instanceof Error ? err.message : 'unknown' });
    }
  });

  app.post('/api/vision', async (c) => {
    const parsed = VisionSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: 'invalid_request', issues: parsed.error.issues.map((i) => i.message) }, 400);
    const provider = getProvider(c.env ?? {}, fetchImpl);
    if (!provider) return c.json({ error: 'vision_unavailable', message: 'No vision provider is configured on the server.' }, 503);
    const catalogue = ENTRIES.map((e) => `- ${e.id}: ${e.name.en} (${e.summary.en})`).join('\n');
    const system = `You identify UAE heritage landmarks and objects in a single photo for a heritage guide.
Only choose from this catalogue, or null if none clearly match:
${catalogue}
Never identify, describe or comment on people or faces. Return JSON {"entryId": string|null, "confidence": number 0-1, "description": short neutral description of the heritage object only}.`;
    try {
      const raw = await provider.generateJSON({ system, user: 'Which catalogue item, if any, is shown?', image: parsed.data.image }, AbortSignal.timeout(10000));
      const v = VisionResultSchema.parse(raw);
      const entryId = v.entryId && ENTRY_BY_ID[v.entryId] ? v.entryId : null;
      const status = !entryId ? 'unrecognised' : v.confidence >= 0.75 ? 'confident' : 'uncertain';
      // The image is processed in memory only and never stored.
      return c.json({ entryId, confidence: entryId ? v.confidence : 0, status, description: v.description, provider: provider.name });
    } catch (err) {
      return c.json({ error: 'vision_failed', message: err instanceof Error ? err.message : 'unknown' }, 502);
    }
  });

  app.notFound((c) => c.json({ error: 'not_found' }, 404));
  return app;
}
