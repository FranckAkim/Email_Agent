'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Drafts() {
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  useEffect(() => {
    if (!token) {
      router.push('/')
      return
    }
    fetchDrafts()
  }, [])

  const fetchDrafts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/emails/drafts?access_token=${token}`)
      const data = await response.json()
      setDrafts(data.drafts)
    } catch (err) {
      setError('Failed to fetch drafts')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Generating drafts...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">AI Drafts</h1>
          <button
            onClick={() => router.push('/inbox')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Inbox
          </button>
        </div>
        <div className="space-y-6">
          {drafts.map((email) => (
            <div key={email.gmail_id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="mb-4">
                <p className="font-semibold text-gray-800">{email.sender}</p>
                <p className="text-gray-600 text-sm">{email.subject}</p>
                <span className="text-xs text-red-500 font-bold">Score: {email.importance_score}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-xs text-gray-400 mb-2 uppercase font-semibold">AI Draft Response</p>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{email.draft}</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  ✓ Approve & Send
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold">
                  ✎ Edit
                </button>
                <button className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold">
                  ✕ Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
