import type { Lang } from './types';

const AR_DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
const ARABIC_CHAR = /[؀-ۿ]/;

/** Normalise text for matching: lowercase Latin, strip Arabic diacritics/tatweel, unify letter variants. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(AR_DIACRITICS, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[’‘`]/g, "'")
    .replace(/'s\b/g, ' is')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(input: string): string[] {
  const n = normalize(input);
  return n ? n.split(' ') : [];
}

/** Arabic clitic variants: و/ف conjunctions, ب/ل/ك prepositions, ال article. */
export function arabicVariants(token: string): string[] {
  const out = new Set<string>([token]);
  if (!ARABIC_CHAR.test(token)) return [...out];
  let t = token;
  if ((t.startsWith('و') || t.startsWith('ف')) && t.length > 3) {
    t = t.slice(1);
    out.add(t);
  }
  for (const p of ['بال', 'كال', 'فال', 'وال', 'لل', 'ال']) {
    if (t.startsWith(p) && t.length - p.length >= 2) {
      out.add(t.slice(p.length));
      break;
    }
  }
  if ((t.startsWith('ب') || t.startsWith('ل') || t.startsWith('ك')) && t.length > 3) out.add(t.slice(1));
  return [...out];
}

/** Detect the language of a question; falls back to the preferred language when ambiguous. */
export function detectLanguage(input: string, preferred: Lang = 'en'): Lang {
  const letters = [...input].filter((c) => /\p{L}/u.test(c));
  if (letters.length === 0) return preferred;
  const arabic = letters.filter((c) => ARABIC_CHAR.test(c)).length;
  const ratio = arabic / letters.length;
  if (ratio >= 0.3) return 'ar';
  if (ratio === 0 && letters.length >= 2) return 'en';
  return preferred;
}

/** Remove a leading wake word ("Nazar, ...", "Hey Nazar", "يا نظر"). */
export function stripWakeWord(input: string): string {
  return input
    .replace(/^\s*(hey|hi|ok|okay)?\s*,?\s*na[sz]ar\s*[,،!.:\-]*\s*/i, '')
    .replace(/^\s*(يا\s*)?نَ?ظَ?ر\s*[,،!.:\-]*\s*/u, '')
    .trim();
}

export const STOPWORDS = new Set<string>([
  // English function words and conversational filler
  'a', 'an', 'the', 'is', 'are', 'am', 'was', 'were', 'be', 'been', 'do', 'does', 'did', 'it', 'its', 'this', 'that',
  'these', 'those', 'there', 'here', 'what', 'which', 'how', 'why', 'when', 'where', 'who', 'i', 'me', 'my', 'you',
  'your', 'we', 'us', 'they', 'them', 'their', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'from', 'by', 'about',
  'and', 'or', 'so', 'tell', 'please', 'can', 'could', 'would', 'will', 'should', 'actually', 'really', 'just',
  'nazar', 'hey', 'ok', 'okay', 'keep', 'kept', 'make', 'made', 'get', 'got', 'like', 'thing', 'things', 'one', 'look',
  'looking', 'see', 'show', 'explain', 'know', 'want', 'more', 'much', 'many', 'some', 'any', 'all', 'very', 'also',
  'building', 'buildings', 'house', 'houses', 'home', 'homes', 'room', 'rooms', 'place', 'people', 'used', 'use',
  'emirati', 'uae', 'emirates', 'dubai', 'abu', 'dhabi', 'arab', 'arabian', 'traditional', 'old', 'story', 'say', 'had',
  'have', 'has', 'if', 'then', 'than', 'up', 'out', 'into', 'them', 'not', 'no', 'yes', 'well', 'mean', 'means',
  // Arabic function words and filler (normalised forms)
  'ما', 'ماذا', 'هو', 'هي', 'هذا', 'هذه', 'ذلك', 'تلك', 'هنا', 'هناك', 'كيف', 'لماذا', 'متي', 'اين', 'من', 'في',
  'علي', 'الي', 'عن', 'مع', 'او', 'ثم', 'كان', 'كانت', 'يكون', 'تكون', 'هل', 'لي', 'انا', 'انت', 'نحن', 'هم', 'يا',
  'نظر', 'اخبرني', 'حدثني', 'قل', 'لنا', 'الذي', 'التي', 'به', 'بها', 'فيه', 'فيها', 'قصه', 'البيوت', 'بيوت',
  'البيت', 'بيت', 'المنزل', 'منزل', 'المبني', 'مبني', 'المكان', 'مكان', 'الاماراتيه', 'الاماراتي', 'اماراتي',
  'الامارات', 'دبي', 'ابوظبي', 'التقليديه', 'التقليدي', 'الناس', 'شيء', 'يمكن', 'يمكنني', 'انظر', 'اليه', 'ان',
]);

export function isArabic(s: string): boolean {
  return ARABIC_CHAR.test(s);
}
