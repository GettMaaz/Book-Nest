'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AddPostFormProps {
  discussionId: string
}

export function AddPostForm({ discussionId }: AddPostFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          discussionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Nastala chyba při přidávání příspěvku')
        setIsLoading(false)
        return
      }

      setContent('')
      router.refresh()
    } catch (error) {
      setError('Nastala chyba při přidávání příspěvku')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Přidat příspěvek</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input min-h-[150px]"
            placeholder="Napište svůj příspěvek..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Přidávání...' : 'Přidat příspěvek'}
        </button>
      </form>
    </div>
  )
}
