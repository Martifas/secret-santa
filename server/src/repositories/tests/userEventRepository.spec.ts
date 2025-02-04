import {
  fakeEvent,
  fakeUser,
  fakeUserEvent,
  fakeWishlist,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@server/utils/tests/database'
import { insertAll } from '@server/utils/tests/record'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { pick } from 'lodash-es'
import { userEventKeysForTesting } from '../../entities/userEvent'
import { userEventRepository } from '../userEventRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = userEventRepository(db)
const [userOne] = await insertAll(db, 'user', fakeUser())
const [userTwo] = await insertAll(db, 'user', fakeUser())
const [eventOne] = await insertAll(db, 'event', [
  fakeEvent({ createdBy: userOne.auth0Id }),
])
const [userWishlist] = await insertAll(db, 'userWishlist', [
  {
    userId: userOne.auth0Id,
    description: 'The things I want',
    title: 'My wishlist',
  },
])
await insertAll(db, 'wishlist', [
  fakeWishlist({
    userId: userOne.auth0Id,
    userWishlistId: userWishlist.id,
  }),
])

const [userEventOne] = await insertAll(db, 'userEvent', [
  fakeUserEvent({
    userId: userOne.auth0Id,
    eventId: eventOne.id,
    wishlistId: userWishlist.id,
    santaForUserId: userTwo.auth0Id,
  }),
])
const fakeUserEventDefault = (
  userEvent: Parameters<typeof fakeUserEvent>[0] = {}
) =>
  fakeUserEvent({
    userId: userOne.auth0Id,
    eventId: eventOne.id,
    wishlistId: userWishlist.id,
    santaForUserId: userTwo.auth0Id,
    ...userEvent,
  })

describe('find by event and user id', () => {
  it('should return record for a specific event and user', async () => {
    const foundRecord = await repository.findByEventAndUserId(
      eventOne.id,
      userOne.auth0Id
    )
    expect(foundRecord).not.toBeNull()
    if (!foundRecord) throw new Error('No  record found')

    expect(pick(foundRecord, userEventKeysForTesting)).toEqual(
      pick(userEventOne, userEventKeysForTesting)
    )
  })
})

describe('isMember', () => {
  it('should return true when user is a member of event', async () => {
    const isMember = await repository.isMember(eventOne.id, userOne.auth0Id)
    expect(isMember).toBe(true)
  })

  it('should return false when user is not a member of event', async () => {
    const [nonMemberUser] = await insertAll(db, 'user', [fakeUser()])

    const isMember = await repository.isMember(
      eventOne.id,
      nonMemberUser.auth0Id
    )
    expect(isMember).toBe(false)
  })

  it('should return false for non-existent event', async () => {
    const isMember = await repository.isMember(99999, userOne.auth0Id)
    expect(isMember).toBe(false)
  })

  it('should return false for non-existent user', async () => {
    const isMember = await repository.isMember(eventOne.id, 'auth0|128888')
    expect(isMember).toBe(false)
  })
})
describe('isEventAdmin', () => {
  it('should return true when user is a admin of event', async () => {
    const [newUser] = await insertAll(db, 'user', fakeUser())
    const [newEvent] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: newUser.auth0Id }),
    ])

    await insertAll(db, 'userEvent', [
      {
        userId: newUser.auth0Id,
        eventId: newEvent.id,
        role: 'admin',
        eventTitle: 'New years party',
      },
    ])

    const isEventAdmin = await repository.isEventAdmin(
      newUser.auth0Id,
      newEvent.id
    )
    expect(isEventAdmin).toBe(true)
  })

  it('should return false when user is not an admin of event', async () => {
    const [nonAdminUser] = await insertAll(db, 'user', [fakeUser()])

    const isEventAdmin = await repository.isEventAdmin(
      nonAdminUser.auth0Id,
      eventOne.id
    )
    expect(isEventAdmin).toBe(false)
  })

  it('should return false for non-existent event', async () => {
    const isEventAdmin = await repository.isEventAdmin(userOne.auth0Id, 99999)
    expect(isEventAdmin).toBe(false)
  })

  it('should return false for non-existent user', async () => {
    const isEventAdmin = await repository.isEventAdmin(
      'auth0|99999',
      eventOne.id
    )
    expect(isEventAdmin).toBe(false)
  })
})

