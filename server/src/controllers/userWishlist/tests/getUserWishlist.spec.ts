import { fakeUser } from '@server/entities/tests/fakes'
import type { UserWishlistRepository } from '@server/repositories/userWishlistRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import wishlistRouter from '..'

describe('getUserWishlist', () => {
  const TEST_USER = fakeUser({
    id: 1,
    auth0Id: 'auth0|123',
  })

  const WISHLIST_ID = 1
  const mockWishlist = {
    id: WISHLIST_ID,
    title: 'Test Wishlist',
    userId: TEST_USER.auth0Id,
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should return wishlist when found', async () => {
    const repos = {
      userWishlistRepository: {
        find: async (id) => {
          expect(id).toBe(WISHLIST_ID)
          return mockWishlist
        }
      } satisfies Partial<UserWishlistRepository>
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getUserWishlist } = createCaller(testContext)

    const result = await getUserWishlist({ id: WISHLIST_ID })
    expect(result).toEqual(mockWishlist)
  })

  it('should throw NOT_FOUND when wishlist does not exist', async () => {
    const repos = {
      userWishlistRepository: {
        find: async () => null
      } satisfies Partial<UserWishlistRepository>
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getUserWishlist } = createCaller(testContext)

    await expect(getUserWishlist({ id: WISHLIST_ID })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'No wishlists found for this user'
      })
    )
  })

  it('should propagate unknown errors from find', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userWishlistRepository: {
        find: async () => {
          throw unknownError
        }
      } satisfies Partial<UserWishlistRepository>
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getUserWishlist } = createCaller(testContext)

    await expect(getUserWishlist({ id: WISHLIST_ID })).rejects.toThrow(
      unknownError
    )
  })
})