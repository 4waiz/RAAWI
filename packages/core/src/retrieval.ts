import type { Answer, ConversationContext, HeritageEntry, Lang, QAPair, Source } from './types';
import { ENTRIES, ENTRY_BY_ID, SOURCES } from './knowledge';
import { CONCEPTS, INTENT_CONCEPTS } from './lexicon';
import { STOPWORDS, arabicVariants, detectLanguage, normalize, stripWakeWord, tokenize } from './text';

export interface Analysis {
  raw: string;
  cleaned: string;
  normalized: string;
  tokens: string[];
  /** All variants of all tokens (Arabic clitics stripped). */
  variants: Set<string>;
  concepts: string[];
  topicConcepts: string[];
  explicitEntities: string[];
  weakEntities: string[];
  visualDeictic: boolean;
  followUp: 'why' | 'how' | 'more' | null;
  unknownTokens: string[];
  lang: Lang;
}

const VISUAL_DEICTIC_EN = /\b(this|that|these|those|here|there)\b/;
const VISUAL_DEICTIC_AR = new Set(['هذا', 'هذه', 'ذلك', 'تلك', 'هنا', 'هناك']);
const MORE_EN = /^(and\s+)?(tell me more|more|go on|continue|what else|anything else|elaborate|keep going|and then|more please|tell me more about it)$/;
const MORE_AR = ['المزيد', 'اكثر', 'ماذا ايضا', 'وماذا ايضا', 'وماذا بعد', 'اكمل', 'كمل', 'زدني'];
const WHY_FILLER = new Set(['why', 'is', 'that', 'so', 'really', 'nazar', 'but', 'and', 'لماذا', 'ليش', 'لم', 'ذلك', 'و']);
const HOW_FILLER = new Set(['how', 'so', 'is', 'that', 'nazar', 'exactly', 'كيف', 'ذلك']);

function arStemMatch(stem: string, normalized: string, variants: Set<string>): boolean {
  if (stem.includes(' ')) return ` ${normalized} `.includes(` ${stem} `) || normalized.includes(stem);
  if (stem.length <= 2 || stem === 'ماذا' || stem === 'ماهو' || stem === 'ماهي') return variants.has(stem);
  for (const v of variants) if (v.includes(stem)) return true;
  return false;
}

function aliasMatch(alias: string, normalized: string, variants: Set<string>): boolean {
  const a = normalize(alias);
  if (!a) return false;
  if (a.includes(' ')) return ` ${normalized} `.includes(` ${a} `);
  return variants.has(a);
}

function tokenIsKnown(tok: string): boolean {
  if (STOPWORDS.has(tok)) return true;
  const vs = arabicVariants(tok);
  if (vs.some((v) => STOPWORDS.has(v))) return true;
  for (const c of CONCEPTS) {
    if (c.en.test(tok)) return true;
    if (c.ar.some((s) => !s.includes(' ') && vs.some((v) => (s.length <= 2 ? v === s : v.includes(s))))) return true;
  }
  for (const e of ENTRIES) {
    const all = [...e.aliases.en, ...e.aliases.ar, ...(e.weakAliases?.en ?? []), ...(e.weakAliases?.ar ?? [])];
    for (const al of all) {
      const parts = normalize(al).split(' ');
      if (vs.some((v) => parts.includes(v))) return true;
    }
  }
  return false;
}

