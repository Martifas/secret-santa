import type { WishlistRepository } from '@server/repositories/wishlistRepository'
import { fakeAuthUser, fakeWishlist } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@server/utils/tests/context'
import { TRPCError } from '@trpc/server'
import wishlistRouter from '..'

describe('create', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })
  const eventId = 100

  const newWishlistInput = {
    userId: TEST_USER.id,
    eventId,
    itemName: 'Bike',
    description: 'Blue mountain bike',
    url: 'https://www.bike.com',
    price: 120,
    priority: 1,
    isPurchased: false,
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
        findByEventAndUserId: async () => null,
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
    expect(result).toMatchObject({
      id: expect.any(Number),
      userId: TEST_USER.id,
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

  it('should throw CONFLICT when wishlist item already exists for user and event', async () => {
    const existingWishlist = {
      ...createdWishlist,
      itemName: 'Existing Bike',
    }

    const repos = {
      wishlistRepository: {
        findByEventAndUserId: async () => existingWishlist,
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
        message: 'A wishlist item with this name already exists for this event and user',
      })
    )
  })

  it('should propagate unknown errors from create', async () => {
    const unknownError = new Error('Database connection failed')

    const repos = {
      wishlistRepository: {
        findByEventAndUserId: async () => null,
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
        findByEventAndUserId: async () => {
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