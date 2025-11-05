'use client'

import { useState } from 'react'
import { BookCard } from '@/components/BookCard'

interface WishlistContentProps {
  initialWishlist: any[]
}

const STATUS_LABELS = {
  WANT_TO_READ: 'Chci přečíst',
  CURRENTLY_READING: 'Právě čtu',
  FINISHED: 'Přečteno',
  ON_HOLD: 'Odloženo',
}

export function WishlistContent({ initialWishlist }: WishlistContentProps) {
  const [wishlist, setWishlist] = useState(initialWishlist)
  const [filter, setFilter] = useState<string>('ALL')

  const filteredWishlist = filter === 'ALL'
    ? wishlist
    : wishlist.filter((item: any) => item.status === filter)

  const handleRemove = (bookId: string) => {
    setWishlist(wishlist.filter((item: any) => item.bookId !== bookId))
  }

  const groupedByStatus = wishlist.reduce((acc: any, item: any) => {
    if (!acc[item.status]) {
      acc[item.status] = []
    }
    acc[item.status].push(item)
    return acc
  }, {})

  return (
    <>
      {/* Filter Tabs */}
      {wishlist.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Všechny ({wishlist.length})
          </button>

          {Object.entries(STATUS_LABELS).map(([status, label]) => {
            const count = groupedByStatus[status]?.length || 0
            if (count === 0) return null

            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {label} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Books Grid */}
      {filteredWishlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-600 text-lg mb-4">
            {filter === 'ALL'
              ? 'Váš wishlist je prázdný'
              : `Nemáte žádné knihy ve stavu "${STATUS_LABELS[filter as keyof typeof STATUS_LABELS]}"`}
          </p>
          <a href="/books" className="btn-primary inline-block">
            Procházet knihy
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWishlist.map((item: any) => (
            <div key={item.id} className="relative">
              <BookCard
                book={item.book}
                showWishlistButton={true}
                onRemove={() => handleRemove(item.bookId)}
              />

              {/* Status Badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded-full text-xs font-medium shadow-md">
                {STATUS_LABELS[item.status as keyof typeof STATUS_LABELS]}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
