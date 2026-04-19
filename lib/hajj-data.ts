export type HajjLocale = 'de' | 'fr' | 'en'
export type ChecklistCategory = 'documents' | 'clothing' | 'health' | 'essentials'

export interface MultilingualText {
  de: string
  fr: string
  en: string
}

export interface HajjStep {
  id: string
  order: number
  title: MultilingualText
  description: MultilingualText
  arabic: string
}

export interface UmrahStep {
  id: string
  order: number
  title: MultilingualText
  description: MultilingualText
  arabic: string
}

export interface HajjDua {
  id: string
  arabic: string
  transliteration: string
  meaning: MultilingualText
  context: MultilingualText
}

export interface ChecklistItem {
  id: string
  category: ChecklistCategory
  label: MultilingualText
}

export interface OfficialLink {
  id: string
  title: MultilingualText
  url: string
  country: MultilingualText
}

export const HAJJ_STEPS: HajjStep[] = [
  {
    id: 'ihram',
    order: 1,
    arabic: 'الإحرام',
    title: {
      de: 'Ihram anlegen',
      fr: "Revêtir l'Ihram",
      en: 'Entering Ihram',
    },
    description: {
      de: 'Vor dem Miqat das weiße Ihram-Gewand anlegen, die Niyyah (Absicht) für Hajj aussprechen und die Talbiyah rezitieren: "Labbayk Allāhumma labbayk..."',
      fr: "Avant le Miqat, revêtir le vêtement blanc d'Ihram, prononcer la Niyyah pour le Hajj et réciter la Talbiyah : « Labbayk Allāhumma labbayk... »",
      en: 'Before the Miqat, put on the white Ihram garment, declare the Niyyah (intention) for Hajj, and recite the Talbiyah: "Labbayk Allāhumma labbayk..."',
    },
  },
  {
    id: 'tawaf-qudum',
    order: 2,
    arabic: 'طواف القدوم',
    title: {
      de: 'Tawaf al-Qudum',
      fr: 'Tawaf al-Qudum',
      en: 'Tawaf al-Qudum',
    },
    description: {
      de: 'Bei Ankunft in Mekka die Kaaba 7-mal gegen den Uhrzeigersinn umrunden (Tawaf des Empfangs). Jede Runde beginnt und endet am Schwarzen Stein.',
      fr: "À l'arrivée à La Mecque, effectuer 7 circumambulations autour de la Ka'ba dans le sens antihoraire (Tawaf d'arrivée). Chaque tour commence et finit à la Pierre Noire.",
      en: "Upon arriving in Mecca, circumambulate the Ka'bah 7 times counter-clockwise (arrival Tawaf). Each circuit begins and ends at the Black Stone.",
    },
  },
  {
    id: 'sai',
    order: 3,
    arabic: 'السعي',
    title: {
      de: "Sa'i — Safa und Marwa",
      fr: "Sa'i — Safa et Marwa",
      en: "Sa'i — Safa and Marwa",
    },
    description: {
      de: '7-mal zwischen den Hügeln Safa und Marwa laufen, in Erinnerung an Hagars Suche nach Wasser für ihren Sohn Ismail. Gesamtstrecke ca. 3,15 km.',
      fr: "Marcher 7 fois entre les collines de Safa et Marwa, en souvenir de la recherche d'eau de Hajar pour son fils Ismaïl. Distance totale environ 3,15 km.",
      en: "Walk 7 times between the hills of Safa and Marwa, commemorating Hajar's search for water for her son Ismail. Total distance approx. 3.15 km.",
    },
  },
  {
    id: 'arafat',
    order: 4,
    arabic: 'عرفات',
    title: {
      de: 'Wuquf in Arafat',
      fr: 'Wuquf à Arafat',
      en: 'Standing at Arafat',
    },
    description: {
      de: 'Am 9. Dhul Hijjah auf der Ebene von Arafat stehen und beten — dies ist der Höhepunkt des Hajj. Nach Sonnenuntergang nach Muzdalifa aufbrechen.',
      fr: "Le 9 Dhul Hijjah, se tenir debout et prier sur la plaine d'Arafat — c'est le point culminant du Hajj. Après le coucher du soleil, se diriger vers Muzdalifa.",
      en: 'On the 9th of Dhul Hijjah, stand and pray on the Plain of Arafat — this is the climax of Hajj. After sunset, depart for Muzdalifa.',
    },
  },
  {
    id: 'muzdalifa',
    order: 5,
    arabic: 'مزدلفة',
    title: {
      de: 'Muzdalifa & Steinigung',
      fr: 'Muzdalifa & Lapidation',
      en: 'Muzdalifa & Stoning',
    },
    description: {
      de: 'Nacht in Muzdalifa verbringen und 49 Kieselsteine sammeln. Am 10. Dhul Hijjah (Eid al-Adha) die große Jamara (Teufelssäule) mit 7 Steinen bewerfen.',
      fr: "Passer la nuit à Muzdalifa et ramasser 49 petits cailloux. Le 10 Dhul Hijjah (Aïd al-Adha), lapider la grande Jamarat avec 7 pierres.",
      en: 'On the 10th of Dhul Hijjah (Eid al-Adha), stone the large Jamarat (pillar) with 7 pebbles.',
    },
  },
  {
    id: 'tawaf-ifadah',
    order: 6,
    arabic: 'طواف الإفاضة',
    title: {
      de: 'Opfer, Haareschneiden & Tawaf al-Ifadah',
      fr: 'Sacrifice, rasage & Tawaf al-Ifadah',
      en: 'Sacrifice, Hair & Tawaf al-Ifadah',
    },
    description: {
      de: "Das Opfertier schlachten (Qurbani), Haare rasieren oder kürzen (Tahallul), dann den Tawaf al-Ifadah und Sa'i vollziehen. Abschluss: Abschiedstawaf (Tawaf al-Wada).",
      fr: "Immoler l'animal de sacrifice (Qurbani), se raser ou se couper les cheveux (Tahallul), puis effectuer le Tawaf al-Ifadah et le Sa'i. Fin : Tawaf d'adieu (Tawaf al-Wada).",
      en: "Slaughter the sacrificial animal (Qurbani), shave or trim hair (Tahallul), then perform Tawaf al-Ifadah and Sa'i. Final step: Farewell Tawaf (Tawaf al-Wada).",
    },
  },
]

