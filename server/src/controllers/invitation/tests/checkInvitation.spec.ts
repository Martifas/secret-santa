import type { InvitationRepository } from '@server/repositories/invitationRepository'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { fakeEventInvitation, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import invitationRouter from '..'

describe('findByEventAndUserId', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })
  const eventId = 100
  const targetUserId = 2

  const existingInvitation = {
    ...fakeEventInvitation({
      id: 1,
      userId: targetUserId,
      eventId,
      email: 'test@example.com',
      token: 'token123',
      status: 'sent',
      expiresAt: new Date('2024-12-25'),
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should return invitation when user is event member', async () => {
    const repos = {
      userEventRepository: {
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      invitationRepository: {
        findByEventAndUserId: async (event, userId) => {
          expect(event).toBe(eventId)
          expect(userId).toBe(targetUserId)
          return existingInvitation
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { checkInvitation } = createCaller(testContext)

    const result = await checkInvitation({
      eventId,
      userId: targetUserId,
    })

    expect(result).toMatchObject({
      id: expect.any(Number),
      userId: targetUserId,
      eventId,
      email: 'test@example.com',
      token: 'token123',
      status: 'sent',
      expiresAt: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should return null when invitation does not exist', async () => {
    const repos = {
      userEventRepository: {
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      invitationRepository: {
        findByEventAndUserId: async () => null,
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { checkInvitation } = createCaller(testContext)

    const result = await checkInvitation({
      eventId,
      userId: targetUserId,
    })

    expect(result).toBeNull()
  })

  it('should throw FORBIDDEN when user is not event member', async () => {
    const repos = {
      userEventRepository: {
        isMember: async () => false,
      } satisfies Partial<UserEventRepository>,
      invitationRepository: {
        findByEventAndUserId: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { checkInvitation } = createCaller(testContext)

    await expect(
      checkInvitation({ eventId, userId: targetUserId })
    ).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not a member of this event',
      })
    )
  })

  it('should propagate unknown errors from event membership check', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        isMember: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
      invitationRepository: {
        findByEventAndUserId: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { checkInvitation } = createCaller(testContext)

    await expect(
      checkInvitation({ eventId, userId: targetUserId })
    ).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from invitation lookup', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      invitationRepository: {
        findByEventAndUserId: async () => {
          throw unknownError
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(invitationRouter)
    const { checkInvitation } = createCaller(testContext)

    await expect(
      checkInvitation({ eventId, userId: targetUserId })
    ).rejects.toThrow(unknownError)
  })
})
