import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

// GET /api/genres - Získat všechny žánry
export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            books: true,
            discussions: true
          }
        }
      }
    })

    return NextResponse.json(genres)
  } catch (error) {
    console.error('Error fetching genres:', error)
    return NextResponse.json(
      { error: 'Nastala chyba při načítání žánrů' },
      { status: 500 }
    )
  }
}

// POST /api/genres - Vytvořit nový žánr (vyžaduje přihlášení)
const createGenreSchema = z.object({
  name: z.string().min(1, 'Název žánru je povinný'),
  description: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Musíte být přihlášeni' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, description } = createGenreSchema.parse(body)

    const slug = slugify(name)

    const genre = await prisma.genre.create({
      data: {
        name,
        slug,
        description,
      }
    })

    return NextResponse.json(genre, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating genre:', error)
    return NextResponse.json(
      { error: 'Nastala chyba při vytváření žánru' },
      { status: 500 }
    )
  }
}
