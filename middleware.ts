import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Admin routes - check if user is admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const token = req.nextauth.token

      // Zkontrolovat, zda uživatel má admin email
      const adminEmails = ['admin@example.com']
      const userEmail = token?.email

      if (!userEmail || !adminEmails.includes(userEmail)) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Admin routes vyžadují přihlášení
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
