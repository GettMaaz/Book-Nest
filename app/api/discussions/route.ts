import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

// GET /api/discussions - Získat diskuze
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const genreId = searchParams.get('genreId')

    const discussions = await prisma.discussion.findMany({
      where: {
        ...(genreId && { genreId })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        genre: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(discussions)
  } catch (error) {
    console.error('Error fetching discussions:', error)
    return NextResponse.json(
      { error: 'Nastala chyba při načítání diskuzí' },
      { status: 500 }
    )
  }
}

// POST /api/discussions - Vytvořit novou diskuzi
const createDiscussionSchema = z.object({
  title: z.string().min(3, 'Název musí mít alespoň 3 znaky'),
  description: z.string().optional(),
  genreId: z.string(),
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
    const { title, description, genreId } = createDiscussionSchema.parse(body)

    const slug = `${slugify(title)}-${Date.now()}`

    const discussion = await prisma.discussion.create({
      data: {
        title,
        slug,
        description,
        userId: session.user.id,
        genreId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        genre: true
      }
    })

    return NextResponse.json(discussion, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating discussion:', error)
    return NextResponse.json(
      { error: 'Nastala chyba při vytváření diskuze' },
      { status: 500 }
    )
  }
}
