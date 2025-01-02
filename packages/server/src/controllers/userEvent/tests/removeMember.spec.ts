import { fakeAuthUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import { TRPCError } from '@trpc/server'
import userEventRouter from '..'

describe('remove', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })

  const userEventId = 1
  const eventId = 100

  const existingUserEvent = {
    id: userEventId,
    eventId,
    userId: TEST_USER.id,
    role: 'member',
    wishlistId: 1,
    santaForUserId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should remove user event when user is removing their own membership', async () => {
    const repos = {
      userEventRepository: {
        remove: async (id) => {
          expect(id).toBe(userEventId)
          return existingUserEvent
        },
        findByEventAndUserId: async () => existingUserEvent,
        isEventAdmin: async () => false,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    const result = await removeMember({ id: userEventId })
    expect(result).toEqual(existingUserEvent)
  })

  it('should remove user event when user is event admin', async () => {
    const otherUserEvent = {
      ...existingUserEvent,
      userId: TEST_USER.id + 1, // Different user's membership
    }

    const repos = {
      userEventRepository: {
        remove: async (id) => {
          expect(id).toBe(userEventId)
          return otherUserEvent
        },
        findByEventAndUserId: async () => otherUserEvent,
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    const result = await removeMember({ id: userEventId })
    expect(result).toEqual(otherUserEvent)
  })

  it('should throw NOT_FOUND when user event does not exist', async () => {
    const repos = {
      userEventRepository: {
        remove: async () => {
          throw new Error('Should not be called')
        },
        findByEventAndUserId: async () => null,
        isEventAdmin: async () => false,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ id: userEventId })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'User event membership not found',
      })
    )
  })

  it('should throw FORBIDDEN when user is not admin and not removing their own membership', async () => {
    const otherUserEvent = {
      ...existingUserEvent,
      userId: TEST_USER.id + 1,
    }

    const repos = {
      userEventRepository: {
        remove: async () => {
          throw new Error('Should not be called')
        },
        findByEventAndUserId: async () => otherUserEvent,
        isEventAdmin: async () => false,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ id: userEventId })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized to remove this membership',
      })
    )
  })

  it('should propagate unknown errors from findByEventAndUserId', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        remove: async () => {
          throw new Error('Should not be called')
        },
        findByEventAndUserId: async () => {
          throw unknownError
        },
        isEventAdmin: async () => false,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ id: userEventId })).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from isEventAdmin', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        remove: async () => {
          throw new Error('Should not be called')
        },
        findByEventAndUserId: async () => existingUserEvent,
        isEventAdmin: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ id: userEventId })).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from remove', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        remove: async () => {
          throw unknownError
        },
        findByEventAndUserId: async () => existingUserEvent,
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ id: userEventId })).rejects.toThrow(unknownError)
  })
})