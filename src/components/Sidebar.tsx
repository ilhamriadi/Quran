'use client'

import { useState } from 'react'
import { X, Book, Bookmark, Search, Settings, Volume2, Sun, Moon } from 'lucide-react'
import { useQuran } from '@/contexts/QuranContext'
import { Button } from '@/components/ui/Button'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { surahs, loadSurah, selectedReciter, reciters, setReciter } = useQuran()
  const [activeSection, setActiveSection] = useState<'surahs' | 'bookmarks' | 'settings'>('surahs')

  const handleSurahClick = (surahNumber: number) => {
    loadSurah(surahNumber)
    onClose()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Menu</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex border-b">
        <button
          onClick={() => setActiveSection('surahs')}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'surahs'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Book className="h-4 w-4 inline mr-2" />
          Surah
        </button>
        <button
          onClick={() => setActiveSection('bookmarks')}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'bookmarks'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bookmark className="h-4 w-4 inline mr-2" />
          Markah
        </button>
        <button
          onClick={() => setActiveSection('settings')}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'settings'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Pengaturan
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeSection === 'surahs' && (
          <div className="p-4">
            <div className="space-y-1">
              {surahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => handleSurahClick(surah.number)}
                  className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {surah.number}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {surah.englishName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {surah.englishNameTranslation}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-arabic text-lg text-primary">
                        {surah.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {surah.numberOfAyahs} ayat • {surah.revelationType}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'bookmarks' && (
          <div className="p-4">
            <p className="text-muted-foreground text-center py-8">
              Belum ada markah tersimpan
            </p>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="p-4 space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 flex items-center">
                <Volume2 className="h-4 w-4 mr-2" />
                Qari (Pembaca)
              </label>
              <div className="space-y-2">
                {reciters.map((reciter) => (
                  <button
                    key={reciter.id}
                    onClick={() => setReciter(reciter)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedReciter?.id === reciter.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <div className="font-medium text-sm">{reciter.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {reciter.style}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 z-50 w-80 h-screen bg-background border-r transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <SidebarContent />
      </div>
    </>
  )
}