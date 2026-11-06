import { lazy, Suspense, useState } from 'react';
import { ENTRY_BY_ID } from '@nazar/core';
import { useNazar, useT } from '../store';
import { Nav } from './Nav';
import { StatusBadges } from './StatusBadges';
import { ConversationPanel } from './Conversation';
import { AskBar } from './AskBar';
import { GlassesFrame } from './GlassesFrame';
import { SceneToolbar, StationList } from './SceneControls';
import { CameraPanel } from './CameraPanel';
import { ArchitectureOverlay, TrustOverlay } from './Overlays';
import { PresenterPanel } from './PresenterPanel';
import { supportsWebGL } from '../lib/webgl';

const World = lazy(() => import('../scene/World'));

function SceneLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-midnight" role="status">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ivory/60">Loading Al Fahidi…</p>
      </div>
    </div>
  );
}

function NoWebGL() {
  return (
    <div className="flex h-full items-center justify-center bg-midnight p-6 text-center">
      <p className="max-w-sm text-sm text-ivory/70">
        3D isn’t available on this device (WebGL is disabled). You can still choose a heritage point and talk to NAZAR — every answer works without the 3D view.
      </p>
    </div>
  );
}

export function ExperienceShell({ presenter = false }: { presenter?: boolean }) {
  const t = useT();
  const lang = useNazar((s) => s.lang);
  const focusEntryId = useNazar((s) => s.focusEntryId);
  const overlay = useNazar((s) => s.overlay);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [webgl] = useState(() => supportsWebGL());
  const focused = focusEntryId ? ENTRY_BY_ID[focusEntryId] : null;

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col bg-midnight lg:block lg:h-[100dvh] lg:overflow-hidden">
      <a href="#ask-input" className="skip-link">
        Skip to question box
      </a>
      <Nav overlay />
      <main id="main" className="contents">
        {/* 3D world */}
        <div className="relative order-1 h-[55dvh] w-full lg:absolute lg:inset-0 lg:h-full" data-testid="scene" role="group" aria-label="Interactive 3D world: stylised interpretation of Al Fahidi, the majlis, Sheikh Zayed Grand Mosque and Al Ain Oasis">
          {webgl ? (
            <Suspense fallback={<SceneLoading />}>
              <World />
            </Suspense>
          ) : (
            <NoWebGL />
          )}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-midnight/85 to-transparent" />
          <GlassesFrame />
          {overlay === 'architecture' && <ArchitectureOverlay />}
          {overlay === 'trust' && <TrustOverlay />}
          <p className="pointer-events-none absolute inset-x-0 bottom-1 z-10 text-center text-[10px] text-ivory/60">
            {lang === 'ar' ? 'مشهد تفسيري مبسّط — ليس إعادة بناء أثرية دقيقة.' : 'Stylised educational interpretation — not an archaeologically exact reconstruction.'}
          </p>
        </div>

        {/* left column */}
        <aside className="order-4 z-20 grid gap-3 pb-6 px-4 pt-4 lg:absolute lg:start-4 lg:top-16 lg:max-h-[calc(100dvh-8rem)] lg:w-[300px] lg:overflow-y-auto lg:px-0 lg:pt-2 scroll-thin">
          {presenter ? <PresenterPanel /> : <StatusBadges />}
          <div className="glass rounded-3xl p-2">
            {presenter ? (
              <details>
                <summary className="cursor-pointer px-3 py-2 text-[12px] text-ivory/70">{lang === 'ar' ? 'المشهد والنقاط التراثية' : 'Scene & heritage points'}</summary>
                <StationList />
                <div className="my-2 border-t hairline" />
                <SceneToolbar />
              </details>
            ) : (
              <>
                <StationList />
                <div className="my-2 border-t hairline" />
                <SceneToolbar />
              </>
            )}
            <button
              type="button"
              onClick={() => setCameraOpen(true)}
              className="mt-2 w-full rounded-xl border hairline px-3 py-2 text-start text-[13px] text-ivory/80 transition hover:border-teal"
              data-testid="open-camera"
            >
              {lang === 'ar' ? '📷 انظر بالكاميرا (بموافقة)' : '📷 Look with camera (consent)'}
            </button>
          </div>
          {presenter && <StatusBadges />}
        </aside>

        {/* conversation */}
        <div className="order-3 z-20 px-4 pt-3 lg:absolute lg:end-4 lg:top-16 lg:bottom-24 lg:w-[400px] lg:px-0 lg:pt-2">
          <ConversationPanel className="h-[60dvh] lg:h-full" />
        </div>

        {/* ask bar */}
        <div className="sticky bottom-0 order-2 z-30 bg-gradient-to-t from-midnight via-midnight/95 to-midnight/0 px-4 pb-4 pt-3 lg:bg-none lg:absolute lg:inset-x-0 lg:bottom-4 lg:mx-auto lg:w-[min(680px,calc(100%-760px))] lg:min-w-[440px] lg:px-0 lg:pb-0">
          {focused && (
            <p className="mx-auto mb-2 w-fit rounded-full bg-midnight/80 px-3 py-1 text-center text-xs text-ivory/80 backdrop-blur" data-testid="focus-label">
              <span className="text-ivory/70">{t.lookingAt}: </span>
              <span className="text-gold">{focused.name[lang]}</span>
            </p>
          )}
          <AskBar />
        </div>
      </main>

      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/70 p-4 backdrop-blur-sm">
          <CameraPanel onClose={() => setCameraOpen(false)} />
        </div>
      )}
    </div>
  );
}
