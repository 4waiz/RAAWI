# NAZAR pitch demo — 60 to 90 seconds

**Setup:** open `https://4waiz.github.io/RAAWI/pitch-demo` (or `http://localhost:5173/pitch-demo`) in Chrome or Edge. The browser must have an English voice, and ideally an Arabic one; on macOS add one under *System Settings → Accessibility → Spoken Content*. Unmute and go full screen (F11). A presentation clicker works too, because PageDown advances the demo.

**Fallbacks:** if audio fails, the captions still show every answer. If the mic fails, every step uses a typed scripted prompt anyway. If the network fails, the app runs fully client-side once loaded, and the service worker caches it.

| # | Press | On screen | Say (verbatim) |
|---|---|---|---|
| 1 | → | Overview flyover of the four heritage stations | "This is NAZAR — نَظَر — the living memory of the UAE. We're above a stylised Al Fahidi Historical Neighbourhood in Dubai." |
| 2 | → | Eye-level glasses POV under the barjeel; capture LED on (simulated) | "Now we're a visitor wearing Ray-Ban Meta glasses. These glasses have no display, so NAZAR speaks." |
| 3 | → | Scripted question "Nazar, what is that tower?" → spoken answer | *(let NAZAR answer, about 8 s)* |
| 4 | → | Sources highlighted, "Verified from curated sources" badge | "Every answer comes from curated heritage sources — Dubai Culture, UNESCO, the Grand Mosque Centre — and the sources are always one tap away." |
| 5 | → | "How did it keep buildings cool?" → answer + airflow cutaway | "Notice I said *it*. NAZAR remembers we're talking about the barjeel — and the 3D world shows how the breeze moves through the house." *(let it speak)* |
| 6 | → | UI switches to Arabic RTL, POV in the majlis, «يا نظر، ما هذه الدلّة؟» | "NAZAR is natively bilingual. In the majlis, a visitor asks in Arabic about the dallah." *(let it speak)* |
| 7 | → | Trust overlay | "Trust is a product feature: camera and mic stay off until allowed, nothing is stored, no face recognition, and NAZAR would rather decline than guess." |
| 8 | → | Architecture overlay | "Under the hood: consent-gated input, context, curated retrieval, grounded generation with citation checks — and an Android companion built on Meta's Device Access Toolkit as our path to real glasses." |

**Total:** about 75 seconds. Press **R** to reset instantly (no page reload). Number keys **1–8** jump to any step.

### Optional live moments (only if the room is quiet)

- Press **M** and ask "Tell me more", or ask «لماذا؟» after step 6.
- Ask an off-topic question ("What's the weather?") to show NAZAR declining.

### Honesty lines, if asked

- "The questions in presenter mode are scripted prompts; the answers are generated live by the knowledge engine."
- "The glasses view is a browser simulation. Our Android Device Access Toolkit companion is a scaffold that we haven't yet run on glasses."
