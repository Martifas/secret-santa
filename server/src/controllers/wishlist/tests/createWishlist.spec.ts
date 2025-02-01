import type { WishlistRepository } from '@server/repositories/wishlistRepository'
import { fakeUser, fakeWishlist } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import wishlistRouter from '..'

describe('create', () => {
  const TEST_USER = fakeUser({
    id: 1,
  })

  const newWishlistInput = {
    userId: TEST_USER.auth0Id,
    itemName: 'Bike',
    description: 'Blue mountain bike',
    price: 120,
    userWishlistId: 1,
  }

  const createdWishlist = {
    ...fakeWishlist({
      id: 1,
      ...newWishlistInput,
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should create a new wishlist item when one does not exist', async () => {
    const repos = {
      wishlistRepository: {
        findByUserIdAndItem: async () => null,
        create: async (input) => {
          expect(input).toEqual(newWishlistInput)
          return createdWishlist
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { createWishlist } = createCaller(testContext)

    const result = await createWishlist(newWishlistInput)
    expect(result).toEqual(createdWishlist.id)
  })

  it('should throw CONFLICT when wishlist item already exists for user and event', async () => {
    const existingWishlist = {
      ...createdWishlist,
      itemName: 'Existing Bike',
    }

    const repos = {
      wishlistRepository: {
        findByUserIdAndItem: async () => existingWishlist,
        create: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { createWishlist } = createCaller(testContext)

    await expect(createWishlist(newWishlistInput)).rejects.toThrow(
      new TRPCError({
        code: 'CONFLICT',
        message: 'A wishlist item with this name already exists for this user',
      })
    )
  })

  it('should propagate unknown errors from create', async () => {
    const unknownError = new Error('Database connection failed')

    const repos = {
      wishlistRepository: {
        findByUserIdAndItem: async () => null,
        create: async () => {
          throw unknownError
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { createWishlist } = createCaller(testContext)

    await expect(createWishlist(newWishlistInput)).rejects.toThrow(unknownError)
  })

  it('should propagate unknown errors from findByEventAndUserId', async () => {
    const unknownError = new Error('Database connection failed')

    const repos = {
      wishlistRepository: {
        findByUserIdAndItem: async () => {
          throw unknownError
        },
        create: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { createWishlist } = createCaller(testContext)

    await expect(createWishlist(newWishlistInput)).rejects.toThrow(unknownError)
  })
})
