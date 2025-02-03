import { fakeAuthUser, fakeEventInvitation } from '@server/entities/tests/fakes'
import type { InvitationRepository } from '@server/repositories/invitationRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import invitationRouter from '..'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { sendGiftExchangeInvitation } from '@server/services/sendEmail'
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@server/utils/sendEmail', () => ({
  sendGiftExchangeInvitation: vi.fn(),
}))

describe('create', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
  })
  const eventId = 100
  const eventDate = new Date('2025-12-25')
  const newInvitationInput = {
    eventId,
    email: 'ezys@miskas.lt',
    status: 'sent',
    eventOrganiser: 'John Doe',
    eventDate,
    title: 'Birthday party',
    budgetLimit: 50,
    description: 'awesome party',
  }
  const createdInvitation = {
    ...fakeEventInvitation({
      id: 1,
      eventId,
      email: 'ezys@miskas.lt',
      status: 'sent',
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(sendGiftExchangeInvitation).mockResolvedValue({
      success: true,
      messageId: 'test-message-id',
    })
  })

  it('should create a new invitation and send email when successful', async () => {
    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => null,
        create: async (input) => {
          expect(input).toEqual({
            eventId,
            email: 'ezys@miskas.lt',
            status: 'sent',
          })
          return createdInvitation.id
        },
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { createAndSendInvitation } = createCaller(testContext)

    const result = await createAndSendInvitation(newInvitationInput)

    expect(result).toEqual({
      success: true,
      invitationId: 1,
      emailSent: true,
      messageId: 'test-message-id',
    })

    expect(sendGiftExchangeInvitation).toHaveBeenCalledWith({
      emailReceiver: 'ezys@miskas.lt',
      eventOrganiser: 'John Doe',
      exchangeDate: eventDate,
      title: newInvitationInput.title,
      budgetLimit: newInvitationInput.budgetLimit,
      description: newInvitationInput.description,
      rsvpLinkYes: `http://localhost:5173/rsvp/${newInvitationInput.eventId}/${createdInvitation.id}/accept`,
      rsvpLinkNo: `http://localhost:5173/rsvp/${newInvitationInput.eventId}/${createdInvitation.id}/refuse`,
    })
  })

  it('should update invitation status and throw when email sending fails', async () => {
    const emailErrorMessage = 'Failed to send email'
    vi.mocked(sendGiftExchangeInvitation).mockResolvedValue({
      success: false,
      error: emailErrorMessage,
    })

    const updateSpy = vi.fn().mockImplementation(async (id, data) => ({
      ...createdInvitation,
      ...data,
    }))

    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => null,
        create: async () => createdInvitation.id,
        update: updateSpy,
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { createAndSendInvitation } = createCaller(testContext)

    await expect(
      createAndSendInvitation(newInvitationInput)
    ).rejects.toThrowError(
      new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Invitation created but failed to send email',
        cause: new Error(emailErrorMessage),
      })
    )

    expect(updateSpy).toHaveBeenCalledWith(createdInvitation.id, {
      status: 'FAILED',
    })
  })

  it('should throw CONFLICT when invitation already exists for user and event', async () => {
    const existingInvitation = {
      ...createdInvitation,
      email: 'existing@miskas.lt',
    }
    const createSpy = vi
      .fn()
      .mockRejectedValue(new Error('Should not be called'))

    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => existingInvitation,
        create: createSpy,
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { createAndSendInvitation } = createCaller(testContext)

    await expect(
      createAndSendInvitation(newInvitationInput)
    ).rejects.toThrowError(
      new TRPCError({
        code: 'CONFLICT',
        message:
          'An invitation with this name already exists for this event and user',
      })
    )

    expect(sendGiftExchangeInvitation).not.toHaveBeenCalled()
    expect(createSpy).not.toHaveBeenCalled()
  })

  it('should propagate unknown errors from create', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => null,
        create: async () => {
          throw unknownError
        },
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { createAndSendInvitation } = createCaller(testContext)

    await expect(
      createAndSendInvitation(newInvitationInput)
    ).rejects.toThrowError(
      new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to process invitation',
        cause: unknownError,
      })
    )

    expect(sendGiftExchangeInvitation).not.toHaveBeenCalled()
  })

  it('should propagate unknown errors from findByEventAndEmail', async () => {
    const unknownError = new Error('Database connection failed')
    const createSpy = vi
      .fn()
      .mockRejectedValue(new Error('Should not be called'))

    const repos = {
      invitationRepository: {
        findByEventAndEmail: async () => {
          throw unknownError
        },
        create: createSpy,
      } satisfies Partial<InvitationRepository>,
      userEventRepository: {
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { createAndSendInvitation } = createCaller(testContext)

    await expect(
      createAndSendInvitation(newInvitationInput)
    ).rejects.toThrowError(
      new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to process invitation',
        cause: unknownError,
      })
    )

    expect(sendGiftExchangeInvitation).not.toHaveBeenCalled()
    expect(createSpy).not.toHaveBeenCalled()
  })
})
