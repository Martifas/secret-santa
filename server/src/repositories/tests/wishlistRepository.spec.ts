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

describe('findAllByUserIdAndUserWishlistId', () => {
  it('should return all wishlist items for a user and wishlist', async () => {
    await insertAll(db, 'wishlist', [
      fakeWishlistDefault({ itemName: 'Second Item' }),
      fakeWishlistDefault({ itemName: 'Third Item' }),
    ])

    const wishlists = await repository.findAllByUserIdAndUserWishlistId(
      userOne.auth0Id,
      userWishlist.id
    )

    expect(wishlists).toHaveLength(3)
    wishlists.forEach((wishlist) => {
      expect(wishlist.userId).toBe(userOne.auth0Id)
      expect(wishlist.userWishlistId).toBe(userWishlist.id)
      expect(wishlist).toHaveProperty('itemName')
      expect(wishlist.createdAt).toBeInstanceOf(Date)
      expect(wishlist.updatedAt).toBeInstanceOf(Date)
    })
  })

  it('should return empty array for non-existent user', async () => {
    const wishlists = await repository.findAllByUserIdAndUserWishlistId(
      'non-existent-user',
      userWishlist.id
    )
    expect(wishlists).toEqual([])
  })

  it('should return empty array for non-existent wishlist id', async () => {
    const wishlists = await repository.findAllByUserIdAndUserWishlistId(
      userOne.auth0Id,
      99999
    )
    expect(wishlists).toEqual([])
  })

  it('should only return items for the specified user and wishlist', async () => {
    const [userTwo] = await insertAll(db, 'user', fakeUser())
    const [userTwoWishlist] = await insertAll(db, 'userWishlist', [
      {
        userId: userTwo.auth0Id,
        description: 'Another wishlist',
        title: 'User Two wishlist',
      },
    ])
    await insertAll(db, 'wishlist', [
      fakeWishlist({
        userId: userTwo.auth0Id,
        userWishlistId: userTwoWishlist.id,
        itemName: 'User Two Item',
      }),
    ])

    const userOneWishlists = await repository.findAllByUserIdAndUserWishlistId(
      userOne.auth0Id,
      userWishlist.id
    )
    expect(userOneWishlists).toHaveLength(1)
    expect(userOneWishlists[0].userId).toBe(userOne.auth0Id)

    const userTwoWishlists = await repository.findAllByUserIdAndUserWishlistId(
      userTwo.auth0Id,
      userTwoWishlist.id
    )
    expect(userTwoWishlists).toHaveLength(1)
    expect(userTwoWishlists[0].userId).toBe(userTwo.auth0Id)
  })
})

describe('findByItemAndUserWishlistId', () => {
  it('should be case sensitive when matching item names', async () => {
    const result = await repository.findByItemAndUserWishlistId(
      wishlistOne.itemName.toUpperCase(),
      userWishlist.id
    )
    expect(result).toBeNull()
  })

  it('should return null for correct item name but wrong wishlist id', async () => {
    const result = await repository.findByItemAndUserWishlistId(
      wishlistOne.itemName,
      99999
    )
    expect(result).toBeNull()
  })
})

describe('create', () => {
  it('should create wishlist item with minimum required fields', async () => {
    const minimalWishlist = {
      userId: userOne.auth0Id,
      userWishlistId: userWishlist.id,
      itemName: 'Minimal Item',
    }

    const createdWishlist = await repository.create(minimalWishlist)
    expect(createdWishlist).toMatchObject({
      ...minimalWishlist,
      id: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should create wishlist item with all fields', async () => {
    const fullWishlist = {
      userId: userOne.auth0Id,
      userWishlistId: userWishlist.id,
      itemName: 'Full Item',
      price: 100,
      description: "Nice item"
    }

    const createdWishlist = await repository.create(fullWishlist)
    expect(createdWishlist).toMatchObject({
      ...fullWishlist,
      id: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })
})
