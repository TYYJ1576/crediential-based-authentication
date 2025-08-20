import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import Mail from 'nodemailer/lib/mailer'

interface MailRequestBody {
  to: string
  subject: string
  text: string
  html?: string
}

interface SendEmailResult {
  accepted?: (string | Mail.Address)[]
  rejected?: (string | Mail.Address)[]
  messageId?: string
  response?: string
  error?: string
}

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  EMAIL_ADDRESS,
  GOOGLE_REFRESH_TOKEN,
} = process.env

if (
  !GOOGLE_CLIENT_ID ||
  !GOOGLE_CLIENT_SECRET ||
  !GOOGLE_REDIRECT_URL ||
  !EMAIL_ADDRESS ||
  !GOOGLE_REFRESH_TOKEN
) {
  throw new Error('Missing required environment variables for email sending')
}

const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL
)

oauth2Client.setCredentials({
  refresh_token: GOOGLE_REFRESH_TOKEN,
})

export async function SendEmail({
  to,
  subject,
  text,
  html,
}: MailRequestBody): Promise<SendEmailResult> {
  try {
    const accessTokenResponse = await oauth2Client.getAccessToken()
    const accessToken = accessTokenResponse.token
    if (!accessToken) throw new Error('Failed to retrieve access token')

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_ADDRESS,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken,
      },
    })

    const mailOptions = {
      from: EMAIL_ADDRESS,
      to,
      subject,
      text,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    return {
      accepted: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId,
      response: info.response,
    }
  } catch (error) {
    console.error('SendEmail error:', error)
    return {
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
