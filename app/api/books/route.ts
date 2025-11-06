import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// GET /api/books - Získat seznam knih
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sort') || 'newest'
    const genreFilter = searchParams.get('genre') || ''
    const perPage = 12
    const skip = (page - 1) * perPage

    // Sestavit SQL dotaz s řazením
    let query = `
      SELECT b.*,
             COUNT(DISTINCT w.id) as wishlist_count
      FROM books b
      LEFT JOIN wishlists w ON w.bookId = b.id
    `

    const params: any[] = []
    const whereClauses: string[] = []

    // Vyhledávání
    if (search) {
      whereClauses.push('(b.title LIKE ? OR b.author LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    // Filtr podle žánru
    if (genreFilter) {
      whereClauses.push(`EXISTS (
        SELECT 1 FROM book_genres bg
        INNER JOIN genres g ON g.id = bg.genreId
        WHERE bg.bookId = b.id AND g.slug = ?
      )`)
      params.push(genreFilter)
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ')
    }

    query += ' GROUP BY b.id'

    // Řazení
    switch (sortBy) {
      case 'title':
        query += ' ORDER BY b.title ASC'
        break
      case 'popular':
        query += ' ORDER BY wishlist_count DESC, b.title ASC'
        break
      case 'oldest':
        query += ' ORDER BY b.createdAt ASC'
        break
      case 'newest':
      default:
        query += ' ORDER BY b.createdAt DESC'
        break
    }

    // Pagination
    query += ` LIMIT ${perPage} OFFSET ${skip}`

    const books = db.prepare(query).all(...params)

    // Přidat žánry ke knihám
    const booksWithGenres = (books as any[]).map((book: any) => ({
      ...book,
      genres: db.prepare(`
        SELECT g.* FROM genres g
        INNER JOIN book_genres bg ON bg.genreId = g.id
        WHERE bg.bookId = ?
      `).all(book.id).map((g: any) => ({ genre: g }))
    }))

    // Počet knih celkem
    let countQuery = 'SELECT COUNT(DISTINCT b.id) as count FROM books b'
    if (genreFilter) {
      countQuery += ` INNER JOIN book_genres bg ON bg.bookId = b.id
                      INNER JOIN genres g ON g.id = bg.genreId`
    }

    const countWhereClauses: string[] = []
    const countParams: any[] = []

    if (search) {
      countWhereClauses.push('(b.title LIKE ? OR b.author LIKE ?)')
      countParams.push(`%${search}%`, `%${search}%`)
    }

    if (genreFilter) {
      countWhereClauses.push('g.slug = ?')
      countParams.push(genreFilter)
    }

    if (countWhereClauses.length > 0) {
      countQuery += ' WHERE ' + countWhereClauses.join(' AND ')
    }

    const totalBooksResult = db.prepare(countQuery).get(...countParams) as any
    const totalBooks = totalBooksResult.count
    const totalPages = Math.ceil(totalBooks / perPage)

    return NextResponse.json({
      books: booksWithGenres,
      totalBooks,
      totalPages,
      currentPage: page
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Nastala chyba při načítání knih', books: [], totalBooks: 0, totalPages: 1 },
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

    // Generate ID
    const id = 'c' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const now = new Date().toISOString()

    db.prepare(`
      INSERT INTO books (id, title, author, isbn, description, coverImage, publishedAt, pageCount, language, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.author,
      data.isbn || null,
      data.description || null,
      data.coverImage || null,
      data.publishedAt || null,
      data.pageCount || null,
      data.language,
      now,
      now
    )

    // Add genre relations
    if (data.genreIds && data.genreIds.length > 0) {
      const insertGenre = db.prepare(`
        INSERT INTO book_genres (id, bookId, genreId, createdAt)
        VALUES (?, ?, ?, ?)
      `)

      for (const genreId of data.genreIds) {
        const bgId = 'c' + Math.random().toString(36).substring(2, 15)
        insertGenre.run(bgId, id, genreId, now)
      }
    }

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id)

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
