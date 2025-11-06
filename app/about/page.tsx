import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O nás | BookNest',
  description: 'Přečtěte si více o BookNest - komunitní platformě pro milovníky knih.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">O BookNest</h1>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Kdo jsme?
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            BookNest je komunitní platforma vytvořená pro milovníky knih.
            Naším cílem je spojit čtenáře z celé České republiky a vytvořit
            prostor, kde mohou sdílet své čtenářské zkušenosti, objevovat nové
            tituly a diskutovat o svých oblíbených knihách.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Platforma vznikla v roce 2024 s vizí demokratizovat přístup ke
            knihám a vytvořit živou komunitu, kde každý čtenář najde své místo.
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Co nabízíme?
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                📚
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Rozsáhlá databáze knih
                </h3>
                <p className="text-gray-600 text-sm">
                  Procházejte tisíce knih různých žánrů, od fantasy přes sci-fi
                  až po klasickou literaturu.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Osobní wishlist
                </h3>
                <p className="text-gray-600 text-sm">
                  Vytvářejte si seznamy knih, které chcete přečíst, právě čtete
                  nebo už jste přečetli.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                💬
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Diskuzní fórum
                </h3>
                <p className="text-gray-600 text-sm">
                  Diskutujte o knihách s ostatními čtenáři v žánrově
                  organizovaných diskuzích.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                📊
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Statistiky a doporučení
                </h3>
                <p className="text-gray-600 text-sm">
                  Objevujte nejoblíbenější knihy komunity a dostávejte
                  personalizovaná doporučení.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Naše hodnoty
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 font-bold">✓</span>
              <span className="text-gray-700">
                <strong>Komunita</strong> - Podporujeme vzájemnou spolupráci a
                sdílení mezi čtenáři
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 font-bold">✓</span>
              <span className="text-gray-700">
                <strong>Rozmanitost</strong> - Respektujeme různé čtenářské
                preference a žánry
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 font-bold">✓</span>
              <span className="text-gray-700">
                <strong>Otevřenost</strong> - Vytváříme přátelské prostředí pro
                všechny milovníky knih
              </span>
            </li>
          </ul>
        </div>

        <div className="card bg-primary-50 border-primary-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Připojte se k nám!
          </h2>
          <p className="text-gray-700 mb-6">
            Staňte se součástí naší rostoucí komunity čtenářů. Registrace je
            zdarma a zabere jen několik sekund.
          </p>
          <div className="flex gap-4">
            <Link href="/register" className="btn-primary">
              Zaregistrovat se
            </Link>
            <Link href="/contact" className="btn-secondary">
              Kontaktujte nás
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
