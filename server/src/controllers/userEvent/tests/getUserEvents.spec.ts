import { fakeUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import userEventRouter from '..'

describe('getUserEvents', () => {
  const TEST_USER = fakeUser({
    id: 1,
    auth0Id: 'auth0|123',
  })

  const mockUserEvents = [
    {
      id: 1,
      eventId: 100,
      userId: TEST_USER.auth0Id,
      role: 'member',
      wishlistId: 1,
      santaForUserId: 'auth0|456',
      eventTitle: 'Christmas Party',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      eventId: 101,
      userId: TEST_USER.auth0Id,
      role: 'admin',
      wishlistId: 2,
      santaForUserId: 'auth0|789',
      eventTitle: 'Birthday Gift Exchange',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  it('should return all user events when found', async () => {
    const repos = {
      userEventRepository: {
        findAllForUser: async (userId) => {
          expect(userId).toBe(TEST_USER.auth0Id)
          return mockUserEvents
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { getUserEvents } = createCaller(testContext)

    const result = await getUserEvents({ userId: TEST_USER.auth0Id })
    expect(result).toEqual(mockUserEvents)
    expect(result).toHaveLength(2)
    expect(result[0].eventTitle).toBe('Christmas Party')
    expect(result[1].eventTitle).toBe('Birthday Gift Exchange')
  })

  it('should handle empty results when user has no events', async () => {
    const repos = {
      userEventRepository: {
        findAllForUser: async () => [],
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { getUserEvents } = createCaller(testContext)

    const result = await getUserEvents({ userId: TEST_USER.auth0Id })
    expect(result).toEqual([])
  })

  it('should propagate unknown errors from findAllForUser', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        findAllForUser: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { getUserEvents } = createCaller(testContext)

    await expect(
      getUserEvents({ userId: TEST_USER.auth0Id })
    ).rejects.toThrow(unknownError)
  })
})