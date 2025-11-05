import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ inWishlist: false })
    }

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: params.bookId,
        },
      },
    })

    return NextResponse.json({
      inWishlist: !!wishlistItem,
      status: wishlistItem ? (wishlistItem as any).status : null,
    })
  } catch (error) {
    console.error('Error checking wishlist:', error)
    return NextResponse.json({ inWishlist: false })
  }
}
