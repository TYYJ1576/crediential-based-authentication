'use client'

import { useEffect, useState } from 'react'

import { MessageBox } from '@/components/ui'

export default function DashBoardPage() {
  const [username, setUsername] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/profile')
        if (res.status === 401) {
          setError('You are not signed in.')
          return
        }

        const data = await res.json()
        if (data.success) {
          setUsername(data.username)
        } else {
          setError(data.message || 'Failed to fetch user data')
        }
      } catch (err) {
        setError('An unexpected error occured.')
      }
    }

    fetchProfile()
  }, [])

  // Render content based on state
  if (error) {
    return (
      <MessageBox
        topic="Error"
        message={error}
        buttonText="Login"
        redirectLocation="/id/login"
        signOut={false}
      />
    )
  }

  if (username) {
    return (
      <MessageBox
        topic="Dashboard"
        message={`Welcome, ${username}`}
        buttonText="Sign out"
        redirectLocation="/"
        signOut={true}
      />
    )
  }

  return (
    <div className="h-screen w-screen min-h-[200px] flex flex-col flex-wrap items-center justify-center gap-8">
      <div className="flex flex-col items-center min-w-[300px] w-full max-w-lg">
        <h2 className="text-2xl font-bold">loading...</h2>
      </div>
    </div>
  )
}
