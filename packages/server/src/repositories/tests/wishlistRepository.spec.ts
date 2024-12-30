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

describe('find by event and user id', () => {
  it('should return a wishlist for a specific event and user', async () => {
    const foundWishlist = await repository.findByEventAndUserId(eventOne.id, userOne.id)
    expect(foundWishlist).not.toBeNull()
    if (!foundWishlist) throw new Error('No wishlist found')
    
    expect(pick(foundWishlist, wishlistKeysForTesting)).toEqual(
      pick(wishlistOne, wishlistKeysForTesting)
    )
  })
})