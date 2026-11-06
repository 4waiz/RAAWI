import { AnimatePresence, motion } from 'framer-motion';
import { useNazar } from '../store';

/**
 * Simulated wearable point of view. Ray-Ban Meta is displayless: NAZAR answers by audio only,
 * so nothing is drawn "on the lens" in that profile. The display profile is a labelled concept.
 */
export function GlassesFrame() {
  const view = useNazar((s) => s.view);
  const overview = useNazar((s) => s.overview);
  const device = useNazar((s) => s.device);
  const led = useNazar((s) => s.captureLed);
  const assistant = useNazar((s) => s.assistant);
  const lang = useNazar((s) => s.lang);
  const turns = useNazar((s) => s.turns);
  const ar = lang === 'ar';
  const lastAnswer = [...turns].reverse().find((x) => x.answer)?.answer;
  if (view !== 'pov' || overview) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10" data-testid="glasses-frame">
      {/* soft lens vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 78% at 50% 48%, transparent 58%, rgba(7,17,28,0.55) 82%, rgba(7,17,28,0.92) 100%)' }}
      />
      {/* status chips: capture LED (real Ray-Ban Meta glasses show a front LED to bystanders) + device profile */}
      <div className="absolute inset-x-0 bottom-[8.5rem] flex flex-wrap justify-center gap-2 px-4 lg:bottom-[7.75rem]">
        <span className="flex items-center gap-2 rounded-full bg-midnight/75 px-2.5 py-1 text-[11px] text-ivory/85" data-testid="capture-led" data-on={led}>
          <span className={`h-2 w-2 rounded-full ${led ? 'bg-ivory shadow-[0_0_10px_3px_rgba(255,255,255,0.8)]' : 'bg-ivory/25'}`} />
          {led ? (ar ? 'مؤشر الالتقاط: نشط (محاكاة)' : 'Capture LED on (simulated)') : ar ? 'الكاميرا متوقفة' : 'Camera idle'}
        </span>
        <span className="rounded-full border border-gold/40 bg-midnight/75 px-2.5 py-1 text-[11px] text-gold">
          {device === 'rayban-meta' ? (ar ? 'محاكاة Ray-Ban Meta · صوت فقط' : 'Simulated Ray-Ban Meta POV · audio-only') : ar ? 'مفهوم نظارة بشاشة · مخطط' : 'Display-glasses concept · Planned'}
        </span>
      </div>
      {/* audio-only cue: an earcon-style indicator near the temple, not a HUD */}
      <AnimatePresence>
        {device === 'rayban-meta' && (assistant === 'speaking' || assistant === 'listening') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-[10.5rem] start-1/2 flex -translate-x-1/2 items-center rtl:translate-x-1/2 gap-2 rounded-full bg-midnight/75 px-3 py-1.5 text-[11px] text-teal"
          >
            <span className="flex items-end gap-0.5" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <motion.span key={i} className="w-0.5 rounded bg-teal" animate={{ height: [4, 12, 6, 10, 4] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }} />
              ))}
            </span>
            {assistant === 'speaking' ? (ar ? 'صوت عبر مكبرات النظارة' : 'Audio via open-ear speakers') : ar ? 'الميكروفونات تستمع' : 'Mics listening'}
          </motion.div>
        )}
      </AnimatePresence>
      {device === 'display-concept' && lastAnswer && (
        <div className="absolute end-[18%] top-[30%] w-56 rounded-xl border border-teal/40 bg-midnight/70 p-2.5 text-[11px] text-ivory" dir="auto">
          <p className="mb-1 text-[9px] uppercase tracking-widest text-teal">{ar ? 'مفهوم — غير منفّذ' : 'Concept — not implemented'}</p>
          {lastAnswer.spoken.split(/[.؟?]/)[0]}
        </div>
      )}
    </div>
  );
}
