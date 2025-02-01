import {
  fakeEvent,
  fakeUser,
  fakeUserEvent,
  fakeWishlist,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@server/utils/tests/database'
import { insertAll, selectAll } from '@server/utils/tests/record'
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
const [wishlistOne] = await insertAll(db, 'wishlist', [
  fakeWishlist({
    userId: userOne.auth0Id,
    userWishlistId: userWishlist.id,
  }),
])

const [userEventOne] = await insertAll(db, 'userEvent', [
  fakeUserEvent({
    userId: userOne.auth0Id,
    eventId: eventOne.id,
    wishlistId: wishlistOne.id,
    santaForUserId: userTwo.auth0Id,
  }),
])
const fakeUserEventDefault = (
  userEvent: Parameters<typeof fakeUserEvent>[0] = {}
) =>
  fakeUserEvent({
    userId: userOne.auth0Id,
    eventId: eventOne.id,
    wishlistId: wishlistOne.id,
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
        role: 'event_admin',
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
    const [newWishlist] = await insertAll(db, 'wishlist', [
      fakeWishlist({
        userId: newUser.auth0Id,
        userWishlistId: newUserWishlist.id,
      }),
    ])

    const record = fakeUserEventDefault({
      userId: newUser.auth0Id,
      eventId: newEvent.id,
      wishlistId: newWishlist.id,
    })

    const createdRecord = await repository.create(record)
    expect(createdRecord).toMatchObject({
      ...pick(record, userEventKeysForTesting),
      id: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })
})

describe('update', () => {
  it('should update role', async () => {
    const updates = {
      role: 'admin',
    }
    const updatedRecord = await repository.updateRole(userEventOne.id, updates)
    expect(pick(updatedRecord, userEventKeysForTesting)).toEqual(
      pick(updates, userEventKeysForTesting)
    )
    expect(updatedRecord.id).toBe(userEventOne.id)
    expect(updatedRecord.role).toEqual('admin')
    expect(updatedRecord.userId).toBe(userEventOne.userId)
    expect(updatedRecord.updatedAt).toBeInstanceOf(Date)
  })

  it('should throw error when updating non-existent record', async () => {
    const updates = {
      role: 'admin',
    }
    await expect(repository.updateRole(99999, updates)).rejects.toThrowError(
      /no result/i
    )
  })
})

describe('remove', () => {
  it('should remove record', async () => {
    const removedRecord = await repository.remove(userEventOne.id)
    expect(pick(removedRecord, userEventKeysForTesting)).toEqual(
      pick(userEventOne, userEventKeysForTesting)
    )
    const result = await selectAll(db, 'userEvent')
    expect(result).toHaveLength(0)
  })

  it('should throw error when removing non-existent record', async () => {
    await expect(repository.remove(99999)).rejects.toThrowError(/no result/i)
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
      expect.arrayContaining([{ userId: userOne.auth0Id }, { userId: userThree.auth0Id }])
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
      newSanta.auth0Id
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
      repository.updateSecretSanta(userTwo.auth0Id, 'auth0|0000')
    ).rejects.toThrowError(/no result/i)
  })

  it('should throw error when updating with non-existent santa', async () => {
    await expect(
      repository.updateSecretSanta(userOne.auth0Id, 'auth0|12458741')
    ).rejects.toThrowError()
  })
})
