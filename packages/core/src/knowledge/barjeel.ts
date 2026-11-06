import type { HeritageEntry } from '../types';

export const barjeel: HeritageEntry = {
  id: 'barjeel-al-fahidi',
  name: { en: 'Barjeel wind tower — Al Fahidi', ar: 'البرجيل — حي الفهيدي التاريخي' },
  category: { en: 'Traditional architecture', ar: 'العمارة التقليدية' },
  location: { en: 'Al Fahidi Historical Neighbourhood, Bur Dubai', ar: 'حي الفهيدي التاريخي، بر دبي' },
  geo: { lat: 25.2637, lng: 55.2995, label: 'Al Fahidi Historical Neighbourhood, Dubai' },
  summary: {
    en: 'A barjeel is a traditional wind tower that caught breezes and channelled them into the rooms below, long before air conditioning.',
    ar: 'البرجيل برج هواء تقليدي كان يلتقط النسيم ويوجّهه إلى الغرف في الأسفل، قبل ظهور المكيفات بزمن طويل.',
  },
  detail: {
    en: 'Al Fahidi Historical Neighbourhood, once known as Bastakiya, lies beside Dubai Creek. Its restored courtyard houses, narrow shaded lanes and wind towers preserve how Dubai lived and kept cool before electricity.',
    ar: 'يقع حي الفهيدي التاريخي، المعروف سابقاً باسم البستكية، بجوار خور دبي. وتحفظ بيوته ذات الأفنية المرمّمة وأزقّته الضيقة الظليلة وأبراج الهواء فيه صورة الحياة في دبي وطرق التبريد قبل الكهرباء.',
  },
  aliases: {
    en: ['barjeel', 'barjil', 'barajeel', 'barjeels', 'windtower', 'windcatcher', 'wind catcher', 'wind tower', 'fahidi', 'bastakiya', 'bastakia'],
    ar: ['برجيل', 'براجيل', 'البرجيل', 'برج الهواء', 'ابراج الهواء', 'الفهيدي', 'فهيدي', 'البستكيه', 'بستكيه'],
  },
  weakAliases: { en: ['tower', 'towers'], ar: ['برج', 'البرج'] },
  sourceIds: ['dubaiculture-alfahidi', 'culturalmap', 'windcatcher-ref'],
  uncertainty: {
    en: 'The 3D scene is a stylised educational interpretation, not an archaeologically exact reconstruction.',
    ar: 'المشهد ثلاثي الأبعاد تفسير تعليمي مبسّط، وليس إعادة بناء أثرية دقيقة.',
  },
  hotspot: {
    station: 'alfahidi',
    position: [2.5, 10.2, -2],
    camera: { position: [-0.5, 6.2, 13.5], target: [2.5, 6.4, -2] },
  },
  suggestions: {
    en: ['What is that tower?', 'How did it keep buildings cool?', 'What is it made of?', 'Tell me more'],
    ar: ['ما هذا البرج؟', 'كيف كان يبرّد البيوت؟', 'مما صُنع؟', 'أخبرني المزيد'],
  },
  qa: [
    {
      id: 'barjeel-overview',
      concepts: ['identity', 'tower'],
      examples: {
        en: ['What is that tower?', 'What is a barjeel?', 'What am I looking at?'],
        ar: ['ما هذا البرج؟', 'ما هو البرجيل؟', 'ما الذي أنظر إليه؟'],
      },
      spoken: {
        en: "That's a barjeel — a traditional wind tower. Before air conditioning, towers like this caught passing breezes and channelled them down into the rooms below.",
        ar: 'هذا برجيل، أي برج هواء تقليدي. قبل المكيفات، كانت هذه الأبراج تلتقط النسيم وتوجّهه إلى الغرف في الأسفل.',
      },
      detail: {
        en: "You're in Al Fahidi Historical Neighbourhood beside Dubai Creek, where restored courtyard houses still carry their wind towers. The barjeel is one of the most recognisable features of traditional Gulf architecture: a tall, square tower, open at the top, that turns the wind into natural ventilation.",
        ar: 'أنت في حي الفهيدي التاريخي بجوار خور دبي، حيث ما زالت البيوت ذات الأفنية المرمّمة تحمل أبراج الهواء. والبرجيل من أبرز ملامح العمارة الخليجية التقليدية: برج مربّع طويل مفتوح من الأعلى يحوّل الرياح إلى تهوية طبيعية.',
      },
      sourceIds: ['dubaiculture-alfahidi'],
      followUp: { how: 'barjeel-cooling', why: 'barjeel-why-design' },
    },
    {
      id: 'barjeel-cooling',
      concepts: ['cooling', 'mechanism'],
      examples: {
        en: ['How did it keep buildings cool?', 'How does it work?', 'How did it cool the house?'],
        ar: ['كيف كان يبرّد البيوت؟', 'كيف يعمل؟', 'كيف كان يبرد المنزل؟'],
      },
      spoken: {
        en: "The top is open on all four sides and divided inside into shafts. The side facing the wind catches it and pushes air down into the room, while warmer air escapes up the other side. That constant airflow made rooms feel noticeably cooler.",
        ar: 'أعلى البرج مفتوح من الجهات الأربع ومقسّم من الداخل إلى ممرات. الجهة المواجهة للريح تلتقطها وتدفع الهواء إلى الغرفة، بينما يخرج الهواء الأدفأ من الجهة الأخرى. هذا التيار المستمر جعل الغرف أكثر برودة بشكل ملحوظ.',
      },
      detail: {
        en: 'Internal partitions split the tower into vertical channels. Wind entering the windward opening is forced downward into the living space; on the sheltered side, lower pressure and rising warm air draw stale air back up and out. The barjeel ventilates rather than refrigerates: moving air carries heat away and helps sweat evaporate from the skin, which is why rooms under a wind tower felt cooler.',
        ar: 'تقسّم الجدران الداخلية البرج إلى قنوات عمودية. فالريح الداخلة من الفتحة المواجهة لها تُدفع إلى أسفل نحو مكان المعيشة، وفي الجهة المحمية يسحب الضغط المنخفض والهواء الدافئ الصاعد الهواءَ الراكد إلى الأعلى والخارج. البرجيل يهوّي ولا يبرّد كالمكيّف: فالهواء المتحرك يحمل الحرارة بعيداً ويساعد على تبخّر العرق من الجلد، ولذلك كانت الغرف تحت البرج أكثر برودة.',
      },
      sourceIds: ['windcatcher-ref', 'dubaiculture-alfahidi'],
      uncertainty: {
        en: "My sources don't give a verified temperature drop — the effect depends on the design and the day's wind.",
        ar: 'لا تذكر مصادري انخفاضاً موثّقاً في درجة الحرارة، فالأثر يعتمد على التصميم وعلى الرياح في ذلك اليوم.',
      },
      followUp: { why: 'barjeel-why-design', how: 'barjeel-materials' },
    },
    {
      id: 'barjeel-why-design',
      concepts: ['design', 'reason'],
      examples: {
        en: ['Why is it so tall?', 'Why is it open on four sides?', 'Why?'],
        ar: ['لماذا هو طويل؟', 'لماذا هو مفتوح من أربع جهات؟', 'لماذا؟'],
      },
      spoken: {
        en: 'Because breezes in the Gulf shift direction, an opening on every side means the tower can catch wind from anywhere. Its height reaches moving air above the rooftops and the dust of the lanes.',
        ar: 'لأن اتجاه النسيم في الخليج يتغيّر، فإن وجود فتحة في كل جهة يتيح للبرج التقاط الريح من أي اتجاه. كما أن ارتفاعه يصل إلى الهواء المتحرك فوق الأسطح بعيداً عن غبار الأزقة.',
      },
      detail: {
        en: 'Wind is generally stronger and steadier above roof level than in a narrow street, so a tall tower captures more useful airflow. The four-sided opening removes the need to orient the house to a single prevailing wind.',
        ar: 'تكون الرياح عادةً أقوى وأكثر ثباتاً فوق مستوى الأسطح منها في الأزقة الضيقة، لذا يلتقط البرج الطويل تياراً هوائياً أنفع. والفتحات في الجهات الأربع تغني عن توجيه البيت نحو ريح سائدة واحدة.',
      },
      sourceIds: ['windcatcher-ref'],
      followUp: { how: 'barjeel-cooling' },
    },
    {
      id: 'barjeel-materials',
      concepts: ['materials'],
      examples: {
        en: ['What is it made of?', 'What materials were used?', 'How was it built?'],
        ar: ['مما صُنع؟', 'ما المواد المستخدمة؟', 'كيف بُني؟'],
      },
      spoken: {
        en: "Al Fahidi's houses were built from traditional materials — stone and gypsum, with teak, sandalwood, palm fronds and palm wood. They suit the heat and humidity of the creek.",
        ar: 'بُنيت بيوت الفهيدي من مواد تقليدية: الحجر والجص، مع خشب الساج والصندل وسعف النخيل وخشبه، وهي مواد تلائم حرارة الخور ورطوبته.',
      },
      detail: {
        en: 'Thick stone and gypsum walls slowed the transfer of daytime heat, while timber — including imported teak — formed beams, doors and the frames of the wind towers. The 3D model in NAZAR uses these colours and textures as a simplified interpretation.',
        ar: 'أبطأت الجدران السميكة من الحجر والجص انتقال حرارة النهار، بينما استُخدم الخشب، ومنه الساج المستورد، في العوارض والأبواب وهياكل أبراج الهواء. ويستخدم نموذج نَظَر ثلاثي الأبعاد هذه الألوان والخامات تفسيراً مبسّطاً.',
      },
      sourceIds: ['dubaiculture-alfahidi'],
    },
    {
      id: 'barjeel-history',
      concepts: ['history', 'people'],
      examples: {
        en: ['How old is this neighbourhood?', 'When was it built?', 'Who built these houses?', 'Why was it called Bastakiya?'],
        ar: ['كم عمر هذا الحي؟', 'متى بُني؟', 'من بنى هذه البيوت؟', 'لماذا سُمّي بالبستكية؟'],
      },
      spoken: {
        en: 'Al Fahidi, once called Bastakiya, grew in the nineteenth century beside Dubai Creek. Many of its merchant families traced their roots to the Bastak region across the Gulf, which gave the area its old name.',
        ar: 'نشأ حي الفهيدي، الذي كان يُسمّى البستكية، في القرن التاسع عشر بجوار خور دبي. وتعود أصول كثير من عائلات التجار فيه إلى منطقة بستك على الضفة الأخرى من الخليج، ومنها جاء اسمه القديم.',
      },
      detail: {
        en: "The neighbourhood is one of the oldest surviving parts of Dubai's historic core. Much of it was restored in recent decades and it is now protected as a heritage district.",
        ar: 'يُعدّ الحي من أقدم الأجزاء الباقية في قلب دبي التاريخي، وقد رُمّم جزء كبير منه في العقود الأخيرة وهو اليوم محمي بوصفه منطقة تراثية.',
      },
      sourceIds: ['dubaiculture-alfahidi'],
      uncertainty: {
        en: 'Sources differ on exact dates — some say the district dates from the 1890s, others from the mid-19th century — and dates vary from house to house.',
        ar: 'تختلف المصادر في التواريخ الدقيقة؛ فبعضها يرجع الحي إلى تسعينيات القرن التاسع عشر وبعضها إلى منتصفه، كما تختلف التواريخ من بيت لآخر.',
      },
    },
    {
      id: 'barjeel-lanes',
      concepts: ['lanes'],
      examples: {
        en: ['Why are the alleys so narrow?', 'What are these lanes called?'],
        ar: ['لماذا الأزقة ضيقة؟', 'ماذا تسمى هذه الممرات؟'],
      },
      spoken: {
        en: 'The narrow lanes, called sikka, keep walkers in shade for most of the day and help channel breezes between the houses.',
        ar: 'الأزقة الضيقة، وتُسمّى السكة، تُبقي المارّة في الظل معظم النهار وتساعد على توجيه النسيم بين البيوت.',
      },
      detail: {
        en: "Tall walls on both sides of a sikka cast shade on each other, so the lanes stay cooler than open ground. The word is familiar today through Dubai's Sikka Art festival, held in the neighbourhood.",
        ar: 'تلقي الجدران العالية على جانبي السكة ظلالها على بعضها، فتبقى الأزقة أبرد من الأرض المكشوفة. وأصبحت الكلمة مألوفة اليوم من خلال مهرجان سكة للفنون الذي يُقام في الحي.',
      },
      sourceIds: ['dubaiculture-alfahidi'],
    },
    {
      id: 'barjeel-name',
      concepts: ['name'],
      examples: {
        en: ['What does barjeel mean?', 'What is it called in Arabic?'],
        ar: ['ما معنى برجيل؟', 'ماذا يسمى بالعربية؟'],
      },
      spoken: {
        en: "Barjeel — برجيل — is the Gulf Arabic name for the wind tower. In English it's usually called a wind tower or windcatcher.",
        ar: 'البرجيل هو الاسم الخليجي لبرج الهواء، ويُسمّى بالإنجليزية عادةً «برج الرياح» أو «ملقف الهواء».',
      },
      detail: {
        en: 'Similar towers appear across the Gulf and the wider region under different local names. NAZAR uses the Emirati term barjeel.',
        ar: 'تنتشر أبراج مشابهة في أنحاء الخليج والمنطقة بأسماء محلية مختلفة، ويستخدم نَظَر المصطلح الإماراتي «البرجيل».',
      },
      sourceIds: ['dubaiculture-alfahidi', 'windcatcher-ref'],
    },
    {
      id: 'barjeel-today',
      concepts: ['visit', 'today'],
      examples: {
        en: ['Can I visit it?', 'What is here today?', 'Is it still used today?'],
        ar: ['هل يمكنني زيارته؟', 'ماذا يوجد هنا اليوم؟', 'هل ما زال يُستخدم اليوم؟'],
      },
      spoken: {
        en: "Al Fahidi is open to visitors in Bur Dubai. Its restored houses now hold museums, galleries, cafés and the Sheikh Mohammed Centre for Cultural Understanding.",
        ar: 'حي الفهيدي مفتوح للزوار في بر دبي. وتضم بيوته المرمّمة اليوم متاحف ومعارض ومقاهي ومركز الشيخ محمد بن راشد آل مكتوم للتواصل الحضاري.',
      },
      detail: {
        en: 'Modern buildings in Dubai rely on air conditioning, but the barjeel remains an emblem of Emirati architecture and a reference point for passive, low-energy cooling design.',
        ar: 'تعتمد المباني الحديثة في دبي على التكييف، لكن البرجيل يبقى رمزاً للعمارة الإماراتية ومرجعاً لتصاميم التبريد السلبي منخفض الطاقة.',
      },
      sourceIds: ['dubaiculture-alfahidi', 'smccu'],
      uncertainty: {
        en: 'Opening hours and venues change — check Dubai Culture or Visit Dubai before you go.',
        ar: 'تتغيّر ساعات العمل والأماكن، لذا يُرجى مراجعة موقع «زوروا دبي» قبل الزيارة.',
      },
    },
  ],
};
