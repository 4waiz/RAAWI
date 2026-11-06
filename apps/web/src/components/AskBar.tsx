import { useState } from 'react';
import { useNazar, useT } from '../store';
import { ask, toggleListening } from '../lib/assistant';
import { sttSupported } from '../lib/speech';
import { AssistantOrb } from './AssistantOrb';

export function MicIcon({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" fill={active ? 'currentColor' : 'none'} />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
    </svg>
  );
}

/** Voice-first input with a text fallback. */
export function AskBar({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const state = useNazar((s) => s.assistant);
  const interim = useNazar((s) => s.interim);
  const consent = useNazar((s) => s.consent);
  const setConsent = useNazar((s) => s.setConsent);
  const lang = useNazar((s) => s.lang);
  const [text, setText] = useState('');
  const [askConsent, setAskConsent] = useState(false);
  const listening = state === 'listening';
  const canListen = sttSupported();

  const onMic = () => {
    if (!consent.microphone && !listening) {
      setAskConsent(true);
      return;
    }
    toggleListening();
  };

  return (
    <div className="w-full">
      {askConsent && (
        <div className="glass mb-2 rounded-2xl p-3 text-sm" role="dialog" aria-label="Microphone consent">
          <p className="text-ivory/90">
            {lang === 'ar'
              ? 'سيستخدم نَظَر الميكروفون فقط أثناء تفعيل زر التحدث. في Chrome تُعالَج الكلمات المنطوقة عبر خدمة التعرّف على الكلام في المتصفح. لا نحفظ أي تسجيل.'
              : "NAZAR uses your microphone only while the Talk button is active. In Chrome, speech is transcribed by the browser's speech service. NAZAR never stores recordings."}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="rounded-full bg-teal px-3 py-1.5 text-xs font-semibold text-midnight"
              onClick={() => {
                setConsent({ microphone: true });
                setAskConsent(false);
                toggleListening();
              }}
            >
              {lang === 'ar' ? 'السماح والبدء' : 'Allow & start'}
            </button>
            <button type="button" className="rounded-full border hairline px-3 py-1.5 text-xs" onClick={() => setAskConsent(false)}>
              {lang === 'ar' ? 'ليس الآن' : 'Not now'}
            </button>
          </div>
        </div>
      )}
      <form
        className="glass flex items-center gap-2 rounded-full p-1.5 ps-3"
        onSubmit={(e) => {
          e.preventDefault();
          const q = text;
          setText('');
          void ask(q, 'typed');
        }}
      >
        {!compact && <AssistantOrb size={30} />}
        <label htmlFor="ask-input" className="sr-only">
          {t.ask}
        </label>
        <input
          id="ask-input"
          data-testid="ask-input"
          value={listening ? interim : text}
          onChange={(e) => setText(e.target.value)}
          placeholder={listening ? `${t.listening}…` : t.askPlaceholder}
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[15px] text-ivory placeholder:text-ivory/55 focus:outline-none"
          dir="auto"
          autoComplete="off"
          maxLength={500}
          readOnly={listening}
        />
        <button
          type="button"
          onClick={onMic}
          disabled={!canListen}
          aria-pressed={listening}
          aria-label={listening ? t.stopListening : t.holdToTalk}
          title={canListen ? undefined : 'Speech recognition is not supported in this browser — please type.'}
          data-testid="mic-button"
          className={`relative flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
            listening ? 'bg-teal text-midnight' : 'border hairline text-ivory hover:border-teal'
          }`}
        >
          {listening && <span className="pulse-ring absolute inset-0 rounded-full border-2 border-teal" aria-hidden />}
          <MicIcon active={listening} />
          <span className="hidden sm:inline">{listening ? t.stopListening : t.holdToTalk}</span>
        </button>
        <button type="submit" data-testid="ask-submit" className="h-10 rounded-full bg-ivory px-4 text-sm font-semibold text-midnight transition hover:bg-sand disabled:opacity-40" disabled={listening || !text.trim()}>
          {t.send}
        </button>
      </form>
    </div>
  );
}
