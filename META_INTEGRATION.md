# Meta wearables integration — status and plan

This document separates what runs today from what is simulated or still planned.

## What we verified (sources)

The official repositories were read directly: `meta/meta-wearables-dat-android` (README, CHANGELOG, the CameraAccess and BirdSpotter samples, and the agent skill docs) and `meta/meta-wearables-webapp`. The build sandbox could not reach developers.meta.com or the Wearables docs MCP because of its network policy.

| Fact | Source |
|---|---|
| The Device Access Toolkit (DAT) for Android is at **1.0.1** (released 2026‑10‑09). It is on **Maven Central** as `com.meta.wearable:mwdat-{core,camera,display,inputs,motion,mockdevice,speech}`, with no token needed. | DAT README, CHANGELOG |
| The sample app uses compileSdk 36, minSdk 31 and JVM 17. The manifest needs `APPLICATION_ID` and `CLIENT_TOKEN` meta-data; both may be `0` in Developer Mode. | `samples/CameraAccess` |
| Flow: `Wearables.initialize` → `startRegistration` (via the Meta AI app) → `createSession(AutoDeviceSelector())` → `session.start()` → on `STARTED`, `addCamera(StreamConfiguration…)` → `stream.start()` → `stream.capturePhoto()`. | CameraAccess `CameraViewModel.kt` |
| The Mock Device Kit provides `MockDeviceKit.getInstance(ctx).enable()`, `pairGlasses(GlassesModel.RAYBAN_META)`, `powerOn/unfold/don`, and `services.camera.setCameraFeed/setCapturedImage`. | CameraAccess `MockDeviceKitViewModel.kt` |
| **There is no DAT audio-output API.** Samples use Android `TextToSpeech` over the Bluetooth route (A2DP/SCO/BLE). The mic is available via HFP, or via experimental stream audio or speech modules. | BirdSpotter `SystemSpokenOutput.kt`, CameraAccess `AudioInputHandler.kt` |
| A display/HUD is available **only** on Meta Ray-Ban Display, through `mwdat-display`. | DAT display skill docs |
| Meta **Web Apps** run on **Meta Ray-Ban Display only**. They use a 600×600 viewport, D-pad/EMG input and a small first-load budget. | `meta-wearables-webapp` README / AGENTS.md |
| DAT is in developer preview. Camera, audio streaming and some other capabilities need per-capability approval in the Developer Center, and experimental features cannot be published yet. | DAT README / CHANGELOG |

## Device classes and how NAZAR treats them

| Device | Display | How NAZAR uses it |
|---|---|---|
| Ray-Ban Meta / Oakley Meta (displayless) | None | Audio-only answers. The browser POV draws **no HUD**; the transcript is labelled as presenter/accessibility text only. |
| Meta Ray-Ban Display | Yes | A future path, either a Web App or `mwdat-display`. Shown in the app only as a labelled *concept*. |
| Phone or laptop browser | Screen | Companion and presenter console (what is deployed). |

## Implementation status

| Piece | Status |
|---|---|
| Browser glasses POV (camera at eye height, simulated capture LED, audio-only cue) | **Simulated** |
| `BrowserSimulatorAdapter`: renders the 3D POV to a JPEG for the vision API | **Working** (simulation) |
| `WebcamAdapter`: real camera via getUserMedia after consent | **Working** |
| Worker `/api/vision`: consent-required frame → catalogue ID + confidence | **Working in tests with a mocked provider**; needs a real provider key to run live |
| `android/` DAT companion: registration, session, camera stream, still capture, Mock Device Kit pairing, `/api/vision` + `/api/ask`, TTS over the Bluetooth route | **Scaffold**. Written against the official sample's API names; **not compiled** (no Android SDK in the build environment) and **not run on glasses or the Mock Device Kit** |
| Meta Ray-Ban Display Web App | **Planned** |

## Running the Android scaffold

1. Install Android Studio with SDK 36, plus the Meta AI app on an Android 12+ phone. Turn on Developer Mode in the Meta AI app.
2. Copy `android/local.properties.example` to `android/local.properties` and set `sdk.dir`. Set `nazar_api_url` to your deployed Worker.
3. Run `./gradlew :app:installDebug` (generate the Gradle wrapper first with `gradle wrapper`).
4. In the app, follow the numbered buttons in order:
   1. **Pair simulated Ray-Ban Meta**: uses the Mock Device Kit; no hardware needed.
   2. **Register**
   3. **Request glasses camera permission**
   4. **Start session**
   5. **Look**
   6. **Ask**
5. For real hardware, register the app in the Wearables Developer Center and request Camera capability approval.

## Remaining work

- Compile the scaffold and fix any API drift against 1.0.1. Add instrumentation tests using the Mock Device Kit (Meta's sample shows the pattern).
- Add a voice trigger: either the Meta AI app voice invocation (experimental) or HFP mic plus on-device speech.
- Handle the session lifecycle: background service and battery-conscious frame rate (currently 2 fps; stills only when asked).
- Display path: a Ray-Ban Display Web App with captions and source chips, kept within the 600×600 viewport and 300 KB budget.