export function analyze(question: string, preferred: Lang = 'en'): Analysis {
  const cleaned = stripWakeWord(question);
  const normalized = normalize(cleaned);
  const tokens = tokenize(cleaned);
  const variants = new Set<string>(tokens.flatMap(arabicVariants));
  const lang = detectLanguage(cleaned || question, preferred);

  const concepts: string[] = [];
  for (const c of CONCEPTS) {
    if (c.en.test(normalized) || c.ar.some((s) => arStemMatch(s, normalized, variants))) concepts.push(c.id);
  }
  const topicConcepts = concepts.filter((c) => !INTENT_CONCEPTS.has(c));

  const explicitEntities: string[] = [];
  const weakEntities: string[] = [];
  for (const e of ENTRIES) {
    if ([...e.aliases.en, ...e.aliases.ar].some((a) => aliasMatch(a, normalized, variants))) explicitEntities.push(e.id);
    else if ([...(e.weakAliases?.en ?? []), ...(e.weakAliases?.ar ?? [])].some((a) => aliasMatch(a, normalized, variants)))
      weakEntities.push(e.id);
  }

  const visualDeictic = VISUAL_DEICTIC_EN.test(normalized) || tokens.some((t) => VISUAL_DEICTIC_AR.has(t));

  let followUp: Analysis['followUp'] = null;
  if (MORE_EN.test(normalized) || MORE_AR.some((m) => arStemMatch(m, normalized, variants) && tokens.length <= 4)) followUp = 'more';
  else if (tokens.length > 0 && tokens.some((t) => t === 'why' || t === 'لماذا' || t === 'ليش') && tokens.every((t) => WHY_FILLER.has(t))) followUp = 'why';
  else if (tokens.length > 0 && tokens.some((t) => t === 'how' || t === 'كيف') && tokens.every((t) => HOW_FILLER.has(t))) followUp = 'how';

  const unknownTokens = tokens.filter((t) => !tokenIsKnown(t) && !/^\d+$/.test(t));

  return { raw: question, cleaned, normalized, tokens, variants, concepts, topicConcepts, explicitEntities, weakEntities, visualDeictic, followUp, unknownTokens, lang };
}

export function resolveEntity(a: Analysis, ctx: Pick<ConversationContext, 'focusEntryId' | 'activeEntryId'>): { entry: HeritageEntry | null; reason: Answer['trace']['entityReason'] } {
  const pickPreferred = (ids: string[]) => {
    if (ctx.focusEntryId && ids.includes(ctx.focusEntryId)) return ctx.focusEntryId;
    if (ctx.activeEntryId && ids.includes(ctx.activeEntryId)) return ctx.activeEntryId;
    return ids[0]!;
  };
  if (a.explicitEntities.length > 0) return { entry: ENTRY_BY_ID[pickPreferred(a.explicitEntities)] ?? null, reason: 'explicit' };
  if (a.weakEntities.length > 0) {
    // A weak noun ("tower") resolves to what the visitor is looking at when it fits, otherwise to the nearest match.
    const id = pickPreferred(a.weakEntities);
    const reason = id === ctx.focusEntryId ? 'visual-focus' : id === ctx.activeEntryId ? 'conversation' : 'explicit';
    return { entry: ENTRY_BY_ID[id] ?? null, reason };
  }
  if (a.visualDeictic && ctx.focusEntryId) return { entry: ENTRY_BY_ID[ctx.focusEntryId] ?? null, reason: 'visual-focus' };
  if (ctx.activeEntryId) return { entry: ENTRY_BY_ID[ctx.activeEntryId] ?? null, reason: 'conversation' };
  if (ctx.focusEntryId) return { entry: ENTRY_BY_ID[ctx.focusEntryId] ?? null, reason: 'visual-focus' };
  return { entry: null, reason: 'none' };
}

const exampleTokenCache = new Map<string, Set<string>>();
function exampleTokens(qa: QAPair): Set<string> {
  let s = exampleTokenCache.get(qa.id);
  if (!s) {
    s = new Set(
      [...qa.examples.en, ...qa.examples.ar]
        .flatMap((q) => tokenize(q))
        .flatMap(arabicVariants)
        .filter((t) => !STOPWORDS.has(t)),
    );
    exampleTokenCache.set(qa.id, s);
  }
  return s;
}

export interface RankedQA {
  qa: QAPair;
  score: number;
  conceptScore: number;
  matched: string[];
}

