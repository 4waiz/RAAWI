import { ENTRIES } from '@nazar/core';
import { useNazar, useT } from '../store';

function Toggle({ label, on, onClick, testid, disabled }: { label: string; on: boolean; onClick: () => void; testid?: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      disabled={disabled}
      data-testid={testid}
      className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-start text-[13px] transition disabled:opacity-35 ${on ? 'bg-teal/15 text-ivory' : 'text-ivory/75 hover:bg-ivory/5'}`}
    >
      <span>{label}</span>
      <span className={`relative h-4 w-7 shrink-0 rounded-full transition ${on ? 'bg-teal' : 'bg-ivory/20'}`}>
        <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-midnight transition-all ${on ? 'start-3.5' : 'start-0.5'}`} />
      </span>
    </button>
  );
}

/** Keyboard/touch accessible scene navigation — mirrors the 3D hotspots. */
export function StationList() {
  const t = useT();
  const lang = useNazar((s) => s.lang);
  const focusEntryId = useNazar((s) => s.focusEntryId);
  const overview = useNazar((s) => s.overview);
  const focus = useNazar((s) => s.focus);
  const showOverview = useNazar((s) => s.showOverview);
  return (
    <nav aria-label={t.stations} className="grid gap-1">
      <p className="px-3 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-ivory/60">{t.stations}</p>
      <button
        type="button"
        onClick={showOverview}
        aria-pressed={overview}
        className={`rounded-xl px-3 py-2 text-start text-[13px] transition ${overview ? 'bg-ivory/10 text-ivory' : 'text-ivory/75 hover:bg-ivory/5'}`}
      >
        {lang === 'ar' ? 'نظرة عامة على العالم' : 'World overview'}
      </button>
      {ENTRIES.map((e, i) => (
        <button
          key={e.id}
          type="button"
          onClick={() => focus(e.id)}
          aria-pressed={focusEntryId === e.id}
          data-testid={`station-${e.id}`}
          className={`group rounded-xl px-3 py-2 text-start transition ${focusEntryId === e.id ? 'bg-teal/15' : 'hover:bg-ivory/5'}`}
        >
          <span className="block text-[13px] text-ivory">{e.name[lang].split('—')[0]}</span>
          <span className="block text-[11px] text-ivory/60">
            {e.location[lang]}
            {i === 3 ? (lang === 'ar' ? ' · إضافي' : ' · bonus') : ''}
          </span>
        </button>
      ))}
    </nav>
  );
}

export function SceneToolbar() {
  const t = useT();
  const s = useNazar();
  const onBarjeel = s.focusEntryId === 'barjeel-al-fahidi' || s.overview;
  return (
    <div className="grid gap-0.5">
      <Toggle
        label={t.glassesView}
        on={s.view === 'pov'}
        disabled={!s.focusEntryId}
        onClick={() => s.set({ view: s.view === 'pov' ? 'orbit' : 'pov' })}
        testid="toggle-pov"
      />
      <Toggle
        label={t.airflow}
        on={s.airflow}
        disabled={!onBarjeel}
        onClick={() => {
          if (!s.airflow && s.focusEntryId !== 'barjeel-al-fahidi') s.focus('barjeel-al-fahidi');
          useNazar.getState().set({ airflow: !s.airflow });
        }}
        testid="toggle-airflow"
      />
      <Toggle label={`${t.thenNow}: ${s.thenNow === 'then' ? t.then : t.now}`} on={s.thenNow === 'now'} onClick={() => s.set({ thenNow: s.thenNow === 'then' ? 'now' : 'then' })} testid="toggle-thennow" />
      <Toggle
        label={t.perfLow}
        on={s.perfLow}
        onClick={() => {
          const v = !s.perfLow;
          s.set({ perfLow: v });
          try {
            localStorage.setItem('nazar.perfLow', v ? '1' : '0');
          } catch {
            /* ignore */
          }
        }}
        testid="toggle-perf"
      />
      <label className="mt-1 flex items-center justify-between gap-2 px-3 py-1.5 text-[12px] text-ivory/70">
        <span>{s.lang === 'ar' ? 'الجهاز' : 'Device'}</span>
        <select
          value={s.device}
          onChange={(e) => s.set({ device: e.target.value as typeof s.device })}
          className="rounded-lg border hairline bg-midnight px-2 py-1 text-[12px] text-ivory"
        >
          <option value="rayban-meta">Ray-Ban Meta (audio)</option>
          <option value="display-concept">{s.lang === 'ar' ? 'نظارة بشاشة (مفهوم)' : 'Display glasses (concept)'}</option>
        </select>
      </label>
    </div>
  );
}
