import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { WishlistContent } from './WishlistContent'

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const wishlist = await prisma.wishlist.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      book: {
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
      },
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Můj Wishlist</h1>
        <p className="text-gray-600">
          {wishlist.length === 0
            ? 'Zatím nemáte žádné knihy ve wishlistu'
            : `Máte ${wishlist.length} ${wishlist.length === 1 ? 'knihu' : wishlist.length < 5 ? 'knihy' : 'knih'} ve wishlistu`}
        </p>
      </div>

      <WishlistContent initialWishlist={wishlist} />
    </div>
  )
}
