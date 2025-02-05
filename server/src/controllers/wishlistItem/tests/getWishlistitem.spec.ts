import type { WishlistRepository } from '@server/repositories/wishlistRepository'
import { fakeUser, fakeWishlist } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import wishlistRouter from '..'

describe('getWishlistItem', () => {
  const TEST_USER = fakeUser({
    id: 1,
  })

  const existingWishlistItems = [
    {
      ...fakeWishlist({
        id: 1,
        userId: TEST_USER.auth0Id,
        userWishlistId: 333,
        itemName: 'Bike',
        description: 'Blue mountain bike',
        price: 120,
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      ...fakeWishlist({
        id: 2,
        userId: TEST_USER.auth0Id,
        userWishlistId: 333,
        itemName: 'Book',
        description: 'Fantasy novel',
        price: 20,
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  it('should return wishlist items when they exist', async () => {
    const repos = {
      wishlistRepository: {
        findAllByUserIdAndUserWishlistId: async (userId, userWishlistId) => {
          expect(userId).toBe(TEST_USER.auth0Id)
          expect(userWishlistId).toBe(existingWishlistItems[0].userWishlistId)
          return existingWishlistItems
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlistItem } = createCaller(testContext)

    const result = await getWishlistItem({
      userId: TEST_USER.auth0Id,
      userWishlistId: existingWishlistItems[0].userWishlistId,
    })

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      id: expect.any(Number),
      userId: TEST_USER.auth0Id,
      userWishlistId: existingWishlistItems[0].userWishlistId,
      itemName: 'Bike',
      description: 'Blue mountain bike',
      price: 120,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
    expect(result[1]).toMatchObject({
      id: expect.any(Number),
      userId: TEST_USER.auth0Id,
      userWishlistId: existingWishlistItems[0].userWishlistId,
      itemName: 'Book',
      description: 'Fantasy novel',
      price: 20,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should return empty array when no wishlist items exist', async () => {
    const repos = {
      wishlistRepository: {
        findAllByUserIdAndUserWishlistId: async () => [],
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlistItem } = createCaller(testContext)

    const result = await getWishlistItem({
      userId: TEST_USER.auth0Id,
      userWishlistId: 444,
    })

    expect(result).toEqual([])
  })

  it('should propagate unknown errors from wishlist lookup', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      wishlistRepository: {
        findAllByUserIdAndUserWishlistId: async () => {
          throw unknownError
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlistItem } = createCaller(testContext)

    await expect(
      getWishlistItem({
        userId: TEST_USER.auth0Id,
        userWishlistId: existingWishlistItems[0].userWishlistId,
      })
    ).rejects.toThrow(unknownError)
  })
})
