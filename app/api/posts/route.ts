import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createPostSchema = z.object({
  content: z.string().min(1, 'Obsah příspěvku je povinný'),
  discussionId: z.string(),
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
    const { content, discussionId } = createPostSchema.parse(body)

    // Zkontrolovat, zda diskuze existuje a není zamčená
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
    })

    if (!discussion) {
      return NextResponse.json(
        { error: 'Diskuze nenalezena' },
        { status: 404 }
      )
    }

    if ((discussion as any).isLocked) {
      return NextResponse.json(
        { error: 'Diskuze je zamčená' },
        { status: 403 }
      )
    }

    const post = await prisma.post.create({
      data: {
        content,
        userId: session.user.id,
        discussionId,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Nastala chyba při vytváření příspěvku' },
      { status: 500 }
    )
  }
}
