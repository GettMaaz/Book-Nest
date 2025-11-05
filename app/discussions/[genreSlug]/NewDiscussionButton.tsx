'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface NewDiscussionButtonProps {
  genreId: string
  genreName: string
}

export function NewDiscussionButton({ genreId, genreName }: NewDiscussionButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          genreId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Nastala chyba při vytváření diskuze')
        setIsLoading(false)
        return
      }

      setIsOpen(false)
      router.refresh()
    } catch (error) {
      setError('Nastala chyba při vytváření diskuze')
      setIsLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        + Nová diskuze
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Nová diskuze v {genreName}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="label">
                  Název diskuze *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                  placeholder="Např.: Jaká je vaše oblíbená kniha?"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Popis (volitelné)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input min-h-[120px]"
                  placeholder="Popište, o čem chcete diskutovat..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !title.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Vytváření...' : 'Vytvořit diskuzi'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                >
                  Zrušit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
