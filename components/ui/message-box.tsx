'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * MessageBox - Displays a message box with a topic, message, and a button.
 *
 * Props:
 * @param topic - Title or heading of the message box.
 * @param message - Main message text to display.
 * @param buttonText - Text to display inside the button.
 * @param redirectLocation - URL or path to redirect when the button is clicked (if not signing out).
 * @param signOut - Optional boolean indicating if the button triggers a sign-out process.
 *
 * Behavior:
 * - If `signOut` is true, clicking the button calls an API to sign out the user,
 *   then redirects to `redirectLocation`.
 * - If `signOut` is false or undefined, the button acts as a link to `redirectLocation`.
 * - Displays any sign-out errors below the message.
 */
export default function MessageBox({
  topic,
  message,
  buttonText,
  redirectLocation,
  signOut = false,
}: {
  topic: string
  message: string
  buttonText: string
  redirectLocation: string
  signOut?: boolean
}) {
  // State to hold any error messages during sign-out process
  const [error, setError] = useState('')

  // Next.js router instance for client-side navigation
  const router = useRouter()

  /**
   * onSignOut - async function to handle user sign-out.
   * Makes a POST request to the sign-out API endpoint.
   * On success, redirects to the specified `redirectLocation`.
   * On failure, sets an error message to display.
   */
  const onSignOut = async () => {
    setError('') // Clear previous error before starting sign-out
    try {
      // Call sign-out API endpoint
      const res = await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const resData = await res.json()

      if (res.ok) {
        // Redirect on successful sign-out
        router.push(redirectLocation)
      } else {
        // Display error from response or fallback message
        setError(resData?.message || 'Sign out failed')
      }
    } catch (err) {
      // Handle network or unexpected errors gracefully
      setError('Sign out failed')
    }
  }

  return (
    // Full screen container to center content both vertically and horizontally
    <div className="h-screen w-screen min-h-[200px] flex flex-col flex-wrap items-center justify-center gap-8">
      {/* Box containing topic heading and message */}
      <div className="flex flex-col items-center min-w-[300px] w-full max-w-lg">
        <h2 className="text-2xl font-bold">{topic}</h2>
        <p className="text-sm">{message}</p>
        {/* Show error message if exists */}
        {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
      </div>

      {/* Conditional render of button:
          - If `signOut` true, button triggers sign-out function on click.
          - Otherwise, button acts as a link to redirect location.
      */}
      {signOut ? (
        <Button variant="outline" onClick={onSignOut}>
          {buttonText}
        </Button>
      ) : (
        <Link href={redirectLocation}>
          <Button variant="outline">{buttonText}</Button>
        </Link>
      )}
    </div>
  )
}