export function rankQAs(entry: HeritageEntry, a: Analysis): RankedQA[] {
  const content = [...a.variants].filter((t) => !STOPWORDS.has(t));
  return entry.qa
    .map((qa) => {
      const matched = qa.concepts.filter((c) => a.concepts.includes(c));
      const conceptScore = matched.reduce((s, c) => s + (CONCEPTS.find((d) => d.id === c)?.weight ?? 1), 0);
      const ex = exampleTokens(qa);
      const overlap = content.filter((t) => ex.has(t)).length;
      const score = conceptScore + (content.length ? (overlap / content.length) * 2 : 0);
      return { qa, score, conceptScore, matched };
    })
    .sort((x, y) => y.score - x.score);
}

function sourcesFor(ids: string[]): Source[] {
  return [...new Set(ids)].map((id) => SOURCES[id]).filter((s): s is Source => Boolean(s));
}

function suggestionsFor(entry: HeritageEntry, used: string[], lang: Lang, exclude?: string | null): string[] {
  const unused = entry.qa.filter((q) => !used.includes(q.id) && q.id !== exclude);
  const out = unused.map((q) => q.examples[lang][0]!).filter(Boolean);
  if (out.length < 3) out.push(...entry.suggestions[lang].filter((s) => !out.includes(s)));
  return out.slice(0, 3);
}

const L = {
  noEntity: {
    en: "I'm not sure what you're looking at yet. Point me at a heritage landmark — like the barjeel wind tower, the dallah, or the Sheikh Zayed Grand Mosque — and ask again.",
    ar: 'لست متأكداً مما تنظر إليه بعد. وجّهني إلى معلم تراثي، مثل البرجيل أو الدلّة أو جامع الشيخ زايد الكبير، ثم اسأل مجدداً.',
  },
  notCovered: {
    en: (name: string) => `My verified sources on the ${name} don't cover that, so I won't guess.`,
    ar: (name: string) => `مصادري الموثّقة عن ${name} لا تغطي ذلك، لذا لن أخمّن.`,
  },
  offTopic: {
    en: "I can only answer heritage questions from NAZAR's curated, sourced knowledge — I won't guess about that.",
    ar: 'لا أجيب إلا عن الأسئلة التراثية من معرفة نَظَر المنسّقة والموثّقة، ولن أخمّن في ذلك.',
  },
  exhausted: {
    en: (name: string) => `That's everything in my verified notes on the ${name} for now. The sources are on screen if you'd like to read further.`,
    ar: (name: string) => `هذا كل ما في ملاحظاتي الموثّقة عن ${name} حالياً. المصادر معروضة إن أردت الاستزادة.`,
  },
  tryAsking: { en: 'You could ask:', ar: 'يمكنك أن تسأل:' },
};

function shortName(entry: HeritageEntry, lang: Lang): string {
  if (lang === 'ar') return entry.name.ar.split('—')[0]!.trim();
  return entry.name.en.split('—')[0]!.trim().replace(/^(.)/, (m) => m.toLowerCase()).replace(/^sheikh/, 'Sheikh').replace(/^al /, 'Al ');
}

export interface AnswerOptions {
  preferredLang?: Lang;
}

/**
 * Curated, source-constrained answer generation. Pure function of (question, context).
 * Never invents facts: every non-declined answer is a curated QA pair with its sources.
 */
