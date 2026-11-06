import { useCallback, useEffect, useRef, useState } from 'react';
import { useNazar } from '../store';
import { PITCH_STEPS, resetDemo } from '../lib/pitch';
import { stopAudio, toggleListening } from '../lib/assistant';

/** Presenter console for /pitch-demo: step through a repeatable 60–90 s demo. */
export function PresenterPanel() {
  const lang = useNazar((s) => s.lang);
  const [step, setStep] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const running = useRef(0);

  const go = useCallback(async (i: number) => {
    if (i < 0 || i >= PITCH_STEPS.length) return;
    const token = ++running.current;
    setStep(i);
    setBusy(true);
    try {
      await PITCH_STEPS[i]!.run();
    } finally {
      if (token === running.current) setBusy(false);
    }
  }, []);

  const reset = useCallback(() => {
    running.current++;
    resetDemo();
    setStep(-1);
    setBusy(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === 'ArrowRight' || k === 'PageDown' || k === 'n') {
        e.preventDefault();
        void go(Math.min(step + 1, PITCH_STEPS.length - 1));
      } else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'p') {
        e.preventDefault();
        void go(Math.max(step - 1, 0));
      } else if (k === 'r' || k === 'R') reset();
      else if (k === 's' || k === 'S') stopAudio();
      else if (k === 'm' || k === 'M') toggleListening();
      else if (k === 'l' || k === 'L') {
        const s = useNazar.getState();
        s.setLang(s.lang === 'en' ? 'ar' : 'en');
      } else if (k === 'a' || k === 'A') {
        const s = useNazar.getState();
        s.set({ airflow: !s.airflow });
      } else if (k === 'g' || k === 'G') {
        const s = useNazar.getState();
        if (s.focusEntryId) s.set({ view: s.view === 'pov' ? 'orbit' : 'pov' });
      } else if (/^[1-8]$/.test(k)) void go(Number(k) - 1);
      else if (k === 'Escape') useNazar.getState().set({ overlay: null });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, reset, step]);

  const cur = step >= 0 ? PITCH_STEPS[step] : null;
  return (
    <section className="glass rounded-3xl p-3" aria-label="Presenter console" data-testid="presenter-panel">
      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold">{lang === 'ar' ? 'وحدة العرض' : 'Presenter console'}</p>
          <p className="text-xs text-ivory/55" data-testid="step-counter">
            {step < 0 ? (lang === 'ar' ? 'جاهز للبدء' : 'Ready') : `${step + 1} / ${PITCH_STEPS.length}`}
            {busy && ' · …'}
          </p>
        </div>
        <div className="flex gap-1.5">
          <button type="button" onClick={reset} className="rounded-full border hairline px-3 py-1.5 text-xs hover:border-teal" data-testid="pitch-reset">
            {lang === 'ar' ? 'إعادة ضبط' : 'Reset'}
          </button>
          <button type="button" onClick={() => void go(Math.max(step - 1, 0))} disabled={step <= 0} className="rounded-full border hairline px-3 py-1.5 text-xs disabled:opacity-30" aria-label="Previous step">
            ←
          </button>
          <button
            type="button"
            onClick={() => void go(Math.min(step + 1, PITCH_STEPS.length - 1))}
            disabled={step >= PITCH_STEPS.length - 1}
            className="rounded-full bg-teal px-4 py-1.5 text-xs font-semibold text-midnight disabled:opacity-30"
            data-testid="pitch-next"
          >
            {step < 0 ? (lang === 'ar' ? 'ابدأ' : 'Start') : lang === 'ar' ? 'التالي' : 'Next'} →
          </button>
          <button type="button" onClick={() => setCollapsed((c) => !c)} className="rounded-full px-2 text-xs text-ivory/60 lg:hidden" aria-expanded={!collapsed}>
            {collapsed ? '▾' : '▴'}
          </button>
        </div>
      </div>
      {cur && (
        <p className="mt-2 rounded-xl bg-ivory/[0.04] px-3 py-2 text-[13px] italic leading-snug text-ivory/80" data-testid="presenter-say" dir="ltr" lang="en">
          “{cur.say}”
        </p>
      )}
      {!collapsed && (
        <ol className="mt-2 grid gap-0.5">
          {PITCH_STEPS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => void go(i)}
                aria-current={i === step ? 'step' : undefined}
                className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-1.5 text-start text-[12.5px] transition ${i === step ? 'bg-teal/15 text-ivory' : i < step ? 'text-ivory/60 hover:bg-ivory/5' : 'text-ivory/80 hover:bg-ivory/5'}`}
              >
                <span className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${i === step ? 'border-teal text-teal' : 'hairline'}`}>{i + 1}</span>
                <span dir="auto">{s.title[lang]}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-2 px-1 text-[10.5px] leading-relaxed text-ivory/60">
        {lang === 'ar'
          ? '→/PageDown التالي · ← السابق · 1–8 قفز · R إعادة · M ميكروفون · S إيقاف الصوت · L اللغة · A الهواء · G النظارة'
          : '→/PageDown next · ← back · 1–8 jump · R reset · M mic · S stop audio · L language · A airflow · G glasses view. Questions are scripted prompts; the answers are produced live by the knowledge engine.'}
      </p>
    </section>
  );
}
