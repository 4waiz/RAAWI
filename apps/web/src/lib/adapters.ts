/**
 * Device adapters: one interface, several honest implementations.
 *  - BrowserSimulatorAdapter: renders the simulated glasses POV from the 3D scene. SIMULATED.
 *  - WebcamAdapter: real camera via getUserMedia, only after explicit consent. WORKING.
 *  - MetaDatAdapter: native Android companion using the Meta Wearables Device Access Toolkit.
 *    Not available inside a browser — see android/ and META_INTEGRATION.md. SCAFFOLD.
 */
import { captureSceneFrame } from '../scene/capture';

export type CapabilityStatus = 'working' | 'simulated' | 'integrated' | 'scaffold' | 'planned';

export interface DeviceAdapter {
  id: 'browser-simulator' | 'webcam' | 'meta-dat-android';
  label: string;
  status: CapabilityStatus;
  capabilities: { camera: boolean; microphone: boolean; audioOut: boolean; display: boolean };
  connect(): Promise<void>;
  captureFrame(): Promise<Blob | null>;
  disconnect(): void;
}

export class BrowserSimulatorAdapter implements DeviceAdapter {
  id = 'browser-simulator' as const;
  label = 'Browser glasses simulator';
  status: CapabilityStatus = 'simulated';
  capabilities = { camera: true, microphone: true, audioOut: true, display: false };
  async connect() {}
  captureFrame() {
    return captureSceneFrame(768);
  }
  disconnect() {}
}

export class WebcamAdapter implements DeviceAdapter {
  id = 'webcam' as const;
  label = 'Device camera (with consent)';
  status: CapabilityStatus = 'working';
  capabilities = { camera: true, microphone: false, audioOut: true, display: false };
  stream: MediaStream | null = null;
  video: HTMLVideoElement | null = null;

  static supported() {
    return typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);
  }

  async connect(video?: HTMLVideoElement) {
    this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } }, audio: false });
    if (video) {
      this.video = video;
      video.srcObject = this.stream;
      await video.play().catch(() => {});
    }
  }

  async captureFrame(maxSize = 768): Promise<Blob | null> {
    const v = this.video;
    if (!v || !v.videoWidth) return null;
    const scale = Math.min(1, maxSize / Math.max(v.videoWidth, v.videoHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(v.videoWidth * scale);
    c.height = Math.round(v.videoHeight * scale);
    c.getContext('2d')!.drawImage(v, 0, 0, c.width, c.height);
    return new Promise((resolve) => c.toBlob((b) => resolve(b), 'image/jpeg', 0.82));
  }

  disconnect() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    if (this.video) this.video.srcObject = null;
  }
}

/** Placeholder describing the native path; a browser cannot talk to Ray-Ban Meta hardware directly. */
export const META_DAT_ADAPTER_INFO = {
  id: 'meta-dat-android' as const,
  label: 'Meta Wearables Device Access Toolkit (Android companion)',
  status: 'scaffold' as CapabilityStatus,
  capabilities: { camera: true, microphone: true, audioOut: true, display: false },
  note: 'Runs as a native Android app (mwdat-core/camera 1.0.1). Frames from the glasses camera are sent to the same /api/vision and /api/ask endpoints; answers play through the glasses’ Bluetooth audio route.',
};
