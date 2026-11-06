import { lazy, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ENTRY_BY_ID } from '@nazar/core';
import { Nav } from '../components/Nav';
import { useNazar, useT } from '../store';
import { supportsWebGL } from '../lib/webgl';

const HeroScene = lazy(() => import('../scene/HeroScene'));
const TEAM = ['Awaiz Ahmed', 'Mohammad Umar', 'Bilal Feroz', 'Huda Mueen'];

const fade = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.6 } };

export default function Landing() {
  const t = useT();
  const lang = useNazar((s) => s.lang);
  const ar = lang === 'ar';
  useEffect(() => {
    document.title = 'NAZAR — The Living Memory of the UAE';
  }, []);
  const barjeel = ENTRY_BY_ID['barjeel-al-fahidi']!;
  const overview = barjeel.qa.find((q) => q.id === 'barjeel-overview')!;
  const cooling = barjeel.qa.find((q) => q.id === 'barjeel-cooling')!;

  const steps = ar
    ? [
        ['انظر', 'انظر إلى معلم أو قطعة تراثية. يعرف نَظَر ما أمامك.'],
        ['اسأل', 'اسأل بطبيعية، بالعربية أو الإنجليزية، دون أن تلمس هاتفك.'],
        ['افهم', 'اسمع إجابة قصيرة موثّقة بالمصادر، مع ذكر عدم اليقين.'],
        ['استكشف', 'تابع بأسئلة مثل «لماذا؟» — نَظَر يتذكّر ما تتحدث عنه.'],
      ]
    : [
        ['Look', 'Look at a landmark or artifact. NAZAR knows what is in front of you.'],
        ['Ask', 'Ask naturally, in English or Arabic — hands-free, phone in pocket.'],
        ['Understand', 'Hear a short, sourced answer, with uncertainty stated honestly.'],
        ['Explore', 'Follow up with “why?” or “tell me more” — NAZAR remembers the thread.'],
      ];

  const different = ar
    ? [
        ['صُمّم للنظارات أولاً', 'تفاعل صوتي دون استخدام اليدين. الشاشة اختيارية، لا شرط.'],
        ['معرفة موثوقة', 'إجابات من مصادر تراثية منسّقة مع روابط ظاهرة، ويعتذر حين لا يعرف.'],
        ['ذاكرة سياقية', '«هو» تعني البرجيل. «لماذا؟» تتابع آخر إجابة.'],
        ['ثنائي اللغة بأصالة', 'عربية سليمة واتجاه من اليمين لليسار، لا ترجمة آلية لاحقة.'],
        ['إمكانية الوصول', 'كلام منطوق للزوار ونصوص مقروءة للجميع.'],
        ['عالم ثلاثي الأبعاد', 'شاهد كيف يحرّك البرجيل الهواء — للتعليم والعرض.'],
      ]
    : [
        ['Wearable-first', 'Hands-free, spoken interaction. A display is optional, never required.'],
        ['Trustworthy knowledge', 'Answers come from curated heritage sources with visible citations — and NAZAR declines when it does not know.'],
        ['Contextual memory', '“It” means the barjeel. “Why?” follows on from the last answer.'],
        ['Natively bilingual', 'Correctly shaped Arabic and right-to-left layout — not a translation afterthought.'],
        ['Accessible', 'Spoken answers for visitors, readable transcripts for everyone.'],
        ['A living 3D world', 'See how a wind tower moves air — for classrooms, museums and pitches.'],
      ];

  const status: [string, string, 'Working' | 'Simulated' | 'Scaffold' | 'Requires key' | 'Planned'][] = [
    ['Interactive 3D Al Fahidi world', 'Three.js scene with hotspots, airflow and Then / Now', 'Working'],
    ['Look → Ask → Listen conversation', 'Voice (Web Speech) or text, spoken answers with captions', 'Working'],
    ['Curated bilingual knowledge', '4 heritage entries, 28 sourced Q&A pairs, follow-up memory', 'Working'],
    ['Wearable POV', 'Browser simulation of an audio-only Ray-Ban Meta experience', 'Simulated'],
    ['Live grounded AI answers', 'Cloudflare Worker + Gemini/OpenAI, citation-validated', 'Requires key'],
    ['Camera vision', 'Consent-gated capture works; recognition needs the API', 'Requires key'],
    ['Meta Device Access Toolkit app', 'Android companion scaffold on mwdat 1.0.1 + Mock Device Kit', 'Scaffold'],
    ['Display-glasses web app', 'Meta Ray-Ban Display only — future path', 'Planned'],
  ];
  const tone = (s: string) =>
    s === 'Working' ? 'text-teal border-teal/40' : s === 'Simulated' ? 'text-gold border-gold/50' : s === 'Planned' ? 'text-ivory/60 border-ivory/20' : 'text-sand border-sand/40';

  return (
    <div className="bg-midnight">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {/* HERO */}
      <section className="grain relative min-h-[100dvh] overflow-hidden">
        <Nav overlay />
        <div className="absolute inset-0">
          {supportsWebGL() && (
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/75 to-transparent rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-midnight to-transparent" />
        </div>
        <main id="main" className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-center px-5 pb-16 pt-28 sm:px-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold">
            {ar ? 'الذاكرة الحيّة للإمارات' : 'The Living Memory of the UAE'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display mt-5 max-w-3xl text-5xl font-medium leading-[1.02] text-ivory sm:text-7xl lg:text-8xl"
          >
            {t.tagline}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/75">
            {ar
              ? 'نَظَر رفيق ثقافي ثنائي اللغة للنظارات الذكية. انظر إلى معلم تراثي، واسأل بطبيعية، واسمع حكايته الموثّقة — دون أن تلمس هاتفك.'
              : 'NAZAR is a bilingual cultural companion for smart glasses. Look at a heritage landmark, ask naturally, and hear its sourced story — without touching your phone.'}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-9 flex flex-wrap gap-3">
            <Link to="/experience" className="rounded-full bg-ivory px-6 py-3 text-[15px] font-semibold text-midnight shadow-[0_10px_40px_-10px_rgba(247,241,231,0.5)] transition hover:bg-sand" data-testid="cta-enter">
              {t.enter}
            </Link>
            <Link to="/pitch-demo" className="rounded-full border border-ivory/25 px-6 py-3 text-[15px] font-medium text-ivory transition hover:border-teal" data-testid="cta-demo">
              {t.watchDemo}
            </Link>
          </motion.div>
          <p className="mt-12 text-xs text-ivory/60">Meta Wearables Studio UAE 2026 · Team Kanban · Kanban Studios</p>
        </main>
      </section>

      {/* SCENARIO */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <motion.div {...fade} className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal">{ar ? 'اللحظة' : 'The moment'}</p>
            <h2 className="font-display mt-3 text-4xl text-ivory sm:text-5xl">{ar ? 'زائر في حي الفهيدي، ينظر إلى الأعلى.' : 'A visitor in Al Fahidi looks up.'}</h2>
            <p className="mt-4 text-ivory/70">
              {ar
                ? 'لا لافتات تُقرأ ولا تطبيقات تُفتح. يسأل فقط — ويجيب نَظَر في أذنه من مصادر تراثية موثوقة، ويتذكّر ما يتحدثان عنه.'
                : 'No plaques to read, no apps to open. They simply ask — and NAZAR answers in their ear from trusted heritage sources, remembering what they are talking about.'}
            </p>
          </div>
          <div className="space-y-3" lang={lang}>
            {[
              ['visitor', ar ? 'يا نظر، ما هذا البرج؟' : 'Nazar, what is that tower?'],
              ['nazar', overview.spoken[lang]],
              ['visitor', ar ? 'كيف كان يبرّد البيوت؟' : 'How did it actually cool the house?'],
              ['nazar', cooling.spoken[lang]],
            ].map(([who, text], i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.5, delay: i * 0.12 }} className={who === 'visitor' ? 'flex justify-end' : ''}>
                <p className={`max-w-[88%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${who === 'visitor' ? 'bg-ivory/10 text-ivory' : 'glass text-ivory/90'}`}>
                  {who === 'nazar' && <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-teal">NAZAR · {ar ? 'صوت' : 'audio'}</span>}
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y hairline bg-midnight-800/60">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <motion.h2 {...fade} className="font-display text-4xl text-ivory sm:text-5xl">
            {ar ? 'كيف يعمل' : 'How it works'}
          </motion.h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([h, d], i) => (
              <motion.li key={h} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <span className="font-display text-5xl text-gold/80">0{i + 1}</span>
                <h3 className="mt-2 text-xl font-semibold text-ivory">{h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/65">{d}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* DIFFERENT */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <motion.h2 {...fade} className="font-display max-w-2xl text-4xl text-ivory sm:text-5xl">
          {ar ? 'ليس مجرد تعرّف على الأشياء.' : 'Not just object recognition. Not just a chatbot.'}
        </motion.h2>
        <dl className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {different.map(([h, d]) => (
            <motion.div key={h} {...fade} className="border-s-2 border-gold/50 ps-5">
              <dt className="text-lg font-semibold text-ivory">{h}</dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-ivory/65">{d}</dd>
            </motion.div>
          ))}
        </dl>
      </section>

      {/* STATUS */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8" aria-labelledby="status-h">
        <motion.div {...fade} className="glass overflow-hidden rounded-3xl">
          <div className="border-b hairline px-6 py-5">
            <h2 id="status-h" className="font-display text-3xl text-ivory">
              {ar ? 'ما الذي يعمل اليوم' : 'What works today — labelled honestly'}
            </h2>
            <p className="mt-1 text-sm text-ivory/60">
              {ar ? 'هذا النموذج الأولي يعمل في المتصفح. لا ندّعي تكاملاً مع أجهزة لم نختبره.' : 'This prototype runs in the browser. We never claim hardware integration we have not verified.'}
            </p>
          </div>
          <ul className="divide-y divide-[rgba(217,185,141,0.12)]" dir="ltr">
            {status.map(([name, note, s]) => (
              <li key={name} className="flex flex-col gap-1 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="block text-[15px] text-ivory">{name}</span>
                  <span className="block text-xs text-ivory/55">{note}</span>
                </span>
                <span className={`w-fit shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tone(s)}`}>{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* TRUST */}
      <section className="border-y hairline bg-midnight-800/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
          <motion.div {...fade}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal">{ar ? 'الثقة والخصوصية' : 'Trust & privacy'}</p>
            <h2 className="font-display mt-3 text-4xl text-ivory">{ar ? 'الثقة ميزة في المنتج.' : 'Trust is a product feature.'}</h2>
            <Link to="/privacy" className="mt-6 inline-flex text-sm text-teal hover:underline">
              {ar ? 'اقرأ تفاصيل الخصوصية ←' : 'Read the privacy details →'}
            </Link>
          </motion.div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {(ar
              ? ['الكاميرا والميكروفون متوقفان حتى تمنح الإذن', 'لا تُرفع الصور إلا بموافقة صريحة ولا تُحفظ', 'لا تعرّف على الوجوه ولا بيانات بيومترية', 'المفاتيح البرمجية على الخادم فقط، لا في المتصفح', 'كل إجابة تعرض مصادرها ومدى يقينها', 'يعتذر نَظَر بدل أن يخمّن']
              : ['Camera and mic stay off until you allow them', 'Images upload only with explicit consent — never stored', 'No face recognition, no biometrics', 'Model keys live server-side only, never in the browser', 'Every answer shows its sources and confidence', 'NAZAR declines rather than guesses']
            ).map((x) => (
              <motion.li key={x} {...fade} className="flex gap-3 text-[15px] text-ivory/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                {x}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* TEAM */}
      <section className="mx-auto max-w-6xl px-5 py-24 text-center sm:px-8">
        <motion.p {...fade} className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
          {ar ? 'من صنع' : 'Built by'}
        </motion.p>
        <motion.h2 {...fade} className="font-display mt-3 text-5xl text-ivory">
          Team Kanban
        </motion.h2>
        <p className="mt-2 text-sm text-ivory/55">Kanban Studios · Meta Wearables Studio UAE 2026</p>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4" dir="ltr">
          {TEAM.map((n) => (
            <li key={n} className="font-display text-2xl text-ivory/90">
              {n}
            </li>
          ))}
        </ul>
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <Link to="/experience" className="rounded-full bg-ivory px-6 py-3 text-[15px] font-semibold text-midnight">
            {t.enter}
          </Link>
          <Link to="/pitch-demo" className="rounded-full border border-ivory/25 px-6 py-3 text-[15px] text-ivory hover:border-teal">
            {t.watchDemo}
          </Link>
        </div>
      </section>

      <footer className="border-t hairline px-5 py-8 text-center text-xs text-ivory/60 sm:px-8">
        <p>
          {ar
            ? 'المحتوى التراثي مستند إلى مصادر رسمية ومنظمة اليونسكو، والمشاهد ثلاثية الأبعاد تفسير تعليمي. لا يمثّل نَظَر أي جهة حكومية أو شركة Meta.'
            : 'Heritage content is based on official and UNESCO sources; 3D scenes are educational interpretations. NAZAR is an independent prototype and is not affiliated with or endorsed by any government entity or Meta.'}
        </p>
        <p className="mt-2">© 2026 Team Kanban · Kanban Studios</p>
      </footer>
    </div>
  );
}
