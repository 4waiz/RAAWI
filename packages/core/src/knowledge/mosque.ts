import type { HeritageEntry } from '../types';

export const mosque: HeritageEntry = {
  id: 'sheikh-zayed-grand-mosque',
  name: { en: 'Sheikh Zayed Grand Mosque', ar: 'جامع الشيخ زايد الكبير' },
  category: { en: 'Architecture & faith', ar: 'العمارة والإيمان' },
  location: { en: 'Abu Dhabi', ar: 'أبوظبي' },
  geo: { lat: 24.4128, lng: 54.4749, label: 'Sheikh Zayed Grand Mosque, Abu Dhabi' },
  summary: {
    en: "Abu Dhabi's landmark mosque, envisioned by Sheikh Zayed bin Sultan Al Nahyan and completed in 2007.",
    ar: 'جامع أبوظبي الأبرز، أراده الشيخ زايد بن سلطان آل نهيان، واكتمل بناؤه عام 2007.',
  },
  detail: {
    en: 'The mosque brings together architectural traditions from across the Islamic world, in white marble, gold and inlaid floral designs. It welcomes visitors of all faiths.',
    ar: 'يجمع الجامع تقاليد معمارية من أنحاء العالم الإسلامي، بالرخام الأبيض والذهب والزخارف النباتية المطعّمة، ويرحّب بالزوار من جميع الأديان.',
  },
  aliases: {
    en: ['mosque', 'grand mosque', 'sheikh zayed', 'zayed', 'masjid', 'minaret', 'minarets', 'dome', 'domes', 'chandelier', 'chandeliers', 'carpet'],
    ar: ['جامع', 'الجامع', 'مسجد', 'المسجد', 'زايد', 'الشيخ زايد', 'مئذنه', 'مآذن', 'المآذن', 'قبه', 'قباب', 'القباب', 'ثريا', 'الثريات', 'سجاده', 'السجاده'],
  },
  weakAliases: { en: ['tower', 'towers'], ar: ['برج'] },
  sourceIds: ['szgmc', 'szgmc-domes', 'szgmc-chandeliers'],
  uncertainty: {
    en: 'The 3D mosque is a simplified, not-to-scale interpretation.',
    ar: 'نموذج الجامع ثلاثي الأبعاد تفسير مبسّط وليس بالمقياس الحقيقي.',
  },
  hotspot: {
    station: 'mosque',
    position: [36, 11.5, -20],
    camera: { position: [36, 9, 6], target: [36, 5, -20] },
  },
  suggestions: {
    en: ['What is this building?', 'How many domes does it have?', 'Tell me about the carpet', 'Can anyone visit?'],
    ar: ['ما هذا المبنى؟', 'كم عدد قبابه؟', 'حدّثني عن السجادة', 'هل يمكن لأي شخص الزيارة؟'],
  },
  qa: [
    {
      id: 'mosque-overview',
      concepts: ['identity'],
      examples: {
        en: ['What is this building?', 'What is the Sheikh Zayed Grand Mosque?'],
        ar: ['ما هذا المبنى؟', 'ما هو جامع الشيخ زايد الكبير؟'],
      },
      spoken: {
        en: "This is the Sheikh Zayed Grand Mosque in Abu Dhabi. It was envisioned by the UAE's founding father, Sheikh Zayed bin Sultan Al Nahyan, and completed in 2007.",
        ar: 'هذا جامع الشيخ زايد الكبير في أبوظبي، أراده الأب المؤسس لدولة الإمارات الشيخ زايد بن سلطان آل نهيان، واكتمل بناؤه عام 2007.',
      },
      detail: {
        en: 'Its design draws on architectural traditions from across the Islamic world, and it is one of the largest mosques in the world. It is both a place of worship and a centre for cultural understanding, open to visitors of every faith.',
        ar: 'يستلهم تصميمه تقاليد معمارية من أنحاء العالم الإسلامي، وهو من أكبر المساجد في العالم. وهو دار عبادة ومركز للتواصل الثقافي في آن، ومفتوح للزوار من كل الأديان.',
      },
      sourceIds: ['szgmc'],
      followUp: { how: 'mosque-architecture', why: 'mosque-founder' },
    },
    {
      id: 'mosque-architecture',
      concepts: ['size', 'domes', 'minarets', 'tower', 'design'],
      examples: {
        en: ['How many domes does it have?', 'How tall are the minarets?', 'What is that tower?', 'How big is it?'],
        ar: ['كم عدد قبابه؟', 'كم يبلغ ارتفاع المآذن؟', 'ما هذا البرج؟', 'ما حجمه؟'],
      },
      spoken: {
        en: 'The mosque has 82 domes, more than a thousand columns and four minarets, each rising to about 107 metres.',
        ar: 'للجامع 82 قبة وأكثر من ألف عمود وأربع مآذن، يبلغ ارتفاع كل منها نحو 107 أمتار.',
      },
      detail: {
        en: 'The domes and minarets are clad in white marble, and the columns are inlaid with floral motifs in semi-precious stones and mother-of-pearl. Reflective pools surround the arcades.',
        ar: 'كُسيت القباب والمآذن بالرخام الأبيض، وطُعّمت الأعمدة بزخارف نباتية من الأحجار شبه الكريمة والصدف. وتحيط البرك العاكسة بالأروقة.',
      },
      sourceIds: ['szgmc-domes', 'szgmc'],
      uncertainty: {
        en: 'Figures are as published by the Sheikh Zayed Grand Mosque Centre; the minaret height is rounded.',
        ar: 'الأرقام كما نشرها مركز جامع الشيخ زايد الكبير، وارتفاع المآذن تقريبي.',
      },
    },
    {
      id: 'mosque-carpet',
      concepts: ['carpet'],
      examples: {
        en: ['Tell me about the carpet', 'How big is the carpet?'],
        ar: ['حدّثني عن السجادة', 'ما حجم السجادة؟'],
      },
      spoken: {
        en: 'The main prayer hall carpet is described as one of the largest hand-knotted carpets in the world, woven by hand by artisans in Iran.',
        ar: 'توصف سجادة قاعة الصلاة الرئيسية بأنها من أكبر السجاد المعقود يدوياً في العالم، وقد نسجها حرفيون يدوياً في إيران.',
      },
      detail: {
        en: 'It was woven in sections and assembled on site, with a floral medallion design.',
        ar: 'نُسجت على أجزاء ثم جُمعت في الموقع، بتصميم زخرفي نباتي.',
      },
      sourceIds: ['szgmc'],
      uncertainty: {
        en: "Published figures for the carpet's exact area and the number of weavers vary, so I don't quote them.",
        ar: 'تختلف الأرقام المنشورة لمساحة السجادة الدقيقة وعدد النسّاجين، لذا لا أذكرها.',
      },
    },
    {
      id: 'mosque-chandeliers',
      concepts: ['chandelier'],
      examples: {
        en: ['Tell me about the chandeliers', 'Where were the chandeliers made?'],
        ar: ['حدّثني عن الثريات', 'أين صُنعت الثريات؟'],
      },
      spoken: {
        en: 'Seven chandeliers hang inside, made in Germany with Swarovski crystals. The largest, in the main prayer hall, is among the biggest mosque chandeliers in the world.',
        ar: 'تتدلّى في الداخل سبع ثريات صُنعت في ألمانيا بكريستال سواروفسكي، وأكبرها في قاعة الصلاة الرئيسية من أكبر ثريات المساجد في العالم.',
      },
      detail: {
        en: 'They combine gold-plated metalwork with coloured crystal, echoing the palm-tree and floral themes used throughout the building.',
        ar: 'تجمع بين المعدن المطلي بالذهب والكريستال الملوّن، في صدى لزخارف النخيل والزهور المستخدمة في أرجاء المبنى.',
      },
      sourceIds: ['szgmc-chandeliers'],
    },
    {
      id: 'mosque-lighting',
      concepts: ['lighting'],
      examples: {
        en: ['Why does the lighting change at night?', 'Tell me about the lighting'],
        ar: ['لماذا تتغير الإضاءة ليلاً؟', 'حدّثني عن الإضاءة'],
      },
      spoken: {
        en: "The mosque's exterior lighting follows the phases of the moon, changing gradually through the lunar month.",
        ar: 'تتبع الإضاءة الخارجية للجامع أطوار القمر، فتتغيّر تدريجياً على مدار الشهر القمري.',
      },
      detail: {
        en: 'Clouds of soft blue-grey light are projected onto the white facade, brightening and dimming with the moon.',
        ar: 'تُسقَط على الواجهة البيضاء سحب من الضوء الأزرق الرمادي الناعم، تشتد وتخفت مع القمر.',
      },
      sourceIds: ['szgmc'],
    },
    {
      id: 'mosque-founder',
      concepts: ['people', 'reason', 'history'],
      examples: {
        en: ['Who built the mosque?', 'Why was it built?', 'When was it built?'],
        ar: ['من بنى الجامع؟', 'لماذا بُني؟', 'متى بُني؟'],
      },
      spoken: {
        en: 'It was the vision of Sheikh Zayed bin Sultan Al Nahyan, who wanted a mosque that would unite the cultural diversity of the Islamic world. Sheikh Zayed, who died in 2004, is buried in its grounds.',
        ar: 'كان الجامع رؤية الشيخ زايد بن سلطان آل نهيان، الذي أراد مسجداً يجمع التنوع الثقافي للعالم الإسلامي. ويرقد الشيخ زايد، الذي توفي عام 2004، في رحابه.',
      },
      detail: {
        en: 'Construction began in the 1990s and the mosque was completed in 2007. It hosts daily prayers, Friday and Eid prayers and large Ramadan iftars.',
        ar: 'بدأ البناء في تسعينيات القرن الماضي واكتمل عام 2007. ويستضيف الصلوات اليومية وصلاة الجمعة والعيدين وموائد إفطار كبيرة في رمضان.',
      },
      sourceIds: ['szgmc'],
    },
    {
      id: 'mosque-capacity',
      concepts: ['capacity'],
      examples: {
        en: ['How many people can pray here?', 'What is the capacity?'],
        ar: ['كم شخصاً يمكنه الصلاة هنا؟', 'ما سعة الجامع؟'],
      },
      spoken: {
        en: 'The mosque can hold more than 40,000 worshippers across its prayer halls and courtyard.',
        ar: 'يتّسع الجامع لأكثر من 40 ألف مصلٍّ في قاعات الصلاة والصحن.',
      },
      detail: {
        en: "The vast courtyard is paved with one of the world's largest marble mosaics, in a floral design.",
        ar: 'وصحنه الواسع مرصوف بواحدة من أكبر فسيفساء الرخام في العالم، بتصميم زهري.',
      },
      sourceIds: ['szgmc'],
      uncertainty: {
        en: 'Published capacity figures differ — commonly between about 40,000 and 55,000 depending on how the courtyard is counted.',
        ar: 'تختلف أرقام السعة المنشورة، وتتراوح عادةً بين نحو 40 ألفاً و55 ألفاً بحسب احتساب الصحن.',
      },
    },
    {
      id: 'mosque-visit',
      concepts: ['visit', 'etiquette'],
      examples: {
        en: ['Can anyone visit?', 'What should I wear?', 'Is it free?'],
        ar: ['هل يمكن لأي شخص الزيارة؟', 'ماذا أرتدي؟', 'هل الدخول مجاني؟'],
      },
      spoken: {
        en: 'Visitors of all faiths are welcome and entry is free. A modest dress code applies, so cover your arms and legs, and women cover their hair.',
        ar: 'يُرحَّب بالزوار من جميع الأديان والدخول مجاني. وتُطبَّق قواعد لباس محتشم، فيُغطّى الذراعان والساقان، وتغطي النساء شعرهن.',
      },
      detail: {
        en: 'Free guided cultural tours are offered. Visiting hours change around prayer times and during Ramadan, so check the official Sheikh Zayed Grand Mosque Centre website before you go.',
        ar: 'تُقدَّم جولات ثقافية مجانية مع مرشدين. وتتغيّر ساعات الزيارة حول أوقات الصلاة وفي رمضان، لذا راجع الموقع الرسمي لمركز جامع الشيخ زايد الكبير قبل الزيارة.',
      },
      sourceIds: ['szgmc'],
      uncertainty: {
        en: 'Booking requirements and hours change — confirm on szgmc.gov.ae.',
        ar: 'تتغيّر متطلبات الحجز والمواعيد، فتأكد منها عبر موقع المركز الرسمي.',
      },
    },
  ],
};
