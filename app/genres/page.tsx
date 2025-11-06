import { db } from '@/lib/db'
import Link from 'next/link'

export default function GenresPage() {
  const genres = db.prepare(`
    SELECT g.*,
           COUNT(DISTINCT bg.bookId) as book_count,
           COUNT(DISTINCT d.id) as discussion_count
    FROM genres g
    LEFT JOIN book_genres bg ON bg.genreId = g.id
    LEFT JOIN discussions d ON d.genreId = g.id
    GROUP BY g.id
    ORDER BY g.name ASC
  `).all()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Žánry knih</h1>
        <p className="text-gray-600">
          Prozkoumejte naší kolekci knih podle žánrů
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(genres as any[]).map((genre: any) => (
          <Link
            key={genre.id}
            href={`/books?genre=${genre.slug}`}
            className="card hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {genre.name}
              </h2>
              <div className="text-3xl">
                {getGenreIcon(genre.name)}
              </div>
            </div>

            {genre.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {genre.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>{genre.book_count} {genre.book_count === 1 ? 'kniha' : genre.book_count < 5 ? 'knihy' : 'knih'}</span>
              </div>

              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span>{genre.discussion_count} {genre.discussion_count === 1 ? 'diskuze' : genre.discussion_count < 5 ? 'diskuze' : 'diskuzí'}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <span className="text-primary-600 font-medium group-hover:underline">
                Zobrazit knihy →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function getGenreIcon(genreName: string): string {
  const icons: Record<string, string> = {
    'Fantasy': '🐉',
    'Sci-Fi': '🚀',
    'Detektivka': '🔍',
    'Romantika': '💕',
    'Historický román': '📜',
    'Thriller': '⚡',
    'Horror': '👻',
    'Klasika': '📚',
  }
  return icons[genreName] || '📖'
}
