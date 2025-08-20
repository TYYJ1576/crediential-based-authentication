import { useEffect, useState } from 'react'

type ProfileResult = {
  profile: { username: string } | null
  loading: boolean
  error: string | null
}

export function useProfile(): ProfileResult {
  const [profile, setProfile] = useState<{ username: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/profile')
        if (cancelled) return

        if (res.status === 401) {
          setError('You are not signed in.')
          setLoading(false)
          return
        }
        const data = await res.json()
        if (data.success) {
          setProfile({ username: data.username })
        } else {
          setError(data.message || 'Failed to fetch user data')
        }
      } catch (err) {
        if (!cancelled) setError('An unexpected error occured.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProfile()

    return () => {
      cancelled = true
    }
  }, [])

  return { profile, loading, error }
}
