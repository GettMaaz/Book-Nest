'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export function Navigation() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-primary-600">BookNest</span>
          </Link>

          {/* Navigační odkazy */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/books" className="text-gray-700 hover:text-primary-600 transition-colors">
              Knihy
            </Link>
            <Link href="/genres" className="text-gray-700 hover:text-primary-600 transition-colors">
              Žánry
            </Link>
            <Link href="/discussions" className="text-gray-700 hover:text-primary-600 transition-colors">
              Diskuze
            </Link>
            {session && (
              <Link href="/wishlist" className="text-gray-700 hover:text-primary-600 transition-colors">
                Můj Wishlist
              </Link>
            )}
          </div>

          {/* Uživatelské menu */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : session ? (
              <>
                <span className="text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="btn-secondary"
                >
                  Odhlásit se
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Přihlásit se
                </Link>
                <Link href="/register" className="btn-primary">
                  Registrace
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
