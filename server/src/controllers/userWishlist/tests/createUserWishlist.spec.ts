import { fakeUser } from '@server/entities/tests/fakes'
import type { UserWishlistRepository } from '@server/repositories/userWishlistRepository'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import wishlistRouter from '..'

describe('createPlaceholderWishlist', () => {
  const TEST_USER = fakeUser({
    id: 1,
    auth0Id: 'auth0|123',
  })

  const mockWishlistInput = {
    title: 'Test Wishlist',
    userId: TEST_USER.auth0Id,
    description: 'Test Description',
  }

  const CREATED_WISHLIST_ID = 1

  it('should create wishlist and return id when successful', async () => {
    const repos = {
      userWishlistRepository: {
        createPlaceholderWishlist: async (input) => {
          expect(input).toEqual(mockWishlistInput)
          return CREATED_WISHLIST_ID
        },
      } satisfies Partial<UserWishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { createUserWishlist } = createCaller(testContext)

    const result = await createUserWishlist(mockWishlistInput)
    expect(result).toEqual(CREATED_WISHLIST_ID)
  })

  it('should throw CONFLICT when creation fails', async () => {
    const repos = {
      userWishlistRepository: {
        createPlaceholderWishlist: async () => 0,
      } satisfies Partial<UserWishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { createUserWishlist } = createCaller(testContext)

    await expect(createUserWishlist(mockWishlistInput)).rejects.toThrow(
      new TRPCError({
        code: 'CONFLICT',
        message: 'Error creating wishlist',
      })
    )
  })

  it('should propagate unknown errors from createPlaceholderWishlist', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userWishlistRepository: {
        createPlaceholderWishlist: async () => {
          throw unknownError
        },
      } satisfies Partial<UserWishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { createUserWishlist } = createCaller(testContext)

    await expect(createUserWishlist(mockWishlistInput)).rejects.toThrow(
      unknownError
    )
  })
})
