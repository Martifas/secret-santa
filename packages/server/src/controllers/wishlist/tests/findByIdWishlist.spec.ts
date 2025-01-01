import type { WishlistRepository } from '@server/repositories/wishlistRepository'
import type { EventRepository } from '@server/repositories/eventRepository'
import { fakeWishlist, fakeAuthUser } from '@server/entities/tests/fakes'
import { createCallerFactory } from '@server/trpc'
import { authRepoContext } from '@tests/utils/context'
import { TRPCError } from '@trpc/server'
import wishlistRouter from '..'

describe('findById', () => {
  const TEST_USER = fakeAuthUser({
    id: 1,
    auth0Id: 'auth0|test123',
  })
  const EVENT_ID = 123
  const WISHLIST_ID = 1
  const baseWishlist = {
    ...fakeWishlist({
      id: WISHLIST_ID,
      eventId: EVENT_ID,
      memberId: TEST_USER.id,
      name: 'Test Wishlist',
      items: [],
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should return a wishlist when user is a member of the event', async () => {
    const repos = {
      wishlistRepository: {
        findById: async () => baseWishlist,
      } satisfies Partial<WishlistRepository>,
      eventRepository: {
        isMember: async () => true,
      } satisfies Partial<EventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { findById } = createCaller(testContext)
    
    const result = await findById({ 
      id: WISHLIST_ID, 
      eventId: EVENT_ID 
    })
    
    expect(result).toMatchObject({
      id: WISHLIST_ID,
      eventId: EVENT_ID,
      memberId: TEST_USER.id,
      name: 'Test Wishlist',
      items: [],
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw NOT_FOUND when wishlist does not exist', async () => {
    const repos = {
      wishlistRepository: {
        findById: async () => null,
      } satisfies Partial<WishlistRepository>,
      eventRepository: {
        isMember: async () => true,
      } satisfies Partial<EventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { findById } = createCaller(testContext)
    
    await expect(findById({ 
      id: WISHLIST_ID, 
      eventId: EVENT_ID 
    })).rejects.toThrow(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'Wishlist item not found',
      })
    )
  })

  it('should throw FORBIDDEN when user is not a member of the event', async () => {
    const repos = {
      wishlistRepository: {
        findById: async () => baseWishlist,
      } satisfies Partial<WishlistRepository>,
      eventRepository: {
        isMember: async () => false,
      } satisfies Partial<EventRepository>,
    }
    const testContext = authRepoContext(repos, TEST_USER)
    const createCaller = createCallerFactory(wishlistRouter)
    const { findById } = createCaller(testContext)
    
    await expect(findById({ 
      id: WISHLIST_ID, 
      eventId: EVENT_ID 
    })).rejects.toThrow(
      new TRPCError({
        code: 'FORBIDDEN',
        message: 'Not a member of this event',
      })
    )
  })
})