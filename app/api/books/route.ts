import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/books - Získat seznam knih
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const genreId = searchParams.get('genreId')
    const search = searchParams.get('search')

    const books = await prisma.book.findMany({
      where: {
        ...(genreId && {
          genres: {
            some: {
              genreId
            }
          }
        }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { author: { contains: search, mode: 'insensitive' } },
          ]
        })
      },
      include: {
        genres: {
          include: {
            genre: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Nastala chyba při načítání knih' },
      { status: 500 }
    )
  }
}

// POST /api/books - Vytvořit novou knihu (vyžaduje přihlášení)
const createBookSchema = z.object({
  title: z.string().min(1, 'Název knihy je povinný'),
  author: z.string().min(1, 'Autor je povinný'),
  isbn: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().url().optional(),
  publishedAt: z.string().optional(),
  pageCount: z.number().optional(),
  language: z.string().default('cs'),
  genreIds: z.array(z.string()).optional(),
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
    const data = createBookSchema.parse(body)

    const book = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        description: data.description,
        coverImage: data.coverImage,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        pageCount: data.pageCount,
        language: data.language,
        ...(data.genreIds && data.genreIds.length > 0 && {
          genres: {
            create: data.genreIds.map(genreId => ({
              genre: {
                connect: { id: genreId }
              }
            }))
          }
        })
      },
      include: {
        genres: {
          include: {
            genre: true
          }
        }
      }
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating book:', error)
    return NextResponse.json(
      { error: 'Nastala chyba při vytváření knihy' },
      { status: 500 }
    )
  }
}
