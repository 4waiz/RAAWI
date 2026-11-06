# Security, privacy and responsible AI

## Data handling

| Data | Default | Handling |
|---|---|---|
| Microphone | Off | Requires an in-app consent dialog, then the browser permission. NAZAR listens only while Talk is active. Recognition is done by the browser's Web Speech API, and **in Chrome, audio goes to the browser vendor's speech service**; this is disclosed in the UI. Nothing is recorded or stored by NAZAR. |
| Camera | Off | Turned on only by the user, with a visible "CAMERA ON" badge. Tracks stop when the panel closes. |
| Captured frames | On-device | Uploaded only after a **separate per-frame opt-in** checkbox, then processed in memory by the Worker and **never stored**. |
| Faces / biometrics | — | No face recognition or biometric ID. The vision prompt forbids describing people. |
| Conversation | Session memory | Kept in browser memory only, and erased by **Clear memory** or reload. No accounts, analytics or tracking cookies. |
| `localStorage` | — | Stores only the performance-mode preference. |

## API hardening (`apps/worker`)

- **Zod validation:** question ≤ 500 characters, image ≤ about 1.5 MB base64 with a MIME allow-list, at most 50 used-QA ids, and `consent: true` required for vision.
- **CORS allow-list** via `ALLOWED_ORIGINS`.
- **Limits:** a per-IP token bucket per isolate (pair it with Cloudflare Rate Limiting rules in production) and a payload cap (413).
- **Timeouts and caching:** provider calls time out at 8 s (ask) and 10 s (vision); responses send `cache-control: no-store` and `x-content-type-options: nosniff`.
- **Keys:** provider keys are read only from Worker secrets (`wrangler secret put`). `.dev.vars`, `.env` and `local.properties` are git-ignored.
- **Output validation:** the model's output is schema-validated, and any citation must be a fact we supplied; otherwise the curated answer is used.

## Front end

- The production build sets a Content-Security-Policy meta tag (`script-src 'self'`, no inline scripts). GitHub Pages can't set HTTP headers, so frame-ancestors can't be enforced there.
- External links use `rel="noopener noreferrer"`.
- There are no third-party scripts or font CDNs; fonts are bundled.
- `scripts/check-secrets.mjs` scans the repo and the built site for key patterns, and CI runs it on `dist`.

## Threat model (summary)

| Threat | Mitigation |
|---|---|
| Cost abuse of the LLM endpoint | Rate limit, size limits, CORS, short outputs (≤ 700 tokens), curated-first path |
| Prompt injection through the question | The model sees only curated facts, and its output must cite supplied fact IDs. Free-form instructions can't add new facts, and a failed validation falls back to curated |
| Hallucinated heritage facts | Grounding plus citation validation, explicit uncertainty, refusal rules, visible sources |
| Bystander privacy (camera) | Off by default, visible indicator, no storage, no faces. On real glasses, the hardware capture LED informs bystanders |
| Key leakage | Server-side secrets only, secret scan in CI, ignored env files |

## Reporting

Email the Team Kanban maintainers via the GitHub repository owner (`4waiz`). Please don't open public issues for vulnerabilities.
