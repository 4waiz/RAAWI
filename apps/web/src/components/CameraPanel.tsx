import { useEffect, useRef, useState } from 'react';
import { ENTRY_BY_ID } from '@nazar/core';
import { useNazar } from '../store';
import { BrowserSimulatorAdapter, WebcamAdapter } from '../lib/adapters';
import { analyseImage, type VisionResult } from '../lib/api';

/**
 * Consent-first camera. The camera is off until the visitor turns it on; frames are only
 * uploaded for analysis after a separate, explicit opt-in, and are never stored.
 */
export function CameraPanel({ onClose }: { onClose: () => void }) {
  const lang = useNazar((s) => s.lang);
  const api = useNazar((s) => s.apiStatus);
  const consent = useNazar((s) => s.consent);
  const setConsent = useNazar((s) => s.setConsent);
  const focus = useNazar((s) => s.focus);
  const set = useNazar((s) => s.set);
  const ar = lang === 'ar';
  const video = useRef<HTMLVideoElement>(null);
  const cam = useRef(new WebcamAdapter());
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frame, setFrame] = useState<{ url: string; blob: Blob; from: 'camera' | 'scene' } | null>(null);
  const [result, setResult] = useState<VisionResult | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const c = cam.current;
    return () => {
      c.disconnect();
      set({ captureLed: false });
    };
  }, [set]);
  useEffect(() => () => {
    if (frame) URL.revokeObjectURL(frame.url);
  }, [frame]);

  const start = async () => {
    setError(null);
    try {
      await cam.current.connect(video.current ?? undefined);
      setConsent({ camera: true });
      setLive(true);
      set({ captureLed: true });
    } catch {
      setError(ar ? 'تم رفض إذن الكاميرا أو أنها غير متاحة.' : 'Camera permission was denied or no camera is available.');
    }
  };
  const stop = () => {
    cam.current.disconnect();
    setLive(false);
    set({ captureLed: false });
  };
  const capture = async (from: 'camera' | 'scene') => {
    const blob = from === 'camera' ? await cam.current.captureFrame() : await new BrowserSimulatorAdapter().captureFrame();
    if (!blob) return;
    setResult(null);
    setFrame({ url: URL.createObjectURL(blob), blob, from });
  };
  const analyse = async () => {
    if (!frame) return;
    setBusy(true);
    setError(null);
    try {
      const r = await analyseImage(frame.blob, lang);
      setResult(r);
      if (r.entryId && r.status === 'confident') focus(r.entryId);
    } catch {
      setError(ar ? 'فشل التحليل — اختر المشهد يدوياً.' : 'Analysis failed — please choose the scene manually.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass w-full max-w-md rounded-3xl p-4" role="dialog" aria-label={ar ? 'الكاميرا' : 'Camera'} data-testid="camera-panel">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">{ar ? 'انظر بالكاميرا' : 'Look with your camera'}</h2>
        <button type="button" onClick={onClose} className="rounded-full px-2 py-1 text-sm text-ivory/70 hover:text-ivory" aria-label={ar ? 'إغلاق' : 'Close'}>
          ✕
        </button>
      </div>
      <p className="mt-1 text-xs text-ivory/60">
        {ar
          ? 'الكاميرا متوقفة حتى تشغّلها. لا تُرفع الصور إلا بموافقة منفصلة، ولا تُحفظ. لا نستخدم التعرّف على الوجوه.'
          : 'The camera stays off until you turn it on. Images are uploaded only with a separate opt-in, and are never stored. No face recognition.'}
      </p>
      <div className="relative mt-3 aspect-video overflow-hidden rounded-2xl bg-black/60">
        <video ref={video} className={`h-full w-full object-cover ${live ? '' : 'hidden'}`} playsInline muted aria-label="Camera preview" />
        {!live && <div className="flex h-full items-center justify-center text-xs text-ivory/60">{ar ? 'الكاميرا متوقفة' : 'Camera off'}</div>}
        {live && (
          <span className="absolute start-2 top-2 flex items-center gap-1.5 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-semibold text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> {ar ? 'الكاميرا تعمل' : 'CAMERA ON'}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {WebcamAdapter.supported() ? (
          live ? (
            <>
              <button type="button" onClick={() => capture('camera')} className="rounded-full bg-ivory px-3 py-1.5 text-xs font-semibold text-midnight">
                {ar ? 'التقط إطاراً' : 'Capture frame'}
              </button>
              <button type="button" onClick={stop} className="rounded-full border hairline px-3 py-1.5 text-xs">
                {ar ? 'أوقف الكاميرا' : 'Turn camera off'}
              </button>
            </>
          ) : (
            <button type="button" onClick={start} className="rounded-full bg-teal px-3 py-1.5 text-xs font-semibold text-midnight" data-testid="camera-start">
              {ar ? 'شغّل الكاميرا' : 'Turn camera on'}
            </button>
          )
        ) : (
          <span className="text-xs text-ivory/60">{ar ? 'الكاميرا غير مدعومة في هذا المتصفح.' : 'Camera is not supported in this browser.'}</span>
        )}
        <button type="button" onClick={() => capture('scene')} className="rounded-full border hairline px-3 py-1.5 text-xs" data-testid="capture-scene">
          {ar ? 'التقط من منظور النظارة المحاكى' : 'Capture simulated glasses POV'}
        </button>
      </div>
      {frame && (
        <div className="mt-3 rounded-2xl border hairline p-3">
          <div className="flex gap-3">
            <img src={frame.url} alt={ar ? 'الإطار الملتقط' : 'Captured frame'} className="h-20 w-32 rounded-lg object-cover" />
            <div className="text-xs text-ivory/70">
              <p>{frame.from === 'scene' ? (ar ? 'إطار من المشهد ثلاثي الأبعاد (محاكاة).' : 'Frame from the 3D scene (simulated POV).') : ar ? 'إطار من كاميرا جهازك.' : 'Frame from your device camera.'}</p>
              <p className="mt-1">{ar ? 'يبقى على جهازك ما لم توافق على الرفع.' : 'It stays on your device unless you opt in to upload.'}</p>
            </div>
          </div>
          <label className="mt-3 flex items-start gap-2 text-xs text-ivory/80">
            <input type="checkbox" checked={consent.imageUpload} onChange={(e) => setConsent({ imageUpload: e.target.checked })} className="mt-0.5 accent-teal" />
            <span>{ar ? 'أوافق على إرسال هذا الإطار إلى خادم نَظَر لتحليله مرة واحدة دون حفظه.' : 'I agree to send this one frame to the NAZAR server for analysis. It is not stored.'}</span>
          </label>
          <button
            type="button"
            onClick={analyse}
            disabled={!consent.imageUpload || !api.vision || busy}
            className="mt-2 rounded-full bg-teal px-3 py-1.5 text-xs font-semibold text-midnight disabled:opacity-40"
            data-testid="analyse"
          >
            {busy ? (ar ? 'جارٍ التحليل…' : 'Analysing…') : ar ? 'حلّل الإطار' : 'Analyse frame'}
          </button>
          {!api.vision && (
            <p className="mt-2 text-xs text-gold" data-testid="vision-unavailable">
              {ar
                ? 'الرؤية المباشرة تتطلب واجهة نَظَر البرمجية مع مفتاح مزوّد، وهي غير مفعّلة في هذا النشر. اختر المشهد يدوياً من النقاط التراثية.'
                : 'Live vision requires the NAZAR API with a provider key, which is not enabled on this deployment. Choose the scene manually from the heritage points.'}
            </p>
          )}
          {result && (
            <p className="mt-2 text-xs text-ivory/85" data-testid="vision-result">
              {result.entryId
                ? `${result.status === 'confident' ? (ar ? 'تم التعرّف:' : 'Recognised:') : ar ? 'غير متأكد — ربما:' : 'Not sure — possibly:'} ${ENTRY_BY_ID[result.entryId]?.name[lang]} (${Math.round(result.confidence * 100)}%)`
                : ar ? 'لم أتعرّف على معلم مدعوم. اختر المشهد يدوياً.' : 'No supported landmark recognised. Choose the scene manually.'}
            </p>
          )}
        </div>
      )}
      {error && <p className="mt-2 text-xs text-gold">{error}</p>}
    </div>
  );
}
