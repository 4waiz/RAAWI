# Likely judge questions — honest answers

**Does this run on Ray-Ban Meta today?**
Not yet. What you saw is a browser simulation of the glasses point of view, plus a working companion web app. We built an Android companion against Meta's Wearables Device Access Toolkit 1.0.1, using the official sample's API, with Mock Device Kit pairing, camera session and still capture. It is a scaffold that we haven't yet compiled or tested on glasses. That is our next milestone.

**Why not just use Meta AI on the glasses?**
General assistants answer from the open web and can make things up. NAZAR answers only from curated, cited heritage knowledge. It shows its sources, states its uncertainty and declines when it doesn't know. It is also built around place: it knows what you're looking at and keeps the thread of a visit. Cultural institutions need that reliability before they put their name on a guide.

**Is the AI real?**
The default mode uses a deterministic retrieval engine over 28 verified bilingual Q&A pairs, and it labels itself "Curated knowledge". A live mode, Gemini or OpenAI through our Cloudflare Worker, is implemented and tested with mocked providers. The model may only use retrieved facts, and any answer that cites something it wasn't given is thrown away. That mode needs an API key, and the GitHub Pages demo doesn't use it.

**Is the vision real?**
Camera capture with explicit consent works. Recognition runs server-side only when a provider key is configured, and it returns a confidence score: below 0.75 it says "not sure". On the public demo, scene selection is manual and labelled that way. We never claim a manual pick is computer vision.

**How accurate is the 3D model?**
It is a stylised educational interpretation, labelled as such on screen. It is not an archaeologically exact reconstruction.

**Arabic quality?**
Answers are written in Modern Standard Arabic, not machine-translated at runtime. Matching handles diacritics, alef and taa marbuta variants, and clitics like و/ال/ب. Speech output depends on the Arabic voice installed on the device. We plan a native-speaker review and a premium TTS voice.

**Privacy?**
The mic and camera are off by default, and an image upload needs its own opt-in. No recordings or frames are stored, there is no face recognition, keys live only on the server, and session memory can be cleared. See SECURITY.md.

**How does it scale beyond three landmarks?**
Content is structured data (entries, Q&A pairs, sources, uncertainty, hotspots) with tests that enforce sources. Institutions like Dubai Culture or museums could own their entries. The engine and the grounded-LLM path don't change per site.

**Business model?**
Licensing to heritage sites, museums and tourism operators, with a free visitor tier. This is a hypothesis; we have no customers or partners. We have not contacted any government entity, and we don't claim any endorsement.

**What did you measure?**
Only engineering metrics. The test suites pass (counts are in PITCH_FACTS.md), there are no serious axe accessibility violations on the main pages, and the gzipped bundle sizes are recorded. We have not run user studies yet.
