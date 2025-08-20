import { serialize } from 'cookie'

import Session from '@/lib/mongodb/models/Session'
import { connectDB } from '@/lib/mongodb/mongodb'
import { getSession } from '@/lib/session/get-session'

export async function POST(req: Request) {
  try {
    // Get the session
    const session = await getSession()

    // Check if session exists
    if (!session) {
      return new Response(JSON.stringify({ message: 'Not Signed In' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Use the session to find the session id if session is exists
    const sessionId = session._id
    console.log(sessionId)

    // Connect to mongoDB
    await connectDB()

    // Find and delete the session in the database
    await Session.deleteOne({ _id: sessionId })

    // Clear cookies
    const expiredCookie = serialize('session_id', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return new Response(JSON.stringify({ message: 'Sign out success' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': expiredCookie,
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Unexpected errors' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
