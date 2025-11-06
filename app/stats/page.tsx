import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { db } from '@/lib/db'

export default async function StatsPage() {
  // Získat nejoblíbenější knihy (nejvíce ve wishlistech)
  const popularBooksQuery = db.prepare(`
    SELECT b.*, COUNT(w.id) as wishlist_count
    FROM books b
    LEFT JOIN wishlists w ON w.bookId = b.id
    GROUP BY b.id
    ORDER BY wishlist_count DESC
    LIMIT 10
  `).all()

  // Získat nejaktivnější diskuze
  const activeDiscussionsQuery = db.prepare(`
    SELECT d.*, COUNT(p.id) as post_count
    FROM discussions d
    LEFT JOIN posts p ON p.discussionId = d.id
    GROUP BY d.id
    ORDER BY post_count DESC
    LIMIT 10
  `).all()

  // Získat statistiky žánrů
  const genreStatsQuery = db.prepare(`
    SELECT g.name,
           COUNT(DISTINCT bg.bookId) as book_count,
           COUNT(DISTINCT d.id) as discussion_count
    FROM genres g
    LEFT JOIN book_genres bg ON bg.genreId = g.id
    LEFT JOIN discussions d ON d.genreId = g.id
    GROUP BY g.id, g.name
    ORDER BY book_count DESC
  `).all()

  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any
  const totalBooks = db.prepare('SELECT COUNT(*) as count FROM books').get() as any
  const totalDiscussions = db.prepare('SELECT COUNT(*) as count FROM discussions').get() as any
  const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get() as any

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Statistiky</h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="card text-center">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-3xl font-bold text-gray-900">{totalUsers.count}</p>
          <p className="text-gray-600">Uživatelé</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-2">📚</div>
          <p className="text-3xl font-bold text-gray-900">{totalBooks.count}</p>
          <p className="text-gray-600">Knihy</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-3xl font-bold text-gray-900">{totalDiscussions.count}</p>
          <p className="text-gray-600">Diskuze</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-2">✍️</div>
          <p className="text-3xl font-bold text-gray-900">{totalPosts.count}</p>
          <p className="text-gray-600">Příspěvky</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Popular Books */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🔥 Nejoblíbenější knihy
          </h2>
          <p className="text-gray-600 mb-4">Nejvíce přidávané do wishlistů</p>

          <div className="space-y-3">
            {(popularBooksQuery as any[]).slice(0, 5).map((book: any, index: number) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold">{book.wishlist_count}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Active Discussions */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            💬 Nejaktivnější diskuze
          </h2>
          <p className="text-gray-600 mb-4">Podle počtu příspěvků</p>

          <div className="space-y-3">
            {(activeDiscussionsQuery as any[]).slice(0, 5).map((discussion: any, index: number) => {
              const genre = db.prepare('SELECT slug FROM genres WHERE id = ?').get(discussion.genreId) as any
              return (
                <Link
                  key={discussion.id}
                  href={`/discussions/${genre?.slug}/${discussion.slug}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 line-clamp-1">
                        {discussion.title}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {discussion.post_count} příspěvků
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Genre Stats */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📊 Přehled žánrů
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Žánr</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Počet knih</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Počet diskuzí</th>
              </tr>
            </thead>
            <tbody>
              {(genreStatsQuery as any[]).map((genre: any) => (
                <tr key={genre.name} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{genre.name}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{genre.book_count}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{genre.discussion_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