export const UMRAH_STEPS: UmrahStep[] = [
  {
    id: 'umrah-ihram',
    order: 1,
    arabic: 'الإحرام',
    title: {
      de: 'Ihram am Miqat',
      fr: 'Ihram au Miqat',
      en: 'Ihram at the Miqat',
    },
    description: {
      de: 'Am Miqat (festgelegte Grenzpunkt) Ihram anlegen, Niyyah für Umrah aussprechen und Talbiyah rezitieren. Für Frauen: normale bescheidene Kleidung.',
      fr: "Au Miqat (point de démarcation fixé), revêtir l'Ihram, prononcer la Niyyah pour l'Umrah et réciter la Talbiyah. Pour les femmes : vêtements modestes habituels.",
      en: 'At the Miqat (designated boundary point), put on Ihram, declare Niyyah for Umrah, and recite Talbiyah. For women: regular modest clothing.',
    },
  },
  {
    id: 'umrah-tawaf',
    order: 2,
    arabic: 'الطواف',
    title: {
      de: 'Tawaf — 7 Umrundungen',
      fr: 'Tawaf — 7 circumambulations',
      en: 'Tawaf — 7 Circuits',
    },
    description: {
      de: 'Die Kaaba 7-mal gegen den Uhrzeigersinn umrunden. Die ersten 3 Runden (für Männer) im leichten Laufschritt, die letzten 4 im normalen Schritttempo.',
      fr: "Effectuer 7 circumambulations autour de la Ka'ba dans le sens antihoraire. Les 3 premiers tours (pour les hommes) au pas de course léger, les 4 derniers à allure normale.",
      en: "Circumambulate the Ka'bah 7 times counter-clockwise. The first 3 circuits (for men) at a brisk pace, the last 4 at a normal walking pace.",
    },
  },
  {
    id: 'umrah-sai',
    order: 3,
    arabic: 'السعي',
    title: {
      de: "Sa'i — Safa bis Marwa",
      fr: "Sa'i — Safa à Marwa",
      en: "Sa'i — Safa to Marwa",
    },
    description: {
      de: "7-mal zwischen Safa und Marwa laufen. Auf den Hügeln jeweils du'a machen und Allah verherrlichen. Die Strecke ist ca. 450 m lang (gesamt ca. 3,15 km).",
      fr: "Marcher 7 fois entre Safa et Marwa. Sur chaque colline, faire du'a et glorifier Allah. La distance est d'environ 450 m (total environ 3,15 km).",
      en: "Walk 7 times between Safa and Marwa. On each hill, make du'a and glorify Allah. Each stretch is approx. 450 m (total approx. 3.15 km).",
    },
  },
  {
    id: 'umrah-halq',
    order: 4,
    arabic: 'الحلق أو التقصير',
    title: {
      de: 'Halq / Taqsir — Haareschneiden',
      fr: 'Halq / Taqsir — Coupe des cheveux',
      en: 'Halq / Taqsir — Hair Cutting',
    },
    description: {
      de: 'Männer rasieren den Kopf (Halq) oder kürzen das Haar gleichmäßig (Taqsir). Frauen schneiden eine kleine Haarsträhne ab. Danach ist der Ihram-Zustand beendet.',
      fr: "Les hommes se rasent la tête (Halq) ou se coupent les cheveux uniformément (Taqsir). Les femmes coupent une petite mèche de cheveux. L'état d'Ihram est alors terminé.",
      en: 'Men shave the head (Halq) or trim hair evenly (Taqsir). Women cut a small lock of hair. After this, the state of Ihram ends.',
    },
  },
]

