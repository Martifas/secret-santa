import { fakeUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import type { UserRepository } from '@server/repositories/userRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import userEventRouter from '..'

describe('getSantee', () => {
  const TEST_USER = fakeUser({
    id: 1,
    auth0Id: 'auth0|123',
  })

  const eventId = 100
  const santeeId = 'auth0|456'

  const mockSanteeUser = {
    firstName: 'John',
    picture: 'profile.jpg',
    email: 'john@example.com',
  }

  it('should return santa assignment when found', async () => {
    const repos = {
      userEventRepository: {
        findBySantaId: async (auth0Id, eventId) => {
          expect(auth0Id).toBe(TEST_USER.auth0Id)
          expect(eventId).toBe(eventId)
          return santeeId
        },
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      userRepository: {
        findNamePicEmailByAuth0Id: async (auth0Id) => {
          expect(auth0Id).toBe(santeeId)
          return {
            firstName: mockSanteeUser.firstName,
            picture: mockSanteeUser.picture,
            email: mockSanteeUser.email,
          }
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { getSantee } = createCaller(testContext)

    const result = await getSantee({ eventId })
    expect(result).toEqual({
      firstName: mockSanteeUser.firstName,
      santeeId: santeeId,
    })
  })

  it('should throw NOT_FOUND when no santee is assigned', async () => {
    const repos = {
      userEventRepository: {
        findBySantaId: async () => null,
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      userRepository: {
        findNamePicEmailByAuth0Id: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { getSantee } = createCaller(testContext)

    await expect(
      getSantee({ eventId })
    ).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'No santees assigned for this user this event',
      })
    )
  })

  it('should return null firstName when santee user details are not found', async () => {
    const repos = {
      userEventRepository: {
        findBySantaId: async () => santeeId,
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      userRepository: {
        findNamePicEmailByAuth0Id: async () => ({
          firstName: null,
          picture: null,
          email: null,
        }),
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { getSantee } = createCaller(testContext)

    const result = await getSantee({ eventId })
    expect(result).toEqual({
      firstName: null,
      santeeId: santeeId,
    })
  })

  it('should propagate unknown errors from findBySantaId', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        findBySantaId: async () => {
          throw unknownError
        },
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      userRepository: {
        findNamePicEmailByAuth0Id: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { getSantee } = createCaller(testContext)

    await expect(
      getSantee({ eventId })
    ).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from findNamePicEmailByAuth0Id', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        findBySantaId: async () => santeeId,
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      userRepository: {
        findNamePicEmailByAuth0Id: async () => {
          throw unknownError
        },
      } satisfies Partial<UserRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { getSantee } = createCaller(testContext)

    await expect(
      getSantee({ eventId })
    ).rejects.toThrow(unknownError)
  })
})