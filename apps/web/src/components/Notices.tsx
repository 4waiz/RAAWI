import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { onNotice, type Notice } from '../lib/assistant';

export function Notices() {
  const [n, setN] = useState<Notice | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const off = onNotice((x) => {
      setN(x);
      clearTimeout(timer);
      timer = setTimeout(() => setN(null), 5000);
    });
    return () => {
      off();
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4" aria-live="assertive">
      <AnimatePresence>
        {n && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`glass pointer-events-auto max-w-md rounded-2xl px-4 py-2.5 text-sm ${n.kind === 'warn' ? 'text-gold' : 'text-ivory'}`}
            role="alert"
          >
            {n.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
