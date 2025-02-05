import { fakeUser } from '@server/entities/tests/fakes'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import userEventRouter from '..'

describe('updateWishlistId', () => {
  const TEST_USER = fakeUser({
    id: 1,
    auth0Id: 'auth0|123',
  })

  const eventId = 100
  const newWishlistId = 200
  const userEventId = 1

  const existingUserEvent = {
    id: userEventId,
    eventId,
    userId: TEST_USER.auth0Id,
    role: 'member',
    wishlistId: 1,
    santaForUserId: 'auth0|456',
    eventTitle: 'Test Event',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should update wishlist ID when user event exists', async () => {
    const repos = {
      userEventRepository: {
        findByEventAndUserId: async (eventId, userId) => {
          expect(eventId).toBe(eventId)
          expect(userId).toBe(TEST_USER.auth0Id)
          return existingUserEvent
        },
        updateWishlistId: async (id, wishlistId) => {
          expect(id).toBe(userEventId)
          expect(wishlistId).toBe(newWishlistId)
          return wishlistId
        },
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { updateWishlistId } = createCaller(testContext)

    const result = await updateWishlistId({
      eventId,
      wishlistId: newWishlistId,
    })
    expect(result).toBe(newWishlistId)
  })

  it('should throw NOT_FOUND when user event does not exist', async () => {
    const repos = {
      userEventRepository: {
        findByEventAndUserId: async () => null,
        updateWishlistId: async () => {
          throw new Error('Should not be called')
        },
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { updateWishlistId } = createCaller(testContext)

    await expect(
      updateWishlistId({ eventId, wishlistId: newWishlistId })
    ).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'User event membership not found',
      })
    )
  })

  it('should handle null return from updateWishlistId', async () => {
    const repos = {
      userEventRepository: {
        findByEventAndUserId: async () => existingUserEvent,
        updateWishlistId: async () => null,
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { updateWishlistId } = createCaller(testContext)

    const result = await updateWishlistId({
      eventId,
      wishlistId: newWishlistId,
    })
    expect(result).toBeNull()
  })

  it('should propagate unknown errors from findByEventAndUserId', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        findByEventAndUserId: async () => {
          throw unknownError
        },
        updateWishlistId: async () => {
          throw new Error('Should not be called')
        },
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { updateWishlistId } = createCaller(testContext)

    await expect(
      updateWishlistId({ eventId, wishlistId: newWishlistId })
    ).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from updateWishlistId', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        findByEventAndUserId: async () => existingUserEvent,
        updateWishlistId: async () => {
          throw unknownError
        },
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(userEventRouter)
    const { updateWishlistId } = createCaller(testContext)

    await expect(
      updateWishlistId({ eventId, wishlistId: newWishlistId })
    ).rejects.toThrow(unknownError)
  })
})