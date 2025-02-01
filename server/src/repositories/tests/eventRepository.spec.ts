import { createTestDatabase } from '@server/utils/tests/database'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { insertAll, selectAll } from '@server/utils/tests/record'
import {
  fakeEvent,
  fakeUser,
  fakeUserEvent,
} from '@server/entities/tests/fakes'
import { pick } from 'lodash-es'
import { eventKeysForTesting } from '@server/entities/event'
import { eventRepository } from '../eventRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = eventRepository(db)
const [userOne] = await insertAll(db, 'user', fakeUser())
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
await insertAll(db, 'userEvent', [
  fakeUserEvent({
    userId: userOne.auth0Id,
    eventId: eventOne.id,
    wishlistId: userWishlist.id,
  }),
])

const fakeEventDefault = (event: Parameters<typeof fakeEvent>[0] = {}) =>
  fakeEvent({ createdBy: userOne.auth0Id, ...event })

describe('find', () => {
  it('should return an event by id', async () => {
    const foundEvent = await repository.find(eventOne.id)

    expect(foundEvent).not.toBeNull()
    if (!foundEvent) throw new Error('No event found')

    expect(pick(foundEvent, eventKeysForTesting)).toEqual(
      pick(eventOne, eventKeysForTesting)
    )
  })

  it('should return null for non-existent event', async () => {
    const foundEvent = await repository.find(99999)
    expect(foundEvent).toBeNull()
  })
})

describe('create', () => {
  it('should create a new event', async () => {
    const event = fakeEventDefault()

    const createdEventId = await repository.create(event)

    const createdEvent = await repository.find(createdEventId)
    expect(createdEvent).toMatchObject({
      ...pick(event, eventKeysForTesting),
      id: createdEventId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })
})

describe('update', () => {
  it('should update event attributes', async () => {
    const updates = {
      title: 'Updated Secret Santa',
      description: 'A very cozy xmas evening with gifts',
      budgetLimit: 150,
      eventDate: new Date('2024-12-24'),
      status: 'published',
    }
    const updatedEvent = await repository.update(eventOne.id, updates)
    expect(pick(updatedEvent, eventKeysForTesting)).toEqual(
      pick(updates, eventKeysForTesting)
    )
    expect(updatedEvent.id).toBe(eventOne.id)
    expect(updatedEvent.createdBy).toBe(eventOne.createdBy)
    expect(updatedEvent.updatedAt).toBeInstanceOf(Date)
  })

  it('should throw error when updating non-existent event', async () => {
    const updates = {
      title: 'Updated Secret Santa',
    }
    await expect(repository.update(99999, updates)).rejects.toThrowError(
      /no result/i
    )
  })
})

describe('remove', () => {
  it('should remove event', async () => {
    await db.deleteFrom('eventInvitations').execute()
    await db.deleteFrom('userEvent').execute()
    await db.deleteFrom('event').execute()

    const [testEvent] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: userOne.auth0Id }),
    ])

    const removedEvent = await repository.remove(testEvent.id)
    expect(pick(removedEvent, eventKeysForTesting)).toEqual(
      pick(testEvent, eventKeysForTesting)
    )
    const result = await selectAll(db, 'event')
    expect(result).toHaveLength(0)
  })

  it('should throw error when removing non-existent event', async () => {
    await expect(repository.remove(99999)).rejects.toThrowError(/no result/i)
  })
})
