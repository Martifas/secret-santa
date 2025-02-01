import type { WishlistRepository } from '@server/repositories/wishlistRepository'
import { fakeUser, fakeWishlist } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import wishlistRouter from '..'

describe('remove', () => {
  const TEST_USER = fakeUser({
    id: 1,
  })

  const id = 1
  const eventId = 100
  const baseWishlist = {
    ...fakeWishlist({
      id,
      userId: TEST_USER.auth0Id,
      eventId,
      itemName: 'Bike',
      description: 'Blue mountain bike',
      url: 'www.bike.com',
      price: 120,
      priority: 1,
      isPurchased: false,
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should remove a wishlist item when user is creator', async () => {
    const repos = {
      wishlistRepository: {
        findById: async () => baseWishlist,
        remove: async (wishlistId: number) => {
          expect(wishlistId).toBe(id)
          return baseWishlist
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { deleteWishlistItem } = createCaller(testContext)

    const result = await deleteWishlistItem({ id })

    expect(result).toMatchObject({
      id,
      userId: TEST_USER.auth0Id,
      eventId,
      itemName: 'Bike',
      description: 'Blue mountain bike',
      url: 'www.bike.com',
      price: 120,
      priority: 1,
      isPurchased: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw NOT_FOUND when wishlist does not exist', async () => {
    const repos = {
      wishlistRepository: {
        findById: async () => null,
        remove: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { deleteWishlistItem } = createCaller(testContext)

    await expect(deleteWishlistItem({ id })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Wishlist item not found',
      })
    )
  })

  it('should throw FORBIDDEN when user is not the creator', async () => {
    const wishlistByAnotherUser = {
      ...baseWishlist,
      userId: 'auth0|9999',
    }

    const repos = {
      wishlistRepository: {
        findById: async () => wishlistByAnotherUser,
        remove: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { deleteWishlistItem } = createCaller(testContext)

    await expect(deleteWishlistItem({ id })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized to remove this wishlist item',
      })
    )
  })

  it('should propagate unknown errors', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      wishlistRepository: {
        findById: async () => baseWishlist,
        remove: async () => {
          throw unknownError
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { deleteWishlistItem } = createCaller(testContext)

    await expect(deleteWishlistItem({ id })).rejects.toThrow(unknownError)
  })
})
