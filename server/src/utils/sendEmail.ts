import nodemailer, { type Transporter } from 'nodemailer'
import 'dotenv/config'

interface EmailConfig {
  emailReceiver: string
  eventOrganiser: string
  exchangeDate: Date
  rsvpLink: string
}

interface EmailTemplateProps {
  eventOrganiser: string
  exchangeDate: Date
  rsvpLink: string
}

interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

const { env } = process

if (!env.EMAIL_SENDER || !env.EMAIL_PASSWORD) {
  throw new Error(
    'Missing required environment variables: EMAIL_SENDER or EMAIL_PASSWORD'
  )
}

const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: env.EMAIL_SENDER,
      pass: env.EMAIL_PASSWORD,
    },
  })
}

const generateEmailTemplate = ({
  eventOrganiser,
  exchangeDate,
  rsvpLink,
}: EmailTemplateProps): string => {
  return `
    <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
          <div style="font-size: 24px; color: #333333; margin-bottom: 20px;">
              You're Invited to ${eventOrganiser}'s Gift Exchange
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
              <img src="https://i.ibb.co/6ytXyyw/gift-meister-final.png" alt="Gift Exchange" style="max-width: 100%; height: auto;">
          </div>
          
          <div style="font-size: 18px; color: #666666; margin-bottom: 15px;">
              Hello!
          </div>
          
          <div style="color: #666666;">
              I'd love for you to join me in the gift-giving fun!
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <div style="font-weight: bold; color: #333333;">Gift Exchange Date</div>
              <div style="color: #666666;">${exchangeDate.toLocaleDateString()}</div>
          </div>
          
          <a href="${rsvpLink}" style="display: inline-block; background-color: #008080; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              RSVP
          </a>
          
          <div style="color: #666666; margin: 20px 0; padding: 0 20px;">
              <h3 style="color: #333333;">What Exactly is a Gift Exchange?</h3>
              <p style="color: #666666;">
                  It's an event where everyone participating is randomly assigned to one another, so that gifts can be exchanged anonymously. It's the easiest and most fun way to gift!
              </p>
          </div>
          
          <div style="margin-top: 20px; color: #666666;">
              <p style="margin: 5px 0;">Hope you'll join us,</p>
              <p style="margin: 5px 0;">${eventOrganiser}</p>
          </div>
      </div>
    </body>
  `
}

export async function sendGiftExchangeInvitation({
  emailReceiver,
  eventOrganiser,
  exchangeDate,
  rsvpLink,
}: EmailConfig): Promise<EmailResponse> {
  try {
    const transporter = createTransporter()
    const htmlTemplate = generateEmailTemplate({
      eventOrganiser,
      exchangeDate,
      rsvpLink,
    })

    const info = await transporter.sendMail({
      from: '"Gift Meister" <secretgiftmeister@gmail.com>',
      to: emailReceiver,
      subject: `${eventOrganiser} invited you to a gift exchange! 🎁`,
      html: htmlTemplate,
    })

    console.log('Message sent: %s', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
