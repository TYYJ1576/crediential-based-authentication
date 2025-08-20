import { cookies } from 'next/headers'

import Session from '../mongodb/models/Session'
import { connectDB } from '../mongodb/mongodb'

export async function getSession() {
  await connectDB()
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')?.value
  if (!sessionId) return null
  const session = await Session.findById(sessionId)
  if (!session || session.expiresAt < new Date()) return null
  return session
}
