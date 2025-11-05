import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { BookCard } from '@/components/BookCard'

interface PageProps {
  searchParams: { page?: string; search?: string }
}

export default async function BooksPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''
  const perPage = 12
  const skip = (page - 1) * perPage

  // Získat knihy s filtrem
  const where = search
    ? {
        OR: [
          { title: { contains: search } },
          { author: { contains: search } },
        ],
      }
    : {}

  const books = await prisma.book.findMany({
    where,
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: perPage,
    skip,
  })

  const totalBooks = await prisma.book.count({ where })
  const totalPages = Math.ceil((totalBooks as any).count / perPage)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Knihy</h1>
        <p className="text-gray-600">Procházejte naši kolekci {(totalBooks as any).count} knih</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form action="/books" method="get" className="max-w-2xl">
          <div className="flex gap-4">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Hledat podle názvu nebo autora..."
              className="input flex-1"
            />
            <button type="submit" className="btn-primary">
              Hledat
            </button>
          </div>
        </form>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Žádné knihy nenalezeny</p>
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
                  href={`/books?page=${page - 1}${search ? `&search=${search}` : ''}`}
                  className="btn-secondary"
                >
                  ← Předchozí
                </Link>
              )}

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/books?page=${p}${search ? `&search=${search}` : ''}`}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      p === page
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>

              {page < totalPages && (
                <Link
                  href={`/books?page=${page + 1}${search ? `&search=${search}` : ''}`}
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
