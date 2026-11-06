import type { HeritageEntry } from '../types';

export const dallah: HeritageEntry = {
  id: 'dallah-hospitality',
  name: { en: 'Dallah & Emirati hospitality', ar: 'الدلّة والضيافة الإماراتية' },
  category: { en: 'Living heritage & customs', ar: 'التراث الحي والعادات' },
  location: { en: 'Majlis courtyard, Al Fahidi (scene)', ar: 'فناء المجلس، الفهيدي (المشهد)' },
  summary: {
    en: 'The dallah is the traditional Arabic coffee pot — a symbol of welcome and generosity in Emirati homes.',
    ar: 'الدلّة هي إبريق القهوة العربية التقليدي، ورمز للترحيب والكرم في البيوت الإماراتية.',
  },
  detail: {
    en: 'Serving Arabic coffee, or qahwa, from a dallah is one of the most important gestures of Emirati hospitality, usually offered in the majlis, the family sitting room for receiving guests.',
    ar: 'تقديم القهوة العربية من الدلّة من أهم مظاهر الضيافة الإماراتية، وغالباً ما يكون في المجلس، وهو مكان جلوس العائلة لاستقبال الضيوف.',
  },
  aliases: {
    en: ['dallah', 'dalla', 'dallahs', 'coffee pot', 'coffeepot', 'qahwa', 'gahwa', 'kahwa', 'arabic coffee', 'finjan', 'majlis', 'hospitality'],
    ar: ['دله', 'الدله', 'دلال', 'قهوه', 'القهوه', 'فنجان', 'الفنجان', 'مجلس', 'المجلس', 'ضيافه', 'الضيافه'],
  },
  weakAliases: { en: ['pot', 'coffee', 'cup', 'cups'], ar: ['ابريق'] },
  sourceIds: ['unesco-coffee', 'unesco-majlis', 'smccu', 'cbuae-coins'],
  hotspot: {
    station: 'majlis',
    position: [-6.2, 1.6, 5.2],
    camera: { position: [-1.8, 2.4, 9.6], target: [-6.2, 0.6, 5.2] },
  },
  suggestions: {
    en: ['What is this pot?', 'How is the coffee served?', 'How do I say I have had enough?', 'Is it recognised by UNESCO?'],
    ar: ['ما هذه الدلّة؟', 'كيف تُقدَّم القهوة؟', 'كيف أشير إلى أنني اكتفيت؟', 'هل اعترفت بها اليونسكو؟'],
  },
  qa: [
    {
      id: 'dallah-overview',
      concepts: ['identity'],
      examples: {
        en: ['What is this pot?', 'What is a dallah?', 'What is that?'],
        ar: ['ما هذه الدلة؟', 'ما هي الدلة؟', 'ما هذا؟'],
      },
      spoken: {
        en: "This is a dallah — the traditional Arabic coffee pot, recognisable by its long, curved spout. In Emirati homes, pouring coffee from it is a symbol of welcome and generosity.",
        ar: 'هذه دلّة، إبريق القهوة العربية التقليدي، وتُعرف بمنقارها الطويل المقوّس. وفي البيوت الإماراتية يُعدّ صبّ القهوة منها رمزاً للترحيب والكرم.',
      },
      detail: {
        en: 'Dallahs are traditionally made of metal such as brass or copper, with a lid topped by a finial. The coffee they hold — qahwa — is offered to guests in the majlis as a first gesture of hospitality.',
        ar: 'تُصنع الدلال تقليدياً من المعادن كالنحاس الأصفر أو الأحمر، ولها غطاء يعلوه رأس مزخرف. وتُقدَّم القهوة فيها للضيوف في المجلس أولى علامات الضيافة.',
      },
      sourceIds: ['unesco-coffee', 'smccu'],
      followUp: { how: 'dallah-serving', why: 'dallah-meaning' },
    },
    {
      id: 'dallah-serving',
      concepts: ['serving', 'mechanism'],
      examples: {
        en: ['How is the coffee served?', 'How do you serve Arabic coffee?', 'Who is served first?'],
        ar: ['كيف تُقدَّم القهوة؟', 'كيف تقدم القهوة العربية؟', 'من يُقدَّم له أولاً؟'],
      },
      spoken: {
        en: 'Coffee is poured in small amounts into a little handleless cup called a finjan, and handed over with the right hand. The most senior or honoured guest is traditionally served first.',
        ar: 'تُصبّ القهوة بكميات قليلة في فنجان صغير بلا مقبض، ويُقدَّم باليد اليمنى. وجرت العادة أن يُبدأ بأكبر الضيوف سناً أو مقاماً.',
      },
      detail: {
        en: 'The person serving usually stands and keeps refilling cups as they are emptied. Only a little coffee is poured at a time so it stays hot and the guest can be served again — part of the ritual of attentive hospitality.',
        ar: 'يقف المقهوي عادةً ويواصل ملء الفناجين كلما فرغت. ولا يُصبّ إلا القليل في كل مرة لتبقى القهوة ساخنة ولكي يُقدَّم للضيف مجدداً، وذلك جزء من طقوس الضيافة والاهتمام.',
      },
      sourceIds: ['unesco-coffee', 'smccu'],
      followUp: { why: 'dallah-meaning', how: 'dallah-enough' },
    },
    {
      id: 'dallah-enough',
      concepts: ['etiquette'],
      examples: {
        en: ['How do I say I have had enough?', 'How many cups should I drink?', 'Why do people shake the cup?'],
        ar: ['كيف أشير إلى أنني اكتفيت؟', 'كم فنجاناً أشرب؟', 'لماذا يهز الناس الفنجان؟'],
      },
      spoken: {
        en: "It's customary to accept at least one cup — often up to three. When you've had enough, gently shake the empty cup from side to side as you hand it back.",
        ar: 'من العادة قبول فنجان واحد على الأقل، وغالباً حتى ثلاثة. وعندما تكتفي، هزّ الفنجان الفارغ برفق يميناً ويساراً وأنت تعيده.',
      },
      detail: {
        en: 'Declining the first cup can seem impolite, so guests usually take at least one. Shaking the cup is the polite, wordless signal that you are finished; otherwise the host will keep refilling it.',
        ar: 'قد يبدو رفض الفنجان الأول غير لائق، لذا يقبل الضيوف فنجاناً واحداً على الأقل. وهزّ الفنجان إشارة مهذبة صامتة إلى الاكتفاء، وإلا فسيواصل المضيف ملأه.',
      },
      sourceIds: ['unesco-coffee', 'smccu'],
    },
    {
      id: 'dallah-ingredients',
      concepts: ['ingredients'],
      examples: {
        en: ['What is in Arabic coffee?', 'What does it taste like?', 'Is there cardamom in it?'],
        ar: ['ما مكونات القهوة العربية؟', 'ما طعمها؟', 'هل فيها هيل؟'],
      },
      spoken: {
        en: 'Arabic coffee is made from lightly roasted beans and is usually flavoured with cardamom; saffron is sometimes added. It is often served with dates.',
        ar: 'تُحضَّر القهوة العربية من حبوب محمّصة تحميصاً خفيفاً، وتُنكَّه عادةً بالهيل، ويُضاف إليها الزعفران أحياناً. وغالباً ما تُقدَّم مع التمر.',
      },
      detail: {
        en: 'Because the beans are lightly roasted, qahwa is golden and aromatic rather than dark and bitter. Recipes vary between families and regions.',
        ar: 'لأن الحبوب تُحمّص تحميصاً خفيفاً، تأتي القهوة ذهبية اللون عطرية بدلاً من أن تكون داكنة مُرّة. وتختلف الوصفات بين العائلات والمناطق.',
      },
      sourceIds: ['unesco-coffee'],
      uncertainty: {
        en: 'Recipes differ from family to family, so treat these as common ingredients rather than a fixed recipe.',
        ar: 'تختلف الوصفات من عائلة لأخرى، فاعتبر هذه مكونات شائعة لا وصفة ثابتة.',
      },
    },
    {
      id: 'dallah-unesco',
      concepts: ['unesco'],
      examples: {
        en: ['Is it recognised by UNESCO?', 'Is Arabic coffee world heritage?'],
        ar: ['هل اعترفت بها اليونسكو؟', 'هل القهوة العربية تراث عالمي؟'],
      },
      spoken: {
        en: "Yes. In 2015, 'Arabic coffee, a symbol of generosity' was inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity, nominated jointly by the UAE, Saudi Arabia, Oman and Qatar. In 2024 the inscription was extended to include more countries.",
        ar: 'نعم. في عام 2015 أُدرجت «القهوة العربية رمز للكرم» في القائمة التمثيلية للتراث الثقافي غير المادي للبشرية لدى اليونسكو، بترشيح مشترك من الإمارات والسعودية وعُمان وقطر، ثم وُسّع الإدراج عام 2024 ليشمل دولاً أخرى.',
      },
      detail: {
        en: "The same year, 'Majlis, a cultural and social space' was also inscribed — the setting where coffee is most often served.",
        ar: 'وفي العام نفسه أُدرج أيضاً «المجلس فضاء ثقافي واجتماعي»، وهو المكان الذي تُقدَّم فيه القهوة غالباً.',
      },
      sourceIds: ['unesco-coffee', 'unesco-majlis'],
    },
    {
      id: 'dallah-majlis',
      concepts: ['majlis'],
      examples: {
        en: ['What is a majlis?', 'Where is coffee served?'],
        ar: ['ما هو المجلس؟', 'أين تُقدَّم القهوة؟'],
      },
      spoken: {
        en: 'A majlis is a sitting room or gathering space where family and community meet, share news and receive guests. It is where coffee is most often served.',
        ar: 'المجلس غرفة جلوس أو مكان تجمّع يلتقي فيه أفراد العائلة والمجتمع ويتبادلون الأخبار ويستقبلون الضيوف، وفيه تُقدَّم القهوة غالباً.',
      },
      detail: {
        en: 'UNESCO describes the majlis as a space for discussing local issues, settling disputes and passing on oral heritage, with coffee and hospitality at its centre.',
        ar: 'تصف اليونسكو المجلس بأنه فضاء لمناقشة الشؤون المحلية وحل الخلافات ونقل التراث الشفهي، وتتوسطه القهوة والضيافة.',
      },
      sourceIds: ['unesco-majlis'],
    },
    {
      id: 'dallah-meaning',
      concepts: ['meaning', 'reason'],
      examples: {
        en: ['Why is coffee so important?', 'What does the dallah symbolise?', 'Why?'],
        ar: ['لماذا القهوة مهمة؟', 'إلامَ ترمز الدلة؟', 'لماذا؟'],
      },
      spoken: {
        en: 'Offering coffee says "you are welcome here". It honours the guest and reflects generosity — which is why the dallah has become a national emblem of Emirati hospitality.',
        ar: 'تقديم القهوة يعني «أهلاً بك». فهو تكريم للضيف وتعبير عن الكرم، ولهذا أصبحت الدلّة رمزاً وطنياً للضيافة الإماراتية.',
      },
      detail: {
        en: 'The dallah appears widely in Emirati public life — on the UAE one-dirham coin, in public art and in heritage displays.',
        ar: 'تظهر الدلّة على نطاق واسع في الحياة العامة الإماراتية: على قطعة الدرهم الواحد، وفي الأعمال الفنية العامة، وفي المعارض التراثية.',
      },
      sourceIds: ['unesco-coffee', 'cbuae-coins'],
    },
    {
      id: 'dallah-coin',
      concepts: ['coin'],
      examples: {
        en: ['Is the dallah on a coin?', 'Which coin shows a dallah?'],
        ar: ['هل الدلة على عملة؟', 'أي عملة تظهر عليها الدلة؟'],
      },
      spoken: {
        en: 'The dallah features on the UAE one-dirham coin.',
        ar: 'تظهر الدلّة على قطعة الدرهم الإماراتي الواحد.',
      },
      detail: {
        en: 'Its place on everyday currency reflects how central coffee hospitality is to national identity.',
        ar: 'ويعكس وجودها على العملة اليومية مكانة ضيافة القهوة في الهوية الوطنية.',
      },
      sourceIds: ['cbuae-coins'],
    },
  ],
};
