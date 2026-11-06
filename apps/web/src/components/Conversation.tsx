import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Answer, Source } from '@nazar/core';
import { useNazar, useT, type UITurn } from '../store';
import { ask, replayLast, stopAudio } from '../lib/assistant';

function ConfidenceBadge({ answer }: { answer: Answer }) {
  const t = useT();
  const map = {
    verified: { cls: 'border-teal/50 text-teal', label: t.verified },
    qualified: { cls: 'border-gold/60 text-gold', label: t.qualified },
    declined: { cls: 'border-ivory/30 text-ivory/70', label: t.declined },
  } as const;
  const m = map[answer.confidence];
  return (
    <div className="flex flex-wrap items-center gap-1.5" data-testid="answer-confidence" data-confidence={answer.confidence}>
      <span className={`rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${m.cls}`}>{m.label}</span>
      <span
        className={`rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${answer.mode === 'live-ai' ? 'border-teal/60 bg-teal/10 text-teal' : 'border-sand/40 text-sand'}`}
        data-testid="answer-mode"
      >
        {answer.mode === 'live-ai' ? t.liveMode : t.curatedMode}
      </span>
    </div>
  );
}

export function SourceCards({ sources, highlight = false }: { sources: Source[]; highlight?: boolean }) {
  const t = useT();
  if (!sources.length) return null;
  return (
    <div className={`mt-3 rounded-xl ${highlight ? 'ring-2 ring-teal/70 ring-offset-2 ring-offset-midnight' : ''}`} data-testid="source-cards">
      <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ivory/60">{t.sources}</p>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-1.5">
        {sources.map((s) => (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 rounded-lg border hairline bg-ivory/[0.03] px-2.5 py-2 text-xs transition hover:border-teal/50"
            >
              <span className={`mt-0.5 shrink-0 rounded px-1 text-[9.5px] font-bold uppercase ${s.type === 'secondary' ? 'bg-ivory/10 text-ivory/60' : s.type === 'unesco' ? 'bg-teal/15 text-teal' : 'bg-gold/15 text-gold'}`}>
                {s.type === 'unesco' ? 'UNESCO' : s.type === 'official' ? 'Official' : 'Ref'}
              </span>
              <span className="min-w-0 flex-1 text-start" dir="ltr">
                <span className="block truncate font-medium text-ivory group-hover:text-teal">{s.title}</span>
                <span className="block truncate text-ivory/60">{s.publisher}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnswerCard({ turn, latest }: { turn: UITurn; latest: boolean }) {
  const t = useT();
  const answer = turn.answer!;
  const highlight = useNazar((s) => s.highlight);
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border hairline bg-midnight-700/60 p-3.5" data-testid="answer-card" lang={answer.lang} dir={answer.lang === 'ar' ? 'rtl' : 'ltr'}>
      <ConfidenceBadge answer={answer} />
      <p className={`mt-2 text-[15px] leading-relaxed text-ivory ${answer.lang === 'ar' ? 'font-arabic text-[16px] leading-loose' : ''}`} data-testid="answer-text">
        {answer.spoken}
      </p>
      {answer.uncertainty && (
        <p className="mt-2 rounded-lg bg-gold/10 px-2.5 py-1.5 text-xs text-gold">
          <span className="font-semibold">{t.uncertainty}: </span>
          {answer.uncertainty}
        </p>
      )}
      {answer.detail && answer.detail !== answer.spoken && (
        <div className="mt-2">
          <button type="button" onClick={() => setOpen((o) => !o)} className="text-xs text-teal hover:underline" aria-expanded={open}>
            {t.details} {open ? '−' : '+'}
          </button>
          {open && <p className="mt-1.5 text-[13px] leading-relaxed text-ivory/75">{answer.detail}</p>}
        </div>
      )}
      <SourceCards sources={answer.sources} highlight={latest && highlight === 'sources'} />
      {latest && answer.suggestions.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ivory/60">{t.suggestions}</p>
          <div className="flex flex-wrap gap-1.5">
            {answer.suggestions.map((s) => (
              <button key={s} type="button" onClick={() => void ask(s, 'suggestion')} className="rounded-full border hairline px-2.5 py-1 text-xs text-ivory/85 transition hover:border-teal hover:text-ivory">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ConversationPanel({ className = '' }: { className?: string }) {
  const t = useT();
  const turns = useNazar((s) => s.turns);
  const muted = useNazar((s) => s.muted);
  const set = useNazar((s) => s.set);
  const clearMemory = useNazar((s) => s.clearMemory);
  const assistant = useNazar((s) => s.assistant);
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Scroll only the transcript container — never the page (important on mobile).
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [turns.length, assistant]);
  const lastNazar = [...turns].reverse().find((x) => x.role === 'nazar')?.id;
  const sourceLabel = (s?: string) => (s === 'scripted' ? t.scripted : s === 'voice' ? t.voice : s === 'typed' || s === 'suggestion' ? t.typed : '');

  return (
    <section className={`glass flex min-h-0 flex-col rounded-3xl ${className}`} aria-label={t.transcript}>
      <div className="flex items-center justify-between gap-2 border-b hairline px-4 py-3">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory/60">{t.transcript}</h2>
        </div>
        <div className="flex items-center gap-1">
          <IconButton label={t.stopAudio} onClick={stopAudio} disabled={assistant !== 'speaking'} testid="stop-audio">
            <path d="M7 7h10v10H7z" fill="currentColor" />
          </IconButton>
          <IconButton label={t.replay} onClick={replayLast} disabled={!lastNazar} testid="replay">
            <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" strokeLinecap="round" strokeLinejoin="round" />
          </IconButton>
          <IconButton label={muted ? t.unmute : t.mute} onClick={() => set({ muted: !muted })} pressed={muted} testid="mute">
            {muted ? <path d="M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6" strokeLinecap="round" /> : <path d="M4 9h4l5-4v14l-5-4H4zM17 8a5 5 0 0 1 0 8" strokeLinecap="round" />}
          </IconButton>
          <IconButton label={t.clearMemory} onClick={clearMemory} disabled={!turns.length} testid="clear-memory">
            <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" strokeLinecap="round" strokeLinejoin="round" />
          </IconButton>
        </div>
      </div>
      <p className="px-4 pt-2.5 text-[11px] leading-snug text-ivory/60">{t.transcriptNote}</p>
      <div ref={scroller} className="scroll-thin min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3" data-testid="transcript">
        {turns.length === 0 && <p className="py-6 text-center text-sm text-ivory/55">{t.empty}</p>}
        <AnimatePresence initial={false}>
          {turns.map((turn) => (
            <motion.div key={turn.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {turn.role === 'visitor' ? (
                <div className="flex flex-col items-end" data-testid="visitor-turn">
                  <p className="max-w-[85%] rounded-2xl rounded-ee-sm bg-ivory/10 px-3 py-2 text-sm text-ivory" dir="auto">
                    {turn.text}
                  </p>
                  {turn.source && <span className="mt-1 text-[10px] uppercase tracking-wider text-ivory/60">{sourceLabel(turn.source)}</span>}
                </div>
              ) : (
                <AnswerCard turn={turn} latest={turn.id === lastNazar} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {assistant === 'thinking' && (
          <div className="flex gap-1 px-1 py-2" aria-label={t.thinking}>
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-gold" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function IconButton({ label, onClick, children, disabled, pressed, testid }: { label: string; onClick: () => void; children: React.ReactNode; disabled?: boolean; pressed?: boolean; testid?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      data-testid={testid}
      className="flex h-8 w-8 items-center justify-center rounded-full text-ivory/75 transition hover:bg-ivory/10 hover:text-ivory disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
