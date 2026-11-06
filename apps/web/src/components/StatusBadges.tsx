import { useNazar } from '../store';

type Tone = 'working' | 'simulated' | 'requires' | 'live';
const TONES: Record<Tone, string> = {
  working: 'border-teal/40 text-teal',
  live: 'border-teal/60 bg-teal/10 text-teal',
  simulated: 'border-gold/50 text-gold',
  requires: 'border-ivory/20 text-ivory/60',
};

export function Badge({ tone, children, title }: { tone: Tone; children: React.ReactNode; title?: string }) {
  return (
    <span title={title} className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-midnight/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur ${TONES[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'requires' ? 'bg-ivory/40' : tone === 'simulated' ? 'bg-gold' : 'bg-teal'}`} />
      {children}
    </span>
  );
}

/** Honest capability labels shown in the experience: Working / Simulated / Requires API. */
export function StatusBadges() {
  const api = useNazar((s) => s.apiStatus);
  const lang = useNazar((s) => s.lang);
  const ar = lang === 'ar';
  return (
    <div className="flex flex-wrap gap-1.5" data-testid="status-badges">
      <Badge tone="working" title="Answers come from the curated, source-backed heritage knowledge base.">
        {ar ? 'المعرفة المنسّقة · تعمل' : 'Curated knowledge · Working'}
      </Badge>
      {api.live ? (
        <Badge tone="live" title={`Provider: ${api.provider}`}>{ar ? 'ذكاء اصطناعي مباشر · متصل' : `Live AI · ${api.provider}`}</Badge>
      ) : (
        <Badge tone="requires" title="Set VITE_NAZAR_API_URL and deploy the Worker with a provider key to enable.">
          {ar ? 'ذكاء اصطناعي مباشر · يتطلب مفتاح API' : 'Live AI · Requires API key'}
        </Badge>
      )}
      <Badge tone="simulated" title="This browser view simulates the glasses point of view. It is not connected to Meta hardware.">
        {ar ? 'النظارة · محاكاة في المتصفح' : 'Glasses · Browser simulation'}
      </Badge>
      <Badge tone={api.vision ? 'live' : 'requires'}>{ar ? (api.vision ? 'الرؤية · متاحة' : 'الرؤية · تتطلب API') : api.vision ? 'Vision · Available' : 'Vision · Requires API'}</Badge>
    </div>
  );
}
