import nodemailer, { type Transporter } from 'nodemailer'
import 'dotenv/config'

interface EmailConfig {
  emailReceiver: string
  eventOrganiser: string
  exchangeDate: Date
  rsvpLinkYes: string
  rsvpLinkNo: string
  budgetLimit: number
  description: string
  title: string
}

interface DrawResultConfig {
  emailReceiver: string
  eventOrganiser: string
  gifteeName: string
  eventLink: string
  exchangeDate: Date
  budgetLimit: number
  title: string
}

interface EmailTemplateProps {
  eventOrganiser: string
  exchangeDate: Date
  rsvpLinkYes: string
  rsvpLinkNo: string
  budgetLimit: number
  description: string
  title: string
}

interface DrawResultTemplateProps {
  eventOrganiser: string
  gifteeName: string
  eventLink: string
  exchangeDate: Date
  budgetLimit: number
  title: string
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
  rsvpLinkYes,
  rsvpLinkNo,
  budgetLimit,
  description,
  title,
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
        <h2 style="color: #333333; margin-bottom: 20px;">Event Details</h2>
        
        <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; color: #333333; margin-bottom: 5px;">📅 Gift Exchange Date</div>
            <div style="color: #666666; font-size: 16px;">${exchangeDate.toLocaleDateString()}</div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; color: #333333; margin-bottom: 5px;">🎯 Event Title</div>
            <div style="color: #666666; font-size: 16px;">${title}</div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; color: #333333; margin-bottom: 5px;">💰 Budget Limit</div>
            <div style="color: #666666; font-size: 16px;">$${budgetLimit}</div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; color: #333333; margin-bottom: 5px;">📝 Description</div>
            <div style="color: #666666; font-size: 16px;">${description}</div>
        </div>
    </div>
          
         <div style="margin-bottom: 15px; color: #666666;">
              Please let us know if you can participate in the gift exchange:
          </div>
          
          <a href="${rsvpLinkYes}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 0 10px;">
              Accept
          </a>
          <a href="${rsvpLinkNo}" style="display: inline-block; background-color: #DC3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 0 10px;">
              Refuse
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

const generateDrawResultTemplate = ({
  eventOrganiser,
  gifteeName,
  eventLink,
  exchangeDate,
  budgetLimit,
  title,
}: DrawResultTemplateProps): string => {
  return `
    <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
          <div style="font-size: 24px; color: #333333; margin-bottom: 20px;">
              Secret Santa Draw Results! 🎅
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
              <img src="https://i.ibb.co/6ytXyyw/gift-meister-final.png" alt="Gift Exchange" style="max-width: 100%; height: auto;">
          </div>
          
          <div style="font-size: 18px; color: #666666; margin-bottom: 15px;">
              The results are in!
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h2 style="color: #333333; margin-bottom: 20px;">🎁 Your Secret Santa Assignment</h2>
              
              <div style="font-size: 24px; color: #4CAF50; margin: 20px 0; padding: 15px; background-color: #ffffff; border-radius: 8px;">
                  You will be giving a gift to:
                  <div style="font-weight: bold; margin-top: 10px; color: #333333;">
                      ${gifteeName}
                  </div>
              </div>
              
              <div style="margin-top: 20px;">
                  <div style="font-weight: bold; color: #333333; margin-bottom: 5px;">📅 Exchange Date</div>
                  <div style="color: #666666;">${exchangeDate.toLocaleDateString()}</div>
              </div>
              
              <div style="margin-top: 15px;">
                  <div style="font-weight: bold; color: #333333; margin-bottom: 5px;">🎯 Event</div>
                  <div style="color: #666666;">${title}</div>
              </div>
              
              <div style="margin-top: 15px;">
                  <div style="font-weight: bold; color: #333333; margin-bottom: 5px;">💰 Budget Limit</div>
                  <div style="color: #666666;">$${budgetLimit}</div>
              </div>
          </div>
          
          <a href="${eventLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              View Event Details
          </a>
          
          <div style="margin-top: 20px; color: #666666;">
              <p style="margin: 5px 0;">Happy gifting!</p>
              <p style="margin: 5px 0;">${eventOrganiser}</p>
          </div>
          
          <div style="color: #999999; font-size: 12px; margin-top: 20px;">
              Remember: Keep it a secret! That's what makes it fun! 🤫
          </div>
      </div>
    </body>
  `
}

export async function sendGiftExchangeInvitation({
  emailReceiver,
  eventOrganiser,
  budgetLimit,
  description,
  title,
  exchangeDate,
  rsvpLinkYes,
  rsvpLinkNo,
}: EmailConfig): Promise<EmailResponse> {
  try {
    const transporter = createTransporter()
    const htmlTemplate = generateEmailTemplate({
      eventOrganiser,
      exchangeDate,
      rsvpLinkYes,
      rsvpLinkNo,
      budgetLimit,
      description,
      title,
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

export async function sendSecretSantaDrawResult({
  emailReceiver,
  eventOrganiser,
  gifteeName,
  eventLink,
  exchangeDate,
  budgetLimit,
  title,
}: DrawResultConfig): Promise<EmailResponse> {
  try {
    const transporter = createTransporter()
    const htmlTemplate = generateDrawResultTemplate({
      eventOrganiser,
      gifteeName,
      eventLink,
      exchangeDate,
      budgetLimit,
      title,
    })

    const info = await transporter.sendMail({
      from: '"Gift Meister" <secretgiftmeister@gmail.com>',
      to: emailReceiver,
      subject: `Your Secret Santa Assignment Revealed! 🎅✨`,
      html: htmlTemplate,
    })

    console.log('Draw result sent: %s', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending draw result:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}