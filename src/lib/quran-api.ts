import { Surah, Ayah, QuranEdition } from '@/types/quran'
import axios from 'axios'

const API_BASE_URL = 'https://api.quran.com/api/v4'

class QuranAPI {
  private axios = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  async getSurahs(): Promise<Surah[]> {
    try {
      const response = await this.axios.get('/chapters')
      return response.data.chapters.map((chapter: any) => ({
        number: chapter.id,
        name: chapter.name_complex,
        englishName: chapter.name_simple,
        englishNameTranslation: chapter.translated_name.name,
        numberOfAyahs: chapter.verses_count,
        revelationType: chapter.revelation_place as 'Meccan' | 'Medinan',
      }))
    } catch (error) {
      console.error('Error fetching surahs:', error)
      throw new Error('Failed to fetch surahs')
    }
  }

  async getSurah(surahNumber: number, edition: string = 'quran-uthmani'): Promise<Surah> {
    try {
      const [chapterResponse, versesResponse] = await Promise.all([
        this.axios.get(`/chapters/${surahNumber}`),
        this.axios.get(`/verses/by_chapter/${surahNumber}?language=en&word_fields=text_uthmani&translations=131&per_page=300`)
      ])

      const chapter = chapterResponse.data.chapter
      const verses = versesResponse.data.verses

      return {
        number: chapter.id,
        name: chapter.name_complex,
        englishName: chapter.name_simple,
        englishNameTranslation: chapter.translated_name.name,
        numberOfAyahs: chapter.verses_count,
        revelationType: chapter.revelation_place as 'Meccan' | 'Medinan',
        ayahs: verses.map((verse: any) => ({
          number: verse.id,
          numberInSurah: verse.verse_number,
          text: verse.text_uthmani,
          translation: verse.translations?.[0]?.text,
          juz: verse.juz_number,
          manzil: verse.manzil_number,
          page: verse.page_number,
          ruku: verse.ruku_number,
          hizbQuarter: verse.hizb_number,
          sajda: verse.sajda !== null,
        }))
      }
    } catch (error) {
      console.error('Error fetching surah:', error)
      throw new Error(`Failed to fetch surah ${surahNumber}`)
    }
  }

  async searchQuery(query: string, language: string = 'en'): Promise<any> {
    try {
      const response = await this.axios.get('/search', {
        params: {
          q: query,
          language,
          size: 20
        }
      })
      return response.data.search
    } catch (error) {
      console.error('Error searching:', error)
      throw new Error('Failed to perform search')
    }
  }

  async getAudioReciters(): Promise<QuranEdition[]> {
    try {
      const response = await this.axios.get('/resources/recitations', {
        params: {
          language: 'en'
        }
      })
      return response.data.recitations
    } catch (error) {
      console.error('Error fetching reciters:', error)
      throw new Error('Failed to fetch audio reciters')
    }
  }

  getAudioUrl(reciterId: string, surahNumber: number, ayahNumber: number): string {
    return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${surahNumber.toString().padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}.mp3`
  }
}

export const quranApi = new QuranAPI()