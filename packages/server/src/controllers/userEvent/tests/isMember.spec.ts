import { fakeAuthUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import userEventRouter from '..'

describe('isMember', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })

  const eventId = 100

  it('should return true when user is a member', async () => {
    const repos = {
      userEventRepository: {
        isMember: async (inputEventId, userId) => {
          expect(inputEventId).toBe(eventId)
          expect(userId).toBe(TEST_USER.id)
          return true
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { isMember } = createCaller(testContext)

    const result = await isMember({ eventId })
    expect(result).toBe(true)
  })

  it('should return false when user is not a member', async () => {
    const repos = {
      userEventRepository: {
        isMember: async (inputEventId, userId) => {
          expect(inputEventId).toBe(eventId)
          expect(userId).toBe(TEST_USER.id)
          return false
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { isMember } = createCaller(testContext)

    const result = await isMember({ eventId })
    expect(result).toBe(false)
  })

  it('should propagate unknown errors from isMember check', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        isMember: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { isMember } = createCaller(testContext)

    await expect(isMember({ eventId })).rejects.toThrow(unknownError)
  })
})