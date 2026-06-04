'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Drafts() {
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sending, setSending] = useState({})
  const [sent, setSent] = useState({})
  const [editing, setEditing] = useState({})
  const [editedDrafts, setEditedDrafts] = useState({})
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

  const handleApprove = async (email) => {
    setSending(prev => ({ ...prev, [email.gmail_id]: true }))
    try {
      const senderEmail = email.sender.match(/<(.+)>/)?.[1] || email.sender
      const body = editedDrafts[email.gmail_id] || email.draft
      const response = await fetch('http://localhost:8000/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: token,
          to: senderEmail,
          subject: email.subject,
          body: body
        })
      })
      const data = await response.json()
      if (data.status === 'sent') {
        setSent(prev => ({ ...prev, [email.gmail_id]: true }))
        setEditing(prev => ({ ...prev, [email.gmail_id]: false }))
      }
    } catch (err) {
      alert('Failed to send email')
    } finally {
      setSending(prev => ({ ...prev, [email.gmail_id]: false }))
    }
  }

  const handleEdit = (email) => {
    setEditing(prev => ({ ...prev, [email.gmail_id]: true }))
    setEditedDrafts(prev => ({ ...prev, [email.gmail_id]: email.draft }))
  }

  const handleCancelEdit = (email) => {
    setEditing(prev => ({ ...prev, [email.gmail_id]: false }))
  }

  const handleDismiss = (gmail_id) => {
    setDrafts(prev => prev.filter(email => email.gmail_id !== gmail_id))
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
                <p className="text-xs text-gray-400 mb-2 uppercase font-semibold">
                  {editing[email.gmail_id] ? 'Editing Draft' : 'AI Draft Response'}
                </p>
                {editing[email.gmail_id] ? (
                  <textarea
                    className="w-full text-gray-700 text-sm p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={6}
                    value={editedDrafts[email.gmail_id]}
                    onChange={(e) => setEditedDrafts(prev => ({ ...prev, [email.gmail_id]: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {editedDrafts[email.gmail_id] || email.draft}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                {sent[email.gmail_id] ? (
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">✓ Sent</span>
                ) : (
                  <>
                    <button
                      onClick={() => handleApprove(email)}
                      disabled={sending[email.gmail_id]}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                    >
                      {sending[email.gmail_id] ? "Sending..." : "✓ Approve & Send"}
                    </button>
                    {editing[email.gmail_id] ? (
                      <button
                        onClick={() => handleCancelEdit(email)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        ✕ Cancel Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(email)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        ✎ Edit
                      </button>
                    )}
                      <button 
                        onClick={() => handleDismiss(email.gmail_id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold">
                        ✕ Dismiss
                      </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
