'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Surah, Ayah, Reciter, Bookmark } from '@/types/quran'
import { quranApi } from '@/lib/quran-api'

interface QuranContextType {
  surahs: Surah[]
  currentSurah: Surah | null
  currentAyahs: Ayah[]
  loading: boolean
  error: string | null

  // Settings
  showTranslation: boolean
  showTafsir: boolean
  selectedReciter: Reciter | null
  reciters: Reciter[]
  fontSize: number

  // Actions
  loadSurahs: () => Promise<void>
  loadSurah: (surahNumber: number) => Promise<void>
  toggleTranslation: () => void
  toggleTafsir: () => void
  setReciter: (reciter: Reciter) => void
  setFontSize: (size: number) => void

  // Bookmarks
  bookmarks: Bookmark[]
  addBookmark: (surahNumber: number, ayahNumber: number, note?: string) => void
  removeBookmark: (bookmarkId: string) => void
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean
}

const QuranContext = createContext<QuranContextType | undefined>(undefined)

const reciters: Reciter[] = [
  {
    id: 'ar.alafasy',
    name: 'Mishari Rashid Al-Afasy',
    arabicName: 'مشاري بن راشد العفاسي',
    style: 'Mujawwad',
    relativePath: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/'
  },
  {
    id: 'ar.abdulbasit',
    name: 'Abdul Basit Abdus Samad',
    arabicName: 'عبد الباسط عبد الصمد',
    style: 'Mujawwad',
    relativePath: 'https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/'
  },
  {
    id: 'ar.muhammadayyub',
    name: 'Muhammad Ayyoub',
    arabicName: 'محمد أيوب',
    style: 'Mujawwad',
    relativePath: 'https://cdn.islamic.network/quran/audio/128/ar.muhammadayyub/'
  },
  {
    id: 'ar.sudais',
    name: 'Abdur Rahman As-Sudais',
    arabicName: 'عبدالرحمن السديس',
    style: 'Murattal',
    relativePath: 'https://cdn.islamic.network/quran/audio/128/ar.sudais/'
  }
]

export function QuranProvider({ children }: { children: ReactNode }) {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null)
  const [currentAyahs, setCurrentAyahs] = useState<Ayah[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showTranslation, setShowTranslation] = useState(true)
  const [showTafsir, setShowTafsir] = useState(false)
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(reciters[0])
  const [fontSize, setFontSize] = useState(18)

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('quran-bookmarks')
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks))
    }

    const savedSettings = localStorage.getItem('quran-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setShowTranslation(settings.showTranslation ?? true)
      setShowTafsir(settings.showTafsir ?? false)
      setFontSize(settings.fontSize ?? 18)

      const savedReciter = reciters.find(r => r.id === settings.reciterId)
      if (savedReciter) {
        setSelectedReciter(savedReciter)
      }
    }

    loadSurahs()
  }, [])

  // Save bookmarks to localStorage
  useEffect(() => {
    if (bookmarks.length > 0) {
      localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks))
    }
  }, [bookmarks])

  // Save settings to localStorage
  useEffect(() => {
    const settings = {
      showTranslation,
      showTafsir,
      fontSize,
      reciterId: selectedReciter.id
    }
    localStorage.setItem('quran-settings', JSON.stringify(settings))
  }, [showTranslation, showTafsir, fontSize, selectedReciter])

  const loadSurahs = async () => {
    try {
      setLoading(true)
      const surahsData = await quranApi.getSurahs()
      setSurahs(surahsData)
      setError(null)
    } catch (err) {
      setError('Gagal memuat daftar surah')
      console.error('Error loading surahs:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadSurah = async (surahNumber: number) => {
    try {
      setLoading(true)
      const surahData = await quranApi.getSurah(surahNumber)
      setCurrentSurah(surahData)
      setCurrentAyahs(surahData.ayahs || [])
      setError(null)
    } catch (err) {
      setError('Gagal memuat surah')
      console.error('Error loading surah:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleTranslation = () => {
    setShowTranslation(prev => !prev)
  }

  const toggleTafsir = () => {
    setShowTafsir(prev => !prev)
  }

  const setReciter = (reciter: Reciter) => {
    setSelectedReciter(reciter)
  }

  const addBookmark = (surahNumber: number, ayahNumber: number, note?: string) => {
    const surah = surahs.find(s => s.number === surahNumber)
    const ayah = currentAyahs.find(a => a.numberInSurah === ayahNumber)

    if (!surah || !ayah) return

    const bookmark: Bookmark = {
      id: `${surahNumber}-${ayahNumber}-${Date.now()}`,
      surahNumber,
      ayahNumber,
      surahName: surah.name,
      ayahText: ayah.text,
      timestamp: Date.now(),
      note
    }

    setBookmarks(prev => [...prev, bookmark])
  }

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
  }

  const isBookmarked = (surahNumber: number, ayahNumber: number) => {
    return bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
  }

  const value: QuranContextType = {
    surahs,
    currentSurah,
    currentAyahs,
    loading,
    error,
    showTranslation,
    showTafsir,
    selectedReciter,
    fontSize,
    reciters,
    loadSurahs,
    loadSurah,
    toggleTranslation,
    toggleTafsir,
    setReciter,
    setFontSize,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked
  }

  return (
    <QuranContext.Provider value={value}>
      {children}
    </QuranContext.Provider>
  )
}

export function useQuran() {
  const context = useContext(QuranContext)
  if (context === undefined) {
    throw new Error('useQuran must be used within a QuranProvider')
  }
  return context
}