export const HAJJ_DUAS: HajjDua[] = [
  {
    id: 'talbiyah',
    arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    transliteration: "Labbayk Allāhumma labbayk, labbayk lā sharīka laka labbayk, inna l-ḥamda wa-n-ni'mata laka wa-l-mulk, lā sharīka lak",
    meaning: {
      de: 'Hier bin ich, o Allah, hier bin ich. Hier bin ich, Du hast keinen Partner, hier bin ich. Wahrlich, alles Lob, alle Gnade und alle Herrschaft gehören Dir. Du hast keinen Partner.',
      fr: "Me voici, ô Allah, me voici. Me voici, Tu n'as pas d'associé, me voici. En vérité, toute la louange, la grâce et la royauté T'appartiennent. Tu n'as pas d'associé.",
      en: 'Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise, grace and sovereignty belong to You. You have no partner.',
    },
    context: {
      de: 'Die Talbiyah wird vom Moment des Ihram bis zur Ankunft in Mekka ununterbrochen rezitiert. Sie ist der zentrale Ruf der Pilgerfahrt.',
      fr: "La Talbiyah est récitée continuellement depuis le moment de l'Ihram jusqu'à l'arrivée à La Mecque. C'est le cri central du pèlerinage.",
      en: 'The Talbiyah is recited continuously from the moment of Ihram until arriving at Mecca. It is the central call of the pilgrimage.',
    },
  },
  {
    id: 'dua-kaaba',
    arabic: 'اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً',
    transliteration: "Allāhumma zid hādha l-bayta tashrīfan wa-ta'ẓīman wa-takrīman wa-mahābah",
    meaning: {
      de: 'O Allah, vermehre die Ehrung, Verherrlichung, Würde und Ehrfurcht dieses Hauses.',
      fr: "Ô Allah, augmente l'honneur, la glorification, la noblesse et le respect de cette Maison.",
      en: 'O Allah, increase the honor, glorification, dignity, and reverence of this House.',
    },
    context: {
      de: 'Beim ersten Anblick der Kaaba gesprochen. Es ist Sunnah, in diesem Moment du\'a zu machen, da es eine Zeit der Erhörung ist.',
      fr: "Prononcée à la première vue de la Ka'ba. C'est la Sunnah de faire du'a en ce moment, car c'est un moment d'exaucement.",
      en: "Recited upon the first sight of the Ka'bah. It is Sunnah to make du'a at this moment, as it is a time of answered prayers.",
    },
  },
  {
    id: 'dua-arafat',
    arabic: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Lā ilāha illā llāhu waḥdahu lā sharīka lah, lahu l-mulku wa-lahu l-ḥamdu wa-huwa 'alā kulli shay'in qadīr",
    meaning: {
      de: 'Es gibt keinen Gott außer Allah, allein, ohne Partner. Ihm gehört die Herrschaft und Ihm gebührt alles Lob, und Er hat Macht über alle Dinge.',
      fr: "Il n'y a de dieu qu'Allah seul, sans associé. À Lui appartient la royauté, et à Lui appartient toute louange, et Il est Puissant sur toute chose.",
      en: 'There is no god but Allah alone, without partner. To Him belongs the dominion and to Him belongs all praise, and He has power over all things.',
    },
    context: {
      de: 'Das beste Gebet am Tag von Arafat. Der Prophet ﷺ sagte: "Das beste du\'a ist das du\'a am Tag von Arafat." (Tirmidhi)',
      fr: "La meilleure invocation du jour d'Arafat. Le Prophète ﷺ a dit : « La meilleure invocation est l'invocation du jour d'Arafat. » (Tirmidhi)",
      en: 'The best supplication on the Day of Arafat. The Prophet ﷺ said: "The best du\'a is the du\'a on the Day of Arafat." (Tirmidhi)',
    },
  },
]

