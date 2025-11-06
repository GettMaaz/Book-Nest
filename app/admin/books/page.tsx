import { db } from '@/lib/db'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminBooksPage() {
  const session = await getServerSession(authOptions)

  // Double check admin access
  const adminEmails = ['admin@example.com']
  if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
    redirect('/')
  }

  const books = db.prepare(`
    SELECT b.*, COUNT(w.id) as wishlist_count
    FROM books b
    LEFT JOIN wishlists w ON w.bookId = b.id
    GROUP BY b.id
    ORDER BY b.createdAt DESC
  `).all()

  const totalBooks = (books as any[]).length
  const totalGenres = db.prepare('SELECT COUNT(*) as count FROM genres').get() as any
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-900">Admin Panel - Knihy</h1>
          <Link href="/" className="btn-secondary">
            ← Zpět na hlavní stránku
          </Link>
        </div>
        <p className="text-gray-600">Správa knih v databázi</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-4xl mb-2">📚</div>
          <p className="text-3xl font-bold text-gray-900">{totalBooks}</p>
          <p className="text-gray-600">Celkem knih</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-2">🏷️</div>
          <p className="text-3xl font-bold text-gray-900">{totalGenres.count}</p>
          <p className="text-gray-600">Žánrů</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-3xl font-bold text-gray-900">{totalUsers.count}</p>
          <p className="text-gray-600">Uživatelů</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <Link href="/admin/books/new" className="btn-primary">
          + Přidat novou knihu
        </Link>
      </div>

      {/* Books Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Název</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Autor</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Stran</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Ve wishlistech</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Akce</th>
            </tr>
          </thead>
          <tbody>
            {(books as any[]).map((book: any) => (
              <tr key={book.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <Link
                    href={`/books/${book.id}`}
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    {book.title}
                  </Link>
                </td>
                <td className="py-3 px-4 text-gray-600">{book.author}</td>
                <td className="py-3 px-4 text-center text-gray-600">
                  {book.pageCount || '-'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {book.wishlist_count}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/admin/books/${book.id}/edit`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Upravit
                    </Link>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => {
                        if (confirm(`Opravdu chcete smazat knihu "${book.title}"?`)) {
                          fetch(`/api/admin/books/${book.id}`, { method: 'DELETE' })
                            .then(() => window.location.reload())
                        }
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Smazat
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalBooks === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Zatím nejsou žádné knihy</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <Link href="/admin/genres" className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Správa žánrů</h3>
          <p className="text-gray-600">Přidávat a upravovat žánry knih</p>
        </Link>

        <Link href="/stats" className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Statistiky platformy</h3>
          <p className="text-gray-600">Přehled nejoblíbenějších knih a diskuzí</p>
        </Link>
      </div>
    </div>
  )
}