describe('create', () => {
  it('should create a new record', async () => {
    const [newUser] = await insertAll(db, 'user', fakeUser())
    const [newEvent] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: newUser.auth0Id }),
    ])
    const [newUserWishlist] = await insertAll(db, 'userWishlist', [
      {
        userId: newUser.auth0Id,
        description: 'The things I want',
        title: 'My wishlist',
      },
    ])
    await insertAll(db, 'wishlist', [
      fakeWishlist({
        userId: newUser.auth0Id,
        userWishlistId: newUserWishlist.id,
      }),
    ])

    const record = fakeUserEventDefault({
      userId: newUser.auth0Id,
      eventId: newEvent.id,
      wishlistId: newUserWishlist.id,
    })

    const createdRecord = await repository.create(record)
    expect(createdRecord).toEqual(expect.any(Number))
  })
})

describe('getAllEventUsers', () => {
  it('should return all user IDs for a specific event', async () => {
    const [userThree] = await insertAll(db, 'user', fakeUser())
    await insertAll(db, 'userEvent', [
      fakeUserEventDefault({
        userId: userThree.auth0Id,
        eventId: eventOne.id,
      }),
    ])

    const users = await repository.getAllEventUsers(eventOne.id)
    expect(users).toHaveLength(2)
    expect(users).toEqual(
      expect.arrayContaining([
        { userId: userOne.auth0Id },
        { userId: userThree.auth0Id },
      ])
    )
  })

  it('should return empty array for non-existent event', async () => {
    const users = await repository.getAllEventUsers(99999)
    expect(users).toEqual([])
  })
})

describe('updateSecretSanta', () => {
  it('should update santa assignment for a user', async () => {
    const [newSanta] = await insertAll(db, 'user', fakeUser())

    const result = await repository.updateSecretSanta(
      userOne.auth0Id,
      newSanta.auth0Id,
      eventOne.id
    )

    expect(result).toEqual({
      santaForUserId: newSanta.auth0Id,
    })

    const updatedRecord = await db
      .selectFrom('userEvent')
      .select(['santaForUserId', 'updatedAt'])
      .where('userId', '=', userOne.auth0Id)
      .executeTakeFirst()

    expect(updatedRecord).toBeTruthy()
    expect(updatedRecord?.santaForUserId).toBe(newSanta.auth0Id)
    expect(updatedRecord?.updatedAt).toBeInstanceOf(Date)
  })

  it('should throw error when updating non-existent user', async () => {
    await expect(
      repository.updateSecretSanta(userTwo.auth0Id, 'auth0|0000', eventOne.id)
    ).rejects.toThrowError(/no result/i)
  })

  it('should throw error when updating with non-existent santa', async () => {
    await expect(
      repository.updateSecretSanta(
        userOne.auth0Id,
        'auth0|12458741',
        eventOne.id
      )
    ).rejects.toThrowError()
  })
})

describe('findAllForUser', () => {
  it('should return all events for a user', async () => { 
    const [eventTwo] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: userOne.auth0Id }),
    ])
    await insertAll(db, 'userEvent', [
      fakeUserEventDefault({
        eventId: eventTwo.id,
      }),
    ])

    const userEvents = await repository.findAllForUser(userOne.auth0Id)
    expect(userEvents).toHaveLength(2)
    userEvents.forEach((event) => {
      expect(event.userId).toBe(userOne.auth0Id)
      expect(event).toHaveProperty('eventTitle')
      expect(event).toHaveProperty('role')
    })
  })

  it('should return empty array for user with no events', async () => {
    const [newUser] = await insertAll(db, 'user', fakeUser())
    const results = await repository.findAllForUser(newUser.auth0Id)
    expect(results).toEqual([])
  })
})

