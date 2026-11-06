/**
 * Concept lexicon: maps question wording (English regex / Arabic normalised stems) to canonical
 * concepts used by the QA matcher. Topic concepts carry more weight than intent concepts.
 */
export interface ConceptDef {
  id: string;
  weight: number;
  en: RegExp;
  /** Normalised Arabic stems; matched as substrings of normalised tokens. */
  ar: string[];
}

export const CONCEPTS: ConceptDef[] = [
  { id: 'identity', weight: 1, en: /\b(what|which)\b|\btell me about\b|\blooking at\b|\bstory\b/, ar: ['ما', 'ماذا', 'ماهو', 'ماهي', 'عرفني', 'حدثني', 'قصه'] },
  { id: 'reason', weight: 2, en: /\bwhy\b|\bhow come\b|\breason\b/, ar: ['لماذا', 'ليش', 'سبب'] },
  { id: 'cooling', weight: 3, en: /\b(cool\w*|cold|air ?condition\w*|ac|temperature\w*|heat|hot|breeze\w*|ventilat\w*|airflow|fresh air)\b/, ar: ['برد', 'برود', 'تبريد', 'حرار', 'تهوي', 'نسيم', 'مكيف', 'تكييف'] },
  { id: 'mechanism', weight: 2, en: /\b(work|works|worked|working|function\w*|mechanism|operat\w*)\b/, ar: ['يعمل', 'تعمل', 'طريقه', 'اليه'] },
  { id: 'design', weight: 3, en: /\b(tall|taller|height|high|shape\w*|sides?|open|opening\w*|design\w*|architect\w*|style)\b/, ar: ['طويل', 'ارتفاع', 'شكل', 'جهات', 'مفتوح', 'تصميم', 'عماره', 'معمار', 'طراز'] },
  { id: 'materials', weight: 3, en: /\b(made of|made from|material\w*|stone\w*|coral|gypsum|wood\w*|timber|teak|sandalwood|construct\w*|how was it built|built (of|from|with))\b/, ar: ['مواد', 'ماده', 'صنع', 'مصنوع', 'حجر', 'مرجان', 'جص', 'خشب', 'ساج', 'كيف بني'] },
  { id: 'history', weight: 3, en: /\b(when|how old|age|year\w*|centur\w*|histor\w*|founded|ago|bastak\w*)\b/, ar: ['متي', 'عمر', 'قديم', 'تاريخ', 'قرن', 'سنه', 'بستك'] },
  { id: 'people', weight: 3, en: /\b(who|famil\w*|merchant\w*|founder|built by|bastak\w*)\b/, ar: ['من بني', 'من بنا', 'عائل', 'تجار', 'مؤسس', 'من صمم', 'بستك'] },
  { id: 'lanes', weight: 3, en: /\b(alley\w*|lane\w*|street\w*|sikka|narrow|path\w*)\b/, ar: ['ازق', 'زقاق', 'سكه', 'ممر', 'شارع', 'ضيق'] },
  { id: 'name', weight: 3, en: /\b(name\w*|called|meaning of|what does .* mean|word|in arabic|pronounc\w*)\b/, ar: ['اسم', 'معني', 'يسمي', 'تسمي', 'سمي'] },
  { id: 'meaning', weight: 3, en: /\b(symbol\w*|signific\w*|important|importance|represent\w*|matter\w*)\b/, ar: ['رمز', 'ترمز', 'يرمز', 'اهميه', 'مهم', 'يمثل'] },
  { id: 'serving', weight: 3, en: /\b(serve\w*|serving|pour\w*|offer\w*|first)\b/, ar: ['تقدم', 'يقدم', 'تقديم', 'يصب', 'تصب', 'اولا', 'قدم'] },
  { id: 'etiquette', weight: 3, en: /\b(etiquette|manners?|polite|rude|enough|shake\w*|shaking|how many cups|wear|dress\w*|cloth\w*|cover\w*|modest)\b/, ar: ['اكتفي', 'يهز', 'هز', 'اداب', 'ادب', 'لباس', 'ارتدي', 'البس', 'ملابس', 'كم فنجان'] },
  { id: 'ingredients', weight: 3, en: /\b(ingredient\w*|cardamom|saffron|tast\w*|flavou?r\w*|recipe\w*|roast\w*|beans?|contain\w*)\b|\bwhat is in\b/, ar: ['مكون', 'هيل', 'زعفران', 'طعم', 'نكه', 'وصف', 'تحميص', 'حبوب'] },
  { id: 'unesco', weight: 3, en: /\b(unesco|world heritage|heritage list|recogni[sz]\w*|inscri\w*|intangible)\b/, ar: ['يونسكو', 'تراث عالمي', 'التراث العالمي', 'اعترف', 'ادرج'] },
  { id: 'majlis', weight: 3, en: /\b(majlis|sitting room|where is (the )?coffee served)\b/, ar: ['مجلس', 'اين تقدم'] },
  { id: 'coin', weight: 3, en: /\b(coin\w*|dirham\w*|currency|money)\b/, ar: ['عمله', 'درهم', 'نقود'] },
  { id: 'size', weight: 3, en: /\b(how (big|large|tall|high|many)|size|area|dimension\w*|largest|biggest|number of)\b/, ar: ['كم عدد', 'حجم', 'مساحه', 'كم يبلغ', 'اكبر'] },
  { id: 'domes', weight: 3, en: /\bdomes?\b/, ar: ['قبه', 'قباب'] },
  { id: 'minarets', weight: 3, en: /\bminarets?\b/, ar: ['مئذن', 'ماذن', 'مازن'] },
  { id: 'tower', weight: 2, en: /\btowers?\b/, ar: ['برج'] },
  { id: 'carpet', weight: 3, en: /\b(carpets?|rugs?)\b/, ar: ['سجاد'] },
  { id: 'chandelier', weight: 3, en: /\b(chandeliers?|crystals?|swarovski)\b/, ar: ['ثريا', 'ثريات', 'كريستال'] },
  { id: 'lighting', weight: 3, en: /\b(light\w*|lit|moon\w*|night\w*|illuminat\w*)\b/, ar: ['اضاء', 'ضوء', 'قمر', 'ليل'] },
  { id: 'capacity', weight: 3, en: /\b(capacity|how many (people|worshippers?|visitors)|hold|fit|accommodat\w*|pray here)\b/, ar: ['سعه', 'يتسع', 'كم شخص', 'مصل'] },
  { id: 'visit', weight: 3, en: /\b(visit\w*|opening hours|hours|tickets?|entry|entrance|enter|free|go there|book\w*)\b/, ar: ['زيار', 'ازور', 'دخول', 'مجاني', 'تذكر', 'حجز'] },
  { id: 'today', weight: 3, en: /\b(today|now|still|modern|nowadays|anymore)\b/, ar: ['اليوم', 'الان', 'حاليا', 'ما زال', 'مازال', 'حديث'] },
  { id: 'water', weight: 3, en: /\b(water\w*|irrigat\w*|channels?|groundwater|falaj|aflaj)\b/, ar: ['ماء', 'مياه', 'قناه', 'قنوات'] },
];

export const CONCEPT_BY_ID: Record<string, ConceptDef> = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));

/** Concepts that are intents rather than topics: they never justify an answer on their own. */
export const INTENT_CONCEPTS = new Set(['identity', 'reason']);
