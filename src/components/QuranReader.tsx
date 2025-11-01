'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Bookmark, BookmarkCheck, Volume2, VolumeX, Settings } from 'lucide-react'
import { useQuran } from '@/contexts/QuranContext'
import { Button } from '@/components/ui/Button'

export function QuranReader() {
  const {
    currentSurah,
    currentAyahs,
    showTranslation,
    selectedReciter,
    fontSize,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleTranslation
  } = useQuran()

  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.src = ''
      }
    }
  }, [currentAudio])

  const playAyahAudio = (ayahNumber: number, ayahIndex: number) => {
    if (!currentSurah || !selectedReciter) return

    const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedReciter.id}/${currentSurah.number.toString().padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}.mp3`

    if (currentAudio) {
      currentAudio.pause()
      currentAudio.src = ''
    }

    const audio = new Audio(audioUrl)
    audioRef.current = audio
    setCurrentAudio(audio)

    audio.addEventListener('play', () => {
      setIsPlaying(true)
      setCurrentAyahIndex(ayahIndex)
    })

    audio.addEventListener('pause', () => {
      setIsPlaying(false)
      setCurrentAyahIndex(null)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentAyahIndex(null)

      // Auto-play next ayah
      if (ayahIndex < currentAyahs.length - 1) {
        setTimeout(() => {
          playAyahAudio(currentAyahs[ayahIndex + 1].numberInSurah, ayahIndex + 1)
        }, 1000)
      }
    })

    audio.play().catch(error => {
      console.error('Error playing audio:', error)
      setIsPlaying(false)
      setCurrentAyahIndex(null)
    })
  }

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.src = ''
      setCurrentAudio(null)
    }
    setIsPlaying(false)
    setCurrentAyahIndex(null)
  }

  const toggleBookmark = (surahNumber: number, ayahNumber: number) => {
    if (!currentSurah) return

    const bookmarkId = `${surahNumber}-${ayahNumber}`
    if (isBookmarked(surahNumber, ayahNumber)) {
      // Find and remove bookmark
      // This is simplified - you'd need to implement proper bookmark finding/removal
      console.log('Remove bookmark:', bookmarkId)
    } else {
      addBookmark(surahNumber, ayahNumber)
    }
  }

  if (!currentSurah) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Volume2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Selamat Datang di Al-Qur'an Digital
          </h2>
          <p className="text-muted-foreground mb-6">
            Pilih surah dari menu di sebelah kiri untuk mulai membaca Al-Qur'an
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Surah Header */}
      <div className="text-center p-6 bg-accent/50 rounded-lg">
        <h1 className="font-arabic text-3xl md:text-4xl text-primary mb-2">
          {currentSurah.name}
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          {currentSurah.englishName}
        </h2>
        <p className="text-muted-foreground">
          {currentSurah.englishNameTranslation} • {currentSurah.numberOfAyahs} Ayat • {currentSurah.revelationType}
        </p>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center justify-center gap-4 p-4 bg-card rounded-lg border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => playAyahAudio(1, 0)}
          disabled={isPlaying}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Play dari Awal
        </Button>

        {isPlaying && (
          <Button variant="outline" size="sm" onClick={stopAudio}>
            <Pause className="h-4 w-4" />
            Stop
          </Button>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Volume2 className="h-4 w-4" />
          <span>{selectedReciter?.name}</span>
        </div>
      </div>

      {/* Ayahs */}
      <div className="space-y-6">
        {currentAyahs.map((ayah, index) => (
          <div
            key={ayah.number}
            className={`
              verse-container p-4 md:p-6 rounded-lg border bg-card
              ${currentAyahIndex === index ? 'ring-2 ring-primary bg-primary/5' : ''}
              fade-in
            `}
          >
            {/* Ayah Number and Actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    {ayah.numberInSurah}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {ayah.sajda && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Sajdah
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => playAyahAudio(ayah.numberInSurah, index)}
                  disabled={isPlaying && currentAyahIndex === index}
                  className="h-8 w-8"
                >
                  {isPlaying && currentAyahIndex === index ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleBookmark(currentSurah.number, ayah.numberInSurah)}
                  className="h-8 w-8"
                >
                  {isBookmarked(currentSurah.number, ayah.numberInSurah) ? (
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Arabic Text */}
            <div className="mb-4">
              <p
                className="arabic-text leading-loose"
                style={{ fontSize: `${fontSize}px` }}
              >
                {ayah.text}
              </p>
            </div>

            {/* Translation */}
            {showTranslation && ayah.translation && (
              <div className="translation-text">
                <p>{ayah.translation}</p>
              </div>
            )}

            {/* Ayah Info */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
              <span>Juz {ayah.juz}</span>
              <span>Halaman {ayah.page}</span>
              <span>Ruku {ayah.ruku}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}