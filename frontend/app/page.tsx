'use client'
import { useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const response = await fetch('http://localhost:8000/auth/login')
    const data = await response.json()
    window.location.href = data.auth_url
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-md text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Email Agent</h1>
        <p className="text-gray-500 mb-8">AI-powered email management. Connect your Gmail to get started.</p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
        >
          {loading ? "Connecting..." : "Connect Gmail"}
        </button>
      </div>
    </main>
  )
}