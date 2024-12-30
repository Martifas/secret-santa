import {
  fakeEvent,
  fakeUser,
  fakeUserEvent,
  fakeWishlist,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll, selectAll } from '@tests/utils/record'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { pick } from 'lodash-es'
import { userEventKeysForTesting } from '../../entities/userEvent'
import { userEventRepository } from '../userEventRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = userEventRepository(db)
const [userOne] = await insertAll(db, 'user', fakeUser())
const [userTwo] = await insertAll(db, 'user', fakeUser())
const [eventOne] = await insertAll(db, 'event', [
  fakeEvent({ createdBy: userOne.id }),
])
const [wishlistOne] = await insertAll(db, 'wishlist', [
  fakeWishlist({ userId: userOne.id, eventId: eventOne.id }),
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

describe('create', () => {
  it('should create a new record', async () => {
    const [newUser] = await insertAll(db, 'user', fakeUser())
    const [newEvent] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: newUser.id }),
    ])
    const [newWishlist] = await insertAll(db, 'wishlist', [
      fakeWishlist({ userId: newUser.id, eventId: newEvent.id }),
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
