import type { UserEventRepository } from '@server/repositories/userEventRepository'
import type { UserRepository } from '@server/repositories/userRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import getUserNamePicEmailByEventRouter from '..'

describe('getUserNamePicEmailByEvent', () => {
  const testEventId = 123
  const testUserId = 'auth0|456'

  const testUserInfo = {
    firstName: 'Test',
    picture: 'https://example.com/avatar.jpg',
    email: 'test@example.com',
    auth0Id: testUserId,
  }

  it('should return user information for event participants', async () => {
    const repos = {
      userEventRepository: {
        getAllEventUsers: async (eventId) => {
          expect(eventId).toBe(testEventId)
          return [{ userId: testUserId }]
        },
      } satisfies Partial<UserEventRepository>,
      userRepository: {
        findNamePicEmailByAuth0Id: async (userId) => {
          expect(userId).toBe(testUserId)
          return testUserInfo
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(getUserNamePicEmailByEventRouter)
    const { getUserNamePicEmailByEvent } = createCaller(testContext)

    const result = await getUserNamePicEmailByEvent({ eventId: testEventId })
    expect(result).toEqual([testUserInfo])
  })

  it('should handle missing user information with defaults', async () => {
    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => [{ userId: testUserId }],
      } satisfies Partial<UserEventRepository>,
      userRepository: {
        findNamePicEmailByAuth0Id: async () => ({
          firstName: null,
          picture: null,
          email: null
        }),
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(getUserNamePicEmailByEventRouter)
    const { getUserNamePicEmailByEvent } = createCaller(testContext)

    const result = await getUserNamePicEmailByEvent({ eventId: testEventId })
    expect(result).toEqual([{
      firstName: 'Unknown User',
      picture: null,
      email: null,
      auth0Id: testUserId,
    }])
  })

  it('should throw NOT_FOUND when no users found for event', async () => {
    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => [],
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(getUserNamePicEmailByEventRouter)
    const { getUserNamePicEmailByEvent } = createCaller(testContext)

    await expect(getUserNamePicEmailByEvent({ eventId: testEventId }))
      .rejects.toThrow(
        new TRPCError({
          code: 'NOT_FOUND',
          message: 'No users found for this event',
        })
      )
  })

  it('should handle multiple users in event', async () => {
    const testUserIds = ['auth0|456', 'auth0|789']
    const testUserInfos = [
      {
        firstName: 'Test1',
        picture: 'https://example.com/avatar1.jpg',
        email: 'test1@example.com',
        auth0Id: testUserIds[0],
      },
      {
        firstName: 'Test2',
        picture: 'https://example.com/avatar2.jpg',
        email: 'test2@example.com',
        auth0Id: testUserIds[1],
      },
    ]

    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => testUserIds.map(userId => ({ userId })),
      } satisfies Partial<UserEventRepository>,
      userRepository: {
        findNamePicEmailByAuth0Id: async (userId) => {
          const userInfo = testUserInfos.find(info => info.auth0Id === userId)
          return {
            firstName: userInfo?.firstName ?? null,
            picture: userInfo?.picture ?? null,
            email: userInfo?.email ?? null
          }
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(getUserNamePicEmailByEventRouter)
    const { getUserNamePicEmailByEvent } = createCaller(testContext)

    const result = await getUserNamePicEmailByEvent({ eventId: testEventId })
    expect(result).toEqual(testUserInfos)
  })

  it('should propagate repository errors', async () => {
    const testError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        getAllEventUsers: async () => {
          throw testError
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos)
    const createCaller = createCallerFactory(getUserNamePicEmailByEventRouter)
    const { getUserNamePicEmailByEvent } = createCaller(testContext)

    await expect(getUserNamePicEmailByEvent({ eventId: testEventId }))
      .rejects.toThrow(testError)
  })
})