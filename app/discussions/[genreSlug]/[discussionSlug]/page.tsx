import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AddPostForm } from './AddPostForm'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: { genreSlug: string; discussionSlug: string }
}

export default async function DiscussionDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  const discussion = await prisma.discussion.findUnique({
    where: { slug: params.discussionSlug },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      genre: true,
      posts: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  if (!discussion) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-primary-600">Domů</Link>
        {' '}/{' '}
        <Link href="/discussions" className="hover:text-primary-600">Diskuze</Link>
        {' '}/{' '}
        <Link
          href={`/discussions/${params.genreSlug}`}
          className="hover:text-primary-600"
        >
          {(discussion as any).genre.name}
        </Link>
        {' '}/{' '}
        <span className="text-gray-900">{(discussion as any).title}</span>
      </div>

      {/* Discussion Header */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          {(discussion as any).isPinned && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
              📌 Připnuto
            </span>
          )}
          {(discussion as any).isLocked && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
              🔒 Zamčeno
            </span>
          )}
          <Link
            href={`/discussions/${params.genreSlug}`}
            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded hover:bg-primary-200 transition-colors"
          >
            {(discussion as any).genre.name}
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {(discussion as any).title}
        </h1>

        {(discussion as any).description && (
          <p className="text-gray-700 mb-4 whitespace-pre-line">
            {(discussion as any).description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
          <div className="flex items-center gap-2">
            {(discussion as any).user.image ? (
              <img
                src={(discussion as any).user.image}
                alt={(discussion as any).user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-600">
                  {(discussion as any).user.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{(discussion as any).user.name}</p>
              <p className="text-xs">Založeno {formatDate(new Date((discussion as any).createdAt))}</p>
            </div>
          </div>

          <span>•</span>

          <span>
            {(discussion as any).posts.length}{' '}
            {(discussion as any).posts.length === 1
              ? 'příspěvek'
              : (discussion as any).posts.length < 5
              ? 'příspěvky'
              : 'příspěvků'}
          </span>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4 mb-8">
        {(discussion as any).posts.map((post: any, index: number) => (
          <div key={post.id} className="card">
            <div className="flex items-start gap-4">
              {post.user.image ? (
                <img
                  src={post.user.image}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold text-primary-600">
                    {post.user.name?.charAt(0) || '?'}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-gray-900">{post.user.name}</p>
                  <span className="text-xs text-gray-500">
                    {formatDate(new Date(post.createdAt))}
                  </span>
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                </div>

                <p className="text-gray-700 whitespace-pre-line break-words">
                  {post.content}
                </p>
              </div>
            </div>
          </div>
        ))}

        {(discussion as any).posts.length === 0 && (
          <div className="card text-center py-8">
            <p className="text-gray-600">Zatím nejsou žádné příspěvky</p>
          </div>
        )}
      </div>

      {/* Add Post Form */}
      {session && !(discussion as any).isLocked ? (
        <AddPostForm discussionId={(discussion as any).id} />
      ) : (discussion as any).isLocked ? (
        <div className="card text-center py-8">
          <div className="text-4xl mb-2">🔒</div>
          <p className="text-gray-600">Tato diskuze je zamčená a nelze do ní přidávat příspěvky</p>
        </div>
      ) : (
        <div className="card text-center py-8">
          <p className="text-gray-600 mb-4">Pro přidání příspěvku se musíte přihlásit</p>
          <Link href="/login" className="btn-primary inline-block">
            Přihlásit se
          </Link>
        </div>
      )}
    </div>
  )
}
