import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { useNazar } from '../store';

export default function Privacy() {
  const lang = useNazar((s) => s.lang);
  useEffect(() => {
    document.title = 'Privacy — NAZAR';
  }, []);
  const ar = lang === 'ar';
  const sections = ar
    ? [
        ['الميكروفون', 'متوقف افتراضياً. يُطلب الإذن عند أول ضغطة على «تحدّث»، ويستمع فقط أثناء تفعيل الزر. يستخدم التعرّف على الكلام واجهة Web Speech في متصفحك؛ في Chrome تُرسل المقاطع الصوتية إلى خدمة الكلام لدى مزوّد المتصفح. نَظَر لا يحفظ أي تسجيل.'],
        ['الكاميرا', 'متوقفة حتى تشغّلها بنفسك، مع مؤشر مرئي أثناء العمل. تبقى الإطارات على جهازك. لا يُرسل إطار للتحليل إلا بعد موافقة منفصلة، ولا يُحفظ على الخادم.'],
        ['الوجوه والبيانات البيومترية', 'لا تعرّف على الوجوه ولا تعرّف بيومتري. تعليمات نموذج الرؤية تمنع وصف الأشخاص.'],
        ['ذاكرة المحادثة', 'تبقى في ذاكرة المتصفح لهذه الجلسة فقط، ويمكن مسحها بزر «مسح الذاكرة». لا حسابات ولا ملفات تعريف تتبّع.'],
        ['الخادم الاختياري', 'عند تفعيل الذكاء الاصطناعي المباشر، يُرسل نص السؤال وسياق المعلم إلى عامل Cloudflare، الذي يستدعي مزوّد النموذج بمفاتيح مخزّنة كأسرار على الخادم فقط. نشر GitHub Pages الحالي لا يستخدم أي خادم.'],
        ['المصادر وعدم اليقين', 'كل إجابة مرتبطة بمصادر منشورة، وتُذكر حالات عدم اليقين صراحة، ويعتذر نَظَر عندما لا تتوفر أدلة موثوقة.'],
      ]
    : [
        ['Microphone', "Off by default. Permission is requested the first time you press Talk, and NAZAR listens only while Talk is active. Speech recognition uses your browser's Web Speech API; in Chrome, audio is sent to the browser vendor's speech service for transcription. NAZAR never stores recordings."],
        ['Camera', 'Off until you turn it on, with a visible indicator while active. Frames stay on your device. A frame is sent for analysis only after a separate, explicit opt-in, and is never stored on the server.'],
        ['Faces & biometrics', 'No face recognition or biometric identification. The vision prompt instructs the model not to describe people.'],
        ['Conversation memory', 'Held in browser memory for this session only and cleared with “Clear memory”. No accounts, no tracking cookies, no analytics.'],
        ['Optional server', 'When live AI is enabled, the question text and landmark context are sent to a Cloudflare Worker, which calls the model provider with keys stored only as server-side secrets. The current GitHub Pages deployment uses no server at all.'],
        ['Sources & uncertainty', 'Every answer links to published sources, uncertainty is stated explicitly, and NAZAR declines when reliable evidence is absent.'],
      ];
  return (
    <div className="min-h-[100dvh] bg-midnight">
      <Nav />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-10">
        <h1 className="font-display text-5xl text-ivory">{ar ? 'الخصوصية والثقة' : 'Privacy & trust'}</h1>
        <p className="mt-3 text-ivory/70">{ar ? 'الثقة جزء من المنتج. هذا ما يفعله نَظَر — وما لا يفعله.' : 'Trust is a product feature. Here is exactly what NAZAR does — and does not do.'}</p>
        <dl className="mt-10 divide-y divide-[rgba(217,185,141,0.16)]">
          {sections.map(([h, d]) => (
            <div key={h} className="grid gap-2 py-5 sm:grid-cols-[200px_1fr]">
              <dt className="font-display text-xl text-gold">{h}</dt>
              <dd className="text-[15px] leading-relaxed text-ivory/80">{d}</dd>
            </div>
          ))}
        </dl>
        <Link to="/experience" className="mt-8 inline-flex rounded-full bg-ivory px-5 py-2.5 text-sm font-semibold text-midnight">
          {ar ? 'ادخل التجربة' : 'Enter the Experience'}
        </Link>
      </main>
    </div>
  );
}
