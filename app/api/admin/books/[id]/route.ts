import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // Check admin access
    const adminEmails = ['admin@example.com']
    if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
      return NextResponse.json(
        { error: 'Nemáte oprávnění' },
        { status: 403 }
      )
    }

    // Delete book and related records (cascade should handle it)
    db.prepare('DELETE FROM books WHERE id = ?').run(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json(
      { error: 'Nastala chyba při mazání knihy' },
      { status: 500 }
    )
  }
}
