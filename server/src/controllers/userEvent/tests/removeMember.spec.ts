import { fakeUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import userEventRouter from '..'

describe('removeMember', () => {
  const TEST_USER = fakeUser({
    id: 1,
    auth0Id: 'auth0|123',
  })

  const userEventId = 1
  const eventId = 100

  const existingUserEvent = {
    id: userEventId,
    eventId,
    userId: TEST_USER.auth0Id,
    role: 'member',
    wishlistId: 1,
    santaForUserId: 'auth0|125625',
    eventTitle: 'Test Event',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should remove user event when user exists', async () => {
    const repos = {
      userEventRepository: {
        remove: async (id) => {
          expect(id).toBe(userEventId)
          return existingUserEvent
        },
        isEventAdmin: async () => true,
        findByEventAndUserId: async (eventId, auth0Id) => {
          expect(eventId).toBe(userEventId)
          expect(auth0Id).toBe(TEST_USER.auth0Id)
          return existingUserEvent
        },
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
        isEventAdmin: async () => true,
        findByEventAndUserId: async (eventId, auth0Id) => {
          expect(eventId).toBe(userEventId)
          expect(auth0Id).toBe(TEST_USER.auth0Id)
          return null
        },
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

  it('should propagate unknown errors from findByEventAndUserId', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        remove: async () => {
          throw new Error('Should not be called')
        },
        isEventAdmin: async () => true,
        findByEventAndUserId: async () => {
          throw unknownError
        },
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
