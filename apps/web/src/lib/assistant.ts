import { answerQuestion, detectLanguage, type Answer } from '@nazar/core';
import { useNazar, type TurnSource } from '../store';
import { askRemote } from './api';
import { hasVoiceFor, speak, stopSpeaking, ttsSupported, startListening, stopListening } from './speech';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let askSeq = 0;

export interface Notice {
  kind: 'info' | 'warn';
  text: string;
}
type NoticeListener = (n: Notice | null) => void;
const listeners = new Set<NoticeListener>();
export const onNotice = (l: NoticeListener) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const notify = (n: Notice | null) => listeners.forEach((l) => l(n));

/** LOOK → ASK → UNDERSTAND: run one question through the knowledge layer and speak the answer. */
export async function ask(question: string, source: TurnSource = 'typed'): Promise<Answer | null> {
  const q = question.trim();
  if (!q) return null;
  const seq = ++askSeq;
  stopSpeaking();
  const s = useNazar.getState();
  const lang = detectLanguage(q, s.lang);
  s.addVisitorTurn(q, lang, source);
  s.setAssistant('thinking');
  s.setInterim('');

  let answer: Answer;
  const pacing = sleep(source === 'scripted' ? 650 : 400);
  if (s.apiStatus.live) {
    try {
      const res = await askRemote(q, s.lang, s.ctx);
      answer = res.answer;
    } catch {
      answer = answerQuestion(q, useNazar.getState().ctx, { preferredLang: s.lang });
      notify({ kind: 'warn', text: s.lang === 'ar' ? 'تعذّر الوصول إلى الذكاء الاصطناعي المباشر — تم استخدام المعرفة المنسّقة.' : 'Live AI unreachable — answered from curated knowledge.' });
    }
  } else {
    answer = answerQuestion(q, s.ctx, { preferredLang: s.lang });
  }
  await pacing;
  if (seq !== askSeq) return null;

  const st = useNazar.getState();
  st.addAnswer(q, answer);
  // Contextual 3D: move the camera when the visitor names a different landmark.
  if (answer.entryId && answer.entryId !== st.focusEntryId && answer.trace.entityReason === 'explicit') {
    st.focus(answer.entryId, { keepContext: true });
  }
  // Show the airflow cutaway whenever NAZAR explains how the barjeel cools.
  if (answer.qaId === 'barjeel-cooling' || answer.qaId === 'barjeel-why-design') st.set({ airflow: true });

  await speakAnswer(answer);
  return answer;
}

export async function speakAnswer(answer: Answer) {
  const st = useNazar.getState();
  if (st.muted || !ttsSupported()) {
    st.setAssistant('idle');
    if (!ttsSupported()) notify({ kind: 'info', text: 'Speech output is not supported in this browser — captions shown instead.' });
    return;
  }
  if (!hasVoiceFor(answer.lang)) {
    notify({
      kind: 'info',
      text: answer.lang === 'ar' ? 'لا يوجد صوت عربي مثبت على هذا الجهاز — سيُستخدم الصوت الافتراضي مع الترجمة النصية.' : 'No matching voice installed — using the default voice with captions.',
    });
  }
  st.setAssistant('speaking');
  const ok = await speak(answer.spoken, answer.lang);
  if (!ok) notify({ kind: 'info', text: answer.lang === 'ar' ? 'تعذّر تشغيل الصوت — الترجمة النصية معروضة.' : 'Audio could not play — captions are shown.' });
  if (useNazar.getState().assistant === 'speaking') useNazar.getState().setAssistant('idle');
}

export function replayLast() {
  const last = [...useNazar.getState().turns].reverse().find((t) => t.answer);
  if (last?.answer) void speakAnswer(last.answer);
}

export function stopAudio() {
  stopSpeaking();
  const st = useNazar.getState();
  if (st.assistant === 'speaking') st.setAssistant('idle');
}

/** Push-to-talk. Mic is used only while listening; the browser shows its own indicator too. */
export function toggleListening(): 'started' | 'stopped' | 'unsupported' {
  const st = useNazar.getState();
  if (st.assistant === 'listening') {
    stopListening();
    return 'stopped';
  }
  stopSpeaking();
  let gotFinal = false;
  st.setAssistant('listening');
  startListening(st.lang, {
    onInterim: (t) => useNazar.getState().setInterim(t),
    onFinal: (t) => {
      gotFinal = true;
      void ask(t, 'voice');
    },
    onError: (code) => {
      const ar = useNazar.getState().lang === 'ar';
      const msg =
        code === 'not-allowed' || code === 'service-not-allowed'
          ? ar ? 'تم رفض إذن الميكروفون — يمكنك الكتابة بدلاً من ذلك.' : 'Microphone permission was denied — you can type instead.'
          : code === 'unsupported'
            ? ar ? 'التعرّف على الكلام غير مدعوم في هذا المتصفح — استخدم الكتابة.' : 'Speech recognition is not supported in this browser — please type.'
            : code === 'no-speech'
              ? ar ? 'لم أسمع شيئاً — حاول مجدداً.' : "I didn't catch that — try again."
              : ar ? 'تعذّر الاستماع — استخدم الكتابة.' : 'Listening failed — please type your question.';
      notify({ kind: 'warn', text: msg });
    },
    onEnd: () => {
      const s2 = useNazar.getState();
      if (!gotFinal && s2.assistant === 'listening') s2.setAssistant('idle');
      s2.setInterim('');
    },
  });
  return 'started';
}
