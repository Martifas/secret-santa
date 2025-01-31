import type { WishlistRepository } from '@server/repositories/wishlistRepository'
import type { UserEventRepository } from '@server/repositories/userEventRepository'
import { fakeUser, fakeWishlist } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import wishlistRouter from '..'

describe('findByUserIdAndItem', () => {
  const TEST_USER = fakeUser({
    id: 1,
  })

  const existingWishlist = {
    ...fakeWishlist({
      id: 1,
      userId: TEST_USER.auth0Id,

      itemName: 'Bike',
      description: 'Blue mountain bike',
      url: 'https://www.bike.com',
      price: 120,
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
        findById: async (id) => {
          expect(id).toBe(existingWishlist.id)

          return existingWishlist
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlist } = createCaller(testContext)

    const result = await getWishlist({
      id: existingWishlist.id,
    })

    expect(result).toMatchObject({
      id: expect.any(Number),
      userId: TEST_USER.auth0Id,
      itemName: 'Bike',
      description: 'Blue mountain bike',
      url: 'https://www.bike.com',
      price: 120,
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
        findById: async () => null,
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlist } = createCaller(testContext)

    const result = await getWishlist({
      id: existingWishlist.id,
    })

    expect(result).toBeNull()
  })

  it('should throw FORBIDDEN when user is not event member', async () => {
    const repos = {
      userEventRepository: {
        isMember: async () => false,
      } satisfies Partial<UserEventRepository>,
      wishlistRepository: {
        findById: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlist } = createCaller(testContext)

    await expect(getWishlist({ id: existingWishlist.id })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not authorized. Event member access required.',
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
        findById: async () => {
          throw new Error('Should not be called')
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlist } = createCaller(testContext)

    await expect(getWishlist({ id: existingWishlist.id })).rejects.toThrow(
      unknownError
    )
  })

  it('should propagate unknown errors from wishlist lookup', async () => {
    const unknownError = new Error('Database connection failed')
    const repos = {
      userEventRepository: {
        isMember: async () => true,
      } satisfies Partial<UserEventRepository>,
      wishlistRepository: {
        findById: async () => {
          throw unknownError
        },
      } satisfies Partial<WishlistRepository>,
    }

    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { getWishlist } = createCaller(testContext)

    await expect(getWishlist({ id: existingWishlist.id })).rejects.toThrow(
      unknownError
    )
  })
})
