// data/arabic-starter-cards.ts

export interface ArabicCardSeed {
  arabic: string
  transliteration: string
  meaning_de: string
  meaning_fr: string
  meaning_en: string
  category: 'dua' | 'vocabulary' | 'phrase'
}

export const ARABIC_STARTER_CARDS: ArabicCardSeed[] = [
  { arabic: 'بِسْمِ اللَّهِ', transliteration: 'Bismillah', meaning_de: 'Im Namen Gottes', meaning_fr: 'Au nom de Dieu', meaning_en: 'In the name of God', category: 'dua' },
  { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', meaning_de: 'Lob sei Gott', meaning_fr: 'Louange à Dieu', meaning_en: 'Praise be to God', category: 'dua' },
  { arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah', meaning_de: 'Gepriesen sei Gott', meaning_fr: 'Gloire à Dieu', meaning_en: 'Glory be to God', category: 'dua' },
  { arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning_de: 'Gott ist am größten', meaning_fr: 'Dieu est le plus grand', meaning_en: 'God is the greatest', category: 'dua' },
  { arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah', meaning_de: 'Es gibt keinen Gott außer Allah', meaning_fr: "Il n'y a de dieu qu'Allah", meaning_en: 'There is no god but Allah', category: 'dua' },
  { arabic: 'إِنْ شَاءَ اللَّهُ', transliteration: "Insha'Allah", meaning_de: 'So Gott will', meaning_fr: 'Si Dieu le veut', meaning_en: 'If God wills', category: 'phrase' },
  { arabic: 'مَاشَاءَ اللَّهُ', transliteration: "Masha'Allah", meaning_de: 'Was Gott will', meaning_fr: 'Ce que Dieu a voulu', meaning_en: 'What God has willed', category: 'phrase' },
  { arabic: 'جَزَاكَ اللَّهُ خَيْرًا', transliteration: 'Jazakallahu khairan', meaning_de: 'Gott möge dich belohnen', meaning_fr: 'Que Dieu te récompense', meaning_en: 'May God reward you', category: 'phrase' },
  { arabic: 'السَّلَامُ عَلَيْكُمْ', transliteration: 'Assalamu alaikum', meaning_de: 'Friede sei mit euch', meaning_fr: 'Que la paix soit sur vous', meaning_en: 'Peace be upon you', category: 'phrase' },
  { arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', meaning_de: 'Ich bitte Gott um Vergebung', meaning_fr: 'Je demande pardon à Dieu', meaning_en: "I seek God's forgiveness", category: 'dua' },
  { arabic: 'رَبَّنَا', transliteration: 'Rabbana', meaning_de: 'Unser Herr', meaning_fr: 'Notre Seigneur', meaning_en: 'Our Lord', category: 'vocabulary' },
  { arabic: 'الرَّحْمَٰنُ', transliteration: 'Ar-Rahman', meaning_de: 'Der Allerbarmer', meaning_fr: 'Le Tout-Miséricordieux', meaning_en: 'The Most Gracious', category: 'vocabulary' },
  { arabic: 'الرَّحِيمُ', transliteration: 'Ar-Rahim', meaning_de: 'Der Barmherzige', meaning_fr: 'Le Très-Miséricordieux', meaning_en: 'The Most Merciful', category: 'vocabulary' },
  { arabic: 'نُورٌ', transliteration: 'Nur', meaning_de: 'Licht', meaning_fr: 'Lumière', meaning_en: 'Light', category: 'vocabulary' },
  { arabic: 'صَلَاةٌ', transliteration: 'Salat', meaning_de: 'Gebet', meaning_fr: 'Prière', meaning_en: 'Prayer', category: 'vocabulary' },
  { arabic: 'زَكَاةٌ', transliteration: 'Zakat', meaning_de: 'Pflichtabgabe', meaning_fr: 'Aumône légale', meaning_en: 'Almsgiving', category: 'vocabulary' },
  { arabic: 'صَوْمٌ', transliteration: 'Saum', meaning_de: 'Fasten', meaning_fr: 'Jeûne', meaning_en: 'Fasting', category: 'vocabulary' },
  { arabic: 'حَجٌّ', transliteration: 'Hajj', meaning_de: 'Pilgerfahrt', meaning_fr: 'Pèlerinage', meaning_en: 'Pilgrimage', category: 'vocabulary' },
  { arabic: 'مَسْجِدٌ', transliteration: 'Masjid', meaning_de: 'Moschee', meaning_fr: 'Mosquée', meaning_en: 'Mosque', category: 'vocabulary' },
  { arabic: 'كِتَابٌ', transliteration: 'Kitab', meaning_de: 'Buch', meaning_fr: 'Livre', meaning_en: 'Book', category: 'vocabulary' },
]
