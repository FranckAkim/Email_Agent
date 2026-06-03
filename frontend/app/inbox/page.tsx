'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Inbox() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  useEffect(() => {
    if (!token) {
      router.push('/')
      return
    }
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/emails?access_token=${token}`)
      const data = await response.json()
      setEmails(data.emails)
    } catch (err) {
      setError('Failed to fetch emails')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading emails...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Inbox</h1>
          <button
            onClick={() => router.push('/drafts')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            View Drafts
          </button>
        </div>
        <div className="space-y-3">
          {emails.map((email) => (
            <div key={email.gmail_id} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${email.is_flagged ? 'border-red-500' : 'border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{email.sender}</p>
                  <p className="text-gray-600">{email.subject}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${email.importance_score > 10 ? 'text-red-500' : email.importance_score > 5 ? 'text-yellow-500' : 'text-gray-400'}`}>
                    Score: {email.importance_score}
                  </span>
                  {email.is_flagged && <p className="text-xs text-red-500 mt-1">🚩 Flagged</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
