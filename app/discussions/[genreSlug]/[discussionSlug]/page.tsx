import { db } from '@/lib/db'
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

  // Get discussion by slug
  const discussion = db.prepare(`
    SELECT d.*,
           u.id as user_id, u.name as user_name, u.image as user_image,
           g.id as genre_id, g.name as genre_name, g.slug as genre_slug
    FROM discussions d
    LEFT JOIN users u ON d.userId = u.id
    LEFT JOIN genres g ON d.genreId = g.id
    WHERE d.slug = ?
  `).get(params.discussionSlug) as any

  if (!discussion) {
    notFound()
  }

  // Get posts for this discussion
  const posts = db.prepare(`
    SELECT p.*,
           u.id as user_id, u.name as user_name, u.image as user_image
    FROM posts p
    LEFT JOIN users u ON p.userId = u.id
    WHERE p.discussionId = ?
    ORDER BY p.createdAt ASC
  `).all(discussion.id) as any[]

  // Transform data to match the expected structure
  const discussionData = {
    ...discussion,
    user: {
      id: discussion.user_id,
      name: discussion.user_name,
      image: discussion.user_image,
    },
    genre: {
      id: discussion.genre_id,
      name: discussion.genre_name,
      slug: discussion.genre_slug,
    },
    posts: posts.map(post => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      user: {
        id: post.user_id,
        name: post.user_name,
        image: post.user_image,
      },
    })),
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
          {discussionData.genre.name}
        </Link>
        {' '}/{' '}
        <span className="text-gray-900">{discussionData.title}</span>
      </div>

      {/* Discussion Header */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          {discussionData.isPinned && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
              📌 Připnuto
            </span>
          )}
          {discussionData.isLocked && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
              🔒 Zamčeno
            </span>
          )}
          <Link
            href={`/discussions/${params.genreSlug}`}
            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded hover:bg-primary-200 transition-colors"
          >
            {discussionData.genre.name}
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {discussionData.title}
        </h1>

        {discussionData.description && (
          <p className="text-gray-700 mb-4 whitespace-pre-line">
            {discussionData.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
          <div className="flex items-center gap-2">
            {discussionData.user.image ? (
              <img
                src={discussionData.user.image}
                alt={discussionData.user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-600">
                  {discussionData.user.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{discussionData.user.name}</p>
              <p className="text-xs">Založeno {formatDate(new Date(discussionData.createdAt))}</p>
            </div>
          </div>

          <span>•</span>

          <span>
            {discussionData.posts.length}{' '}
            {discussionData.posts.length === 1
              ? 'příspěvek'
              : discussionData.posts.length < 5
              ? 'příspěvky'
              : 'příspěvků'}
          </span>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4 mb-8">
        {discussionData.posts.map((post: any, index: number) => (
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

        {discussionData.posts.length === 0 && (
          <div className="card text-center py-8">
            <p className="text-gray-600">Zatím nejsou žádné příspěvky</p>
          </div>
        )}
      </div>

      {/* Add Post Form */}
      {session && !discussionData.isLocked ? (
        <AddPostForm discussionId={discussionData.id} />
      ) : discussionData.isLocked ? (
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
