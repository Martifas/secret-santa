import { fakeUser, fakeWishlist } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@server/utils/tests/database'
import { insertAll, selectAll } from '@server/utils/tests/record'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { pick } from 'lodash-es'
import { wishlistKeysForTesting } from '@server/entities/wishlistItem'
import { wishlistRepository } from '../wishlistRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = wishlistRepository(db)

const [userOne] = await insertAll(db, 'user', fakeUser())
const [userWishlist] = await insertAll(db, 'userWishlist', [
  {
    userId: userOne.auth0Id,
    description: 'The things I want',
    title: 'My wishlist',
  },
])

const [wishlistOne] = await insertAll(db, 'wishlist', [
  fakeWishlist({
    userId: userOne.auth0Id,
    userWishlistId: userWishlist.id,
    itemName: 'Test Item',
  }),
])

const fakeWishlistDefault = (
  wishlist: Parameters<typeof fakeWishlist>[0] = {}
) =>
  fakeWishlist({
    userId: userOne.auth0Id,
    userWishlistId: userWishlist.id,
    ...wishlist,
  })

describe('find by user id and user wishlist id', () => {
  it('should return a wishlist record for a specific user and wishlist id', async () => {
    const foundWishlist = await repository.findByUserIdAndUserWishlistId(
      userOne.auth0Id,
      userWishlist.id
    )

    expect(foundWishlist).not.toBeNull()
    if (!foundWishlist) throw new Error('No wishlist found')
    expect(pick(foundWishlist, wishlistKeysForTesting)).toEqual(
      pick(wishlistOne, wishlistKeysForTesting)
    )
  })

  it('should return null when no matching wishlist exists', async () => {
    const result = await repository.findByUserIdAndUserWishlistId(
      'non-existent-user',
      99999
    )
    expect(result).toBeNull()
  })
})

describe('find by item name and user wishlist id', () => {
  it('should return a wishlist record for a specific item name and wishlist id', async () => {
    const foundWishlist = await repository.findByItemAndUserWishlistId(
      wishlistOne.itemName,
      userWishlist.id
    )

    expect(foundWishlist).not.toBeNull()
    if (!foundWishlist) throw new Error('No wishlist found')
    expect(pick(foundWishlist, wishlistKeysForTesting)).toEqual(
      pick(wishlistOne, wishlistKeysForTesting)
    )
  })

  it('should return null when no matching item exists in the wishlist', async () => {
    const result = await repository.findByItemAndUserWishlistId(
      'non-existent-item',
      userWishlist.id
    )
    expect(result).toBeNull()
  })
})

describe('create', () => {
  it('should create a new wishlist', async () => {
    const wishlist = fakeWishlistDefault({
      itemName: 'New Item',
    })
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
    }

    const updatedWishlist = await repository.update(wishlistOne.id, updates)

    expect(pick(updatedWishlist, wishlistKeysForTesting)).toEqual(
      pick({ ...wishlistOne, ...updates }, wishlistKeysForTesting)
    )
    expect(updatedWishlist.id).toBe(wishlistOne.id)
    expect(updatedWishlist.userId).toBe(wishlistOne.userId)
    expect(updatedWishlist.updatedAt).toBeInstanceOf(Date)
  })

  it('should throw error when updating non-existent wishlist', async () => {
    const updates = {
      itemName: 'Mountain Bike',
    }
    await expect(repository.update(99999, updates)).rejects.toThrowError(
      /no result/i
    )
  })
})

describe('remove', () => {
  it('should remove wishlist', async () => {
    const removedWishlist = await repository.remove(wishlistOne.id)

    expect(pick(removedWishlist, wishlistKeysForTesting)).toEqual(
      pick(wishlistOne, wishlistKeysForTesting)
    )

    const result = await selectAll(db, 'wishlist')
    expect(result).toHaveLength(0)
  })

  it('should throw error when removing non-existent wishlist', async () => {
    await expect(repository.remove(99999)).rejects.toThrowError(/no result/i)
  })
})
