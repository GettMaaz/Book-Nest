import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Navigation } from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'BookNest - Komunitní platforma pro čtenáře',
  description: 'Objevujte nové knihy, sdílejte své oblíbené tituly a diskutujte s ostatními čtenáři',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className="font-sans">
        <Providers>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-gray-800 text-white mt-20">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <p className="text-gray-400">
                  © 2024 BookNest. Komunitní platforma pro čtenáře.
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
