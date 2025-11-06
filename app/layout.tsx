import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Navigation } from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'BookNest - Komunitní platforma pro čtenáře',
  description: 'Objevujte nové knihy, sdílejte své oblíbené tituly a diskutujte s ostatními čtenáři v žánrově organizovaných diskuzích.',
  keywords: 'knihy, čtení, wishlist, diskuze, fantasy, sci-fi, detektivka, knihovna, čtenáři, česká literatura',
  authors: [{ name: 'BookNest Team' }],
  openGraph: {
    title: 'BookNest - Komunitní platforma pro čtenáře',
    description: 'Objevujte nové knihy, sdílejte své oblíbené tituly a diskutujte s ostatními čtenáři.',
    type: 'website',
    locale: 'cs_CZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookNest - Komunitní platforma pro čtenáře',
    description: 'Objevujte nové knihy, sdílejte své oblíbené tituly a diskutujte s ostatními čtenáři.',
  },
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
              <div className="grid md:grid-cols-3 gap-8 mb-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">BookNest</h3>
                  <p className="text-gray-400 text-sm">
                    Komunitní platforma pro milovníky knih
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Odkazy</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="/books" className="text-gray-400 hover:text-white transition-colors">
                        Knihy
                      </a>
                    </li>
                    <li>
                      <a href="/discussions" className="text-gray-400 hover:text-white transition-colors">
                        Diskuze
                      </a>
                    </li>
                    <li>
                      <a href="/stats" className="text-gray-400 hover:text-white transition-colors">
                        Statistiky
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">O projektu</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                        O nás
                      </a>
                    </li>
                    <li>
                      <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                        Kontakt
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  © 2024 BookNest. Vytvořeno s 💙 pro milovníky knih.
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
