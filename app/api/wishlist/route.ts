import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/wishlist - Získat wishlist aktuálního uživatele
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Musíte být přihlášeni' },
        { status: 401 }
      )
    }

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        book: {
          include: {
            genres: {
              include: {
                genre: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Nastala chyba při načítání wishlistu' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Přidat knihu do wishlistu
const addToWishlistSchema = z.object({
  bookId: z.string(),
  status: z.enum(['WANT_TO_READ', 'CURRENTLY_READING', 'FINISHED', 'ON_HOLD']).default('WANT_TO_READ'),
  notes: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Musíte být přihlášeni' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { bookId, status, notes } = addToWishlistSchema.parse(body)

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        bookId,
        status,
        notes,
      },
      include: {
        book: true
      }
    })

    return NextResponse.json(wishlistItem, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Nastala chyba při přidávání do wishlistu' },
      { status: 500 }
    )
  }
}
