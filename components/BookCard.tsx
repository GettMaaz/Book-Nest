'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface BookCardProps {
  book: any
  showWishlistButton?: boolean
  onRemove?: () => void
}

export function BookCard({ book, showWishlistButton = true, onRemove }: BookCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const genres = book.genres?.map((bg: any) => bg.genre) || []
  const firstGenre = genres[0]

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      router.push('/login')
      return
    }

    setIsLoading(true)

    try {
      if (isInWishlist || onRemove) {
        // Odebrat z wishlistu
        const response = await fetch(`/api/wishlist/${book.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setIsInWishlist(false)
          if (onRemove) onRemove()
        }
      } else {
        // Přidat do wishlistu
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookId: book.id,
            status: 'WANT_TO_READ',
          }),
        })

        if (response.ok) {
          setIsInWishlist(true)
        }
      }
    } catch (error) {
      console.error('Chyba při práci s wishlistem:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Link href={`/books/${book.id}`} className="group">
      <div className="card hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Cover Image */}
        <div className="aspect-[2/3] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl">📖</div>
          )}

          {/* Wishlist Button */}
          {showWishlistButton && (
            <button
              onClick={handleWishlistToggle}
              disabled={isLoading}
              className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
                isInWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isInWishlist ? 'Odebrat z wishlistu' : 'Přidat do wishlistu'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
            {book.title}
          </h3>

          <p className="text-sm text-gray-600 mb-2">{book.author}</p>

          {firstGenre && (
            <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full mb-2 w-fit">
              {firstGenre.name}
            </span>
          )}

          {book.description && (
            <p className="text-sm text-gray-600 line-clamp-3 mt-2">
              {book.description}
            </p>
          )}

          {book.pageCount && (
            <p className="text-xs text-gray-500 mt-auto pt-2">
              {book.pageCount} stran
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