export function answerQuestion(question: string, ctx: ConversationContext, opts: AnswerOptions = {}): Answer {
  const a = analyze(question, opts.preferredLang ?? 'en');
  const lang = a.lang;
  const { entry, reason } = resolveEntity(a, ctx);
  const base = { lang, mode: 'curated' as const };

  const decline = (spoken: string, e: HeritageEntry | null, why: Answer['trace']['entityReason']): Answer => ({
    ...base,
    entryId: e?.id ?? null,
    qaId: null,
    spoken,
    detail: e ? `${L.tryAsking[lang]} ${suggestionsFor(e, ctx.usedQaIds, lang).join(' · ')}` : spoken,
    sources: e ? sourcesFor(e.sourceIds) : [],
    confidence: 'declined',
    suggestions: e ? suggestionsFor(e, ctx.usedQaIds, lang) : [],
    trace: { entityReason: why, matchedConcepts: a.concepts, score: 0, followUp: a.followUp },
  });

  if (!entry) {
    const offTopic = a.unknownTokens.length > 0 && a.topicConcepts.length === 0;
    return decline(offTopic ? L.offTopic[lang] : L.noEntity[lang], null, 'none');
  }

  const finish = (qa: QAPair, score: number, matched: string[]): Answer => ({
    ...base,
    entryId: entry.id,
    qaId: qa.id,
    spoken: qa.spoken[lang],
    detail: qa.detail[lang],
    sources: sourcesFor(qa.sourceIds),
    confidence: qa.uncertainty ? 'qualified' : 'verified',
    uncertainty: qa.uncertainty?.[lang],
    suggestions: suggestionsFor(entry, [...ctx.usedQaIds, qa.id], lang, qa.id),
    trace: { entityReason: reason, matchedConcepts: matched, score: Math.round(score * 100) / 100, followUp: a.followUp },
  });

  // Follow-ups that depend on the previous answer.
  if (a.followUp) {
    const last = ctx.lastQaId ? entry.qa.find((q) => q.id === ctx.lastQaId) : undefined;
    if (a.followUp === 'why' || a.followUp === 'how') {
      const linked = last?.followUp?.[a.followUp];
      const target =
        (linked && entry.qa.find((q) => q.id === linked)) ||
        entry.qa.find((q) => !ctx.usedQaIds.includes(q.id) && q.concepts.includes(a.followUp === 'why' ? 'reason' : 'mechanism')) ||
        entry.qa.find((q) => q.concepts.includes(a.followUp === 'why' ? 'reason' : 'mechanism'));
      if (target) return finish(target, 1, [a.followUp]);
    }
    const unused = entry.qa.filter((q) => !ctx.usedQaIds.includes(q.id) && q.id !== ctx.lastQaId);
    const next = unused.find((q) => !q.concepts.includes('identity')) ?? unused[0];
    if (next) return finish(next, 1, ['more']);
    return { ...decline(L.exhausted[lang](shortName(entry, lang)), entry, reason), confidence: 'qualified' };
  }

  const ranked = rankQAs(entry, a);
  const best = ranked[0];
  const hasTopic = a.topicConcepts.length > 0;

  if (best && best.conceptScore >= 2 && best.matched.some((m) => !INTENT_CONCEPTS.has(m) || m === 'reason')) {
    // Reason-only matches must be backed by a topic concept or a strong example overlap.
    const reasonOnly = best.matched.every((m) => m === 'reason');
    if (!reasonOnly || best.score >= 3) return finish(best.qa, best.score, best.matched);
  }

  if (hasTopic) {
    // The visitor asked about a topic this entry has no verified answer for.
    return decline(L.notCovered[lang](shortName(entry, lang)), entry, reason);
  }

  if (a.unknownTokens.length > 0 && a.explicitEntities.length === 0) {
    return decline(L.offTopic[lang], entry, reason);
  }

  // "What is that?" / "Tell me about the dallah" → overview.
  const overview = entry.qa.find((q) => q.concepts.includes('identity')) ?? entry.qa[0]!;
  if (a.concepts.includes('identity') || a.explicitEntities.length > 0 || a.visualDeictic || a.unknownTokens.length === 0) {
    return finish(overview, 1, ['identity']);
  }
  return decline(L.offTopic[lang], entry, reason);
}

/** Retrieval for the live-AI path: returns the grounding facts an LLM is allowed to use. */
export function retrieveGrounding(question: string, ctx: ConversationContext, preferredLang: Lang = 'en') {
  const a = analyze(question, preferredLang);
  const { entry, reason } = resolveEntity(a, ctx);
  if (!entry) return { analysis: a, entry: null, reason, facts: [] as { id: string; text: string; sourceIds: string[] }[] };
  const ranked = rankQAs(entry, a).slice(0, 4);
  const facts = ranked.map((r) => ({
    id: r.qa.id,
    text: `${r.qa.spoken.en} ${r.qa.detail.en}${r.qa.uncertainty ? ` (Uncertainty: ${r.qa.uncertainty.en})` : ''}`,
    sourceIds: r.qa.sourceIds,
  }));
  return { analysis: a, entry, reason, facts };
}
