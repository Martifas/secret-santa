import type { WishlistRepository } from '@server/repositories/wishlistRepository'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { fakeAuthUser, fakeWishlist } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import { TRPCError } from '@trpc/server'
import wishlistRouter from '..'

describe('findByEventAndUserId', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })
  const eventId = 100
  const targetUserId = 2

  const existingWishlist = {
    ...fakeWishlist({
      id: 1,
      userId: targetUserId,
      eventId,
      itemName: 'Bike',
      description: 'Blue mountain bike',
      url: 'https://www.bike.com',
      price: 120,
      priority: 1,
      isPurchased: false,
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should return wishlist when user is event member', async () => {
    const repos = {
      userEventRepository: {
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      wishlistRepository: {
        findByEventAndUserId: async (event, userId) => {
          expect(event).toBe(eventId)
          expect(userId).toBe(targetUserId)
          return existingWishlist
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlist } = createCaller(testContext)

    const result = await getWishlist({ 
      eventId, 
      userId: targetUserId 
    })

    expect(result).toMatchObject({
      id: expect.any(Number),
      userId: targetUserId,
      eventId,
      itemName: 'Bike',
      description: 'Blue mountain bike',
      url: 'https://www.bike.com',
      price: 120,
      priority: 1,
      isPurchased: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should return null when wishlist does not exist', async () => {
    const repos = {
      userEventRepository: {
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      wishlistRepository: {
        findByEventAndUserId: async () => null,
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlist } = createCaller(testContext)

    const result = await getWishlist({ 
      eventId, 
      userId: targetUserId, 
    })

    expect(result).toBeNull()
  })

  it('should throw FORBIDDEN when user is not event member', async () => {
    const repos = {
      userEventRepository: {
        isMember: async () => false,
      } satisfies Partial<UserEventRepository>,
      wishlistRepository: {
        findByEventAndUserId: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlist } = createCaller(testContext)

    await expect(
      getWishlist({ eventId, userId: targetUserId })
    ).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not a member of this event',
      })
    )
  })

  it('should propagate unknown errors from event membership check', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        isMember: async () => {
          throw unknownError
        },
      } satisfies Partial<UserEventRepository>,
      wishlistRepository: {
        findByEventAndUserId: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlist } = createCaller(testContext)

    await expect(
      getWishlist({ eventId, userId: targetUserId })
    ).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from wishlist lookup', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      wishlistRepository: {
        findByEventAndUserId: async () => {
          throw unknownError
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlist } = createCaller(testContext)

    await expect(
      getWishlist({ eventId, userId: targetUserId })
    ).rejects.toThrow(unknownError)
  })
})