import type { HeritageEntry } from '../types';

export const alain: HeritageEntry = {
  id: 'al-ain-oasis',
  name: { en: 'Al Ain Oasis & the falaj', ar: 'واحة العين والأفلاج' },
  category: { en: 'World Heritage landscape', ar: 'موقع تراث عالمي' },
  location: { en: 'Al Ain, Abu Dhabi', ar: 'العين، أبوظبي' },
  geo: { lat: 24.2155, lng: 55.7619, label: 'Al Ain Oasis' },
  summary: {
    en: "A date-palm oasis watered by the ancient falaj channel system — part of the UAE's first UNESCO World Heritage Site.",
    ar: 'واحة نخيل تُروى بنظام الأفلاج القديم، وهي جزء من أول موقع إماراتي على قائمة التراث العالمي لليونسكو.',
  },
  detail: {
    en: "The Cultural Sites of Al Ain — Hafit, Hili, Bidaa Bint Saud and the oases — were inscribed on UNESCO's World Heritage List in 2011.",
    ar: 'أُدرجت المواقع الثقافية في العين — حفيت وهيلي وبدع بنت سعود ومناطق الواحات — على قائمة التراث العالمي لليونسكو عام 2011.',
  },
  aliases: {
    en: ['al ain', 'alain', 'oasis', 'falaj', 'aflaj', 'hafit', 'hili', 'date palm', 'palms'],
    ar: ['العين', 'واحه', 'الواحه', 'فلج', 'الفلج', 'افلاج', 'الافلاج', 'حفيت', 'هيلي', 'نخيل', 'النخيل'],
  },
  sourceIds: ['unesco-alain', 'visitabudhabi'],
  hotspot: {
    station: 'alain',
    position: [-34, 4.5, -18],
    camera: { position: [-34, 7, 2], target: [-34, 1.5, -18] },
  },
  suggestions: {
    en: ['What is this place?', 'How does a falaj work?', 'Is it a World Heritage Site?'],
    ar: ['ما هذا المكان؟', 'كيف يعمل الفلج؟', 'هل هو موقع تراث عالمي؟'],
  },
  qa: [
    {
      id: 'alain-overview',
      concepts: ['identity'],
      examples: { en: ['What is this place?', 'What is Al Ain Oasis?'], ar: ['ما هذا المكان؟', 'ما هي واحة العين؟'] },
      spoken: {
        en: "This is Al Ain Oasis — a shaded grove of date palms in the heart of Al Ain, watered for centuries by falaj channels. It's part of the UAE's first UNESCO World Heritage Site.",
        ar: 'هذه واحة العين، بستان ظليل من نخيل التمر في قلب مدينة العين، تُروى منذ قرون بقنوات الأفلاج، وهي جزء من أول موقع إماراتي على قائمة التراث العالمي لليونسكو.',
      },
      detail: {
        en: 'Walking paths run between walled plantations of palms and fruit trees, with the falaj channels still carrying water through the oasis.',
        ar: 'تمتد ممرات المشي بين بساتين النخيل والأشجار المثمرة المسوّرة، وما زالت قنوات الأفلاج تحمل الماء عبر الواحة.',
      },
      sourceIds: ['unesco-alain', 'visitabudhabi'],
      followUp: { how: 'alain-falaj', why: 'alain-unesco' },
    },
    {
      id: 'alain-falaj',
      concepts: ['mechanism', 'water'],
      examples: { en: ['How does a falaj work?', 'Where does the water come from?'], ar: ['كيف يعمل الفلج؟', 'من أين يأتي الماء؟'] },
      spoken: {
        en: 'A falaj is a channel that carries groundwater by gravity — often underground at first, then along open channels — to farms in the oasis. Water is shared out between owners on a time-based schedule.',
        ar: 'الفلج قناة تنقل المياه الجوفية بالجاذبية، غالباً تحت الأرض في البداية ثم في قنوات مكشوفة، إلى المزارع في الواحة. ويُوزَّع الماء بين الملاك وفق جدول زمني.',
      },
      detail: {
        en: 'UNESCO cites the Al Ain falaj systems as evidence of sustainable water management in the desert stretching back to the Iron Age.',
        ar: 'تستشهد اليونسكو بأفلاج العين دليلاً على إدارة مستدامة للمياه في الصحراء تعود إلى العصر الحديدي.',
      },
      sourceIds: ['unesco-alain'],
    },
    {
      id: 'alain-unesco',
      concepts: ['unesco', 'history'],
      examples: { en: ['Is it a World Heritage Site?', 'How old is it?'], ar: ['هل هو موقع تراث عالمي؟', 'كم عمره؟'] },
      spoken: {
        en: 'In 2011, the Cultural Sites of Al Ain — Hafit, Hili, Bidaa Bint Saud and the oasis areas — became the first UNESCO World Heritage Site in the UAE.',
        ar: 'في عام 2011 أصبحت المواقع الثقافية في العين — حفيت وهيلي وبدع بنت سعود ومناطق الواحات — أول موقع تراث عالمي لليونسكو في الإمارات.',
      },
      detail: {
        en: 'The inscription covers evidence of settlement from the Neolithic onwards, including Bronze Age tombs at Jebel Hafit and Hili.',
        ar: 'يشمل الإدراج شواهد على الاستيطان منذ العصر الحجري الحديث، ومنها مدافن العصر البرونزي في جبل حفيت وهيلي.',
      },
      sourceIds: ['unesco-alain'],
    },
    {
      id: 'alain-palms',
      concepts: ['size'],
      examples: { en: ['How many palm trees are there?', 'How big is the oasis?'], ar: ['كم عدد النخيل؟', 'ما مساحة الواحة؟'] },
      spoken: {
        en: 'Al Ain Oasis has well over a hundred thousand date palms, of many different varieties.',
        ar: 'تضم واحة العين أكثر من مئة ألف نخلة بأصناف متعددة.',
      },
      detail: {
        en: 'Visitor information from Abu Dhabi tourism describes it as home to around 147,000 date palms.',
        ar: 'تصفها معلومات الزوار الصادرة عن هيئة السياحة في أبوظبي بأنها تضم نحو 147 ألف نخلة.',
      },
      sourceIds: ['visitabudhabi'],
      uncertainty: {
        en: 'Palm counts are approximate and quoted from visitor information.',
        ar: 'أعداد النخيل تقريبية ومنقولة من معلومات الزوار.',
      },
    },
  ],
};
