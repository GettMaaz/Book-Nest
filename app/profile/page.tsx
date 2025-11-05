import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const wishlistCount = (await prisma.wishlist.count({
    where: { userId: session.user.id },
  }) as any).count

  const posts = await prisma.post.findMany({
    where: { userId: session.user.id },
  })

  const discussions = await prisma.discussion.findMany({
    where: { userId: session.user.id },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Můj profil</h1>

        {/* User Info Card */}
        <div className="card mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              {(user as any)?.image ? (
                <img
                  src={(user as any).image}
                  alt={(user as any).name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-primary-600">
                  {(user as any)?.name?.charAt(0) || '?'}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {(user as any)?.name}
              </h2>
              <p className="text-gray-600 mb-4">{(user as any)?.email}</p>

              {(user as any)?.bio && (
                <p className="text-gray-700">{(user as any).bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-3xl font-bold text-gray-900">{wishlistCount}</p>
            <p className="text-gray-600">Knihy ve wishlistu</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
            <p className="text-gray-600">Příspěvky v diskuzích</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">✨</div>
            <p className="text-3xl font-bold text-gray-900">{discussions.length}</p>
            <p className="text-gray-600">Založené diskuze</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Rychlé odkazy</h3>
          <div className="space-y-2">
            <a href="/wishlist" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">→ Můj Wishlist</span>
            </a>
            <a href="/discussions" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">→ Diskuzní fórum</span>
            </a>
            <a href="/books" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">→ Procházet knihy</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
