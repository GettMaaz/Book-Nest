import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero sekce */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Vítejte v BookNest
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Komunitní platforma pro milovníky knih. Objevujte nové tituly,
          sdílejte své oblíbené knihy a diskutujte s ostatními čtenáři.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="btn-primary">
            Zaregistrovat se
          </Link>
          <Link href="/books" className="btn-secondary">
            Procházet knihy
          </Link>
        </div>
      </section>

      {/* Funkce */}
      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="card text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">Databáze knih</h3>
          <p className="text-gray-600">
            Procházejte rozsáhlou databázi knih různých žánrů a autorů
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold mb-2">Osobní Wishlist</h3>
          <p className="text-gray-600">
            Vytvářejte si seznamy knih, které chcete přečíst nebo právě čtete
          </p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-semibold mb-2">Diskuzní fórum</h3>
          <p className="text-gray-600">
            Diskutujte o svých oblíbených knihách s ostatními čtenáři
          </p>
        </div>
      </section>

      {/* Žánry */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Populární žánry</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Fantasy', 'Sci-Fi', 'Detektivka', 'Romance', 'Horror', 'Historický', 'Thriller', 'Klasika'].map((genre) => (
            <Link
              key={genre}
              href={`/genres/${genre.toLowerCase()}`}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center font-medium"
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
