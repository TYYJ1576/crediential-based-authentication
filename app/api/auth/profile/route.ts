import { getSession } from '@/lib/session/get-session'

export async function GET(req: Request) {
  // Get session
  const session = await getSession()

  // Return error message when user is not signed in
  if (!session) {
    return new Response(
      JSON.stringify({ success: false, message: 'Not Signed In' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  // Use session to get user info
  return new Response(
    JSON.stringify({ success: true, username: session.data.username }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
