import { fakeUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import userEventRouter from '..'

describe('getUserEvent', () => {
  const TEST_USER = fakeUser({
    id: 1,
    auth0Id: 'auth0|123',
  })

  const eventId = 100
  const userId = TEST_USER.auth0Id

  const mockUserEvent = {
    id: 1,
    eventId,
    userId,
    role: 'member',
    wishlistId: 1,
    santaForUserId: 'auth0|456',
    eventTitle: 'Test Event',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should return user event when found', async () => {
    const repos = {
      userEventRepository: {
        findByEventAndUserId: async (eventId, userId) => {
          expect(eventId).toBe(eventId)
          expect(userId).toBe(TEST_USER.auth0Id)
          return mockUserEvent
        },
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { getUserEvent } = createCaller(testContext)

    const result = await getUserEvent({ eventId, userId })
    expect(result).toEqual(mockUserEvent)
  })

  it('should throw NOT_FOUND when user event does not exist', async () => {
    const repos = {
      userEventRepository: {
        findByEventAndUserId: async () => null,
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { getUserEvent } = createCaller(testContext)

    await expect(getUserEvent({ eventId, userId })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'No user event found',
      })
    )
  })

  it('should propagate unknown errors from findByEventAndUserId', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        findByEventAndUserId: async () => {
          throw unknownError
        },
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { getUserEvent } = createCaller(testContext)

    await expect(getUserEvent({ eventId, userId })).rejects.toThrow(
      unknownError
    )
  })
})
