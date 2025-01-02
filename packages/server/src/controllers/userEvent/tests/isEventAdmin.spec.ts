import { fakeAuthUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import userEventRouter from '..'

describe('isEventAdmin', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })

  const eventId = 100

  it('should return true when user is an event admin', async () => {
    const repos = {
      userEventRepository: {
        isEventAdmin: async (userId, inputEventId) => {
          expect(userId).toBe(TEST_USER.id)
          expect(inputEventId).toBe(eventId)
          return true
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { isEventAdmin } = createCaller(testContext)

    const result = await isEventAdmin({ eventId })
    expect(result).toBe(true)
  })

  it('should return false when user is not an event admin', async () => {
    const repos = {
      userEventRepository: {
        isEventAdmin: async (userId, inputEventId) => {
          expect(userId).toBe(TEST_USER.id)
          expect(inputEventId).toBe(eventId)
          return false
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { isEventAdmin } = createCaller(testContext)

    const result = await isEventAdmin({ eventId })
    expect(result).toBe(false)
  })

  it('should propagate unknown errors from isEventAdmin check', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        isEventAdmin: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { isEventAdmin } = createCaller(testContext)

    await expect(isEventAdmin({ eventId })).rejects.toThrow(unknownError)
  })
})