export const PACKING_CHECKLIST: ChecklistItem[] = [
  { id: 'passport', category: 'documents', label: { de: 'Reisepass (mind. 6 Monate gültig)', fr: 'Passeport (valide 6 mois min.)', en: 'Passport (valid for 6+ months)' } },
  { id: 'visa', category: 'documents', label: { de: 'Hajj-/Umrah-Visum', fr: 'Visa Hajj/Umrah', en: 'Hajj/Umrah Visa' } },
  { id: 'vaccination', category: 'documents', label: { de: 'Impfzeugnis (Meningitis, COVID)', fr: 'Carnet de vaccination (Méningite, COVID)', en: 'Vaccination certificate (Meningitis, COVID)' } },
  { id: 'photos', category: 'documents', label: { de: 'Passfotos (4 Stück)', fr: "Photos d'identité (4 exemplaires)", en: 'Passport photos (4 copies)' } },
  { id: 'travel-insurance', category: 'documents', label: { de: 'Reiseversicherung', fr: 'Assurance voyage', en: 'Travel insurance' } },
  { id: 'ihram', category: 'clothing', label: { de: 'Ihram-Gewänder (2 Sätze, Männer)', fr: "Vêtements d'Ihram (2 ensembles, hommes)", en: 'Ihram garments (2 sets, men)' } },
  { id: 'modest-clothes', category: 'clothing', label: { de: 'Bescheidene Kleidung (Frauen: Abaya, Hijab)', fr: 'Vêtements modestes (femmes : abaya, hijab)', en: 'Modest clothing (women: abaya, hijab)' } },
  { id: 'walking-shoes', category: 'clothing', label: { de: 'Bequeme Wanderschuhe', fr: 'Chaussures de marche confortables', en: 'Comfortable walking shoes' } },
  { id: 'sandals', category: 'clothing', label: { de: 'Sandalen für Tawaf (offene Zehen erlaubt)', fr: 'Sandales pour le Tawaf (orteils découverts autorisés)', en: 'Sandals for Tawaf (open toes allowed)' } },
  { id: 'medications', category: 'health', label: { de: 'Persönliche Medikamente', fr: 'Médicaments personnels', en: 'Personal medications' } },
  { id: 'sunscreen', category: 'health', label: { de: 'Sonnenschutzcreme (LSF 50+)', fr: 'Crème solaire (FPS 50+)', en: 'Sunscreen (SPF 50+)' } },
  { id: 'water-bottle', category: 'health', label: { de: 'Wiederverwendbare Wasserflasche', fr: "Bouteille d'eau réutilisable", en: 'Reusable water bottle' } },
  { id: 'first-aid', category: 'health', label: { de: 'Erste-Hilfe-Set (Pflaster, Schmerzmittel)', fr: 'Trousse de premiers secours (pansements, analgésiques)', en: 'First aid kit (bandages, pain relief)' } },
  { id: 'quran', category: 'essentials', label: { de: 'Kleiner Koran (Taschenformat)', fr: 'Petit Coran (format de poche)', en: 'Small Quran (pocket size)' } },
  { id: 'prayer-beads', category: 'essentials', label: { de: 'Gebetskette (Misbaha)', fr: 'Chapelet de prière (Misbaha)', en: 'Prayer beads (Misbaha)' } },
  { id: 'money-belt', category: 'essentials', label: { de: 'Geldgürtel / Wertsachenbeutel', fr: 'Ceinture porte-monnaie / sac de sécurité', en: 'Money belt / security pouch' } },
  { id: 'phone-charger', category: 'essentials', label: { de: 'Handy-Ladekabel & Adapter', fr: 'Câble de charge + adaptateur', en: 'Phone charger & adapter' } },
  { id: 'umbrella', category: 'essentials', label: { de: 'Sonnenschirm / Regenschirm', fr: 'Parasol / parapluie', en: 'Umbrella (sun & rain)' } },
]

export const OFFICIAL_LINKS: OfficialLink[] = [
  {
    id: 'saudi-embassy-de',
    url: 'https://www.saudi-embassy.de',
    title: { de: 'Saudische Botschaft in Deutschland', fr: "Ambassade d'Arabie saoudite en Allemagne", en: 'Saudi Embassy in Germany' },
    country: { de: 'Deutschland', fr: 'Allemagne', en: 'Germany' },
  },
  {
    id: 'ministry-hajj',
    url: 'https://www.haj.gov.sa',
    title: { de: 'Ministerium für Hajj und Umrah (Saudi-Arabien)', fr: "Ministère du Hajj et de l'Umrah (Arabie saoudite)", en: 'Ministry of Hajj and Umrah (Saudi Arabia)' },
    country: { de: 'Saudi-Arabien', fr: 'Arabie saoudite', en: 'Saudi Arabia' },
  },
  {
    id: 'ditib',
    url: 'https://www.ditib.de',
    title: { de: 'DITIB — Türkisch-Islamische Union', fr: 'DITIB — Union islamique turco-allemande', en: 'DITIB — Turkish-Islamic Union' },
    country: { de: 'Deutschland', fr: 'Allemagne', en: 'Germany' },
  },
  {
    id: 'zmd',
    url: 'https://www.zentralrat.de',
    title: { de: 'Zentralrat der Muslime in Deutschland', fr: 'Conseil central des musulmans en Allemagne', en: 'Central Council of Muslims in Germany' },
    country: { de: 'Deutschland', fr: 'Allemagne', en: 'Germany' },
  },
]
