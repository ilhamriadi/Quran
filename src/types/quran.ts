export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: 'Meccan' | 'Medinan'
  ayahs?: Ayah[]
}

export interface Ayah {
  number: number
  numberInSurah: number
  text: string
  translation?: string
  audio?: string
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda?: boolean
}

export interface QuranEdition {
  identifier: string
  language: string
  name: string
  englishName: string
  format: string
  type: string
  direction: 'ltr' | 'rtl'
}

export interface AudioFile {
  verse: number
  url: string
  duration: number
}

export interface Reciter {
  id: string
  name: string
  arabicName: string
  style: string
  relativePath: string
}

export interface Translation {
  text: string
  language: string
  name: string
}

export interface Bookmark {
  id: string
  surahNumber: number
  ayahNumber: number
  surahName: string
  ayahText: string
  timestamp: number
  note?: string
}

export interface SearchResult {
  surah: Surah
  ayahs: Ayah[]
  query: string
}