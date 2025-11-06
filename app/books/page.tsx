'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { BookCard } from '@/components/BookCard'

export default function BooksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [books, setBooks] = useState<any[]>([])
  const [genres, setGenres] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalBooks, setTotalBooks] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search') || ''
  const sortBy = searchParams.get('sort') || 'newest'
  const genreFilter = searchParams.get('genre') || ''

  useEffect(() => {
    fetchBooks()
    fetchGenres()
  }, [page, search, sortBy, genreFilter])

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      if (search) params.set('search', search)
      if (sortBy) params.set('sort', sortBy)
      if (genreFilter) params.set('genre', genreFilter)

      const response = await fetch(`/api/books?${params.toString()}`)
      const data = await response.json()

      setBooks(data.books || [])
      setTotalPages(data.totalPages || 1)
      setTotalBooks(data.totalBooks || 0)
    } catch (error) {
      console.error('Error fetching books:', error)
      setBooks([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/genres')
      const data = await response.json()
      setGenres(data || [])
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

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
        <p className="text-gray-600">Procházejte naši kolekci {totalBooks} knih</p>
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
              onChange={(e) => router.push(buildUrl({ sort: e.target.value, page: '1' }))}
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
              onChange={(e) => router.push(buildUrl({ genre: e.target.value, page: '1' }))}
              className="input py-2 min-w-[200px]"
            >
              <option value="">Všechny žánry</option>
              {genres.map((genre: any) => (
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
                Žánr: {genres.find((g: any) => g.slug === genreFilter)?.name}
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

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Načítání knih...</p>
        </div>
      ) : books.length === 0 ? (
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
            {books.map((book: any) => (
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
