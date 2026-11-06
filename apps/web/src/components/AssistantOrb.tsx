import { motion } from 'framer-motion';
import { useNazar, useT } from '../store';

const COLORS = { idle: '#D9B98D', listening: '#35D6C3', thinking: '#D6A96B', speaking: '#35D6C3' };

/** NAZAR presence indicator — the four interaction states. */
export function AssistantOrb({ size = 44 }: { size?: number }) {
  const state = useNazar((s) => s.assistant);
  const t = useT();
  const c = COLORS[state];
  const label = { idle: t.idle, listening: t.listening, thinking: t.thinking, speaking: t.speaking }[state];
  return (
    <div className="flex items-center gap-2.5" role="status" aria-live="polite" data-testid="assistant-state" data-state={state}>
      <div className="relative" style={{ width: size, height: size }}>
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ border: `1.5px solid ${c}` }}
          animate={state === 'idle' ? { scale: 1, opacity: 0.5 } : { scale: [1, 1.35, 1], opacity: [0.8, 0.1, 0.8] }}
          transition={{ duration: state === 'thinking' ? 1.1 : 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute inset-[22%] rounded-full"
          style={{ background: `radial-gradient(circle at 35% 30%, #fff8, ${c})` }}
          animate={state === 'speaking' ? { scale: [1, 1.18, 0.95, 1.12, 1] } : state === 'thinking' ? { rotate: 360 } : { scale: 1 }}
          transition={{ duration: state === 'speaking' ? 0.9 : 2, repeat: state === 'idle' ? 0 : Infinity, ease: 'linear' }}
        />
      </div>
      <span className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: c }}>
        {label}
      </span>
    </div>
  );
}
