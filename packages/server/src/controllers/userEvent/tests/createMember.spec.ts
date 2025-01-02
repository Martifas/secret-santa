import { fakeAuthUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import { TRPCError } from '@trpc/server'
import userEventRouter from '..'

describe('create', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })

  const eventId = 100
  const newUserEventInput = {
    eventId,
    userId: TEST_USER.id,
    role: 'member',
    wishlistId: 1,
    santaForUserId: 2,
  }

  const createdUserEvent = {
    id: 1,
    ...newUserEventInput,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should create a new user event membership when user is not already a member', async () => {
    const repos = {
      userEventRepository: {
        create: async (input) => {
          expect(input).toEqual(newUserEventInput)
          return createdUserEvent
        },
        findByEventAndUserId: async () => null,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { createMember } = createCaller(testContext)

    const result = await createMember(newUserEventInput)
    expect(result).toMatchObject({
      id: expect.any(Number),
      eventId,
      userId: TEST_USER.id,
      role: 'member',
      wishlistId: expect.any(Number),
      santaForUserId: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw BAD_REQUEST when user is already a member', async () => {
    const repos = {
      userEventRepository: {
        create: async () => {
          throw new Error('Should not be called')
        },
        findByEventAndUserId: async () => ({
          ...createdUserEvent
        }),
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { createMember } = createCaller(testContext)

    await expect(createMember(newUserEventInput)).rejects.toThrow(
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User is already a member of this event',
      })
    )
  })

  it('should propagate unknown errors from create', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        create: async () => {
          throw unknownError
        },
        findByEventAndUserId: async () => null,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { createMember } = createCaller(testContext)

    await expect(createMember(newUserEventInput)).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from findByEventAndUserId check', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        create: async () => {
          throw new Error('Should not be called')
        },
        findByEventAndUserId: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { createMember } = createCaller(testContext)

    await expect(createMember(newUserEventInput)).rejects.toThrow(unknownError)
  })
})