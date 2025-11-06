'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface WishlistButtonProps {
  bookId: string
}

export function WishlistButton({ bookId }: WishlistButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('WANT_TO_READ')

  useEffect(() => {
    if (session?.user?.id) {
      checkWishlistStatus()
    }
  }, [session, bookId])

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`/api/wishlist/check/${bookId}`)
      if (response.ok) {
        const data = await response.json()
        setIsInWishlist(data.inWishlist)
        if (data.status) setStatus(data.status)
      }
    } catch (error) {
      console.error('Chyba při kontrole wishlistu:', error)
    }
  }

  const handleToggle = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    setIsLoading(true)

    try {
      if (isInWishlist) {
        const response = await fetch(`/api/wishlist/${bookId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setIsInWishlist(false)
        }
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookId,
            status,
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
    <div className="space-y-4">
      {!isInWishlist && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input w-full mb-2"
        >
          <option value="WANT_TO_READ">Chci přečíst</option>
          <option value="CURRENTLY_READING">Právě čtu</option>
          <option value="FINISHED">Přečteno</option>
          <option value="ON_HOLD">Odloženo</option>
        </select>
      )}

      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
          isInWishlist
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        {isInWishlist ? 'Odebrat z wishlistu' : 'Přidat do wishlistu'}
      </button>

      {isInWishlist && (
        <p className="text-sm text-gray-600 text-center">
          Tato kniha je ve vašem wishlistu
        </p>
      )}
    </div>
  )
}
