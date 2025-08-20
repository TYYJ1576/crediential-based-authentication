'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { Button } from '../ui'

/**
 * Verification - React component for email verification process.
 *
 * Props:
 * @param verifyToken - Verification token extracted from URL or props.
 *
 * Behavior:
 * - Automatically sends the token to the backend verification API on mount.
 * - Displays real-time status and message based on API response.
 * - Shows navigation buttons based on success, failure, or missing token.
 */
export default function Verification({ verifyToken }: { verifyToken: string }) {
  // Local state to track verification status ('Verifying', 'Success', 'Fail', 'Missing')
  const [status, setStatus] = useState('Verifying')

  // Message to display to user about current verification state
  const [message, setMessage] = useState('Verifying...')

  useEffect(() => {
    if (verifyToken) {
      // Send POST request to verify email with the token
      fetch('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ verifyToken }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(async (res) => {
          if (res.ok) {
            // On successful verification, update state to success
            setStatus('Success')
            setMessage(
              'Your account is verified! Click the button to login your account'
            )
          } else {
            // On failure, read error message from response and update state
            const data = await res.json()
            setStatus('Fail')
            setMessage(
              data.error ||
                'Verification failed. Click the button to register again.'
            )
          }
        })
        .catch(() => {
          // On network or unexpected errors, update state to failure
          setStatus('Fail')
          setMessage('Verification failed. Click the button to register again.')
        })
    } else {
      // If token is missing, update state accordingly
      setStatus('Missing')
      setMessage('Verification token not found.')
    }
  }, [verifyToken])

  return (
    // Container centered vertically and horizontally with spacing
    <div className="h-screen w-screen min-h-[200px] flex flex-col flex-wrap items-center justify-center gap-8">
      {/* Display verification status and message */}
      <div className="flex flex-col items-center min-w-[300px] w-full max-w-lg">
        <h2 className="text-2xl font-bold">{status}</h2>
        <p className="text-sm">{message}</p>
      </div>

      {/* Conditionally render navigation buttons based on verification status */}
      {status === 'Success' && (
        <Button variant="outline">
          <Link href="/id/login" className="text-xs font-normal">
            LOGIN PAGE
          </Link>
        </Button>
      )}
      {status === 'Fail' && (
        <Button variant="outline">
          <Link href="/id/register" className="text-xs font-normal">
            REGISTER PAGE
          </Link>
        </Button>
      )}
      {status === 'Missing' && (
        <Button variant="outline">
          <Link href="/" className="text-xs font-normal">
            HOME PAGE
          </Link>
        </Button>
      )}
    </div>
  )
}
