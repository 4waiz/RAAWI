# Pitch facts — what we can and cannot claim

## Safe to claim (demonstrably working)

- An interactive Three.js 3D world: a stylised Al Fahidi with a procedural barjeel, majlis and dallah, a simplified Sheikh Zayed Grand Mosque, and Al Ain Oasis with a moving falaj. It includes an airflow cutaway, a Then/Now view and a performance mode.
- The Look → Ask → Listen loop works in the browser, with voice in Chrome/Edge and text everywhere.
- 4 heritage entries and 28 Q&A pairs in English and Modern Standard Arabic, each with sources and uncertainty notes.
- Follow-ups such as "it", "why?", "how?" and "tell me more" keep context, and the memory can be cleared.
- NAZAR declines off-topic questions and anything its sources don't cover.
- Arabic RTL interface with correct shaping (IBM Plex Sans Arabic and Amiri, bundled).
- A presenter mode with 8 steps, keyboard/clicker control and instant reset.
- Consent-gated mic and camera, with no storage.
- A live-AI Worker with citation validation, implemented and unit-tested with mocked providers.

## Measured prototype results (from this repository's test runs, 6 Nov 2026)

- Unit tests: core 30/30, API 11/11, web 4/4.
- End-to-end: 25/25 Playwright tests passing on desktop and mobile Chromium. They cover the demo path, Arabic, presenter reset, consent gating, the 404 page and deep links.
- Accessibility: 0 serious or critical axe violations on `/`, `/experience`, `/pitch-demo` and `/privacy`.
- No horizontal scroll at 390 px width on the main routes.
- Bundle (gzip): app about 76 KB, three.js about 177 KB, R3F/drei about 100 KB.

## Must be qualified

- **Glasses:** a *browser simulation* of the Ray-Ban Meta point of view. It is not connected to hardware.
- **Meta DAT:** an Android *scaffold* on DAT 1.0.1 and the Mock Device Kit. It has not been compiled or run.
- **Live AI and vision:** require an API key and the deployed Worker. They are off on the GitHub Pages demo.
- **Presenter-mode questions:** scripted prompts, though the answers are produced by the engine at runtime.
- **3D:** an educational interpretation, not a reconstruction.

## Must NOT claim

- Any partnership with, or endorsement by, Meta, Dubai Culture, DCT Abu Dhabi, SZGMC, UNESCO or any government body.
- User numbers, pilot sites, accuracy percentages or user-study results (we have none).
- An on-lens display on Ray-Ban Meta (it is displayless).
- That recognition happened when the scene was chosen manually.

## Future capabilities (roadmap)

1. Compile and run the DAT companion on the Mock Device Kit, then on Ray-Ban Meta.
2. Premium bilingual TTS voice behind the Worker.
3. A Meta Ray-Ban Display Web App with captions and source chips.
4. More sites (Qasr Al Hosn, pearl diving), authored with institutions.
5. Native-speaker review of all Arabic content.
