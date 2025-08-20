import { connectDB } from '@/lib/mongodb/mongodb'
import User from '@/lib/mongodb/models/User'

/**
 * POST - API route handler to verify user's email address.
 *
 * Accepts a verification token, validates it, and updates the user's
 * emailVerified status if the token is valid and not expired.
 * Returns success or appropriate error response.
 *
 * @param req - Incoming POST request with JSON body containing `verifyToken`.
 * @returns Response - JSON response with success or error message.
 */
export async function POST(req: Request) {
  try {
    // Parse JSON body to extract verifyToken
    const body = await req.json()
    const { verifyToken } = body

    // Connect to MongoDB database
    await connectDB()

    // Find user document by provided verification token
    const user = await User.findOne({ verifyToken })

    // If no user found with the token, return error
    if (!user) {
      return new Response(JSON.stringify({ error: 'Token not found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if the verification token is still valid (not expired)
    // Calculate difference between token expiry time and current time
    if (user.verifyTokenExpiry.getTime() - Date.now() > 0) {
      // Token is valid: update user to mark email as verified
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            emailVerified: Date.now(), // Set emailVerified as current timestamp
            verifyToken: null, // Remove verify token to prevent reuse
            verifyTokenExpiry: null, // Clear expiry time
          },
        },
        { new: true } // Return the updated document
      )

      // If for some reason the user wasn't updated, respond with failure
      if (!updatedUser) {
        return new Response(JSON.stringify({ error: 'verification failed' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    // Respond with success message after verification
    return new Response(JSON.stringify({ message: 'verification succeed' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    // Log the error for debugging
    console.log(err)

    // Respond with generic error message and 400 status code
    return new Response(JSON.stringify({ error: err }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
