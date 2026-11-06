/** Server-side model provider adapters. API keys never leave the Worker. */
export interface Env {
  ALLOWED_ORIGINS?: string;
  AI_PROVIDER?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

export interface ProviderRequest {
  system: string;
  user: string;
  image?: { mimeType: string; base64: string };
}

export interface Provider {
  name: 'gemini' | 'openai';
  model: string;
  generateJSON(req: ProviderRequest, signal?: AbortSignal): Promise<unknown>;
}

export function getProvider(env: Env, fetchImpl: typeof fetch = fetch): Provider | null {
  const choice = (env.AI_PROVIDER ?? 'gemini').toLowerCase();
  if (choice === 'gemini' && env.GEMINI_API_KEY) return gemini(env.GEMINI_API_KEY, env.GEMINI_MODEL ?? 'gemini-2.5-flash', fetchImpl);
  if (choice === 'openai' && env.OPENAI_API_KEY) return openai(env.OPENAI_API_KEY, env.OPENAI_MODEL ?? 'gpt-4o-mini', fetchImpl);
  return null;
}

function parseJSONText(text: string): unknown {
  const trimmed = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  return JSON.parse(trimmed);
}

function gemini(key: string, model: string, fetchImpl: typeof fetch): Provider {
  return {
    name: 'gemini',
    model,
    async generateJSON(req, signal) {
      const parts: unknown[] = [{ text: req.user }];
      if (req.image) parts.push({ inline_data: { mime_type: req.image.mimeType, data: req.image.base64 } });
      const res = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        signal,
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: req.system }] },
          contents: [{ role: 'user', parts }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 700, responseMimeType: 'application/json' },
        }),
      });
      if (!res.ok) throw new Error(`gemini_http_${res.status}`);
      const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
      const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
      return parseJSONText(text);
    },
  };
}

function openai(key: string, model: string, fetchImpl: typeof fetch): Provider {
  return {
    name: 'openai',
    model,
    async generateJSON(req, signal) {
      const content: unknown[] = [{ type: 'text', text: req.user }];
      if (req.image) content.push({ type: 'image_url', image_url: { url: `data:${req.image.mimeType};base64,${req.image.base64}`, detail: 'low' } });
      const res = await fetchImpl('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal,
        headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 700,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: req.system },
            { role: 'user', content },
          ],
        }),
      });
      if (!res.ok) throw new Error(`openai_http_${res.status}`);
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return parseJSONText(data.choices?.[0]?.message?.content ?? '');
    },
  };
}
