import { Html } from '@react-three/drei';
import { ENTRIES } from '@nazar/core';
import { useNazar } from '../store';

/** Accessible HTML hotspot buttons anchored to 3D positions (keyboard focusable). */
export function Hotspots() {
  const focusEntryId = useNazar((s) => s.focusEntryId);
  const lang = useNazar((s) => s.lang);
  const view = useNazar((s) => s.view);
  const focus = useNazar((s) => s.focus);
  if (view === 'pov' && focusEntryId) return null;
  return (
    <>
      {ENTRIES.map((e) => {
        const active = e.id === focusEntryId;
        return (
          <Html key={e.id} position={e.hotspot.position} center zIndexRange={[15, 0]}>
            <button
              type="button"
              onClick={() => focus(e.id)}
              aria-pressed={active}
              aria-label={`${lang === 'ar' ? 'انظر إلى' : 'Look at'} ${e.name[lang]}`}
              className={`group flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-xs font-medium shadow-xl transition ${
                active ? 'border-teal bg-midnight/90 text-ivory' : 'border-gold/40 bg-midnight/70 text-ivory/90 hover:border-teal'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-teal/70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal" />
              </span>
              <span className={lang === 'ar' ? 'font-arabic' : ''}>{e.name[lang].split('—')[0]}</span>
            </button>
          </Html>
        );
      })}
    </>
  );
}
