import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NewDiscussionButton } from './NewDiscussionButton'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: { genreSlug: string }
}

export default async function GenreDiscussionsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  const genre = await prisma.genre.findUnique({
    where: { slug: params.genreSlug },
  })

  if (!genre) {
    notFound()
  }

  const discussions = await prisma.discussion.findMany({
    where: {
      genreId: (genre as any).id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      genre: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: [
      { isPinned: 'desc' },
      { createdAt: 'desc' },
    ],
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-primary-600">Domů</Link>
        {' '}/{' '}
        <Link href="/discussions" className="hover:text-primary-600">Diskuze</Link>
        {' '}/{' '}
        <span className="text-gray-900">{(genre as any).name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {(genre as any).name}
          </h1>
          {(genre as any).description && (
            <p className="text-gray-600">{(genre as any).description}</p>
          )}
        </div>

        {session && <NewDiscussionButton genreId={(genre as any).id} genreName={(genre as any).name} />}
      </div>

      {/* Discussions List */}
      {discussions.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-600 text-lg mb-4">
            Zatím nejsou žádné diskuze v tomto žánru
          </p>
          {session && (
            <p className="text-gray-500">
              Buďte první, kdo založí diskuzi!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion: any) => (
            <Link
              key={discussion.id}
              href={`/discussions/${params.genreSlug}/${discussion.slug}`}
              className="card hover:shadow-lg transition-shadow block"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {discussion.isPinned && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                        📌 Připnuto
                      </span>
                    )}
                    {discussion.isLocked && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                        🔒 Zamčeno
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                    {discussion.title}
                  </h3>

                  {discussion.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {discussion.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {discussion.user.image ? (
                        <img
                          src={discussion.user.image}
                          alt={discussion.user.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary-600">
                            {discussion.user.name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                      <span>{discussion.user.name}</span>
                    </div>

                    <span>•</span>

                    <span>{formatDate(new Date(discussion.createdAt))}</span>

                    <span>•</span>

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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>
                        {discussion._count.posts}{' '}
                        {discussion._count.posts === 1
                          ? 'příspěvek'
                          : discussion._count.posts < 5
                          ? 'příspěvky'
                          : 'příspěvků'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
