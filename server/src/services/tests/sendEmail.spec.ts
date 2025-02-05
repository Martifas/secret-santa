/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import nodemailer from 'nodemailer'
import {
  sendGiftExchangeInvitation,
  sendSecretSantaDrawResult,
} from '../sendEmail'
// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn(),
    })),
  },
}))

describe('Email Service', () => {
  const mockDate = new Date('2025-12-25')

  // Common test data
  const baseEmailConfig = {
    emailReceiver: 'recipient@example.com',
    eventOrganiser: 'Test Organiser',
    exchangeDate: mockDate,
    budgetLimit: 50,
    title: 'Christmas Gift Exchange',
    description: 'A fun gift exchange event',
  }

  const mockTransporter = {
    sendMail: vi.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the createTransport mock to return our mockTransporter
    vi.mocked(nodemailer.createTransport).mockReturnValue(
      mockTransporter as any
    )
  })

  describe('sendGiftExchangeInvitation', () => {
    const invitationConfig = {
      ...baseEmailConfig,
      rsvpLinkYes: 'https://example.com/yes',
      rsvpLinkNo: 'https://example.com/no',
    }

    it('should successfully send an invitation email', async () => {
      const result = await sendGiftExchangeInvitation(invitationConfig)

      expect(result.success).toBe(true)
      expect(result.messageId).toBe('test-message-id')
      expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1)

      // Verify email content
      const sendMailArgs = mockTransporter.sendMail.mock.calls[0][0]
      expect(sendMailArgs).toMatchObject({
        from: '"Gift Meister" <secretgiftmeister@gmail.com>',
        to: invitationConfig.emailReceiver,
        subject: `${invitationConfig.eventOrganiser} invited you to a gift exchange! 🎁`,
      })
      expect(sendMailArgs.html).toContain(invitationConfig.title)
      expect(sendMailArgs.html).toContain(invitationConfig.description)
      expect(sendMailArgs.html).toContain(invitationConfig.rsvpLinkYes)
      expect(sendMailArgs.html).toContain(invitationConfig.rsvpLinkNo)
    })

    it('should handle errors when sending invitation email', async () => {
      const mockError = new Error('Failed to send email')
      mockTransporter.sendMail.mockRejectedValueOnce(mockError)

      const result = await sendGiftExchangeInvitation(invitationConfig)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to send email')
      expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1)
    })
  })

  describe('sendSecretSantaDrawResult', () => {
    const drawResultConfig = {
      ...baseEmailConfig,
      gifteeName: 'John Doe',
      eventLink: 'https://example.com/event',
    }

    it('should successfully send a draw result email', async () => {
      const result = await sendSecretSantaDrawResult(drawResultConfig)

      expect(result.success).toBe(true)
      expect(result.messageId).toBe('test-message-id')
      expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1)

      // Verify email content
      const sendMailArgs = mockTransporter.sendMail.mock.calls[0][0]
      expect(sendMailArgs).toMatchObject({
        from: '"Gift Meister" <secretgiftmeister@gmail.com>',
        to: drawResultConfig.emailReceiver,
        subject: 'Your Secret Santa Assignment Revealed! 🎅✨',
      })
      expect(sendMailArgs.html).toContain(drawResultConfig.gifteeName)
      expect(sendMailArgs.html).toContain(drawResultConfig.eventLink)
      expect(sendMailArgs.html).toContain(drawResultConfig.title)
    })

    it('should handle errors when sending draw result email', async () => {
      const mockError = new Error('Failed to send email')
      mockTransporter.sendMail.mockRejectedValueOnce(mockError)

      const result = await sendSecretSantaDrawResult(drawResultConfig)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to send email')
      expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1)
    })
  })
})
