import { db } from '@/lib/db'
import Link from 'next/link'
import { BookCard } from '@/components/BookCard'

interface PageProps {
  searchParams: { page?: string; search?: string; sort?: string; genre?: string }
}

export default async function BooksPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''
  const sortBy = searchParams.sort || 'newest'
  const genreFilter = searchParams.genre || ''
  const perPage = 12
  const skip = (page - 1) * perPage

  // Sestavit SQL dotaz s řazením
  let query = `
    SELECT b.*,
           COUNT(DISTINCT w.id) as wishlist_count
    FROM books b
    LEFT JOIN wishlists w ON w.bookId = b.id
  `

  const params: any[] = []
  const whereClauses: string[] = []

  // Vyhledávání
  if (search) {
    whereClauses.push('(b.title LIKE ? OR b.author LIKE ?)')
    params.push(`%${search}%`, `%${search}%`)
  }

  // Filtr podle žánru
  if (genreFilter) {
    whereClauses.push(`EXISTS (
      SELECT 1 FROM book_genres bg
      INNER JOIN genres g ON g.id = bg.genreId
      WHERE bg.bookId = b.id AND g.slug = ?
    )`)
    params.push(genreFilter)
  }

  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ')
  }

  query += ' GROUP BY b.id'

  // Řazení
  switch (sortBy) {
    case 'title':
      query += ' ORDER BY b.title ASC'
      break
    case 'popular':
      query += ' ORDER BY wishlist_count DESC, b.title ASC'
      break
    case 'oldest':
      query += ' ORDER BY b.createdAt ASC'
      break
    case 'newest':
    default:
      query += ' ORDER BY b.createdAt DESC'
      break
  }

  // Pagination
  query += ` LIMIT ${perPage} OFFSET ${skip}`

  const books = db.prepare(query).all(...params)

  // Přidat žánry ke knihám
  const booksWithGenres = books.map((book: any) => ({
    ...book,
    genres: db.prepare(`
      SELECT g.* FROM genres g
      INNER JOIN book_genres bg ON bg.genreId = g.id
      WHERE bg.bookId = ?
    `).all(book.id).map((g: any) => ({ genre: g }))
  }))

  // Počet knih celkem
  let countQuery = 'SELECT COUNT(DISTINCT b.id) as count FROM books b'
  if (genreFilter) {
    countQuery += ` INNER JOIN book_genres bg ON bg.bookId = b.id
                    INNER JOIN genres g ON g.id = bg.genreId`
  }

  const countWhereClauses: string[] = []
  const countParams: any[] = []

  if (search) {
    countWhereClauses.push('(b.title LIKE ? OR b.author LIKE ?)')
    countParams.push(`%${search}%`, `%${search}%`)
  }

  if (genreFilter) {
    countWhereClauses.push('g.slug = ?')
    countParams.push(genreFilter)
  }

  if (countWhereClauses.length > 0) {
    countQuery += ' WHERE ' + countWhereClauses.join(' AND ')
  }

  const totalBooks = db.prepare(countQuery).get(...countParams) as any
  const totalPages = Math.ceil(totalBooks.count / perPage)

  // Získat všechny žánry pro filtr
  const genres = db.prepare('SELECT * FROM genres ORDER BY name ASC').all()

  // Sestavit URL parametry
  const buildUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams()
    if (newParams.page) params.set('page', newParams.page)
    if (newParams.search || search) params.set('search', newParams.search || search)
    if (newParams.sort || sortBy) params.set('sort', newParams.sort || sortBy)
    if (newParams.genre || genreFilter) params.set('genre', newParams.genre || genreFilter)
    return `/books?${params.toString()}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Knihy</h1>
        <p className="text-gray-600">Procházejte naši kolekci {totalBooks.count} knih</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <form action="/books" method="get" className="max-w-2xl">
          <div className="flex gap-4">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Hledat podle názvu nebo autora..."
              className="input flex-1"
            />
            {sortBy && <input type="hidden" name="sort" value={sortBy} />}
            {genreFilter && <input type="hidden" name="genre" value={genreFilter} />}
            <button type="submit" className="btn-primary">
              Hledat
            </button>
          </div>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Řadit podle:</label>
            <select
              value={sortBy}
              onChange={(e) => window.location.href = buildUrl({ sort: e.target.value, page: '1' })}
              className="input py-2 min-w-[200px]"
            >
              <option value="newest">Nejnovější</option>
              <option value="oldest">Nejstarší</option>
              <option value="title">Název (A-Z)</option>
              <option value="popular">Nejoblíbenější</option>
            </select>
          </div>

          {/* Genre Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Žánr:</label>
            <select
              value={genreFilter}
              onChange={(e) => window.location.href = buildUrl({ genre: e.target.value, page: '1' })}
              className="input py-2 min-w-[200px]"
            >
              <option value="">Všechny žánry</option>
              {(genres as any[]).map((genre: any) => (
                <option key={genre.id} value={genre.slug}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(search || genreFilter || sortBy !== 'newest') && (
            <Link href="/books" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Vymazat filtry
            </Link>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(search || genreFilter) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {search && (
            <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              <span>Hledáno: "{search}"</span>
              <a
                href={buildUrl({ search: '', page: '1' })}
                className="hover:text-primary-900"
              >
                ×
              </a>
            </div>
          )}
          {genreFilter && (
            <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              <span>
                Žánr: {(genres as any[]).find((g: any) => g.slug === genreFilter)?.name}
              </span>
              <a
                href={buildUrl({ genre: '', page: '1' })}
                className="hover:text-primary-900"
              >
                ×
              </a>
            </div>
          )}
        </div>
      )}

      {/* Books Grid */}
      {booksWithGenres.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Žádné knihy nenalezeny</p>
          {(search || genreFilter) && (
            <Link href="/books" className="btn-primary inline-block mt-4">
              Zobrazit všechny knihy
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {booksWithGenres.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="btn-secondary"
                >
                  ← Předchozí
                </Link>
              )}

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  // Zobrazit max 10 stránek
                  let pageNum = i + 1
                  if (totalPages > 10) {
                    if (page <= 5) {
                      pageNum = i + 1
                    } else if (page >= totalPages - 4) {
                      pageNum = totalPages - 9 + i
                    } else {
                      pageNum = page - 5 + i
                    }
                  }

                  return (
                    <Link
                      key={pageNum}
                      href={buildUrl({ page: String(pageNum) })}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pageNum === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  )
                })}
              </div>

              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="btn-secondary"
                >
                  Další →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
