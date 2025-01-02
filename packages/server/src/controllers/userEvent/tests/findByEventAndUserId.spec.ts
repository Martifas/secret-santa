import { fakeAuthUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import userEventRouter from '..'

describe('findByEventAndUserId', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })

  const eventId = 100

  const existingUserEvent = {
    id: 1,
    eventId,
    userId: TEST_USER.id,
    role: 'member',
    wishlistId: 1,
    santaForUserId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should return user event when it exists', async () => {
    const repos = {
      userEventRepository: {
        findByEventAndUserId: async (inputEventId, userId) => {
          expect(inputEventId).toBe(eventId)
          expect(userId).toBe(TEST_USER.id)
          return existingUserEvent
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { findByEventAndUserId } = createCaller(testContext)

    const result = await findByEventAndUserId({ eventId })
    expect(result).toEqual(existingUserEvent)
  })

  it('should return null when user event does not exist', async () => {
    const repos = {
      userEventRepository: {
        findByEventAndUserId: async (inputEventId, userId) => {
          expect(inputEventId).toBe(eventId)
          expect(userId).toBe(TEST_USER.id)
          return null
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { findByEventAndUserId } = createCaller(testContext)

    const result = await findByEventAndUserId({ eventId })
    expect(result).toBeNull()
  })

  it('should propagate unknown errors from findByEventAndUserId', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        findByEventAndUserId: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { findByEventAndUserId } = createCaller(testContext)

    await expect(findByEventAndUserId({ eventId })).rejects.toThrow(unknownError)
  })
})