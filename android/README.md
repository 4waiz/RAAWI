# NAZAR Glasses — Android companion (scaffold)

This is a proof-of-concept companion for Meta glasses, built on the **Meta Wearables Device Access Toolkit 1.0.1**: `mwdat-core`, `mwdat-camera` and `mwdat-mockdevice` from Maven Central. The API usage mirrors Meta's official `CameraAccess` sample.

**Status:** this has **not been compiled or run**. The environment that produced it had no Android SDK. See `../META_INTEGRATION.md` for the full status and setup steps.

- `MainActivity.kt`: permissions, `Wearables.initialize`, registration, Mock Device Kit pairing, and the Look/Ask actions.
- `GlassesSession.kt`: session → camera stream (2 fps) → `capturePhoto()` → JPEG.
- `NazarApi.kt`: calls the same `/api/vision` and `/api/ask` endpoints as the web app.
- `Narrator.kt`: Android TTS, which plays through the glasses' Bluetooth audio route. DAT has no audio-out API.
