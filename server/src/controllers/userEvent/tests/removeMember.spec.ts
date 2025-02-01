import { fakeUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import userEventRouter from '..'

describe('removeMember', () => {
  const TEST_USER = fakeUser({
    id: 1,
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

  it('should remove user event when user is an admin', async () => {
    const repos = {
      userEventRepository: {
        remove: async (id) => {
          expect(id).toBe(userEventId)
          return existingUserEvent
        },
        findByEventAndUserId: async () => existingUserEvent,
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    const result = await removeMember({ id: userEventId, eventId })
    expect(result).toEqual(existingUserEvent)
  })

  it('should throw NOT_FOUND when user event does not exist', async () => {
    const repos = {
      userEventRepository: {
        remove: async () => {
          throw new Error('Should not be called')
        },
        findByEventAndUserId: async () => null,
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ id: userEventId, eventId })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'User event membership not found',
      })
    )
  })

  it('should throw FORBIDDEN when user is not an admin', async () => {
    const repos = {
      userEventRepository: {
        remove: async () => {
          throw new Error('Should not be called')
        },
        findByEventAndUserId: async () => existingUserEvent,
        isEventAdmin: async () => false,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ id: userEventId, eventId })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized. Admin access required.',
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
        isEventAdmin: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { removeMember } = createCaller(testContext)

    await expect(removeMember({ id: userEventId, eventId })).rejects.toThrow(
      unknownError
    )
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

    await expect(removeMember({ id: userEventId, eventId })).rejects.toThrow(
      unknownError
    )
  })
})
