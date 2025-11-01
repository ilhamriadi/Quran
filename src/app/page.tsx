'use client'

import { useState, useEffect } from 'react'
import { QuranReader } from '@/components/QuranReader'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { useQuran } from '@/contexts/QuranContext'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { loading } = useQuran()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Memuat Al-Qur'an...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <QuranReader />
          </div>
        </main>
      </div>
    </div>
  )
}