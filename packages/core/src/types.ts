export type Lang = 'en' | 'ar';
export type Bilingual = { en: string; ar: string };

export type SourceType = 'official' | 'unesco' | 'secondary';

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  type: SourceType;
  /** What this source is used to support. */
  supports: string;
}

export interface QAPair {
  id: string;
  /** Canonical concepts that strongly indicate this question (see lexicon). */
  concepts: string[];
  /** Example phrasings, used for token-overlap scoring and documentation. */
  examples: { en: string[]; ar: string[] };
  /** Short spoken answer (1–3 sentences) — what the glasses would say aloud. */
  spoken: Bilingual;
  /** Fuller text explanation for the companion / presenter transcript. */
  detail: Bilingual;
  sourceIds: string[];
  /** Explicit qualification when evidence is limited or figures vary. */
  uncertainty?: Bilingual;
  /** Follow-up links for bare "why?" / "how?" questions after this answer. */
  followUp?: { why?: string; how?: string };
}

export interface Hotspot {
  station: 'alfahidi' | 'majlis' | 'mosque' | 'alain';
  /** World-space anchor of the 3D hotspot marker. */
  position: [number, number, number];
  /** Where the camera flies to when this entry is focused. */
  camera: { position: [number, number, number]; target: [number, number, number] };
}

export interface HeritageEntry {
  id: string;
  name: Bilingual;
  category: Bilingual;
  location: Bilingual;
  geo?: { lat: number; lng: number; label: string };
  summary: Bilingual;
  detail: Bilingual;
  /** Entity aliases. Matching any of these counts as an explicit mention. */
  aliases: { en: string[]; ar: string[] };
  /** Weak aliases (e.g. "tower") — only count when nothing stronger matches. */
  weakAliases?: { en: string[]; ar: string[] };
  qa: QAPair[];
  sourceIds: string[];
  uncertainty?: Bilingual;
  hotspot: Hotspot;
  /** Starter questions shown in the UI. */
  suggestions: { en: string[]; ar: string[] };
}

export type AnswerConfidence = 'verified' | 'qualified' | 'declined';
export type AnswerMode = 'curated' | 'live-ai';

export interface Answer {
  lang: Lang;
  entryId: string | null;
  qaId: string | null;
  spoken: string;
  detail: string;
  sources: Source[];
  confidence: AnswerConfidence;
  uncertainty?: string;
  suggestions: string[];
  mode: AnswerMode;
  /** Debug info for the presenter console (how the answer was resolved). */
  trace: {
    entityReason: 'explicit' | 'visual-focus' | 'conversation' | 'none';
    matchedConcepts: string[];
    score: number;
    followUp: 'why' | 'how' | 'more' | null;
  };
}

export interface Turn {
  role: 'visitor' | 'nazar';
  text: string;
  lang: Lang;
  entryId: string | null;
  qaId?: string | null;
  at: number;
}

export interface ConversationContext {
  /** What the visitor is currently looking at (LOOK). */
  focusEntryId: string | null;
  /** The entity the conversation is currently about (for "it", "why?"). */
  activeEntryId: string | null;
  lastQaId: string | null;
  usedQaIds: string[];
  history: Turn[];
}
