import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DiscussionsPage() {
  const genres = await prisma.genre.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          books: true,
          discussions: true,
        },
      },
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Diskuzní fórum</h1>
        <p className="text-gray-600">
          Diskutujte o svých oblíbených knihách s ostatními čtenáři
        </p>
      </div>

      {/* Genre Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {genres.map((genre: any) => {
          const discussionCount = genre._count?.discussions?.count || 0
          const bookCount = genre._count?.books?.count || 0

          return (
            <Link
              key={genre.id}
              href={`/discussions/${genre.slug}`}
              className="card hover:shadow-lg transition-all group"
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
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <span>{discussionCount} {discussionCount === 1 ? 'diskuze' : discussionCount < 5 ? 'diskuze' : 'diskuzí'}</span>
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>{bookCount} {bookCount === 1 ? 'kniha' : bookCount < 5 ? 'knihy' : 'knih'}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <span className="text-primary-600 font-medium group-hover:underline">
                  Procházet diskuze →
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Empty State */}
      {genres.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Zatím nejsou vytvořeny žádné žánry</p>
        </div>
      )}
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