describe('findBySantaId', () => {
  it('should return userId of person who is santa for specified user', async () => {
    const santaUserId = await repository.findBySantaId(
      userTwo.auth0Id,
      eventOne.id
    )
    expect(santaUserId).toBe(userOne.auth0Id)
  })

  it('should return null when no santa is assigned', async () => {
    const [newUser] = await insertAll(db, 'user', fakeUser())
    const santaUserId = await repository.findBySantaId(
      newUser.auth0Id,
      eventOne.id
    )
    expect(santaUserId).toBeNull()
  })

  it('should return null for non-existent event', async () => {
    const santaUserId = await repository.findBySantaId(userOne.auth0Id, 99999)
    expect(santaUserId).toBeNull()
  })
})

describe('updateWishlistId', () => {
  it('should update wishlist id for user event', async () => {
    const [newWishlist] = await insertAll(db, 'userWishlist', [
      {
        userId: userOne.auth0Id,
        description: 'New wishlist',
        title: 'Updated wishlist',
      },
    ])

    const updatedId = await repository.updateWishlistId(
      userEventOne.id,
      newWishlist.id
    )
    expect(updatedId).toBe(userEventOne.id)

    const updatedRecord = await repository.findByEventAndUserId(
      eventOne.id,
      userOne.auth0Id
    )
    expect(updatedRecord?.wishlistId).toBe(newWishlist.id)
    expect(updatedRecord?.updatedAt).not.toEqual(userEventOne.updatedAt)
  })

  it('should throw error when updating non-existent record', async () => {
    await expect(
      repository.updateWishlistId(99999, userWishlist.id)
    ).rejects.toThrowError(/no result/i)
  })
})

describe('removeByEventId', () => {
  it('should remove all user events for an event', async () => {
    const [userThree, userFour] = await insertAll(db, 'user', [
      fakeUser(),
      fakeUser(),
    ])
    await insertAll(db, 'userEvent', [
      fakeUserEventDefault({ userId: userThree.auth0Id }),
      fakeUserEventDefault({ userId: userFour.auth0Id }),
    ])

    const removedIds = await repository.removeByEventId(eventOne.id)
    expect(removedIds.length).toBeGreaterThan(0)

    const remainingRecords = await db
      .selectFrom('userEvent')
      .select(['id'])
      .where('eventId', '=', eventOne.id)
      .execute()

    expect(remainingRecords).toHaveLength(0)
  })

  it('should return empty array for event with no user events', async () => {
    const removedIds = await repository.removeByEventId(99999)
    expect(removedIds).toEqual([])
  })
})

describe('removeUserByEventId', () => {
  it('should remove specific user from event', async () => {
    const removedId = await repository.removeUserByEventId(
      eventOne.id,
      userOne.auth0Id
    )
    expect(removedId).not.toBeNull()

    const record = await repository.findByEventAndUserId(
      eventOne.id,
      userOne.auth0Id
    )
    expect(record).toBeNull()
  })

  it('should return null when user is not in event', async () => {
    const [newUser] = await insertAll(db, 'user', fakeUser())
    const result = await repository.removeUserByEventId(
      eventOne.id,
      newUser.auth0Id
    )
    expect(result).toBeNull()
  })

  it('should return null for non-existent event', async () => {
    const result = await repository.removeUserByEventId(99999, userOne.auth0Id)
    expect(result).toBeNull()
  })
})

describe('findByEventAndUserId', () => {
  it('should return null for non-existent event', async () => {
    const result = await repository.findByEventAndUserId(99999, userOne.auth0Id)
    expect(result).toBeNull()
  })

  it('should return null for non-existent user', async () => {
    const result = await repository.findByEventAndUserId(
      eventOne.id,
      'non-existent-user'
    )
    expect(result).toBeNull()
  })
})
