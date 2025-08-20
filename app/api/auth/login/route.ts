import * as z from 'zod/v4'
import { v4 as uuidv4 } from 'uuid'
import { serialize } from 'cookie'
import bcrypt from 'bcryptjs'

import { LoginData } from '@/lib/zod/zod-schemas'
import User from '@/lib/mongodb/models/User'
import { connectDB } from '@/lib/mongodb/mongodb'
import Session from '@/lib/mongodb/models/Session'

/**
 * POST - API route handler for user login.
 *
 * Validates input data, verifies user credentials,
 * creates a session and sets a session cookie on success.
 * Returns error responses with proper status codes on failure.
 *
 * @param req - Incoming Request object representing HTTP POST request.
 * @returns Response - HTTP Response with JSON payload and appropriate status.
 */
export async function POST(req: Request) {
  try {
    // Parse and validate request body using Zod schema
    const body = await req.json()
    const result = LoginData.safeParse(body)

    // Handle validation errors
    if (!result.success) {
      // Using z.flattenError to provide detailed error info (adjust if necessary)
      return new Response(JSON.stringify({ error: z.flattenError }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { email, password } = result.data

    // Connect to MongoDB database
    await connectDB()

    // Find user by email ensuring email is verified (field exists, not null, and is a valid date)
    const user = await User.findOne({
      email,
      emailVerified: { $exists: true, $ne: null, $type: 'date' },
    })

    // If no user found or email not verified, return 400 error
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not exists / Email not verified' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Compare provided password with hashed password stored in DB
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      // Return 401 Unauthorized if password does not match
      return new Response(JSON.stringify({ error: 'Wrong password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create unique session ID
    const sessionId = uuidv4()

    // Set session expiration time to 12 hours from now (0.5 days)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 0.5)

    // Store session in the database
    await Session.create({
      _id: sessionId, // Session ID as document _id
      userId: user._id, // Reference to user
      data: { username: user.username, email: user.email }, // Session related user data
      expiresAt, // Expiry date-time for session
    })

    // Serialize cookie to be set in the response
    const cookie = serialize('session_id', sessionId, {
      httpOnly: true, // Cannot be accessed via client-side JS
      path: '/', // Cookie sent to all routes
      sameSite: 'lax', // CSRF protection
      expires: expiresAt, // Cookie expiration matches session expiration
      secure: process.env.NODE_ENV === 'production', // Set secure flag in prod only
    })

    // Return success response with cookie set in headers
    return new Response(JSON.stringify({ message: 'Login success' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie,
      },
    })
  } catch (err) {
    // Handle unexpected errors gracefully
    return new Response(
      JSON.stringify({
        error: 'Login failed',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
