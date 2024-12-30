import { fakeEvent, fakeUser, fakeWishlist } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/record'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { pick } from 'lodash-es'
import { wishlistKeysForTesting } from '@server/entities/wishlist'
import { wishlistRepository } from '../wishlistRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = wishlistRepository(db)
const [userOne] = await insertAll(db, 'user', fakeUser())
const [eventOne] = await insertAll(db, 'event', [
  fakeEvent({ createdBy: userOne.id }),
])
const [wishlistOne] = await insertAll(db, 'wishlist', [
  fakeWishlist({ userId: userOne.id, eventId: eventOne.id }),
])

const fakeWishlistDefault = (wishlist: Parameters<typeof fakeWishlist>[0] = {}) =>
  fakeWishlist({ userId: userOne.id, eventId: eventOne.id, ...wishlist })

describe('find by event and user id', () => {
  it('should return a wishlist for a specific event and user', async () => {
    const foundWishlist = await repository.findByEventAndUserId(
      eventOne.id,
      userOne.id
    )
    expect(foundWishlist).not.toBeNull()
    if (!foundWishlist) throw new Error('No wishlist found')

    expect(pick(foundWishlist, wishlistKeysForTesting)).toEqual(
      pick(wishlistOne, wishlistKeysForTesting)
    )
  })
})

describe('create', () => {
  it('should create a new wishlist', async () => {

    const wishlist = fakeWishlistDefault()

    const createdWishlist = await repository.create(wishlist)

    expect(createdWishlist).toMatchObject({
      ...pick(wishlist, wishlistKeysForTesting),
      id: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })
})

describe('update', () => {
  it('should update wishlist attributes', async () => {
    const updates = {
      itemName: 'Santa Sculpture',
      description: 'Solid Santa',
      price: 50,
      isPurchased: false,
      priority: 1,
    }
    const updatedWishlist = await repository.update(wishlistOne.id, updates)
    expect(pick(updatedWishlist, wishlistKeysForTesting)).toEqual(
      pick(updates, wishlistKeysForTesting)
    )
    expect(updatedWishlist.id).toBe(eventOne.id)
    expect(updatedWishlist.userId).toBe(wishlistOne.userId)
    expect(updatedWishlist.updatedAt).toBeInstanceOf(Date)
  })

  it('should throw error when updating non-existent wishlist', async () => {
    const updates = {
      name: 'Mountain Bike',
    }
    await expect(repository.update(99999, updates)).rejects.toThrowError(
      /no result/i
    )
  })
})
