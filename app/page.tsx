import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Doporučené knihy (nejoblíbenější)
  const recommendedBooks = db.prepare(`
    SELECT b.*, COUNT(w.id) as wishlist_count
    FROM books b
    LEFT JOIN wishlists w ON w.bookId = b.id
    GROUP BY b.id
    ORDER BY wishlist_count DESC
    LIMIT 6
  `).all()

  // Přidat žánry
  const booksWithGenres = (recommendedBooks as any[]).map((book: any) => ({
    ...book,
    genres: db.prepare(`
      SELECT g.* FROM genres g
      INNER JOIN book_genres bg ON bg.genreId = g.id
      WHERE bg.bookId = ?
    `).all(book.id)
  }))

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
          {session ? (
            <>
              <Link href="/books" className="btn-primary">
                Procházet knihy
              </Link>
              <Link href="/wishlist" className="btn-secondary">
                Můj Wishlist
              </Link>
            </>
          ) : (
            <>
              <Link href="/register" className="btn-primary">
                Zaregistrovat se
              </Link>
              <Link href="/books" className="btn-secondary">
                Procházet knihy
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Doporučené knihy */}
      {booksWithGenres.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            🔥 Nejoblíbenější knihy
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Knihy, které si nejvíce čtenářů přidalo do wishlistu
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {booksWithGenres.map((book: any) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="group"
              >
                <div className="aspect-[2/3] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-3 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-5xl">📖</div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-1">{book.author}</p>
                {book.wishlist_count > 0 && (
                  <p className="text-xs text-primary-600 mt-1">
                    ❤️ {book.wishlist_count} {book.wishlist_count === 1 ? 'čtenář' : 'čtenářů'}
                  </p>
                )}
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/books" className="btn-secondary">
              Zobrazit všechny knihy →
            </Link>
          </div>
        </section>
      )}

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
          {['Fantasy', 'Sci-Fi', 'Detektivka', 'Romantika', 'Horror', 'Historický román', 'Thriller', 'Klasika'].map((genre) => (
            <Link
              key={genre}
              href={`/books?genre=${genre.toLowerCase().replace(/ /g, '-')}`}
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
