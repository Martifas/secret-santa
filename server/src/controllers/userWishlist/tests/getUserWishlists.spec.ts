import { fakeUser } from '@server/entities/tests/fakes'
import type { UserWishlistRepository } from '@server/repositories/userWishlistRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import wishlistRouter from '..'

describe('getUserWishlists', () => {
  const TEST_USER = fakeUser({
    id: 1,
    auth0Id: 'auth0|123',
  })

  const mockWishlists = [
    {
      id: 1,
      title: 'First Wishlist',
      userId: TEST_USER.auth0Id,
      description: 'Test Description 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'Second Wishlist',
      userId: TEST_USER.auth0Id,
      description: 'Test Description 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  it('should return all wishlists for user when found', async () => {
    const repos = {
      userWishlistRepository: {
        findAllForUser: async (userId) => {
          expect(userId).toBe(TEST_USER.auth0Id)
          return mockWishlists
        },
      } satisfies Partial<UserWishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getUserWishlists } = createCaller(testContext)

    const result = await getUserWishlists()
    expect(result).toEqual(mockWishlists)
  })

  it('should throw NOT_FOUND when user has no wishlists', async () => {
    const repos = {
      userWishlistRepository: {
        findAllForUser: async () => [],
      } satisfies Partial<UserWishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getUserWishlists } = createCaller(testContext)

    await expect(getUserWishlists()).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'No wishlists found for this user',
      })
    )
  })

  it('should propagate unknown errors from findAllForUser', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userWishlistRepository: {
        findAllForUser: async () => {
          throw unknownError
        },
      } satisfies Partial<UserWishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getUserWishlists } = createCaller(testContext)

    await expect(getUserWishlists()).rejects.toThrow(unknownError)
  })
})
