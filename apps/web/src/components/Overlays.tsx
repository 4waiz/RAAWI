import { motion } from 'framer-motion';
import { useNazar } from '../store';

const PIPELINE_EN = [
  ['Device input', 'Browser simulator · webcam (consent) · Meta DAT Android (scaffold)'],
  ['Consent gate', 'Mic/camera off by default · separate image-upload opt-in'],
  ['Context', 'What you look at (focus) + conversation memory'],
  ['Identify', 'Hotspot / manual scene · optional server vision'],
  ['Retrieve', 'Curated bilingual knowledge · 4 entries · 28 sourced Q&A'],
  ['Generate', 'Curated answer · or LLM grounded only on retrieved facts'],
  ['Validate', 'Citations must match retrieved facts · uncertainty kept'],
  ['Deliver', 'Speech (TTS) + captions · contextual 3D camera & airflow'],
];
const PIPELINE_AR = [
  ['مدخلات الجهاز', 'محاكي المتصفح · الكاميرا (بموافقة) · أندرويد مع Meta DAT (هيكل أولي)'],
  ['بوابة الموافقة', 'الميكروفون والكاميرا متوقفان افتراضياً · موافقة منفصلة لرفع الصور'],
  ['السياق', 'ما تنظر إليه + ذاكرة المحادثة'],
  ['التعرّف', 'نقطة تراثية / اختيار يدوي · رؤية اختيارية عبر الخادم'],
  ['الاسترجاع', 'معرفة منسّقة ثنائية اللغة · 4 مداخل · 28 سؤالاً موثّقاً'],
  ['التوليد', 'إجابة منسّقة · أو نموذج لغوي مقيّد بالحقائق المسترجعة فقط'],
  ['التحقق', 'يجب أن تطابق الاستشهادات الحقائق المسترجعة'],
  ['التسليم', 'صوت وترجمة نصية · كاميرا ثلاثية الأبعاد سياقية'],
];

export function ArchitectureOverlay() {
  const lang = useNazar((s) => s.lang);
  const set = useNazar((s) => s.set);
  const rows = lang === 'ar' ? PIPELINE_AR : PIPELINE_EN;
  return (
    <OverlayShell title={lang === 'ar' ? 'كيف يعمل نَظَر' : 'How NAZAR works'} onClose={() => set({ overlay: null })} testid="architecture-overlay">
      <ol className="grid gap-2 sm:grid-cols-2">
        {rows.map(([h, d], i) => (
          <motion.li key={h} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex gap-3 rounded-xl border hairline bg-ivory/[0.03] p-3">
            <span className="font-display text-2xl leading-none text-gold">{i + 1}</span>
            <span>
              <span className="block text-sm font-semibold text-ivory">{h}</span>
              <span className="block text-xs text-ivory/65">{d}</span>
            </span>
          </motion.li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-ivory/60">
        {lang === 'ar'
          ? 'المسار إلى الأجهزة: تطبيق أندرويد مرافق يستخدم Meta Wearables Device Access Toolkit 1.0.1 (هيكل قابل للبناء، غير مُختبر على نظارة حقيقية بعد) يرسل إطارات الكاميرا إلى نفس الواجهة البرمجية، ويُشغَّل الصوت عبر بلوتوث النظارة.'
          : 'Path to hardware: an Android companion built on the Meta Wearables Device Access Toolkit 1.0.1 (buildable scaffold, not yet tested on physical glasses) sends glasses-camera frames to the same API; answers play through the glasses’ Bluetooth audio.'}
      </p>
    </OverlayShell>
  );
}

export function TrustOverlay() {
  const lang = useNazar((s) => s.lang);
  const consent = useNazar((s) => s.consent);
  const set = useNazar((s) => s.set);
  const ar = lang === 'ar';
  const items = ar
    ? [
        ['الميكروفون', consent.microphone ? 'مسموح — يعمل فقط أثناء زر التحدث' : 'متوقف حتى تمنح الإذن'],
        ['الكاميرا', consent.camera ? 'مسموح في هذه الجلسة' : 'متوقفة حتى تمنح الإذن'],
        ['رفع الصور', consent.imageUpload ? 'مسموح لإطار واحد في كل مرة' : 'غير مسموح'],
        ['التخزين', 'لا نحفظ الصوت ولا الصور · الذاكرة في الجلسة فقط ويمكن مسحها'],
        ['الوجوه', 'لا تعرّف بيومتري ولا تعرّف على الوجوه'],
        ['المصادر', 'كل إجابة تعرض مصادرها ودرجة اليقين'],
      ]
    : [
        ['Microphone', consent.microphone ? 'Allowed — active only while Talk is on' : 'Off until you grant permission'],
        ['Camera', consent.camera ? 'Allowed this session' : 'Off until you grant permission'],
        ['Image upload', consent.imageUpload ? 'Allowed, one frame at a time' : 'Not allowed'],
        ['Storage', 'No audio or images stored · memory is per-session and clearable'],
        ['Faces', 'No biometric identification or face recognition'],
        ['Sources', 'Every answer shows its sources and confidence'],
      ];
  return (
    <OverlayShell title={ar ? 'الثقة والخصوصية' : 'Trust & privacy'} onClose={() => set({ overlay: null })} testid="trust-overlay">
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map(([h, d]) => (
          <li key={h} className="rounded-xl border hairline bg-ivory/[0.03] p-3">
            <span className="block text-sm font-semibold text-ivory">{h}</span>
            <span className="block text-xs text-ivory/65">{d}</span>
          </li>
        ))}
      </ul>
    </OverlayShell>
  );
}

function OverlayShell({ title, children, onClose, testid }: { title: string; children: React.ReactNode; onClose: () => void; testid: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center bg-midnight/60 p-4 backdrop-blur-sm" data-testid={testid}>
      <div className="glass max-h-full w-full max-w-3xl overflow-y-auto rounded-3xl p-5 sm:p-6" role="dialog" aria-label={title}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-3xl text-ivory">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full border hairline px-3 py-1 text-sm hover:border-teal">
            ✕
          </button>
        </div>
        {children}
      </div>
    </motion.div>
  );
}
