import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { WishlistButton } from '@/components/WishlistButton'
import Link from 'next/link'

interface PageProps {
  params: { id: string }
}

export default async function BookDetailPage({ params }: PageProps) {
  const book = await prisma.book.findUnique({
    where: { id: params.id },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  })

  if (!book) {
    notFound()
  }

  const genres = (book as any).genres?.map((bg: any) => bg.genre) || []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-primary-600">Domů</Link>
        {' '}/{' '}
        <Link href="/books" className="hover:text-primary-600">Knihy</Link>
        {' '}/{' '}
        <span className="text-gray-900">{(book as any).title}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="aspect-[2/3] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center overflow-hidden mb-4">
              {(book as any).coverImage ? (
                <img
                  src={(book as any).coverImage}
                  alt={(book as any).title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-9xl">📖</div>
              )}
            </div>

            <WishlistButton bookId={(book as any).id} />
          </div>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {(book as any).title}
          </h1>

          <p className="text-xl text-gray-700 mb-6">
            od <span className="font-semibold">{(book as any).author}</span>
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 mb-6">
            {genres.length > 0 && (
              <div className="flex gap-2">
                {genres.map((genre: any) => (
                  <Link
                    key={genre.id}
                    href={`/books?genre=${genre.slug}`}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {(book as any).pageCount && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Počet stran</p>
                <p className="text-lg font-semibold">{(book as any).pageCount}</p>
              </div>
            )}

            {(book as any).language && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Jazyk</p>
                <p className="text-lg font-semibold uppercase">{(book as any).language}</p>
              </div>
            )}

            {(book as any).publishedAt && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Vydáno</p>
                <p className="text-lg font-semibold">
                  {new Date((book as any).publishedAt).getFullYear()}
                </p>
              </div>
            )}

            {(book as any).isbn && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">ISBN</p>
                <p className="text-sm font-mono">{(book as any).isbn}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {(book as any).description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Popis</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {(book as any).description}
              </p>
            </div>
          )}

          {/* Discussion Section */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Diskuze</h2>
            <p className="text-gray-600 mb-4">
              Chcete diskutovat o této knize? Přejděte do{' '}
              {genres[0] && (
                <Link
                  href={`/discussions?genre=${genres[0].slug}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  diskuzního fóra pro {genres[0].name}
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
