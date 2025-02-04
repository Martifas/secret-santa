import { createTestDatabase } from '@server/utils/tests/database'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { insertAll } from '@server/utils/tests/record'
import { fakeUser } from '@server/entities/tests/fakes'
import { pick } from 'lodash-es'
import { userWishlistKeysForTesting } from '@server/entities/userWishlist'
import { userWishlistRepository } from '../userWishlistRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = userWishlistRepository(db)

const [userOne] = await insertAll(db, 'user', fakeUser())
const [userWishlistOne] = await insertAll(db, 'userWishlist', [{
  userId: userOne.auth0Id,
  description: 'Test wishlist',
  title: 'My test wishlist'
}])

describe('find', () => {
  it('should return a wishlist by id', async () => {
    const foundWishlist = await repository.find(userWishlistOne.id)
    expect(foundWishlist).not.toBeNull()
    if (!foundWishlist) throw new Error('No wishlist found')
    expect(pick(foundWishlist, userWishlistKeysForTesting)).toEqual(
      pick(userWishlistOne, userWishlistKeysForTesting)
    )
  })

  it('should return null for non-existent wishlist', async () => {
    const foundWishlist = await repository.find(99999)
    expect(foundWishlist).toBeNull()
  })

  it('should return wishlist with all expected fields', async () => {
    const foundWishlist = await repository.find(userWishlistOne.id)
    expect(foundWishlist).toMatchObject({
      id: expect.any(Number),
      userId: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
})

describe('findAllForUser', () => {
  it('should return all wishlists for a user', async () => {
    await insertAll(db, 'userWishlist', [
      {
        userId: userOne.auth0Id,
        description: 'Second wishlist',
        title: 'Another wishlist'
      },
      {
        userId: userOne.auth0Id,
        description: 'Third wishlist',
        title: 'Yet another wishlist'
      }
    ])

    const wishlists = await repository.findAllForUser(userOne.auth0Id)
    expect(wishlists).toHaveLength(3)
    wishlists.forEach(wishlist => {
      expect(wishlist.userId).toBe(userOne.auth0Id)
      expect(wishlist).toHaveProperty('title')
      expect(wishlist).toHaveProperty('description')
    })
  })

  it('should return empty array for user with no wishlists', async () => {
    const [newUser] = await insertAll(db, 'user', fakeUser())
    const wishlists = await repository.findAllForUser(newUser.auth0Id)
    expect(wishlists).toEqual([])
  })

  it('should return empty array for non-existent user', async () => {
    const wishlists = await repository.findAllForUser('non-existent-user')
    expect(wishlists).toEqual([])
  })

  it('should only return wishlists for the specified user', async () => {
    const [userTwo] = await insertAll(db, 'user', fakeUser())
    await insertAll(db, 'userWishlist', [
      {
        userId: userTwo.auth0Id,
        description: 'User Two wishlist',
        title: 'User Two list'
      }
    ])

    const userOneWishlists = await repository.findAllForUser(userOne.auth0Id)
    const userTwoWishlists = await repository.findAllForUser(userTwo.auth0Id)

    expect(userOneWishlists.every(w => w.userId === userOne.auth0Id)).toBe(true)
    expect(userTwoWishlists.every(w => w.userId === userTwo.auth0Id)).toBe(true)
  })
})

describe('createPlaceholderWishlist', () => {
  it('should create a new wishlist with basic fields', async () => {
    const wishlistData = {
      userId: userOne.auth0Id,
      description: 'New wishlist',
      title: 'Brand new wishlist'
    }

    const createdId = await repository.createPlaceholderWishlist(wishlistData)
    expect(createdId).toEqual(expect.any(Number))

    const createdWishlist = await repository.find(createdId)
    expect(createdWishlist).toMatchObject({
      ...wishlistData,
      id: createdId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should create wishlist with minimum required fields', async () => {
    const minimalWishlist = {
      userId: userOne.auth0Id,
      title: 'Minimal wishlist',
      description: ''
    }

    const createdId = await repository.createPlaceholderWishlist(minimalWishlist)
    const createdWishlist = await repository.find(createdId)
    expect(createdWishlist).toMatchObject({
      ...minimalWishlist,
      id: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should throw error for non-existent user', async () => {
    const invalidWishlist = {
      userId: 'non-existent-user',
      title: 'Invalid wishlist',
      description: 'This should fail'
    }

    await expect(repository.createPlaceholderWishlist(invalidWishlist))
      .rejects.toThrow()
  })

  it('should create wishlist with unique title for same user', async () => {
    const wishlist1 = {
      userId: userOne.auth0Id,
      title: 'Same Title',
      description: 'First wishlist'
    }

    const wishlist2 = {
      userId: userOne.auth0Id,
      title: 'Same Title',
      description: 'Second wishlist'
    }

    await repository.createPlaceholderWishlist(wishlist1)
    const createdId2 = await repository.createPlaceholderWishlist(wishlist2)
    
    const createdWishlist2 = await repository.find(createdId2)
    expect(createdWishlist2?.title).toBe(wishlist2.title)
  })
})