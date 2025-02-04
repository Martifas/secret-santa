import { createTestDatabase } from '@server/utils/tests/database'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { insertAll, selectAll } from '@server/utils/tests/record'
import {
  fakeEvent,
  fakeUser,
  fakeUserEvent,
} from '@server/entities/tests/fakes'
import { pick } from 'lodash-es'
import {
  eventKeysForMembers,
  eventKeysForTesting,
} from '@server/entities/event'
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

  it('should create event with minimum required fields', async () => {
    const minimalEvent = {
      createdBy: userOne.auth0Id,
      eventDate: new Date('2025-12-12'),
      status: 'draft' as const,
      budgetLimit: 100,
      description: 'Minimal event description',
      title: 'Minimal Event',
    }

    const createdEventId = await repository.create(minimalEvent)
    const createdEvent = await repository.find(createdEventId)
    expect(createdEvent).toMatchObject({
      ...minimalEvent,
      id: createdEventId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should fail if createdBy is missing', async () => {
    const invalidEvent = {
      eventDate: new Date('2025-12-12'),
      status: 'draft' as const,
    }

    // @ts-expect-error testing invalid input
    await expect(repository.create(invalidEvent)).rejects.toThrow()
  })
})

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

  it('should return event with all eventKeysForMembers fields', async () => {
    const foundEvent = await repository.find(eventOne.id)
    expect(foundEvent).not.toBeNull()
    if (!foundEvent) throw new Error('No event found')

    for (const key of eventKeysForMembers) {
      expect(foundEvent).toHaveProperty(key)
    }
  })

  it('should find event with related records', async () => {
    const [testEvent] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: userOne.auth0Id }),
    ])

    await insertAll(db, 'eventInvitations', [
      {
        eventId: testEvent.id,
        userId: userOne.auth0Id,
        status: 'pending',
        email: 'miskas@miskas.lt',
      },
    ])

    await insertAll(db, 'userEvent', [
      {
        eventId: testEvent.id,
        userId: userOne.auth0Id,
        wishlistId: userWishlist.id,
        eventTitle: 'Party',
        role: 'member',
      },
    ])

    const foundEvent = await repository.find(testEvent.id)
    expect(foundEvent).not.toBeNull()
    expect(foundEvent?.id).toBe(testEvent.id)
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
    const removedEventId = await repository.remove(testEvent.id)
    expect(removedEventId).toBe(testEvent.id)
    const result = await selectAll(db, 'event')
    expect(result).toHaveLength(0)
  })

  it('should throw error when removing non-existent event', async () => {
    await expect(repository.remove(99999)).rejects.toThrowError(/no result/i)
  })

  it('should handle concurrent deletion', async () => {
    const [testEvent] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: userOne.auth0Id }),
    ])

    await repository.remove(testEvent.id)
    await expect(repository.remove(testEvent.id)).rejects.toThrow()
  })
})
