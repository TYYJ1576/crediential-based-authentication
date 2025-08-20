import bcrypt from 'bcryptjs'
import * as z from 'zod/v4'
import { randomBytes } from 'crypto'

import User from '@/lib/mongodb/models/User'
import { connectDB } from '@/lib/mongodb/mongodb'
import { RegisterData } from '@/lib/zod/zod-schemas'
import { VerificationEmail } from '@/components/html/verification-email'
import { SendEmail } from '@/lib/email/send-email'

const SITE_URL = process.env.SITE_URL

/**
 * POST - API route handler for user registration.
 *
 * Validates the input data with Zod, creates or updates a user
 * record with hashed password and verification token,
 * sends a verification email, and returns appropriate HTTP responses.
 *
 * @param req - Incoming POST request object with user registration data.
 * @returns Response - JSON response indicating success or failure.
 */
export async function POST(req: Request) {
  // Parse and validate request body with Zod schema
  const body = await req.json()
  const result = RegisterData.safeParse(body)

  // Handle validation errors
  if (!result.success) {
    return new Response(JSON.stringify({ error: z.flattenError }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { username, email, password } = result.data

  try {
    // Establish connection to MongoDB
    await connectDB()

    // Check if user with verified email already exists
    const user = await User.findOne({
      email,
      emailVerified: { $exists: true, $ne: null, $type: 'date' },
    })

    if (user) {
      // Prevent duplicate account creation for verified email
      return new Response(JSON.stringify({ error: 'User exists already' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Hash the password securely using bcrypt with salt rounds = 10
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate a secure verification token and expiry timestamp (1 hour)
    const verifyToken = randomBytes(32).toString('hex')
    const verifyTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Create or update user document in the database with verification info
    const userUpdated = await User.findOneAndUpdate(
      { email }, // filter by email
      {
        username,
        email,
        password: hashedPassword,
        emailVerified: null, // Mark as not verified yet
        verifyToken, // Token sent via email for verification
        verifyTokenExpiry, // Token expiry timestamp
      },
      {
        upsert: true, // Create a new user if no document matches
        new: true, // Return the updated document
      }
    )

    // If the update/create operation failed, send an error response
    if (userUpdated == null) {
      return new Response(
        JSON.stringify({ error: 'Unable to create account' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Construct verification URL using the token
    const verifyUrl = `${SITE_URL}/auth/verify-email/${encodeURIComponent(
      verifyToken
    )}`

    // Generate HTML content for the verification email
    const verifyHTML = VerificationEmail(verifyUrl)

    // Send verification email with plain text and HTML versions
    const sendResult = await SendEmail({
      to: email,
      subject: 'Verify your email address',
      text: 'Please verify your email by clicking: ' + verifyUrl,
      html: verifyHTML,
    })

    // Handle any error during email sending
    if (sendResult.error) {
      return new Response(JSON.stringify({ error: sendResult.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Return success response indicating verification email sent
    return new Response(
      JSON.stringify({ message: 'Verification email sent' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    // Log unexpected errors (helpful for debugging)
    console.log(err)

    // Return generic error response on server failure
    return new Response(JSON.stringify({ error: err }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
