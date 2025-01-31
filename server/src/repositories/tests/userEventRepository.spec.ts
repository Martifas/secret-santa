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
const [wishlistOne] = await insertAll(db, 'wishlist', [
  fakeWishlist({ userId: userOne.auth0Id }),
])

const [userEventOne] = await insertAll(db, 'userEvent', [
  fakeUserEvent({
    userId: userOne.id,
    eventId: eventOne.id,
    wishlistId: wishlistOne.id,
    santaForUserId: userTwo.id,
  }),
])
const fakeUserEventDefault = (
  userEvent: Parameters<typeof fakeUserEvent>[0] = {}
) =>
  fakeUserEvent({
    userId: userOne.id,
    eventId: eventOne.id,
    wishlistId: wishlistOne.id,
    santaForUserId: userTwo.id,
    ...userEvent,
  })

describe('find by event and user id', () => {
  it('should return record for a specific event and user', async () => {
    const foundRecord = await repository.findByEventAndUserId(
      eventOne.id,
      userOne.id
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
    const isMember = await repository.isMember(eventOne.id, userOne.id)
    expect(isMember).toBe(true)
  })

  it('should return false when user is not a member of event', async () => {
    const [nonMemberUser] = await insertAll(db, 'user', [fakeUser()])

    const isMember = await repository.isMember(eventOne.id, nonMemberUser.id)
    expect(isMember).toBe(false)
  })

  it('should return false for non-existent event', async () => {
    const isMember = await repository.isMember(99999, userOne.id)
    expect(isMember).toBe(false)
  })

  it('should return false for non-existent user', async () => {
    const isMember = await repository.isMember(eventOne.id, 99999)
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
        userId: newUser.id,
        eventId: newEvent.id,
        role: 'event_admin',
      },
    ])

    const isEventAdmin = await repository.isEventAdmin(newUser.id, newEvent.id)
    expect(isEventAdmin).toBe(true)
  })

  it('should return false when user is not an admin of event', async () => {
    const [nonAdminUser] = await insertAll(db, 'user', [fakeUser()])

    const isEventAdmin = await repository.isEventAdmin(
      eventOne.id,
      nonAdminUser.id
    )
    expect(isEventAdmin).toBe(false)
  })

  it('should return false for non-existent event', async () => {
    const isEventAdmin = await repository.isEventAdmin(99999, userOne.id)
    expect(isEventAdmin).toBe(false)
  })

  it('should return false for non-existent user', async () => {
    const isEventAdmin = await repository.isEventAdmin(eventOne.id, 99999)
    expect(isEventAdmin).toBe(false)
  })
})

describe('create', () => {
  it('should create a new record', async () => {
    const [newUser] = await insertAll(db, 'user', fakeUser())
    const [newEvent] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: newUser.auth0Id }),
    ])
    const [newWishlist] = await insertAll(db, 'wishlist', [
      fakeWishlist({ userId: newUser.auth0Id }),
    ])

    const record = fakeUserEventDefault({
      userId: newUser.id,
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
        userId: userThree.id,
        eventId: eventOne.id,
      }),
    ])

    const users = await repository.getAllEventUsers(eventOne.id)
    expect(users).toHaveLength(2)
    expect(users).toEqual(
      expect.arrayContaining([{ userId: userOne.id }, { userId: userThree.id }])
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

    const result = await repository.updateSecretSanta(userOne.id, newSanta.id)

    expect(result).toEqual({
      santaForUserId: newSanta.id,
    })

    const updatedRecord = await db
      .selectFrom('userEvent')
      .select(['santaForUserId', 'updatedAt'])
      .where('userId', '=', userOne.id)
      .executeTakeFirst()

    expect(updatedRecord).toBeTruthy()
    expect(updatedRecord?.santaForUserId).toBe(newSanta.id)
    expect(updatedRecord?.updatedAt).toBeInstanceOf(Date)
  })

  it('should throw error when updating non-existent user', async () => {
    await expect(
      repository.updateSecretSanta(99999, userTwo.id)
    ).rejects.toThrowError(/no result/i)
  })

  it('should throw error when updating with non-existent santa', async () => {
    await expect(
      repository.updateSecretSanta(userOne.id, 99999)
    ).rejects.toThrowError()
  })
})
