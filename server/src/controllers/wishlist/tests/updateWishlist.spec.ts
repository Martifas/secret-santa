import type { WishlistRepository } from '@server/repositories/wishlistRepository'
import { fakeAuthUser, fakeWishlist } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import wishlistRouter from '..'
import type { WishlistRowUpdate } from '@server/types/wishlist'

describe('update', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })
  const id = 1
  const eventId = 100
  const baseWishlist = {
    ...fakeWishlist({
      id,
      userId: TEST_USER.id,
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

  it('should update a wishlist with partial data when user is creator', async () => {
    const updates = { price: 140, description: 'Red City bike' }
    const updatedWishlist = {
      ...baseWishlist,
      ...updates,
      updatedAt: new Date(),
    }

    const repos = {
      wishlistRepository: {
        findById: async () => baseWishlist,
        update: async (
          wishlistId: number,
          wishlistUpdates: WishlistRowUpdate
        ) => {
          expect(wishlistId).toBe(id)
          expect(wishlistUpdates).toEqual(updates)
          return updatedWishlist
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { updateWishlist } = createCaller(testContext)

    const result = await updateWishlist({ id, ...updates })

    expect(result).toMatchObject({
      id,
      itemName: 'Bike',
      description: 'Red City bike',
      url: 'www.bike.com',
      price: 140,
      priority: 1,
      isPurchased: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw NOT_FOUND when wishlist does not exist', async () => {
    const updates = { price: 140 }
    const repos = {
      wishlistRepository: {
        findById: async () => null,
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { updateWishlist } = createCaller(testContext)

    await expect(updateWishlist({ id, ...updates })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Wishlist item not found',
      })
    )
  })

  it('should throw FORBIDDEN when user is not the creator', async () => {
    const updates = { price: 140 }
    const wishlistByAnotherUser = {
      ...baseWishlist,
      userId: TEST_USER.id + 1,
    }

    const repos = {
      wishlistRepository: {
        findById: async () => wishlistByAnotherUser,
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { updateWishlist } = createCaller(testContext)

    await expect(updateWishlist({ id, ...updates })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized to update this wishlist item',
      })
    )
  })

  it('should propagate unknown errors', async () => {
    const updates = { price: 140 }
    const unknownError = new Error('Database connection failed')

    const repos = {
      wishlistRepository: {
        findById: async () => baseWishlist,
        update: async () => {
          throw unknownError
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { updateWishlist } = createCaller(testContext)

    await expect(updateWishlist({ id, ...updates })).rejects.toThrow(
      unknownError
    )
  })
})
