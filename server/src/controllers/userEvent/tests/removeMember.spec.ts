import { fakeUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import type { InvitationRepository } from '@server/repositories/invitationRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import userEventRouter from '..'

describe('removeMember', () => {
  const TEST_USER = fakeUser({
    id: 1,
    auth0Id: 'auth0|123',
  })

  const eventId = 100
  const userId = TEST_USER.auth0Id

  const existingUserEvent = {
    id: 1,
    eventId,
    userId: TEST_USER.auth0Id,
    role: 'member',
    wishlistId: 1,
    santaForUserId: 'auth0|125625',
    eventTitle: 'Test Event',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should successfully remove user event and invitation', async () => {
    const repos = {
      userEventRepository: {
        removeUserByEventId: async (eventId, userId) => {
          expect(eventId).toBe(eventId)
          expect(userId).toBe(TEST_USER.auth0Id)
          return 1
        },
        isEventAdmin: async () => true,
        findByEventAndUserId: async () => existingUserEvent,
      } satisfies Partial<UserEventRepository>,
      invitationRepository: {
        removeUserByEventId: async (eventId, userId) => {
          expect(eventId).toBe(eventId)
          expect(userId).toBe(TEST_USER.auth0Id)
          return 1
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    const result = await removeMember({ userId, eventId })
    expect(result).toEqual({ success: true })
  })

  it('should succeed even if invitation removal fails', async () => {
    const repos = {
      userEventRepository: {
        removeUserByEventId: async () => 1,
        isEventAdmin: async () => true,
        findByEventAndUserId: async () => existingUserEvent,
      } satisfies Partial<UserEventRepository>,
      invitationRepository: {
        removeUserByEventId: async () => {
          throw new Error('Invitation removal failed')
        },
      } satisfies Partial<InvitationRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    const result = await removeMember({ userId, eventId })
    expect(result).toEqual({ success: true })
  })

  it('should throw BAD_REQUEST when eventId is missing', async () => {
    const testContext = authRepoContext({}, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(
      // @ts-expect-error Testing invalid input
      removeMember({ userId, eventId: null })
    ).rejects.toThrow(
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event ID not provided',
      })
    )
  })

  it('should throw NOT_FOUND when user event does not exist', async () => {
    const repos = {
      userEventRepository: {
        removeUserByEventId: async () => {
          throw new Error('Should not be called')
        },
        isEventAdmin: async () => true,
        findByEventAndUserId: async () => null,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ userId, eventId })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'User event membership not found',
      })
    )
  })

  it('should throw INTERNAL_SERVER_ERROR when removeUserByEventId returns null', async () => {
    const repos = {
      userEventRepository: {
        removeUserByEventId: async () => null,
        isEventAdmin: async () => true,
        findByEventAndUserId: async () => existingUserEvent,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ userId, eventId })).rejects.toThrow(
      new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to remove user event membership',
      })
    )
  })

  it('should propagate unknown errors from findByEventAndUserId', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        removeUserByEventId: async () => {
          throw new Error('Should not be called')
        },
        isEventAdmin: async () => true,
        findByEventAndUserId: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ userId, eventId })).rejects.toThrow(
      new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while removing user from event',
        cause: unknownError,
      })
    )
  })

  it('should wrap unknown errors from removeUserByEventId with TRPC error', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        removeUserByEventId: async () => {
          throw unknownError
        },
        findByEventAndUserId: async () => existingUserEvent,
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ userId, eventId })).rejects.toThrow(
      new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while removing user from event',
        cause: unknownError,
      })
    )
  })
})
