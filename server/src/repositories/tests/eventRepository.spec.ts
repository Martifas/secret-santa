import { createTestDatabase } from '@server/utils/tests/database'
import { wrapInRollbacks } from '@server/utils/tests/transactions'
import { insertAll, selectAll } from '@server/utils/tests/record'
import { fakeEvent, fakeUser } from '@server/entities/tests/fakes'
import { pick } from 'lodash-es'
import { eventKeysForTesting } from '@server/entities/event'
import { eventRepository } from '../eventRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = eventRepository(db)
const [userOne] = await insertAll(db, 'user', fakeUser())
const [eventOne] = await insertAll(db, 'event', [
  fakeEvent({ createdBy: userOne.id }),
])

const fakeEventDefault = (event: Parameters<typeof fakeEvent>[0] = {}) =>
  fakeEvent({ createdBy: userOne.id, ...event })

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

    const createdEvent = await repository.create(event)

    expect(createdEvent).toMatchObject({
      ...pick(event, eventKeysForTesting),
      id: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })
})

describe('update', () => {
  it('should update event attributes', async () => {
    const updates = {
      name: 'Updated Secret Santa',
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
      name: 'Updated Secret Santa',
    }
    await expect(repository.update(99999, updates)).rejects.toThrowError(
      /no result/i
    )
  })
})

describe('remove', () => {
  it('should remove event', async () => {
    const removedEvent = await repository.remove(eventOne.id)
    expect(pick(removedEvent, eventKeysForTesting)).toEqual(
      pick(eventOne, eventKeysForTesting)
    )
    const result = await selectAll(db, 'event')
    expect(result).toHaveLength(0)
  })

  it('should throw error when removing non-existent event', async () => {
    await expect(repository.remove(99999)).rejects.toThrowError(/no result/i)
  })
})

describe('findAllForUser', () => {
  it('should return events created by user', async () => {
    const events = await repository.findAllForUser(userOne.id)

    expect(events).toHaveLength(1)
    expect(events).toEqual([
      expect.objectContaining(pick(eventOne, eventKeysForTesting)),
    ])
  })

  it('should return events where user is a member', async () => {
    const [userTwo] = await insertAll(db, 'user', [fakeUser()])
    const [eventTwo] = await insertAll(db, 'event', [
      fakeEvent({ createdBy: userTwo.id }),
    ])

    // Make userOne a member of eventTwo
    await insertAll(db, 'userEvent', [
      {
        userId: userOne.id,
        eventId: eventTwo.id,
        role: 'participant',
      },
    ])

    const events = await repository.findAllForUser(userOne.id)

    expect(events).toHaveLength(2)
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining(pick(eventOne, eventKeysForTesting)),
        expect.objectContaining(pick(eventTwo, eventKeysForTesting)),
      ])
    )
  })

  it('should return events without duplicates when user is both creator and member', async () => {
    // Make userOne also a member of their own event
    await insertAll(db, 'userEvent', [
      {
        userId: userOne.id,
        eventId: eventOne.id,
        role: 'participant',
      },
    ])

    const events = await repository.findAllForUser(userOne.id)

    expect(events).toHaveLength(1)
    expect(events).toEqual([
      expect.objectContaining(pick(eventOne, eventKeysForTesting)),
    ])
  })

  it('should return empty array when user has no events', async () => {
    const [userTwo] = await insertAll(db, 'user', [fakeUser()])

    const events = await repository.findAllForUser(userTwo.id)

    expect(events).toEqual([])
  })
})
