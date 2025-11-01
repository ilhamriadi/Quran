import './globals.css'
import { Inter } from 'next/font/google'
import { QuranProvider } from '@/contexts/QuranContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Al-Qur\'an Digital | Modern Quran Web App',
  description: 'Baca Al-Qur\'an dengan terjemahan, audio murottal, dan fitur modern',
  keywords: 'quran, al-quran, islam, murottal, terjemahan, tafsir',
  author: 'Quran Web App Team',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#10b981',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className={inter.className}>
        <QuranProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            {children}
          </div>
        </QuranProvider>
      </body>
    </html>
  )
}